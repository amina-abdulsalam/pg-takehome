# Stock Intraday Data App

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Frontend:** React, TypeScript, Vite

## Prerequisites

- Node.js v20+
- A free TwelveData API key (follow this guide to create one): https://twelvedata.com/docs/introduction/overview

## Setup

### 1. Clone the repo

```bash
git clone git@github.com:amina-abdulsalam/pg-takehome.git
cd pg-takehome
```

### 2. Install Dependencies for the Backend

```bash
cd server
npm install
```

### 3. Set up .env file

Duplicate the `.env.example` file inside `server/` and rename it to `.env`. Fill in your API key

### 4. Run the backend:

```bash
npm run dev
```

Server runs on `http://localhost:3001`.

### 5. Run the frontend

In a **second terminal** (keep the backend running):

```bash
cd client
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Usage

1. Enter a stock symbol (e.g. `IBM`, `AAPL`, `TSLA`)
2. Click **Search**
3. Results are grouped by day and paginated

## APIs

`GET /api/intraday/:symbol`: returns the last 30 days of intraday data, grouped by day.

| Status | Meaning                                          |
| ------ | ------------------------------------------------ |
| 200    | Success                                          |
| 404    | Invalid symbol / no data found                   |
| 502    | Upstream API failure (bad key, rate limit, etc.) |
