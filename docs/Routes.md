# API Routes Reference

A complete reference for all endpoints exposed by the Public Service Gateway, with ready-to-use Postman examples.

All routes are versioned under `/api/v1`. No authentication headers are required from the client the gateway handles upstream API authentication automatically using secrets fetched from Infisical at startup.

## Postman Setup

1. Create a Postman **Environment** and add the variable:
   ```
   baseUrl = http://localhost:3000
   ```
2. Use `{{baseUrl}}` as a prefix in all requests below.
3. No `Authorization` headers or API keys are needed in any request.


## Table of Contents

1. [Weather](#1-weather----apiv1weather)
2. [News](#2-news----apiv1news)
3. [Currency](#3-currency----apiv1currency)
4. [Public Holidays](#4-public-holidays----apiv1holiday)
5. [Sports](#5-sports----apiv1sports)


## 1. Weather `/api/v1/weather`

**Upstream API:** [OpenWeatherMap](https://openweathermap.org/api)

| Method | Endpoint | Required Params |
|---|---|---|
| GET | `/api/v1/weather/current` | `lat`, `lon` |
| GET | `/api/v1/weather/forecast` | `lat`, `lon` |


### GET /api/v1/weather/current

Fetches current weather conditions for a given location.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `lat` | Yes | Latitude coordinate |
| `lon` | Yes | Longitude coordinate |

**Postman Example**
```
GET {{baseUrl}}/api/v1/weather/current?lat=51.5074&lon=-0.1278
```

**Successful Response**
```json
{
  "currentWeather": {
    "details": "...OpenWeatherMap response..."
  }
}
```

**Error Responses**
- `400 Bad Request` `lat` or `lon` missing
- `500 Internal Server Error` upstream API request failed

---

### GET /api/v1/weather/forecast

Fetches a 5-day / 3-hour interval weather forecast for a given location.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `lat` | Yes | Latitude coordinate |
| `lon` | Yes | Longitude coordinate |

**Postman Example**
```
GET {{baseUrl}}/api/v1/weather/forecast?lat=51.5074&lon=-0.1278
```

**Successful Response**
```json
{
  "forecastWeather": {
    "details": "...OpenWeatherMap response..."
  }
}
```

**Error Responses**
- `400 Bad Request` `lat` or `lon` missing
- `500 Internal Server Error` upstream API request failed


## 2. News `/api/v1/news`

**Upstream API:** [NewsAPI](https://newsapi.org/)

| Method | Endpoint | Required Params |
|---|---|---|
| GET | `/api/v1/news/top-headlines` | `country` |
| GET | `/api/v1/news/topic` | `q` |


### GET /api/v1/news/top-headlines

Fetches current top headlines filtered by country.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `country` | Yes | Two-letter country code (e.g. `us`, `gb`, `gh`) |

**Postman Example**
```
GET {{baseUrl}}/api/v1/news/top-headlines?country=us
```

**Successful Response**
```json
{
  "Top Headlines": {
    "details": "...NewsAPI response..."
  }
}
```

**Error Responses**
- `400 Bad Request` `country` missing
- `500 Internal Server Error` upstream API request failed


### GET /api/v1/news/topic

Fetches news articles matching a search term or phrase.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `q` | Yes | Search term or phrase (e.g. `technology`, `climate change`) |

**Postman Example**
```
GET {{baseUrl}}/api/v1/news/topic?q=technology
```

**Successful Response**
```json
{
  "Related Article(s)": {
    "details": "...NewsAPI response..."
  }
}
```

**Error Responses**
- `400 Bad Request` `q` missing
- `500 Internal Server Error` upstream API request failed


## 3. Currency `/api/v1/currency`

**Upstream API:** [ExchangeRates.Host](https://exchangerate.host/)

| Method | Endpoint | Required Params |
|---|---|---|
| GET | `/api/v1/currency/list` | None |
| GET | `/api/v1/currency/live` | `symbols` |
| GET | `/api/v1/currency/historical` | `date` |
| GET | `/api/v1/currency/convert` | `from`, `to`, `amount` |
| GET | `/api/v1/currency/timeframe` | `start_date`, `end_date` |
| GET | `/api/v1/currency/change` | `start_date`, `end_date` |


### GET /api/v1/currency/list

Returns all currency codes and names supported by the upstream API.

**Postman Example**
```
GET {{baseUrl}}/api/v1/currency/list
```

### GET /api/v1/currency/live

Fetches real-time exchange rates for one or more currencies, relative to a base currency (default: USD).

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `symbols` | Yes | Comma-separated currency codes (e.g. `USD,EUR,GBP`) |

**Postman Example**
```
GET {{baseUrl}}/api/v1/currency/live?symbols=USD,EUR,GBP
```

### GET /api/v1/currency/historical

Fetches exchange rates for a specific past date.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `date` | Yes | Date in `YYYY-MM-DD` format |

**Postman Example**
```
GET {{baseUrl}}/api/v1/currency/historical?date=2025-01-01
```

### GET /api/v1/currency/convert

Converts a specified amount from one currency to another.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `from` | Yes | Source currency code (e.g. `USD`) |
| `to` | Yes | Target currency code (e.g. `GBP`) |
| `amount` | Yes | Numeric amount to convert |

**Postman Example**
```
GET {{baseUrl}}/api/v1/currency/convert?from=USD&to=GBP&amount=100
```

### GET /api/v1/currency/timeframe

Fetches exchange rates for every day within a specified date range.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `start_date` | Yes | Start date in `YYYY-MM-DD` format |
| `end_date` | Yes | End date in `YYYY-MM-DD` format |

**Postman Example**
```
GET {{baseUrl}}/api/v1/currency/timeframe?start_date=2025-01-01&end_date=2025-01-31
```

### GET /api/v1/currency/change

Returns the rate of change (margin and percentage) for currencies between two dates.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `start_date` | Yes | Start date in `YYYY-MM-DD` format |
| `end_date` | Yes | End date in `YYYY-MM-DD` format |

**Postman Example**
```
GET {{baseUrl}}/api/v1/currency/change?start_date=2025-01-01&end_date=2025-01-31
```

## 4. Public Holidays `/api/v1/holiday`

**Upstream API:** [Nager.Date](https://date.nager.at/)

| Method | Endpoint | Required Params |
|---|---|---|
| GET | `/api/v1/holiday/AvailableCountries` | None |
| GET | `/api/v1/holiday/PublicHolidays` | `year`, `countryCode` |
| GET | `/api/v1/holiday/NextPublicHolidays` | `countryCode` |
| GET | `/api/v1/holiday/NextPublicHolidaysWorldwide` | None |
| GET | `/api/v1/holiday/CountryInfo` | `countryCode` |
| GET | `/api/v1/holiday/LongWeekend` | `year`, `countryCode` |
| GET | `/api/v1/holiday/IsTodayPublicHoliday` | `countryCode` |

### GET /api/v1/holiday/AvailableCountries

Returns the full list of countries supported by the Nager.Date API.

**Postman Example**
```
GET {{baseUrl}}/api/v1/holiday/AvailableCountries
```

### GET /api/v1/holiday/PublicHolidays

Returns all public holidays for a given country and year.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `year` | Yes | Four-digit year (e.g. `2026`) |
| `countryCode` | Yes | Two-letter country code (e.g. `US`, `GB`, `GH`) |

**Postman Example**
```
GET {{baseUrl}}/api/v1/holiday/PublicHolidays?year=2026&countryCode=US
```

### GET /api/v1/holiday/NextPublicHolidays

Returns the upcoming public holidays for a given country.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `countryCode` | Yes | Two-letter country code |

**Postman Example**
```
GET {{baseUrl}}/api/v1/holiday/NextPublicHolidays?countryCode=GB
```

### GET /api/v1/holiday/NextPublicHolidaysWorldwide

Returns the next public holidays across all countries supported by the API.

**Postman Example**
```
GET {{baseUrl}}/api/v1/holiday/NextPublicHolidaysWorldwide
```

### GET /api/v1/holiday/CountryInfo

Returns metadata about a country full name, region, borders, etc.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `countryCode` | Yes | Two-letter country code |

**Postman Example**
```
GET {{baseUrl}}/api/v1/holiday/CountryInfo?countryCode=US
```

### GET /api/v1/holiday/LongWeekend

Returns all long weekends (public holidays adjacent to weekends) for a given country and year.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `year` | Yes | Four-digit year (e.g. `2026`) |
| `countryCode` | Yes | Two-letter country code |

**Postman Example**
```
GET {{baseUrl}}/api/v1/holiday/LongWeekend?year=2026&countryCode=US
```


### GET /api/v1/holiday/IsTodayPublicHoliday

Returns whether today is a public holiday in the given country.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `countryCode` | Yes | Two-letter country code |

**Postman Example**
```
GET {{baseUrl}}/api/v1/holiday/IsTodayPublicHoliday?countryCode=US
```

**Response**
- `true` HTTP 200, today is a public holiday
- `false` HTTP 204, today is not a public holiday

## 5. Sports `/api/v1/sports`

**Upstream API:** [TheSportsDB](https://www.thesportsdb.com/api.php)

| Method | Endpoint | Required Params |
|---|---|---|
| GET | `/api/v1/sports/searchTeams` | `t` |
| GET | `/api/v1/sports/searchEvents` | `e` |
| GET | `/api/v1/sports/searchPlayers` | `p` |
| GET | `/api/v1/sports/searchVenues` | `v` |
| GET | `/api/v1/sports/lookUpLeague` | `id` |
| GET | `/api/v1/sports/lookUpTable` | `l` |

### GET /api/v1/sports/searchTeams

Searches for sports teams by name.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `t` | Yes | Team name to search for (e.g. `Arsenal`) |

**Postman Example**
```
GET {{baseUrl}}/api/v1/sports/searchTeams?t=Arsenal
```

**Successful Response**
```json
{
  "Sports Teams": {
    "teams": [
      {
        "idTeam": "133604",
        "strTeam": "Arsenal",
        "strTeamBadge": "https://...",
        "strSport": "Soccer",
        "strLeague": "English Premier League",
        "idLeague": "4328",
        "strCountry": "England",
        "strStadium": "Emirates Stadium",
        "strDescriptionEN": "...",
        "intFormedYear": "1886"
      }
    ]
  }
}
```

**Error Responses**
- `400 Bad Request` `t` missing
- `500 Internal Server Error` upstream API request failed

### GET /api/v1/sports/searchEvents

Searches for sports events by event name and optionally by season.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `e` | Yes | Event name to search for (e.g. `Arsenal_vs_Chelsea`) |
| `s` | No | Season to filter by (e.g. `2024-2025`) |

**Postman Example**
```
GET {{baseUrl}}/api/v1/sports/searchEvents?e=Arsenal_vs_Chelsea&s=2024-2025
```

**Successful Response**
```json
{
  "Sports Events": {
    "events": [
      {
        "idEvent": "1234567",
        "strEvent": "Arsenal vs Chelsea",
        "strSport": "Soccer",
        "idLeague": "4328",
        "strLeague": "English Premier League",
        "strSeason": "2024-2025",
        "strHomeTeam": "Arsenal",
        "strAwayTeam": "Chelsea",
        "intHomeScore": "2",
        "intAwayScore": "1",
        "dateEvent": "2024-10-05",
        "strTime": "12:30:00",
        "strVenue": "Emirates Stadium",
        "strStatus": "Match Finished"
      }
    ]
  }
}
```

**Error Responses**
- `400 Bad Request` `e` missing
- `500 Internal Server Error` upstream API request failed

### GET /api/v1/sports/searchPlayers

Searches for players by name.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `p` | Yes | Player name to search for (e.g. `Bukayo Saka`) |

**Postman Example**
```
GET {{baseUrl}}/api/v1/sports/searchPlayers?p=Bukayo+Saka
```

**Successful Response**
```json
{
  "Team Players": {
    "player": [
      {
        "idPlayer": "34146937",
        "strPlayer": "Bukayo Saka",
        "idTeam": "133604",
        "strTeam": "Arsenal",
        "strSport": "Soccer",
        "strNationality": "England",
        "dateBorn": "2001-09-05",
        "strPosition": "Winger",
        "strThumb": "https://...",
        "strDescriptionEN": "..."
      }
    ]
  }
}
```

**Error Responses**
- `400 Bad Request` `p` missing
- `500 Internal Server Error` upstream API request failed


### GET /api/v1/sports/searchVenues

Searches for sports venues by name.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `v` | Yes | Venue name to search for (e.g. `Emirates`) |

**Postman Example**
```
GET {{baseUrl}}/api/v1/sports/searchVenues?v=Emirates
```

**Successful Response**
```json
{
  "Sports Venues": {
    "venues": [
      {
        "idVenue": "15269",
        "strVenue": "Emirates Stadium",
        "strCountry": "England",
        "strLocation": "London",
        "intCapacity": "60704"
      }
    ]
  }
}
```

**Error Responses**
- `400 Bad Request` `v` missing
- `500 Internal Server Error` upstream API request failed

### GET /api/v1/sports/lookUpLeague

Looks up details for a specific league by its TheSportsDB league ID.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `id` | Yes | TheSportsDB league ID (e.g. `4328`) |

**Postman Example**
```
GET {{baseUrl}}/api/v1/sports/lookUpLeague?id=4328
```

**Successful Response**
```json
{
  "Sports League(s)": {
    "leagues": [
      {
        "idLeague": "4328",
        "strLeague": "English Premier League",
        "strSport": "Soccer",
        "strCountry": "England",
        "strBadge": "https://...",
        "strDescriptionEN": "..."
      }
    ]
  }
}
```

**Error Responses**
- `400 Bad Request` `id` missing
- `500 Internal Server Error` upstream API request failed

### GET /api/v1/sports/lookUpTable

Looks up the league standings table for a given league, optionally filtered by season.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `l` | Yes | TheSportsDB league ID (e.g. `4328`) |
| `s` | No | Season to filter by (e.g. `2024-2025`) |

**Postman Example**
```
GET {{baseUrl}}/api/v1/sports/lookUpTable?l=4328&s=2024-2025
```

**Successful Response**
```json
{
  "Sports Table(s)": {
    "table": [
      {
        "idTeam": "133604",
        "strTeam": "Arsenal",
        "strBadge": "https://...",
        "intRank": "1",
        "intPlayed": "38",
        "intWin": "28",
        "intDraw": "5",
        "intLoss": "5",
        "intPoints": "89"
      }
    ]
  }
}
```

**Error Responses**
- `400 Bad Request` `l` missing
- `500 Internal Server Error` upstream API request failed
