# Public Service Gateway

An API gateway for public services built on Express and TypeScript. The gateway aggregates several public APIs behind a single, uniform interface for downstream clients. Secrets and runtime configuration are managed via [Infisical](https://infisical.com/) no API keys are stored locally beyond the credentials needed to bootstrap the Infisical connection.

## Features

- Express server written in TypeScript (ESM)
- Layered architecture: service / controller / router with constructor-injected dependencies
- Secrets management via Infisical SDK
- Shared HTTP client (`HttpService`) and request handler (`ControllerResponseHandler`) used across all modules
- Weather routes at `/api/weather/current` and `/api/weather/forecast`
- News routes at `/api/news/top-headlines` and `/api/news/topic`
- Query parameter parsing and validation
- Structured JSON logging via Winston, with Morgan piped through it

## External APIs

This gateway aggregates the following public APIs into unified endpoints:

| API                                                                                                | Purpose | Status      |
|----------------------------------------------------------------------------------------------------|---|-------------|
| [OpenWeatherMap](https://openweathermap.org/api)                                                   | Current weather and 5-day forecast | Implemented |
| [NewsAPI](https://newsapi.org/)                                                                    | News headlines and articles | Implemented |
| [ExchangeRates.Host](https://exchangerate.host/)                                                   | Currency exchange rates | Implemented |
| [Nager.Date](https://date.nager.at/)                                                               | Public holidays by country | Planned     |
| [TheSportsDB](https://www.thesportsdb.com/api.php) / [API-Football](https://www.api-football.com/) | Sports scores and fixtures | Planned     |
| [AviationStack](https://aviationstack.com/)                                                        | Flight and aviation data | Planned     |
| [Agromonitoring](https://agromonitoring.com/api)                                                   | Agricultural and soil data | Planned     |

Each integration follows the same modular service / controller / router pattern. API keys and base URLs are stored in Infisical and injected at startup.

## Requirements

- Node.js 20+
- npm or yarn
- An [Infisical](https://infisical.com/) project with the runtime secrets listed below

## Setup

1. Clone the repository:
```bash
git clone https://github.com/michaelrockson/Public-Service-Gateway.git
cd Public-Service-API-Gateway
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

## API

### Weather

#### GET /api/weather/current

Fetches current weather data for a given location.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `lat` | Yes | Latitude coordinate |
| `lon` | Yes | Longitude coordinate |

**Successful Response**
```json
{
  "currentWeather": {
    "details" : "...OpenWeatherMap response..."
  }
}
```

**Error Responses**
- `400 Bad Request` = `lat` or `lon` missing
- `500 Internal Server Error` = upstream API request failed

---

#### GET /api/weather/forecast

Fetches a 5-day weather forecast for a given location.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `lat` | Yes | Latitude coordinate |
| `lon` | Yes | Longitude coordinate |

**Successful Response**
```json
{
  "forecastWeather": {
    "details" : "...OpenWeatherMap response..."
  }
}
```

**Error Responses**
- `400 Bad Request` = `lat` or `lon` missing
- `500 Internal Server Error` = upstream API request failed

---

### News

#### GET /api/news/top-headlines

Fetches current top headlines, optionally filtered by country.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `country` | Yes | Two-letter country code (e.g. `us`, `gb`) |

**Successful Response**
```json
{
  "Top Headlines": {
    "details": "...NewsAPI response..."
  }
}
```

**Error Responses**
- `400 Bad Request` = `country` missing
- `500 Internal Server Error` = upstream API request failed

---

#### GET /api/news/topic

Fetches news articles matching a search query.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `q` | Yes | Search term or phrase |

**Successful Response**
```json
{
  "Related Article(s)": {
    "details": "...NewsAPI response..."
  }
}
```

**Error Responses**
- `400 Bad Request` = `q` missing
- `500 Internal Server Error` = upstream API request failed

---

## Project Structure

```
src/
├── server.ts                        # Entry point bootstrap and startup
├── modules/
│   ├── routes.registry.ts           # Mounts all module routers under /api
│   ├── weather/
│   │   ├── weather.service.ts       # Outbound calls to OpenWeatherMap
│   │   ├── weather.controller.ts    # HTTP request handling for weather endpoints
│   │   ├── weather.routes.ts        # Route definitions for /api/weather
│   │   └── weather.types.ts         # Request parameter types
│   └── news/
│       ├── news.service.ts          # Outbound calls to NewsAPI
│       ├── news.controller.ts       # HTTP request handling for news endpoints
│       ├── news.routes.ts           # Route definitions for /api/news
│       └── news.types.ts            # Request parameter types
└── shared/
    ├── infisical.service.ts         # Infisical auth and secret injection
    ├── env.config.ts                # envProvider synchronous config access
    ├── http.service.ts              # Shared Axios wrapper used by all services
    ├── http.controller.ts           # Shared request/response handler
    ├── server.logger.ts             # Winston logger instance
    └── utils/
        └── config.utils.ts          # getEnvVar, validateSecrets, bootServices
```

## Architecture

The gateway uses a layered architecture with constructor-injected dependencies. The startup sequence in `server.ts` enforces strict initialization order:

1. Infisical secrets fetched and injected into `process.env`
2. `envProvider` populated with resolved config
3. `bootServices()` instantiates all services (which read from `envProvider`), then injects them into their controllers
4. `createGatewayRouter()` receives the live controllers and mounts all routers
5. Server starts listening

No service or controller is instantiated at module load time. All construction happens inside `bootServices()`, which only runs after `envProvider` is ready. See [ARCHITECTURE.md](docs/Architecture.md) for a full breakdown.

## Notes

- All API keys and base URLs are stored in Infisical, not in `.env`.
- The `.env` file contains only the five Infisical bootstrap credentials.
- All modules share the same `HttpService` and `ControllerResponseHandler` from the shared layer no module makes raw Axios calls or implements its own response formatting.
- When adding a new module, follow the pattern in `ARCHITECTURE.md` service, controller, router factory, registration in `bootServices()` and `createGatewayRouter()`.
