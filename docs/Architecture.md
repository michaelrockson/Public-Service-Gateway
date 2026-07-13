# API Gateway Architecture Guide

A reference for any developer picking up this codebase. Covers the startup
sequence, dependency flow, module structure, the resource registration pattern,
the shared type system, and the conventions to follow when adding new modules.


## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Startup Sequence](#4-startup-sequence)
5. [Dependency Flow](#5-dependency-flow)
6. [Secrets & Configuration](#6-secrets--configuration)
7. [Resource Registration Pattern](#7-resource-registration-pattern)
8. [Module Structure](#8-module-structure)
9. [Shared Layer](#9-shared-layer)
10. [Type System](#10-type-system)
11. [Available Routes](#11-available-routes)
12. [Adding a New Module](#12-adding-a-new-module)
13. [Environment Variables](#13-environment-variables)


## 1. Project Overview

Public Services API Gateway is a TypeScript/Express API gateway that
aggregates five third-party public data APIs weather, news, currency,
holidays, and sports behind a single, unified interface mounted at `/v1`.

Secrets management is handled by Infisical. No API keys or runtime
configuration are stored locally in `.env`; `.env` contains only the five
credentials needed to reach Infisical itself.


## 2. Tech Stack

| Concern | Choice |
|---|---|
| Runtime | Node.js (ESM, `"type": "module"`) |
| Language | TypeScript 6, strict mode, `NodeNext` modules |
| Framework | Express 5 |
| Secrets | Infisical SDK (`@infisical/sdk`) |
| HTTP client | Axios (via shared `HttpService`) |
| Logging | Winston |
| Request logging | Morgan (piped through Winston) |
| Local env loading | dotenv |
| Dev server | `tsx watch` |


## 3. Directory Structure

```
src/
├── server.ts                        # Entry point — bootstrap and startup
│
├── modules/                         # Feature modules (one folder per domain)
│   ├── resource.registry.ts         # Instantiates all providers → GatewayControllers
│   ├── routes.registry.ts           # Mounts all module routers under /v1
│   │
│   ├── weather/
│   │   ├── weather.provider.ts      # Factory: WeatherService + WeatherController
│   │   ├── weather.service.ts
│   │   ├── weather.controller.ts
│   │   ├── weather.routes.ts
│   │   └── weather.types.ts
│   │
│   ├── news/
│   │   ├── news.provider.ts
│   │   ├── news.service.ts
│   │   ├── news.controller.ts
│   │   ├── news.routes.ts
│   │   └── news.types.ts
│   │
│   ├── currency/
│   │   ├── currency.provider.ts
│   │   ├── currency.service.ts
│   │   ├── currency.controller.ts
│   │   ├── currency.routes.ts
│   │   └── currency.types.ts
│   │
│   ├── holidays/
│   │   ├── holiday.provider.ts
│   │   ├── holiday.service.ts
│   │   ├── holiday.controller.ts
│   │   ├── holiday.routes.ts
│   │   └── holiday.types.ts
│   │
│   └── sports/
│       ├── sports.provider.ts
│       ├── sports.service.ts
│       ├── sports.controller.ts
│       ├── sports.routes.ts
│       └── sports.types.ts
│
└── shared/                          # Cross-cutting infrastructure
    ├── env.config.ts                # envProvider singleton + populateEnvProvider()
    ├── http.controller.ts           # ControllerResponseHandler (shared response utils)
    ├── server.logger.ts             # Winston logger instance
    ├── services/
    │   ├── base.service.ts          # Abstract base: executeRequest / executeRawRequest
    │   ├── http.service.ts          # Axios wrapper: makeApiRequest / handleApiErrors
    │   └── infisical.service.ts     # Infisical auth + secret injection
    └── utils/
        ├── controller.utils.ts      # parseParams / validateParams / validateResponse
        ├── logger.utils.ts          # logProcess / logBootstrapStep / createMorganStream
        ├── server.utils.ts          # bootGatewayResources() → GatewayControllers
        └── config/
            ├── config.types.ts      # GatewayControllers, GatewayServices, ModuleResourcesProvider
            └── config.utils.ts      # validateGatewayResources / unpackResourceControllers / env helpers
```


## 4. Startup Sequence

Everything flows through `startServer()` in `server.ts`. Each step depends
on the previous one completing successfully.

```
startServer()
│
├── 1. injectSecretsFromInfisical()
│         Reads the five Infisical bootstrap vars from the local .env,
│         authenticates with the Infisical SDK, and calls listSecrets()
│         with attachToProcessEnv: true — injecting all runtime secrets
│         into process.env. Returns a typed AppSecrets object.
│
├── 2. populateEnvProvider(serverSecrets)
│         Merges AppSecrets into the shared envProvider singleton via
│         Object.assign. After this point any class can read config
│         synchronously from envProvider without touching process.env.
│
├── 3. bootGatewayResources()
│         Calls registerGatewayResources() which invokes each module's
│         provider function, builds the GatewayControllers and
│         GatewayServices registries, validates they are all truthy,
│         and returns GatewayControllers (the controller map).
│         Then calls unpackResourceControllers() to strip any falsy
│         entries before handing the map to the router.
│
├── 4. createGatewayRouter(controllers)
│         Receives the live GatewayControllers map. Passes each
│         controller instance into its module's router factory, mounts
│         all routers under /v1, and returns the configured Express Router.
│
└── 5. server.listen(port)
          Server is live. Incoming requests flow:
          Express → gatewayRouter → module router → controller → service.
```


## 5. Dependency Flow

Dependencies flow strictly top-down. No layer reaches up into a layer above it.

```
dotenv (.env)
    │
    ▼
InfisicalService             (bootstraps remote secrets into process.env)
    │
    ▼
envProvider                  (populated once, read synchronously by services)
    │
    ▼
Services                     (read envProvider in constructors, call HttpService)
    │
    ▼
Controllers                  (receive service instance via constructor injection)
    │
    ▼
Providers                    (factory functions: new Service → new Controller)
    │
    ▼
resource.registry.ts         (calls all providers, builds + validates registries)
    │
    ▼
server.utils.ts              (bootGatewayResources → unpackResourceControllers)
    │
    ▼
routes.registry.ts           (createGatewayRouter → mounts module routers)
    │
    ▼
Express Server
```

Key rules enforced by this flow:

- A service never knows a controller exists.
- A controller never knows which route mounted it.
- A router never knows how the server bootstrapped.
- Services must **never** be instantiated at module load time. All
  instantiation happens inside provider functions, which are only called
  after `populateEnvProvider()` has completed. Violating this causes
  `envProvider` values to be `undefined` at construction time.


## 6. Secrets & Configuration

### Two-step bootstrap

**Step 1 Local `.env` (Infisical credentials only)**

The local `.env` contains only these five values, read by dotenv on startup:

```
INFISICAL_SITE_URL
INFISICAL_CLIENT_ID
INFISICAL_CLIENT_SECRET
INFISICAL_ENVIRONMENT
INFISICAL_PROJECT_ID
```

**Step 2 Remote secrets (from Infisical)**

`injectSecretsFromInfisical()` authenticates and fetches all remaining
secrets, attaching them to `process.env`. They are then mapped into a
typed `AppSecrets` object and passed to `populateEnvProvider()`.

### Accessing config in services

Always read from `envProvider`, never from `process.env` directly:

```typescript
// correct
super(envProvider.weatherApiUrl, envProvider.weatherApiKey, "appid");

// avoid
super(process.env.WEATHER_API_URL, process.env.WEATHER_API_KEY, "appid");
```

### Working directory note

`dotenv` resolves `.env` relative to `process.cwd()`, not relative to
`server.ts`. Always run the server from the project root. Running from
`src/` will cause dotenv to report zero injected vars and the Infisical
bootstrap will fail with `Missing required environment variable: INFISICAL_SITE_URL`.


## 7. Resource Registration Pattern

The gateway uses a **provider → registry → validation → boot** pattern to
instantiate and validate all modules before the server starts accepting requests.

### Step-by-step

```
provideXxxResources()            — module-level factory function
    ↓
{ name, service, controller }    — typed as a ModuleResourcesProvider discriminated union member
    ↓
registerGatewayResources()       — builds GatewayControllers + GatewayServices maps,
                                   calls validateGatewayResources() to assert all are truthy
    ↓
bootGatewayResources()           — wraps registerGatewayResources() in error handling,
                                   passes the result through unpackResourceControllers()
    ↓
GatewayControllers               — passed directly to createGatewayRouter()
```

### Provider functions

Each module exports a provider factory with a narrowed return type:

```typescript
// holidays/holiday.provider.ts
export function provideHolidayResources(): Extract<ModuleResourcesProvider, { name: "holiday" }> {
  const holidayService = new HolidayService();
  const holidayController = new HolidayController(holidayService);
  return { name: "holiday", service: holidayService, controller: holidayController };
}
```

The `Extract<ModuleResourcesProvider, { name: "holiday" }>` return type
ensures callers receive the concrete `HolidayService` / `HolidayController`
types rather than the full union.

### Registry maps

`registerGatewayResources()` calls each provider once, destructures the
result, and assembles the two typed maps:

```typescript
const gatewayServicesRegistry: GatewayServices = {
  weatherService: weather.service,
  newsService:    news.service,
  // ...
};

const gatewayControllerRegistry: GatewayControllers = {
  weatherController: weather.controller,
  newsController:    news.controller,
  // ...
};
```

`validateGatewayResources()` iterates both maps and throws if any entry is
falsy, logging a bootstrap success message if all are present.


## 8. Module Structure

Each feature module follows a five-file structure:

```
module.provider.ts    — Factory: creates service + controller, returns typed pair
module.service.ts     — Outbound HTTP calls to the third-party API
module.controller.ts  — Receives HTTP requests, delegates to service via ControllerResponseHandler
module.routes.ts      — Defines routes, exported as a factory function
module.types.ts       — TypeScript interfaces for request params and API response shapes
```

### Provider

Creates one service and one controller and returns them as a named pair.
This is the only place where `new XxxService()` and `new XxxController()`
are called. See 7 for details.

### Service

Owns all outbound HTTP communication with the upstream API. Extends
`BaseService`, which provides `executeRequest()` (returns `response.data`)
and `executeRawRequest()` (returns the full `AxiosResponse`, useful when
the HTTP status code itself carries meaning, as in `IsTodayPublicHoliday`).

```typescript
export class WeatherService extends BaseService {
  constructor() {
    super(envProvider.weatherApiUrl, envProvider.weatherApiKey, "appid");
  }
  async getCurrentWeather(params: CurrentWeatherParams) {
    return this.executeRequest("weather", params);
  }
}
```

### Controller

Receives its service via constructor injection. Delegates all request
lifecycle concerns (param parsing, validation, error catching, JSON
formatting) to `ControllerResponseHandler` via `handleRequest()`.

```typescript
export class WeatherController {
  private readonly httpClient: WeatherService;
  constructor(weatherService: WeatherService) {
    this.httpClient = weatherService;
  }
  async handleCurrentWeatherRequest(req: Request, res: Response) {
    await responseHandler.handleRequest(
      req, res,
      (params) => this.httpClient.getCurrentWeather(params),
      "weather",
      ["q", "units"],
    );
  }
}
```

### Routes

Exported as a factory function never a module-level router instance.
Receives the controller instance as its only argument.

```typescript
export function createWeatherRouter(weatherController: WeatherController): Router {
  const router = Router();
  router.get("/current",  async (req, res) => { await weatherController.handleCurrentWeatherRequest(req, res); });
  router.get("/forecast", async (req, res) => { await weatherController.handleForecastWeatherRequest(req, res); });
  return router;
}
```


## 9. Shared Layer

### `services/infisical.service.ts`

Two exports:
- `InfisicalService` class authenticates with Infisical SDK (universal auth)
  and calls `listSecrets()` with `attachToProcessEnv: true`.
- `injectSecretsFromInfisical()` function orchestrates auth + injection,
  maps the resolved `process.env` values into a typed `AppSecrets` object,
  validates them with `validateInfisicalSecrets()`, and returns the object.

### `env.config.ts`

Exports `envProvider` (a plain `AppConfig` object, initially `{}` cast) and
`populateEnvProvider(config)` which calls `Object.assign(envProvider, config)`.
After `populateEnvProvider()` runs, any constructor can safely read from
`envProvider` synchronously.

### `services/base.service.ts`

Abstract base class for all feature services. Constructor accepts
`apiUrl`, `apiKey`, and `apiKeyQueryParamName` and creates an `HttpService`
instance. Exposes:

- `executeRequest<T>()` calls `makeApiRequest()` and returns `response.data`.
- `executeRawRequest<T>()` returns the full `AxiosResponse<T>`, for when
  the status code carries semantic meaning (e.g. holiday status check).

### `services/http.service.ts`

Thin Axios wrapper. Accepts `apiUrl`, `apiKey`, `apiKeyName` at construction.

- `makeApiRequest(endpoint?, params?, additionalUris?)` builds the full
  URL by joining `apiUrl`, `endpoint`, and any `additionalUris` segments;
  appends the API key as a query param.
- `handleApiErrors(error)` normalises Axios errors into readable `Error`
  messages, redacting the API key in logged params via `safetyCheckParams()`.

### `http.controller.ts`

`ControllerResponseHandler` a singleton (`responseHandler`) used by all
controllers. Core method is `handleRequest()` which handles the full request
lifecycle:

1. Parses query params from `req.query` via `parseParams()`.
2. Validates required params via `validateParams()`; sends 400 and returns if invalid.
3. Calls the provided `fetchFunction` (delegated to the service).
4. Validates the response via `validateResponse()`; sends 404 if absent.
5. Sends `200` with the result wrapped under `responseKey`.
6. Catches unexpected errors and sends `500`.

Also exposes: `successResponse`, `badRequest`, `notFound`, `badGatewayError`,
`internalServerError`.

### `server.logger.ts`

Configures a Winston logger with:
- A console transport (always active, colourised, simple format).
- File transports to `logs/error.log` and `logs/combined.log` (active when
  `envProvider.environment` is truthy, i.e. non-empty).
- Timestamp, error-stack, and JSON formatting on all outputs.

### `utils/logger.utils.ts`

Named log helpers with log-level prefixes:

| Function | Prefix | Level |
|---|---|---|
| `logProcess()` | `[PROCESS]` | `info` |
| `logProcessError()` | `[PROCESS]` | `error` |
| `logBootstrapStep()` | `[BOOTSTRAP]` | `info` |
| `logBootstrapError()` | `[BOOTSTRAP]` | `error` |
| `logInboundRaw()` | `[INBOUND]` | `info` |
| `createMorganStream()` | — | Pipes Morgan output to `logInboundRaw` |

### `utils/controller.utils.ts`

| Function | Purpose |
|---|---|
| `parseParams(req, attrs)` | Extracts named keys from `req.query` into a plain record |
| `validateParams(params, res)` | Sends `400` and lists missing params if any are falsy |
| `validateResponse(data, res)` | Sends `404` and throws if `data` is `null` / `undefined` |

### `utils/server.utils.ts`

Exports `bootGatewayResources(): GatewayControllers`. Wraps
`registerGatewayResources()` + `unpackResourceControllers()` in a try/catch
that calls `logBootstrapError()` and re-throws on failure.

### `utils/config/config.utils.ts`

| Function | Purpose |
|---|---|
| `validateEnvs(secrets)` | Throws if any value in a record is falsy |
| `validateInfisicalSecrets(secrets)` | Like `validateEnvs` but also logs the count of injected secrets |
| `validateInfisicalCredentials(id, secret)` | Throws if either Infisical credential is missing |
| `getEnvVar(key, fallback?)` | Reads a string from `process.env`, throws if absent and no fallback |
| `getEnvNumber(key, fallback?)` | Like `getEnvVar` but parses as `number` |
| `validateGatewayResources(controllers, services)` | Iterates both maps, throws if any entry is falsy |
| `unpackResourceControllers(registry)` | Copies only truthy entries into a new `GatewayControllers` object |


## 10. Type System

All shared types live in `shared/utils/config/config.types.ts`.

### `ModuleResourcesProvider`

A discriminated union keyed on the `name` literal. Each provider function
returns one specific member via `Extract<>`, so TypeScript narrows to the
concrete service/controller types for that module:

```typescript
export type ModuleResourcesProvider =
  | { name: "weather";  service: WeatherService;  controller: WeatherController  }
  | { name: "news";     service: NewsService;      controller: NewsController     }
  | { name: "currency"; service: CurrencyService;  controller: CurrencyController }
  | { name: "holiday";  service: HolidayService;   controller: HolidayController  }
  | { name: "sports";   service: SportsService;    controller: SportsController   };
```

### `GatewayControllers`

The typed controller map, keyed by camelCase names. This single type is
used by `registerGatewayResources()`, `bootGatewayResources()`, and
`createGatewayRouter()` — keeping it the single source of truth:

```typescript
export type GatewayControllers = {
  weatherController:  WeatherController;
  newsController:     NewsController;
  currencyController: CurrencyController;
  holidayController:  HolidayController;
  sportsController:   SportsController;
};
```

### `GatewayServices`

Mirrors `GatewayControllers` for the service layer, used only for
validation inside `registerGatewayResources()`:

```typescript
export type GatewayServices = {
  weatherService:  WeatherService;
  newsService:     NewsService;
  currencyService: CurrencyService;
  holidayService:  HolidayService;
  sportsService:   SportsService;
};
```


## 11. Available Routes

All routes are mounted under `/v1`.

### Weather `/v1/weather`

| Method | Path | Required query params | Description |
|---|---|---|---|
| `GET` | `/current` | `q`, `units` | Current weather for a location |
| `GET` | `/forecast` | `q`, `units` | Multi-day forecast for a location |

### News `/v1/news`

| Method | Path | Description |
|---|---|---|
| `GET` | `/topic` | Search news articles by topic |
| `GET` | `/top-headlines` | Top headlines |

### Currency `/v1/currency`

| Method | Path | Description |
|---|---|---|
| `GET` | `/live` | Live exchange rates |
| `GET` | `/historical` | Historical exchange rates |
| `GET` | `/convert` | Currency conversion |
| `GET` | `/timeframe` | Rates over a date range |
| `GET` | `/change` | Rate fluctuation data |
| `GET` | `/list` | All supported currencies |

### Holidays `/v1/holiday`

| Method | Path | Description |
|---|---|---|
| `GET` | `/PublicHolidays` | Public holidays for a year + country |
| `GET` | `/NextPublicHolidays` | Upcoming public holidays for a country |
| `GET` | `/NextPublicHolidaysWorldwide` | Upcoming public holidays globally |
| `GET` | `/AvailableCountries` | Countries supported by the API |
| `GET` | `/CountryInfo` | Metadata for a country |
| `GET` | `/LongWeekend` | Long weekends for a year + country |
| `GET` | `/IsTodayPublicHoliday` | 200 = yes, 204 = no |

### Sports`/v1/sports`

| Method | Path | Description |
|---|---|---|
| `GET` | `/searchTeams` | Search for teams by name |
| `GET` | `/searchEvents` | Search for events |
| `GET` | `/searchPlayers` | Search for players |
| `GET` | `/searchVenues` | Search for venues |
| `GET` | `/lookUpLeague` | Look up a league by ID |
| `GET` | `/lookUpTable` | Look up a league table by ID |


## 12. Adding a New Module

Follow these steps to add a new domain (e.g. `maps`). There are exactly
nine touchpoints, in this order:

**1. Create the module folder:**
```
src/modules/maps/
    maps.types.ts
    maps.service.ts
    maps.controller.ts
    maps.routes.ts
    maps.provider.ts
```

**2. Add the env vars to Infisical** and expose them in `env.config.ts`
(`AppConfig` interface + `injectSecretsFromInfisical` config object):
```typescript
interface AppConfig {
  // ...existing...
  mapsApiUrl: string;
  mapsApiKey: string;
}
```

**3. Implement the service** extend `BaseService`, read from `envProvider`:
```typescript
export class MapsService extends BaseService {
  constructor() {
    super(envProvider.mapsApiUrl, envProvider.mapsApiKey, "key");
  }
  async geocode(params: Record<string, string>) {
    return this.executeRequest("geocode/json", params);
  }
}
```

**4. Implement the controller** inject service via constructor:
```typescript
export class MapsController {
  private readonly httpClient: MapsService;
  constructor(mapsService: MapsService) { this.httpClient = mapsService; }
  async handleGeocodeRequest(req: Request, res: Response) {
    await responseHandler.handleRequest(req, res,
      (params) => this.httpClient.geocode(params), "geocode", ["address"]);
  }
}
```

**5. Implement the router** export a factory function:
```typescript
export function createMapsRouter(mapsController: MapsController): Router {
  const router = Router();
  router.get("/geocode", async (req, res) => {
    await mapsController.handleGeocodeRequest(req, res);
  });
  return router;
}
```

**6. Add the provider:**
```typescript
export function provideMapsResources(): Extract<ModuleResourcesProvider, { name: "maps" }> {
  const mapsService = new MapsService();
  const mapsController = new MapsController(mapsService);
  return { name: "maps", service: mapsService, controller: mapsController };
}
```

**7. Update `config.types.ts`** add the new variant to all three types:
```typescript
// ModuleResourcesProvider — new union member:
| { name: "maps"; service: MapsService; controller: MapsController }

// GatewayControllers — new key:
mapsController: MapsController;

// GatewayServices — new key:
mapsService: MapsService;
```

**8. Register in `resource.registry.ts`:**
```typescript
const maps = provideMapsResources();

const gatewayServicesRegistry: GatewayServices    = { ...existing, mapsService: maps.service };
const gatewayControllerRegistry: GatewayControllers = { ...existing, mapsController: maps.controller };
```

**9. Mount in `routes.registry.ts`:**
```typescript
import { createMapsRouter } from "./maps/maps.routes.js";
apiRouter.use("/maps", createMapsRouter(controllers.mapsController));
```


## 13. Environment Variables

### Local `.env` (bootstrap only)

Only these five values belong in `.env`. Everything else lives in Infisical.

| Variable | Purpose |
|---|---|
| `INFISICAL_SITE_URL` | Infisical instance URL |
| `INFISICAL_CLIENT_ID` | Universal auth client ID |
| `INFISICAL_CLIENT_SECRET` | Universal auth client secret |
| `INFISICAL_ENVIRONMENT` | Target environment (`dev`, `staging`, `prod`) |
| `INFISICAL_PROJECT_ID` | Infisical project to fetch secrets from |

### Infisical secrets (runtime)

Fetched at startup, injected into `process.env`, then mapped into
`envProvider` via `populateEnvProvider()`.

| Infisical variable | `envProvider` key | Purpose |
|---|---|---|
| `PORT` | `port` | Server listen port (default: `3000`) |
| `ENVIRONMENT` | `environment` | App environment label (default: `"dev"`) |
| `LOG_LEVEL` | `logLevel` | Winston log level (default: `"info"`) |
| `WEATHER_API_URL` | `weatherApiUrl` | OpenWeatherMap base URL |
| `WEATHER_API_KEY` | `weatherApiKey` | OpenWeatherMap API key (`appid` param) |
| `NEWS_API_URL` | `newsApiUrl` | NewsAPI base URL |
| `NEWS_API_KEY` | `newsApiKey` | NewsAPI key |
| `CURRENCY_API_URL` | `currencyApiUrl` | Currencylayer base URL |
| `CURRENCY_API_KEY` | `currencyApiKey` | Currencylayer key (`access_key` param) |
| `HOLIDAY_API_URL` | `holidayApiUrl` | Nager.Date base URL (no key required) |
| `SPORTS_API_URL` | `sportsApiUrl` | TheSportsDB base URL |
| `SPORTS_API_KEY` | `sportsApiKey` | TheSportsDB API key (embedded in path) |
