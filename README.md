# Public Services API Gateway

A public service API gateway built with Express and TypeScript. The gateway is designed to consume multiple public APIs and expose unified endpoints for downstream clients.

## Features

- Express server written in TypeScript
- Modular API gateway architecture
- Weather route at `/api/weather/current`
- Query parameter parsing and validation
- External API request handling with Axios
- Environment-based configuration for API URL and key

## Requirements

- Node.js 18+ (recommended)
- yarn
- A weather API provider with an API key

## Setup

1. Clone the repository.
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
    "...weather" "API" "response" "data..."
  }
}
```

#### Error Responses

- `400 Bad Request` when `lat` or `lon` are missing or invalid
- `404 Not Found` when current weather data is unavailable
- `500 Internal Server Error` when the external weather API request fails

## Project Structure

- `src/server.ts` - Express application entry point
- `src/modules/weather/weather.routes.ts` - Weather router
- `src/modules/weather/weather.controller.ts` - Controller handling request flow
- `src/modules/weather/weather.service.ts` - Service calling the external weather API
- `src/modules/weather/weather.controller.utils.ts` - Utility functions for parsing, validation, and error handling
- `src/modules/weather/weather.model.ts` - Weather request parameter types

## Notes

- The service expects the weather API base URL and key to be provided through environment variables.
- Current implementation forwards the external API response data directly in the JSON body.
