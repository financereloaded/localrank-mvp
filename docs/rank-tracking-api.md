# Rank Tracking API

## Endpoint

```
GET /api/track-rankings
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `keyword` | string | Yes | The search keyword to track |
| `location` | string | No | Location for local rankings (e.g., "Miami, FL") |

## Example Request

```
GET /api/track-rankings?keyword=plumber&location=Miami%2C+FL
```

## Response

```json
{
  "keyword": "plumber",
  "location": "Miami, FL",
  "results": [
    {
      "position": 1,
      "url": "https://example.com",
      "page": 1,
      "serp_type": "organic",
      "title": "Example Title",
      "snippet": "Example description"
    },
    {
      "position": 1,
      "url": "https://maps-listing.com",
      "page": 1,
      "serp_type": "maps",
      "title": "Local Business",
      "snippet": "123 Main St"
    }
  ],
  "total_results": 7,
  "search_metadata": {
    "id": "...",
    "status": "Success"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `keyword` | string | The searched keyword |
| `location` | string \| null | The location parameter provided |
| `results` | array | Array of ranking results |
| `results[].position` | number | Position in search results (1-based) |
| `results[].url` | string | The URL of the ranking page |
| `results[].page` | number | Page number where result appears |
| `results[].serp_type` | string | Either "organic" or "maps" |
| `results[].title` | string | Title of the result (if available) |
| `results[].snippet` | string | Description/snippet (if available) |
| `total_results` | number | Total number of results found |
| `search_metadata.id` | string | SerpApi search ID |
| `search_metadata.status` | string | Search status |

## Usage in Frontend

```typescript
const response = await fetch('/api/track-rankings?keyword=roofers&location=Austin, TX');
const data = await response.json();
console.log(data.results);
```

## Test Page

Visit `/test-rankings` to test the API interactively.
