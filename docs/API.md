# API Documentation

Base URL: `http://localhost:5000/api`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

## Alerts

- `POST /alert`
- `POST /alerts`
- `GET /alerts`
- `GET /alerts/summary`
- `POST /alerts/:id/send`
- `POST /alerts/:id/cancel`
- `POST /trigger-hardware-alert`

Example payload for `POST /alerts`:

```json
{
  "type": "manual",
  "source": "web-ui",
  "severity": 4.4,
  "status": "countdown",
  "location": {
    "lat": 28.6139,
    "lng": 77.209,
    "accuracy": 12
  },
  "sensorSnapshot": {
    "threshold": 3.2,
    "shakeForce": 4.4,
    "deviceMotionAvailable": true
  }
}
```

## Contacts

- `POST /contacts`
- `GET /contacts`
- `PATCH /contacts/:id`
- `DELETE /contacts/:id`

## Location Logs

- `POST /location`
- `GET /location`

## RAG

- `GET /rag/documents`
- `POST /rag/upload`
- `POST /rag/query`

Example payload for `POST /rag/query`:

```json
{
  "question": "What should a driver do first after a collision?"
}
```
