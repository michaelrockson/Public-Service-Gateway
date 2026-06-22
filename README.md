# Public Services API Gateway

An API gateway for public services that is developed on top of Express and TypeScript. The main idea of the gateway is to interact with several public APIs and provide uniform endpoints to downstream clients.

## Features

- Express server written in TypeScript
- Modular API gateway architecture
- Weather routes at `/api/weather/current` and `/api/weather/forecast`
- Query parameter parsing and validation
- External API request handling with Axios
- Environment-based configuration for API URL and key

## External APIs

This gateway aggregates the following public APIs into unified endpoints:

| API | Purpose | Status |
|---|---|---|
| [OpenWeatherMap](https://openweathermap.org/api) | Current weather and 5-day forecast | Implemented |
| [NewsAPI](https://newsapi.org/) | News headlines and articles | Planned |
| [ExchangeRate-API](https://www.exchangerate-api.com/) | Currency exchange rates | Planned |
| [Nager.Date](https://date.nager.at/) | Public holidays by country | Planned |
| [TheSportsDB](https://www.thesportsdb.com/api.php) / [API-Football](https://www.api-football.com/) | Sports scores and fixtures | Planned |
| [AviationStack](https://aviationstack.com/) | Flight and aviation data | Planned |
| [Agromonitoring](https://agromonitoring.com/api) | Agricultural and soil data | Planned |

Each integration will follow the same modular service/controller/routes pattern with API keys and base URLs configured via environment variables.

## Requirements

- Node.js 18+ (recommended)
- yarn
- A weather API provider with an API key

## Setup

1. Clone the repository.
```bash
    git clone https://github.com/michaelrockson/Public-Service-API-Gateway.git
    cd Public-Service-API-Gateway
```
2. Install dependencies:
```bash
yarn install
```
3. Create a `.env` file in the project root with the following values:

```env
WEATHER_API_URL=<your-weather-api-base-url>
WEATHER_API_KEY=<your-weather-api-key>
```

## Running Locally

### Development

```bash
yarn dev
```

The server listens on port `3000` by default.

### Build and Start

```bash
yarn build
yarn start
```

## API

### GET /api/weather/current

Fetches current weather data for a given latitude and longitude.

#### Query Parameters

- `lat` (required) - latitude coordinate
- `lon` (required) - longitude coordinate

#### Successful Response

```json
{
  "currentWeather": {
    "...weather API response data..."
  }
}
```

#### Error Responses

- `400 Bad Request` when `lat` or `lon` are missing or invalid
- `404 Not Found` when current weather data is unavailable
- `500 Internal Server Error` when the external weather API request fails

### GET /api/weather/forecast

Fetches a 5-day weather forecast for a given latitude and longitude.

#### Query Parameters

- `lat` (required) - latitude coordinate
- `lon` (required) - longitude coordinate

#### Successful Response

```json
{
  "forecastWeather": {
    "...weather API response data..."
  }
}
```

#### Error Responses

- `400 Bad Request` when `lat` or `lon` are missing or invalid
- `404 Not Found` when forecast data is unavailable
- `500 Internal Server Error` when the external weather API request fails

## Project Structure

- `src/server.ts` - Express application entry point
- `src/modules/weather/weather.routes.ts` - Weather router (current and forecast)
- `src/modules/weather/weather.controller.ts` - Controller handling request flow for both endpoints
- `src/modules/weather/weather.service.ts` - Service calling the external weather API (current and forecast)
- `src/modules/weather/utils/weather.service.utils.ts` - Utility function for reusable weather API calls
- `src/modules/weather/utils/weather.controller.utils.ts` - Utility functions for parsing, validation and error handling
- `src/modules/weather/weather.model.ts` - Weather request parameter types

## Notes

- The service expects the weather API base URL and key to be provided through environment variables.
- Current and forecast endpoints share the same parameter parsing, validation and error-handling logic.
- Current implementation forwards the external API response data directly in the JSON body.
- As additional API modules are added, each should follow the same modular structure (`routes` / `controller` / `service` / `controller.utils` / `model`) for consistency.