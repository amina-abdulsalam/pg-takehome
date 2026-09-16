import {
  ExternalApiError,
  InvalidSymbolError,
  TwelveDataIntradayResponse,
} from "../types/types";

export async function fetchData(
  stockSymbol: string,
): Promise<TwelveDataIntradayResponse> {
  if (!stockSymbol || stockSymbol.trim() == "") {
    throw new InvalidSymbolError("Please provide a stock symbol");
  }

  const apiKey = process.env.API_KEY;
  const { startDate, endDate } = getDateRange();

  const url = `https://api.twelvedata.com/time_series?apikey=${apiKey}&symbol=${stockSymbol}&interval=15min&start_date=${startDate}&end_date=${endDate}&format=JSON`;

  const response = await fetch(url);

  if (response.status === 400) {
    throw new InvalidSymbolError(`Invalid request for symbol: ${stockSymbol}`);
  }

  if (response.status === 401 || response.status === 403) {
    throw new ExternalApiError(
      "Stock data provider rejected the request — check API key/plan",
    );
  }

  if (response.status === 404) {
    throw new InvalidSymbolError(`No data found for symbol: ${stockSymbol}`);
  }

  if (response.status === 429) {
    throw new ExternalApiError(
      "Rate limit reached with stock data provider — try again shortly",
    );
  }

  if (!response.ok) {
    throw new ExternalApiError(
      `API request failed with status ${response.status}`,
    );
  }

  // other errors
  if (!response.ok) {
    throw new ExternalApiError(
      `API request failed with status ${response.status}`,
    );
  }

  const data = await response.json();

  if (!data.values) {
    throw new ExternalApiError("Unexpected response shape from stock API");
  }

  return data as TwelveDataIntradayResponse;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateRange(): { startDate: string; endDate: string } {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return {
    startDate: formatDate(thirtyDaysAgo),
    endDate: formatDate(today),
  };
}
