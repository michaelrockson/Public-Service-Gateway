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
7. [Dependency Injection Pattern](#7-dependency-injection-pattern)
8. [Resource Registration Pattern](#8-resource-registration-pattern)
9. [Module Structure](#9-module-structure)
10. [Shared Layer](#10-shared-layer)
11. [Interface Layer](#11-interface-layer)
12. [Type System](#12-type-system)
13. [Available Routes](#13-available-routes)
14. [Adding a New Module](#14-adding-a-new-module)
15. [Environment Variables](#15-environment-variables)


## 1. Project Overview

Public Services API Gateway is a TypeScript/Express API gateway that
aggregates five third-party public data APIs weather, news, currency,
holidays, and sports behind a single, unified interface mounted at `/v1`.

Secrets management is handled by Infisical. No API keys or runtime
configuration are stored locally in `.env`; `.env` contains only the five
credentials needed to reach Infisical itself.

All shared infrastructure (`ConfigService`, `WinstonLogger`,
`ControllerResponseHandler`) is instantiated once in `server.ts` and
propagated downward via a `SharedDependencies` object no singletons,
no module-level state.


## 2. Tech Stack

| Concern | Choice |
|---|---|
| Runtime | Node.js (ESM, `"type": "module"`) |
| Language | TypeScript 6, strict mode, `NodeNext` modules |
| Framework | Express 5 |
| Secrets | Infisical SDK (`@infisical/sdk`) |
| HTTP client | Axios (via `AxiosHttpClient` implementing `IHttpClient`) |
| Logging | Winston (wrapped in `WinstonLogger` implementing `ILogger`) |
| Request logging | Morgan (piped through `WinstonLogger` via `createMorganStream`) |
| Local env loading | dotenv |
| Dev server | `tsx watch` |


## 3. Directory Structure

```
src/
├── server.ts                        # Entry point — bootstrap and startup
│
├── modules/                         # Feature modules (one folder per domain)
│   ├── controllers.registry.ts         # Instantiates all providers → GatewayControllers
│   ├── routes.registry.ts           # Mounts all module routers under /v1
│   │
│   ├── weather/
│   │   ├── weather.provider.ts      # Factory: AxiosHttpClient → WeatherService → WeatherController
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
    ├── config/
    │   ├── bootstrap.types.ts          # SharedDependencies, GatewayControllers, GatewayServices, ModuleResourcesProvider
    │   └── config.service.ts            # ConfigService class (implements IConfig)
    │
    ├── http/
    │   ├── api.errors.ts            # BadRequestError, NotFoundError (typed Error subclasses)
    │   └── response.handler.ts       # ControllerResponseHandler (implements IResponseHandler)
    │
    ├── interfaces/
    │   ├── config.interface.ts      # IConfig — shape of all runtime configuration
    │   ├── http.interface.ts        # IHttpClient — contract for HTTP clients (makeApiRequest / handleApiErrors)
    │   ├── logger.interface.ts      # ILogger — contract for loggers (info / error / warn / debug)
    │   └── response.handler.interface.ts  # IResponseHandler — contract for response helpers
    │
    ├── logger/
    │   └── winston.logger.ts         # WinstonLogger class (implements ILogger)
    │
    ├── services/
    │   ├── base.service.ts          # Abstract base: executeRequest / executeRawRequest (accepts IHttpClient)
    │   ├── axios.client.ts          # AxiosHttpClient (implements IHttpClient)
    │   └── bootstrap.infisical.ts     # InfisicalService class + injectSecretsFromInfisical()
    │
    └── utils/
        ├── config.utils.ts          # validateEnvs / validateInfisicalSecrets / getEnvVar / getEnvNumber /
        │                            # validateInfisicalCredentials / validateGatewayResources / unpackResourceControllers
        ├── request.utils.ts      # parseParams / validateParams / validateResponse
        ├── logger.utils.ts          # logProcess / logBootstrapStep / logInboundRaw / createMorganStream / consoleLogger
        └── bootstrap.utils.ts          # bootGatewayResources() → GatewayControllers
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
│         into process.env. Maps process.env values into a typed IConfig
│         object and returns it.
│
├── 2. new ConfigService(serverSecrets)
│         Constructs a ConfigService instance (implements IConfig) from the
│         returned secrets object. This is the single source of truth for
│         all runtime configuration. No singletons; config is passed as a
│         dependency.
│
├── 3. new WinstonLogger(config)
│         Constructs a WinstonLogger (implements ILogger). Reads
│         config.logLevel and config.environment to configure transports
│         (console always; file transports only when environment === "prod").
│
├── 4. new ControllerResponseHandler(config)
│         Constructs the shared response handler (implements IResponseHandler).
│         Reads config.environment to determine error verbosity in responses.
│
├── 5. bootGatewayResources({ config, logger, responseHandler })
│         Packages the three shared instances into a SharedDependencies object
│         and calls registerGatewayResources(deps), which invokes each module's
│         provider function. Each provider constructs its own AxiosHttpClient,
│         Service, and Controller using the injected dependencies.
│         validateGatewayResources() asserts all instances are truthy.
│         unpackResourceControllers() strips falsy entries and returns
│         GatewayControllers.
│
├── 6. createGatewayRouter(controllers)
│         Receives the live GatewayControllers map. Passes each controller
│         into its module's router factory, mounts all routers under /v1,
│         and returns the configured Express Router.
│
└── 7. server.listen(port)
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
ConfigService                (typed IConfig; instantiated once in server.ts)
    │
    ├──────────────────────────────────┐
    ▼                                  ▼
WinstonLogger                 ControllerResponseHandler
(ILogger)                     (IResponseHandler)
    │                                  │
    └──────────────┬───────────────────┘
                   ▼
           SharedDependencies        ({ config, logger, responseHandler })
                   │
                   ▼
           Provider functions        (construct AxiosHttpClient → Service → Controller)
                   │
                   ▼
           controllers.registry.ts      (builds + validates GatewayControllers / GatewayServices)
                   │
                   ▼
           bootstrap.utils.ts           (bootGatewayResources → unpackResourceControllers)
                   │
                   ▼
           routes.registry.ts        (createGatewayRouter → mounts module routers)
                   │
                   ▼
           Express Server
```

Key rules enforced by this flow:

- A service never knows a controller exists.
- A controller never knows which route mounted it.
- A router never knows how the server bootstrapped.
- Services must **never** be instantiated at module load time. All
  instantiation happens inside provider functions, which are called
  only after `ConfigService` has been constructed and passed in.
- No module reads `process.env` directly; all config is accessed through
  the injected `IConfig` (`deps.config`).


## 6. Secrets & Configuration

### Two-step bootstrap

**Step 1 — Local `.env` (Infisical credentials only)**

The local `.env` contains only these five values, read by dotenv on startup
(via `dotenv.config()` called at module evaluation time in `config.utils.ts`):

```
INFISICAL_SITE_URL
INFISICAL_CLIENT_ID
INFISICAL_CLIENT_SECRET
INFISICAL_ENVIRONMENT
INFISICAL_PROJECT_ID
```

**Step 2 — Remote secrets (from Infisical)**

`injectSecretsFromInfisical()` constructs an `InfisicalService`, authenticates
via universal auth, calls `listSecrets()` with `attachToProcessEnv: true`,
then reads the now-populated `process.env` values into a typed `IConfig`
-shaped object. `validateInfisicalSecrets()` checks for missing keys and
logs the count of injected secrets before returning.

### Accessing config in modules

Always read from the injected `deps.config`, never from `process.env` directly:

```typescript
// correct — inside a provider function
const weatherHttpClient = new AxiosHttpClient(
  deps.config.weatherApiUrl,
  deps.config.weatherApiKey,
  "appid",
);

// avoid
const weatherHttpClient = new AxiosHttpClient(
  process.env.WEATHER_API_URL!,
  process.env.WEATHER_API_KEY!,
  "appid",
);
```

### Working directory note

`dotenv` resolves `.env` relative to `process.cwd()`, not relative to
`server.ts`. Always run the server from the project root. Running from
`src/` will cause dotenv to report zero injected vars and the Infisical
bootstrap will fail with `Missing required environment variable: INFISICAL_SITE_URL`.


## 7. Dependency Injection Pattern

`server.ts` constructs three shared infrastructure objects and bundles them
into a `SharedDependencies` struct, which is then threaded through the
entire bootstrap chain:

```typescript
const config          = new ConfigService(serverSecrets);   // IConfig
const logger          = new WinstonLogger(config);           // ILogger
const responseHandler = new ControllerResponseHandler(config); // IResponseHandler

const sharedDependencies: SharedDependencies = { config, logger, responseHandler };
```

**Provider functions** receive `deps: SharedDependencies` and use it to:
1. Construct an `AxiosHttpClient` with the appropriate URL and key from `deps.config`.
2. Construct the module's `Service`, passing the `AxiosHttpClient`.
3. Construct the module's `Controller`, passing the `Service` and `deps.responseHandler`.

```typescript
// weather/weather.provider.ts
export function provideWeatherResources(
  deps: SharedDependencies,
): Extract<ModuleResourcesProvider, { name: "weather" }> {
  const weatherHttpClient = new AxiosHttpClient(
    deps.config.weatherApiUrl,
    deps.config.weatherApiKey,
    "appid",
  );
  const weatherService    = new WeatherService(weatherHttpClient);
  const weatherController = new WeatherController(weatherService, deps.responseHandler);
  return { name: "weather", service: weatherService, controller: weatherController };
}
```

This pattern means:
- No module ever imports `ConfigService`, `WinstonLogger`, or
  `ControllerResponseHandler` directly.
- All cross-cutting concerns are swappable behind interfaces.
- Testing a module only requires a mock `SharedDependencies`.


## 8. Resource Registration Pattern

The gateway uses a **provider → registry → validation → boot** pattern to
instantiate and validate all modules before the server starts accepting requests.

### Step-by-step

```
provideXxxResources(deps)        — module-level factory, receives SharedDependencies
    ↓
{ name, service, controller }    — typed as a ModuleResourcesProvider discriminated union member
    ↓
registerGatewayResources(deps)   — builds GatewayControllers + GatewayServices maps,
                                   calls validateGatewayResources(logger, controllers, services)
    ↓
bootGatewayResources(deps)       — wraps registerGatewayResources() in error handling,
                                   passes the result through unpackResourceControllers()
    ↓
GatewayControllers               — passed directly to createGatewayRouter()
```

### Provider functions

Each module exports a provider factory with a narrowed return type:

```typescript
// holidays/holiday.provider.ts
export function provideHolidayResources(
  deps: SharedDependencies,
): Extract<ModuleResourcesProvider, { name: "holiday" }> {
  const holidayHttpClient = new AxiosHttpClient(
    deps.config.holidayApiUrl,
    "",        // Nager.Date requires no API key
    "",
  );
  const holidayService    = new HolidayService(holidayHttpClient);
  const holidayController = new HolidayController(holidayService, deps.responseHandler);
  return { name: "holiday", service: holidayService, controller: holidayController };
}
```

The `Extract<ModuleResourcesProvider, { name: "holiday" }>` return type
ensures callers receive the concrete `HolidayService` / `HolidayController`
types rather than the full union.

### Registry maps

`registerGatewayResources()` calls each provider with `deps`, destructures the
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

`validateGatewayResources(deps.logger, gatewayControllerRegistry, gatewayServicesRegistry)`
iterates both maps and throws if any entry is falsy, logging a bootstrap
success message if all are present.


## 9. Module Structure

Each feature module follows a five-file structure:

```
module.provider.ts    — Factory: creates AxiosHttpClient → service → controller, returns typed pair
bootstrap.module.ts     — Outbound HTTP calls to the third-party API (extends BaseService)
module.controller.ts  — Receives HTTP requests, delegates to service via IResponseHandler
module.routes.ts      — Defines routes, exported as a factory function
module.types.ts       — TypeScript interfaces for request params and API response shapes
```

### Provider

Receives `SharedDependencies`, constructs the `AxiosHttpClient` (with the
appropriate base URL, API key, and key param name from `deps.config`),
creates the service and controller, and returns them as a named pair.
This is the only place where `new XxxService()` and `new XxxController()`
are called. See [Section 7](#7-dependency-injection-pattern) for details.

### Service

Owns all outbound HTTP communication with the upstream API. Extends
`BaseService`, which accepts an `IHttpClient` via its constructor and
provides `executeRequest()` (returns `response.data`) and
`executeRawRequest()` (returns the full `{ data, status }` object, useful
when the HTTP status code itself carries meaning, as with `IsTodayPublicHoliday`).

```typescript
export class WeatherService extends BaseService {
  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }
  async getCurrentWeather(params: CurrentWeatherParams) {
    return this.executeRequest("weather", params);
  }
  async getWeatherForecast(params: CurrentWeatherParams) {
    return this.executeRequest("forecast", params);
  }
}
```

### Controller

Receives its service via constructor injection **and** the shared
`IResponseHandler` (sourced from `deps.responseHandler` in the provider).
Delegates all request lifecycle concerns (param parsing, validation, error
catching, JSON formatting) to `IResponseHandler` via `handleRequest()`.

```typescript
export class WeatherController {
  private readonly httpClient: WeatherService;
  private readonly responseHandler: IResponseHandler;

  constructor(weatherService: WeatherService, responseHandler: IResponseHandler) {
    this.httpClient      = weatherService;
    this.responseHandler = responseHandler;
  }

  async handleCurrentWeatherRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req, res,
      (params) => this.httpClient.getCurrentWeather(params),
      "currentWeather",
      ["lat", "lon"],
    );
  }
}
```

### Routes

Exported as a factory function — never a module-level router instance.
Receives the controller instance as its only argument.

```typescript
export function createWeatherRouter(weatherController: WeatherController): Router {
  const router = Router();
  router.get("/current",  async (req, res) => { await weatherController.handleCurrentWeatherRequest(req, res); });
  router.get("/forecast", async (req, res) => { await weatherController.handleForecastWeatherRequest(req, res); });
  return router;
}
```


## 10. Shared Layer

### `config/config.service.ts` — `ConfigService`

A class implementing `IConfig`. Constructed once in `server.ts` from the
`IConfig`-shaped object returned by `injectSecretsFromInfisical()`. After
construction its properties are `readonly`, making it a stable, immutable
config snapshot for the lifetime of the process.

### `config/bootstrap.types.ts`

Defines the four shared types: `SharedDependencies`, `GatewayControllers`,
`GatewayServices`, and `ModuleResourcesProvider`. See [Section 12](#12-type-system).

### `services/bootstrap.infisical.ts`

Two exports:
- `InfisicalService` class — authenticates with the Infisical SDK (universal
  auth) and calls `listSecrets()` with `attachToProcessEnv: true`.
- `injectSecretsFromInfisical()` — orchestrates auth + injection, maps the
  resolved `process.env` values into a typed `IConfig`-shaped object,
  validates them with `validateInfisicalSecrets()`, and returns the object.

### `services/base.service.ts`

Abstract base class for all feature services. Constructor accepts an
`IHttpClient` instance. Exposes:

- `executeRequest<T>()` — calls `makeApiRequest()` and returns `response.data`.
- `executeRawRequest<T>()` — returns the full `{ data: T; status?: number }`
  object, for when the status code carries semantic meaning.

### `services/axios.client.ts` — `AxiosHttpClient`

Implements `IHttpClient`. Accepts `apiUrl`, `apiKey`, and `apiKeyName` at
construction time.

- `makeApiRequest(endpoint?, params?, additionalUris?)` — builds the full URL
  by joining `apiUrl`, `endpoint`, and any `additionalUris` segments; appends
  the API key as a query param using `apiKeyName`.
- `handleApiErrors(error)` — normalises Axios errors into readable `Error`
  messages, redacting the API key in logged params via `safetyCheckParams()`.

### `http/response.handler.ts` — `ControllerResponseHandler`

Implements `IResponseHandler`. Constructed once in `server.ts` and injected
into every controller via `deps.responseHandler`. Core method is
`handleRequest()` which handles the full request lifecycle:

1. If `requiredParams` is provided, parses query params via `parseParams()`.
2. Validates required params via `validateParams()`; throws `BadRequestError` if any are missing.
3. Calls the provided `fetchFunction` (delegated to the service).
4. Validates the response via `validateResponse()`; throws `NotFoundError` if absent.
5. Sends `200` with the result wrapped under `responseKey`.
6. Catches `BadRequestError` → `400`, `NotFoundError` → `404`, anything else → `500`.

Also exposes: `successResponse`, `badRequest`, `notFound`, `badGatewayError`,
`internalServerError`.

Error details in responses are suppressed when `config.environment === "prod"`.

### `http/api.errors.ts`

Typed `Error` subclasses used as discriminated signals within the request
lifecycle:

| Class | HTTP status | Thrown by |
|---|---|---|
| `BadRequestError` | 400 | `validateParams()` |
| `NotFoundError` | 404 | `validateResponse()` |

### `logger/winston.logger.ts` — `WinstonLogger`

Implements `ILogger`. Constructed once in `server.ts`.
- Console transport is always active (colourised, simple format).
- File transports (`logs/error.log`, `logs/combined.log`) are added only
  when `config.environment === "prod"`.
- All transports use timestamp, error-stack, and JSON formatting.

### `utils/logger.utils.ts`

Named log helpers that accept an `ILogger` instance as their first argument:

| Function | Prefix | Level |
|---|---|---|
| `logProcess(logger, step)` | `[PROCESS]` | `info` |
| `logProcessError(logger, step, error)` | `[PROCESS]` | `error` |
| `logBootstrapStep(logger, step)` | `[BOOTSTRAP]` | `info` |
| `logBootstrapError(logger, step, error)` | `[BOOTSTRAP]` | `error` |
| `logInboundRaw(logger, message)` | `[INBOUND]` | `info` |
| `createMorganStream(logger)` | — | Pipes Morgan output to `logInboundRaw` |

Also exports `consoleLogger` — a lightweight `ILogger` backed by the native
`console` object, used for pre-bootstrap logging (before `WinstonLogger` exists).

### `utils/request.utils.ts`

| Function | Purpose |
|---|---|
| `parseParams(req, attrs)` | Extracts named keys from `req.query` into a plain record |
| `validateParams(params)` | Throws `BadRequestError` listing missing params if any are falsy |
| `validateResponse(data)` | Throws `NotFoundError` if `data` is `null` / `undefined` |

### `utils/bootstrap.utils.ts`

Exports `bootGatewayResources(deps): GatewayControllers`. Wraps
`registerGatewayResources(deps)` + `unpackResourceControllers()` in a
try/catch that calls `logBootstrapError(deps.logger, ...)` and re-throws on failure.

### `utils/config.utils.ts`

| Function | Purpose |
|---|---|
| `validateEnvs(secrets)` | Throws if any value in a record is falsy |
| `validateInfisicalSecrets(secrets)` | Like `validateEnvs` but also logs the count of injected secrets |
| `validateInfisicalCredentials(id, secret)` | Throws if either Infisical credential is missing |
| `getEnvVar(key, fallback?)` | Reads a string from `process.env`, throws if absent and no fallback |
| `getEnvNumber(key, fallback?)` | Like `getEnvVar` but parses as `number` |
| `validateGatewayResources(logger, controllers, services)` | Iterates both maps, throws if any entry is falsy |
| `unpackResourceControllers(registry)` | Copies only truthy entries into a new `GatewayControllers` object |

> `dotenv.config()` is called at module evaluation time inside this file,
> ensuring `.env` is loaded before any `getEnvVar` calls during the
> Infisical bootstrap.


## 11. Interface Layer

All cross-cutting contracts live in `shared/interfaces/`. Concrete classes
implement these interfaces; modules depend only on the interface, never the
concrete class.

### `IConfig` (`config.interface.ts`)

Shape of all runtime configuration. Implemented by `ConfigService`.

```typescript
export interface IConfig {
  environment: string;
  port: number;
  logLevel: string;
  weatherApiUrl: string;
  weatherApiKey: string;
  newsApiUrl: string;
  newsApiKey: string;
  currencyApiUrl: string;
  currencyApiKey: string;
  holidayApiUrl: string;
  sportsApiUrl: string;
  sportsApiKey: string;
}
```

### `ILogger` (`logger.interface.ts`)

Logging contract. Implemented by `WinstonLogger`; `consoleLogger` is a
lightweight inline implementation used before the logger is constructed.

```typescript
export interface ILogger {
  info(message: string, ...meta: any[]): void;
  error(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
}
```

### `IHttpClient` (`http.interface.ts`)

HTTP client contract. Implemented by `AxiosHttpClient`.

```typescript
export interface IHttpClient {
  makeApiRequest<T = unknown>(
    endpoint?: string,
    params?: Record<string, unknown>,
    additionalUris?: string[],
  ): Promise<{ data: T; status?: number }>;
  handleApiErrors(error: unknown): never;
}
```

### `IResponseHandler` (`response.handler.interface.ts`)

Response utility contract. Implemented by `ControllerResponseHandler`.

```typescript
export interface IResponseHandler {
  handleRequest(req, res, fetchFunction, responseKey, requiredParams?): Promise<void>;
  successResponse(res, message?, details?): void;
  badRequest(res, message?, details?): void;
  notFound(res, message?, details?): void;
  badGatewayError(res, message?, details?): void;
  internalServerError(res, message?, details?): void;
}
```


## 12. Type System

All shared gateway types live in `shared/config/bootstrap.types.ts`.

### `SharedDependencies`

The bundle of shared infrastructure passed through the entire bootstrap chain:

```typescript
export type SharedDependencies = {
  config:          IConfig;
  logger:          ILogger;
  responseHandler: IResponseHandler;
};
```

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

The typed controller map, keyed by camelCase names. Used by
`registerGatewayResources()`, `bootGatewayResources()`, and
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

Mirrors `GatewayControllers` for the service layer, used only for validation
inside `registerGatewayResources()`:

```typescript
export type GatewayServices = {
  weatherService:  WeatherService;
  newsService:     NewsService;
  currencyService: CurrencyService;
  holidayService:  HolidayService;
  sportsService:   SportsService;
};
```


## 13. Available Routes

All routes are mounted under `/v1`.

### Weather `/v1/weather`

| Method | Path | Required query params | Description |
|---|---|---|---|
| `GET` | `/current` | `lat`, `lon` | Current weather for a location |
| `GET` | `/forecast` | `lat`, `lon` | Multi-day forecast for a location |

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
| `GET` | `/IsTodayPublicHoliday` | `true` = today is a holiday, `false` = it is not |

### Sports `/v1/sports`

| Method | Path | Description |
|---|---|---|
| `GET` | `/searchTeams` | Search for teams by name |
| `GET` | `/searchEvents` | Search for events |
| `GET` | `/searchPlayers` | Search for players |
| `GET` | `/searchVenues` | Search for venues |
| `GET` | `/lookUpLeague` | Look up a league by ID |
| `GET` | `/lookUpTable` | Look up a league table by ID |


## 14. Adding a New Module

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

**2. Add the env vars to Infisical** and expose them in `shared/interfaces/config.interface.ts`
(`IConfig` interface) and `shared/config/config.service.ts` (`ConfigService` class):
```typescript
// config.interface.ts
interface IConfig {
  // ...existing...
  mapsApiUrl: string;
  mapsApiKey: string;
}

// config.service.ts — add matching readonly properties + constructor assignments
```

**3. Map the new vars in `bootstrap.infisical.ts`:**
```typescript
const config = {
  // ...existing...
  mapsApiUrl: getEnvVar("MAPS_API_URL", ""),
  mapsApiKey: getEnvVar("MAPS_API_KEY", ""),
} as const;
```

**4. Implement the service** — extend `BaseService`, accept `IHttpClient`:
```typescript
export class MapsService extends BaseService {
  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }
  async geocode(params: Record<string, string>) {
    return this.executeRequest("geocode/json", params);
  }
}
```

**5. Implement the controller** — inject service and `IResponseHandler`:
```typescript
export class MapsController {
  private readonly httpClient: MapsService;
  private readonly responseHandler: IResponseHandler;
  constructor(mapsService: MapsService, responseHandler: IResponseHandler) {
    this.httpClient      = mapsService;
    this.responseHandler = responseHandler;
  }
  async handleGeocodeRequest(req: Request, res: Response) {
    await this.responseHandler.handleRequest(
      req, res,
      (params) => this.httpClient.geocode(params),
      "geocode",
      ["address"],
    );
  }
}
```

**6. Implement the router** — export a factory function:
```typescript
export function createMapsRouter(mapsController: MapsController): Router {
  const router = Router();
  router.get("/geocode", async (req, res) => {
    await mapsController.handleGeocodeRequest(req, res);
  });
  return router;
}
```

**7. Implement the provider** — construct `AxiosHttpClient` → service → controller:
```typescript
export function provideMapsResources(
  deps: SharedDependencies,
): Extract<ModuleResourcesProvider, { name: "maps" }> {
  const mapsHttpClient = new AxiosHttpClient(
    deps.config.mapsApiUrl,
    deps.config.mapsApiKey,
    "key",
  );
  const mapsService    = new MapsService(mapsHttpClient);
  const mapsController = new MapsController(mapsService, deps.responseHandler);
  return { name: "maps", service: mapsService, controller: mapsController };
}
```

**8. Update `bootstrap.types.ts`** — add the new variant to all three types:
```typescript
// ModuleResourcesProvider — new union member:
| { name: "maps"; service: MapsService; controller: MapsController }

// GatewayControllers — new key:
mapsController: MapsController;

// GatewayServices — new key:
mapsService: MapsService;
```

**9. Register in `controllers.registry.ts`:**
```typescript
const maps = provideMapsResources(deps);

const gatewayServicesRegistry: GatewayServices      = { ...existing, mapsService: maps.service };
const gatewayControllerRegistry: GatewayControllers = { ...existing, mapsController: maps.controller };
```

**10. Mount in `routes.registry.ts`:**
```typescript
import { createMapsRouter } from "./maps/maps.routes.js";
apiRouter.use("/maps", createMapsRouter(controllers.mapsController));
```


## 15. Environment Variables

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
a typed `IConfig` object and passed to `new ConfigService(config)`.

| Infisical variable | `IConfig` / `ConfigService` key | Purpose |
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
