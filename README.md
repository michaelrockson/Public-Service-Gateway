# Public Service Gateway

An API gateway for public services built on Express and TypeScript. The gateway aggregates several public APIs behind a single, uniform interface for downstream clients. Secrets and runtime configuration are managed via [Infisical](https://infisical.com/) no API keys are stored locally beyond the credentials needed to bootstrap the Infisical connection.

## Features

- Express server written in TypeScript (ESM)
- Versioned API routes under `/api/v1`
- Layered architecture: `BaseService` → service → controller → router, with constructor-injected dependencies
- Secrets management via Infisical SDK — zero secrets in source control
- Shared `HttpService` and `ControllerResponseHandler` used across all modules
- Structured JSON logging via Winston, with Morgan piped through it
- Four fully implemented modules: **Weather**, **News**, **Currency**, **Public Holidays**

## External APIs

| API | Purpose | Status |
|---|---|---|
| [OpenWeatherMap](https://openweathermap.org/api) | Current weather and 5-day forecast | Implemented |
| [NewsAPI](https://newsapi.org/) | News headlines and articles | Implemented |
| [ExchangeRates.Host](https://exchangerate.host/) | Currency exchange rates | Implemented |
| [Nager.Date](https://date.nager.at/) | Public holidays by country | Implemented |
| [TheSportsDB](https://www.thesportsdb.com/api.php) / [API-Football](https://www.api-football.com/) | Sports scores and fixtures | Planned |
| [AviationStack](https://aviationstack.com/) | Flight and aviation data | Planned |
| [Agromonitoring](https://agromonitoring.com/api) | Agricultural and soil data | Planned |

Each integration follows the same modular service / controller / router pattern. API keys and base URLs are stored in Infisical and injected at startup.

## Requirements

- Node.js 20+
- yarn
- An [Infisical](https://infisical.com/) project with the runtime secrets listed below

## Setup

1. Clone the repository:
```bash
git clone https://github.com/michaelrockson/Public-Service-Gateway.git
cd Public-Service-Gateway
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the project root with your Infisical bootstrap credentials:
```env
INFISICAL_SITE_URL=https://app.infisical.com
INFISICAL_CLIENT_ID=<your-client-id>
INFISICAL_CLIENT_SECRET=<your-client-secret>
INFISICAL_ENVIRONMENT=dev
INFISICAL_PROJECT_ID=<your-project-id>
```

These five values are the only secrets that live locally. Everything else is fetched from Infisical at startup.

4. Add the following secrets to your Infisical project:
```
PORT
ENVIRONMENT
LOG_LEVEL
WEATHER_API_URL
WEATHER_API_KEY
NEWS_API_URL
NEWS_API_KEY
CURRENCY_API_URL
CURRENCY_API_KEY
HOLIDAY_API_URL
```

## Running Locally

### Development
```bash
yarn dev
```
The server listens on the port configured in Infisical (`PORT`), defaulting to `3000`.

### Build and Start
```bash
yarn build
yarn start
```

> **Important:** Always run the server from the project root, not from `src/`. The dotenv bootstrap resolves `.env` relative to `process.cwd()`. Running from the wrong directory will cause a `Missing required environment variable: INFISICAL_SITE_URL` error at startup.

## API & Testing

All endpoints are documented in **[docs/Routes.md](docs/Routes.md)**, including full parameter tables and ready-to-use Postman examples for every module.


## Project Structure

```
src/
├── server.ts                        # Entry point — bootstrap and startup
├── modules/
│   ├── routes.registry.ts           # Mounts all module routers under /api/v1
│   ├── weather/
│   │   ├── weather.service.ts       # Outbound calls to OpenWeatherMap
│   │   ├── weather.controller.ts    # HTTP request handling for weather endpoints
│   │   ├── weather.routes.ts        # Route definitions for /api/v1/weather
│   │   └── weather.types.ts         # Request parameter types
│   ├── news/
│   │   ├── news.service.ts          # Outbound calls to NewsAPI
│   │   ├── news.controller.ts       # HTTP request handling for news endpoints
│   │   ├── news.routes.ts           # Route definitions for /api/v1/news
│   │   └── news.types.ts            # Request parameter types
│   ├── currency/
│   │   ├── currency.service.ts      # Outbound calls to ExchangeRates.Host
│   │   ├── currency.controller.ts   # HTTP request handling for currency endpoints
│   │   ├── currency.routes.ts       # Route definitions for /api/v1/currency
│   │   └── currency.types.ts        # Request parameter types
│   └── holidays/
│       ├── holiday.service.ts       # Outbound calls to Nager.Date
│       ├── holiday.controller.ts    # HTTP request handling for holiday endpoints
│       ├── holiday.routes.ts        # Route definitions for /api/v1/holiday
│       └── holiday.types.ts         # Request parameter types
└── shared/
    ├── env.config.ts                # envProvider — synchronous config access
    ├── http.controller.ts           # Shared ControllerResponseHandler
    ├── server.logger.ts             # Winston logger instance
    ├── services/
    │   ├── base.service.ts          # Abstract base class for all API services
    │   ├── http.service.ts          # Shared Axios wrapper (executeRequest / executeRawRequest)
    │   └── infisical.service.ts     # Infisical auth and secret injection
    └── utils/
        ├── config.utils.ts          # getEnvVar, validateSecrets
        ├── controller.utils.ts      # Shared controller helper utilities
        ├── logger.utils.ts          # Morgan stream, logProcess, logBootstrapStep
        └── server.utils.ts          # bootServices() — instantiates all services & controllers
```

## Architecture

The gateway uses a layered architecture with constructor-injected dependencies. The startup sequence in `server.ts` enforces strict initialization order:

1. Infisical secrets fetched and injected into `process.env`
2. `envProvider` populated with resolved config
3. `bootServices()` instantiates all services (which read from `envProvider`), then injects them into their controllers
4. `createGatewayRouter()` receives the live controllers and mounts all routers under `/api/v1`
5. Server starts listening

No service or controller is instantiated at module load time. All construction happens inside `bootServices()`, which only runs after `envProvider` is ready. See [Architecture.md](docs/Architecture.md) for a full breakdown.

## Notes

- All API keys and base URLs are stored in Infisical, not in `.env`.
- The `.env` file contains only the five Infisical bootstrap credentials.
- All modules share the same `HttpService` (via `BaseService`) and `ControllerResponseHandler` — no module makes raw Axios calls or implements its own response formatting.
- When adding a new module, follow the pattern in [Architecture.md](docs/Architecture.md): extend `BaseService`, create a controller, export a router factory, register in `bootServices()` and `createGatewayRouter()`.
