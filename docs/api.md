# Smart Fridge Backend API Documentation

This document provides detailed documentation for the Smart Fridge Backend API.

## Table of Contents

- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Sessions](#sessions)
  - [Recipes](#recipes)

## Authentication

The API uses a session-based authentication system. To access protected endpoints, you need to include the following headers in your request:

- `x-session-id`: The ID of the session.
- `x-session-token`: The token for the session.

You can obtain a session ID and token by calling the `POST /api/sessions/start` endpoint.

## API Endpoints

### Sessions

#### `POST /api/sessions/start`

Starts a new session and returns a session ID and token.

**Request Body**

None

**Response Body**

```json
{
  "sessionId": "string",
  "token": "string"
}
```

**Example**

```bash
curl -X POST http://localhost:5000/api/sessions/start
```

#### `GET /api/sessions/:id`

Retrieves information about a session.

**URL Parameters**

- `id` (string, required): The ID of the session.

**Response Body**

```json
{
  "sessionId": "string",
  "token": "string",
  "expiresAt": "number",
  "requestCount": "number"
}
```

**Example**

```bash
curl http://localhost:5000/api/sessions/your-session-id
```

### Recipes

#### `GET /api/recipes/generate`

Generates a recipe based on a list of ingredients.

**Authentication**

This endpoint requires authentication. See the [Authentication](#authentication) section for more details.

**Query Parameters**

- `ingredients` (string, required): A comma-separated list of ingredients.

**Response Body**

```json
{
  "recipe": "string"
}
```

**Example**

```bash
curl -H "x-session-id: your-session-id" -H "x-session-token: your-session-token" "http://localhost:5000/api/recipes/generate?ingredients=chicken,rice,broccoli"
```
