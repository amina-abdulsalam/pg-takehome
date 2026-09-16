# Description & Reasoning

This app takes a stock symbol, pulls the last 30 days of 15-minute intraday
data, groups it by trading day, and shows the average low, average high, and
total volume for each day.

## Why I Used TwelveData

I tried to use the Alpha Vantage API first,
but their intraday endpoint turned out to be premium-only, and their free tier had low API request limits per day. TwelveData's free
tier supports intraday data with a high enough rate limit that works for
this project (800), so I switched.

## Raw Data vs. What the App Returns

I kept the external API's response shape and my own API's `DailyAggregate`
shape as two separate types instead of one shared type. TwelveData provides 15-minute
readings, and my API collapses all of those down into one object per day.

## Volume Is Summed, Not Averaged

The spec's field names (`lowAverage`, `highAverage`) ask for averages, and
that's what I did for price. However, for the volume, I just returned the total volume per day instead of the average volume per intraday interval.

## How Errors Are Handled

Rather than sending back a 500 for anything that goes wrong, I looked at
TwelveData's actual documented error codes and split them into two buckets:

- A bad symbol or malformed request (400/404) comes back as a 404, since it's most likely caused by an invalid symbol typed by the user.
- Anything on the provider side (invalid API key, plan restriction, rate
  limiting, which would show as a 401/403/429 respectively) comes back as a 502 instead, since they're provider-side issues.

## What I'd Still Want to Add

A couple of things I didn't build out, given the MVP scope:

- There's no schema validation on the API response. Currently, the code just checks that
  `data.values` exists and doesn't validate the full shape. If TwelveData
  changed their response format, my code could potentially fail.
- The `DailyAggregate` type is declared separately in both the frontend and
  backend, since there's no shared package between them. They're kept in
  sync by hand against the same JSON contract. This is a bit inefficient and
  could be optimized in the future.
