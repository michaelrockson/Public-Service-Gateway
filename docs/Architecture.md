# Public Services API Gateway — Architecture Guide

A reference for any developer picking up this codebase. Covers the startup
sequence, dependency flow, module structure and the conventions to follow
when adding new services.


## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Startup Sequence](#4-startup-sequence)
5. [Dependency Flow](#5-dependency-flow)
6. [Secrets & Configuration](#6-secrets--configuration)
7. [Module Structure](#7-module-structure)
8. [Shared Layer](#8-shared-layer)
9. [Adding a New Module](#9-adding-a-new-module)
10. [Environment Variables](#10-environment-variables)


## 1. Project Overview

Public Services API Gateway is a TypeScript/Express API gateway that
aggregates multiple third-party public data APIs (weather, news, etc.)
behind a single, unified interface. It uses Infisical for secrets
management, meaning no secrets are stored locally in `.env` beyond what
is needed to bootstrap the Infisical connection itself.


## 2. Tech Stack

| Concern | Choice |
|---|---|
| Runtime | Node.js (ESM, `"type": "module"`) |
| Language | TypeScript |
| Framework | Express 5 |
| Secrets | Infisical SDK |
| HTTP client | Axios (via shared `HttpService`) |
| Logging | Winston |
| Request logging | Morgan (piped through Winston) |
| Local env loading | dotenv |


## 3. Directory Structure

```
src/
├── server.ts                   # Entry point — bootstrap and startup
├── modules/                    # Feature modules (one folder per domain)
│   ├── routes.registry.ts      # Mounts all module routers under /api
│   ├── weather/
│   │   ├── weather.service.ts
│   │   ├── weather.controller.ts
│   │   ├── weather.routes.ts
│   │   └── weather.model.ts
│   └── news/
│       ├── news.service.ts
│       ├── news.controller.ts
│       ├── news.routes.ts
│       └── news.model.ts
└── shared/                     # Cross-cutting infrastructure
    ├── infisical.service.ts    # Infisical auth + secret injection
    ├── env.config.ts           # envProvider — synchronous config access
    ├── http.service.ts         # Shared Axios wrapper
    ├── http.controller.ts      # Shared request/response handler
    └── server.logger.ts        # Winston logger instance
```

## 4. Startup Sequence

Everything flows through `startServer()` in `server.ts`. The sequence is
strictly ordered — each step depends on the one before it completing
successfully.

```
startServer()
│
├── 1. injectSecretsFromInfisical()
│         Authenticates with Infisical using credentials from the local
│         .env file, fetches all remote secrets and attaches them to
│         process.env. Returns a typed AppSecrets config object.
│
├── 2. populateEnvProvider(serverSecrets)
│         Loads the resolved AppSecrets into the shared envProvider
│         singleton so any class can read config values synchronously,
│         without touching process.env directly.
│
├── 3. setServices()
│         Instantiates all services and controllers now that envProvider
│         is populated. Services are created first, then injected into
│         their controllers as constructor dependencies.
│         Returns { weatherController, newsController }.
│
├── 4. createGatewayRouter(controllers)
│         Passes the live controller instances into each module's router
│         factory. Mounts all routers under /api and returns the
│         configured Express router.
│
└── 5. server.listen(port)
          Server is live. Incoming requests are routed through the
          mounted router → controller → service.
```

## 5. Dependency Flow

Dependencies flow strictly top-down. No layer reaches up into the layer
above it.

```
envProvider
    │
    ▼
Services          (read config from envProvider at construction time)
    │
    ▼
Controllers       (receive service instance via constructor injection)
    │
    ▼
Routers           (receive controller instance via factory function)
    │
    ▼
Gateway Router        (mounts all module routers under /api)
    │
    ▼
Express Server
```

This means:

- A service never knows a controller exists.
- A controller never knows which route mounted it.
- A router never knows how the server bootstrapped.
- Every dependency is explicit nothing is imported as a module-level
  singleton after `setServices()` runs.

---

## 6. Secrets & Configuration

### Why two steps?

There are two distinct config concerns that must happen in order:

**Step 1 — Bootstrap secrets (from local `.env`)**

The local `.env` file contains only the five credentials needed to reach
Infisical. These are loaded by `dotenv` via `config.utils.ts` and are
read during `injectSecretsFromInfisical()`.

```
INFISICAL_SITE_URL
INFISICAL_CLIENT_ID
INFISICAL_CLIENT_SECRET
INFISICAL_ENVIRONMENT
INFISICAL_PROJECT_ID
```

**Step 2 — Runtime secrets (from Infisical)**

After authenticating with Infisical, all remaining application secrets
(API keys, URLs, port, log level, etc.) are fetched remotely and
injected into `process.env`. `populateEnvProvider()` then loads these
into the `envProvider` singleton for synchronous access.

### Accessing config in services

Always read from `envProvider`, never from `process.env` directly:

```typescript
// this is correct
this.newsApiUrl = envProvider.newsApiUrl;

// please avoid
this.newsApiUrl = process.env.NEWS_API_URL;
```

### Critical rule — instantiation timing

Services read from `envProvider` in their constructors. This means
**services must never be instantiated at module load time** (i.e. no
module-level `new NewsService()`). All instantiation must happen inside
`setServices()`, which only runs after `populateEnvProvider()` has
completed.

Violating this causes `envProvider` values to be `undefined` at
construction time, which produces `Invalid URL` errors at request time.


## 7. Module Structure

Each feature module follows the same four-file structure:

```
module.service.ts       — Outbound HTTP calls to the third-party API
module.controller.ts    — Receives HTTP requests, delegates to service
module.routes.ts        — Defines routes, exported as a factory function
module.model.ts         — TypeScript interfaces for request/response shapes
```

### Service

Owns all communication with the external API. Constructed with config
read from `envProvider`. Has no knowledge of Express.

```typescript
export class NewsService {
  constructor() {
    this.newsApiUrl = envProvider.newsApiUrl; // safe —> envProvider is ready
    this.newsApiKey = envProvider.newsApiKey;
    this.httpService = new HttpService(this.newsApiUrl, this.newsApiKey, "apiKey");
  }
}
```

### Controller

Receives a service instance via constructor injection. Delegates request
handling to `ControllerResponseHandler` from the shared layer.

```typescript
export class NewsController {
  constructor(newsService: NewsService) {
    this.httpClient = newsService;
  }
}
```

### Routes

Exported as a factory function never a module-level router instance.
Accepts the controller instance as an argument.

```typescript
export function createNewsRouter(newsController: NewsController): Router {
  const newsRouter = Router();
  newsRouter.get("/top-headlines", async (req, res) => {
    await newsController.handleGetTopHeadlines(req, res);
  });
  return newsRouter;
}
```

## 8. Shared Layer

### `infisical.service.ts`

Handles the two-phase Infisical bootstrap:
1. `InfisicalService` — authenticates and fetches secrets.
2. `injectSecretsFromInfisical()` — orchestrates auth + injection,
   returns the resolved `AppSecrets` config object.

### `env.config.ts`

Exports `envProvider` (a plain object) and `populateEnvProvider()`.
`populateEnvProvider()` is called once in `startServer()`. After that,
`envProvider` is safe to read synchronously from any constructor.

### `http.service.ts`

A thin Axios wrapper (`HttpService`) that accepts a base URL, API key,
and key param name at construction. Exposes `makeApiRequest()` and
`handleApiErrors()`. All services use this no module instantiates
Axios directly.

### `http.controller.ts`

`ControllerResponseHandler` provides a `handleRequest()` method that
handles query param extraction, required param validation, error
catching and JSON response formatting. All controllers delegate to this.

### `server.logger.ts`

A configured Winston logger instance. Morgan is piped through it so all
request logs share the same format and destination as application logs.

## 9. Adding a New Module

Follow these steps to add a new domain (e.g. `currency`):

**1. Create the module folder and files:**
```
src/modules/currency/
    currency.model.ts
    currency.service.ts
    currency.controller.ts
    currency.routes.ts
```

**2. Implement the service** read from `envProvider`, use `HttpService`:
```typescript
export class CurrencyService {
  constructor() {
    this.currencyApiUrl = envProvider.currencyApiUrl;
    this.currencyApiKey = envProvider.currencyApiKey;
    this.httpService = new HttpService(this.currencyApiUrl, this.currencyApiKey, "apikey");
  }
}
```

**3. Implement the controller** accept service via constructor:
```typescript
export class CurrencyController {
  constructor(currencyService: CurrencyService) {
    this.httpClient = currencyService;
  }
}
```

**4. Implement the router** export a factory function:
```typescript
export function createCurrencyRouter(currencyController: CurrencyController): Router {
  const currencyRouter = Router();
  currencyRouter.get("/rates", async (req, res) => {
    await currencyController.handleGetRates(req, res);
  });
  return currencyRouter;
}
```

**5. Register in `setServices()` in `server.ts`:**
```typescript
function setServices() {
  const weatherService = new WeatherService();
  const weatherController = new WeatherController(weatherService);

  const newsService = new NewsService();
  const newsController = new NewsController(newsService);

  const currencyService = new CurrencyService();             // add
  const currencyController = new CurrencyController(currencyService); // add

  return { weatherController, newsController, currencyController }; // add
}
```

**6. Mount in `createGatewayRouter()` in `routes.registry.ts`:**
```typescript
apiRouter.use("/currency", createCurrencyRouter(controllers.currencyController));
```

**7. Add the env vars to Infisical** (not to `.env`) and expose them
via `envProvider` in `env.config.ts`.

## 10. Environment Variables

### Local `.env` (bootstrap only)

Only these five belong in `.env`. Everything else lives in Infisical.

| Variable | Purpose |
|---|---|
| `INFISICAL_SITE_URL` | Infisical instance URL |
| `INFISICAL_CLIENT_ID` | Universal auth client ID |
| `INFISICAL_CLIENT_SECRET` | Universal auth client secret |
| `INFISICAL_ENVIRONMENT` | Target environment (`dev`, `prod`, etc.) |
| `INFISICAL_PROJECT_ID` | Infisical project to fetch secrets from |

### Infisical secrets (runtime)

| Variable | Purpose |
|---|---|
| `PORT` | Server port (default: `3000`) |
| `ENVIRONMENT` | App environment label (default: `dev`) |
| `LOG_LEVEL` | Winston log level (default: `info`) |
| `WEATHER_API_URL` | OpenWeatherMap base URL |
| `WEATHER_API_KEY` | OpenWeatherMap API key |
| `NEWS_API_URL` | NewsAPI base URL |
| `NEWS_API_KEY` | NewsAPI key |

### Working directory note

`dotenv` resolves `.env` relative to `process.cwd()`, not relative to
`server.ts`. Always run the server from the project root, or ensure your
IDE run configuration sets the working directory to the project root.
Running from `src/` will cause dotenv to report `injected env (0)` and
the Infisical bootstrap will fail with `Missing required environment
variable: INFISICAL_SITE_URL`.