# API Testing Examples

Use the demo login first:

- email: `anuja@example.com`
- password: `farmguard123`

## Register

```bash
curl -X POST http://localhost:8000/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Farmer One\",\"email\":\"farmer@example.com\",\"password\":\"farmguard123\",\"phone\":\"9876543210\",\"location\":\"Pune\",\"language\":\"English\"}"
```

## Login

```bash
curl -X POST http://localhost:8000/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"anuja@example.com\",\"password\":\"farmguard123\"}"
```

## Ask AI

```bash
curl -X POST http://localhost:8000/ask-ai ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"Will it rain today and should I irrigate tomatoes?\",\"crop_name\":\"Tomato\",\"location\":\"Pune\",\"language\":\"English\"}"
```

## Weather

```bash
curl http://localhost:8000/weather/Pune -H "Authorization: Bearer YOUR_TOKEN"
```

## Market prices

```bash
curl http://localhost:8000/market-prices/tomato -H "Authorization: Bearer YOUR_TOKEN"
```

## Notifications

```bash
curl http://localhost:8000/notifications -H "Authorization: Bearer YOUR_TOKEN"
```

## Analytics

```bash
curl http://localhost:8000/analytics -H "Authorization: Bearer YOUR_TOKEN"
```

