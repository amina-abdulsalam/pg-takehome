import {
  TwelveDataIntradayResponse,
  TwelveDataValue,
  DailyAggregate,
} from "../types/types";

// Split the date at the space since the API returns it like 2026-09-11 11:00:00
// This helps with aggregating the data
function extractDateKey(datetime: string): string {
  return datetime.split(" ")[0];
}

function groupByDay(values: TwelveDataValue[]): Map<string, TwelveDataValue[]> {
  const grouped = new Map<string, TwelveDataValue[]>();

  for (const entry of values) {
    const day = extractDateKey(entry.datetime);
    const existing = grouped.get(day) ?? [];
    existing.push(entry);
    grouped.set(day, existing);
  }

  return grouped;
}

function aggregateDay(day: string, entries: TwelveDataValue[]): DailyAggregate {
  const lows = entries.map((e) => parseFloat(e.low));
  const highs = entries.map((e) => parseFloat(e.high));
  const totalVolume = entries.reduce((sum, e) => sum + parseFloat(e.volume), 0);

  const lowAverage = lows.reduce((sum, val) => sum + val, 0) / lows.length;
  const highAverage = highs.reduce((sum, val) => sum + val, 0) / highs.length;

  return {
    day,
    lowAverage,
    highAverage,
    volume: totalVolume,
  };
}

export function aggregateByDay(
  response: TwelveDataIntradayResponse,
): DailyAggregate[] {
  const grouped = groupByDay(response.values);

  const result: DailyAggregate[] = [];
  for (const [day, entries] of grouped) {
    result.push(aggregateDay(day, entries));
  }

  return result.sort((a, b) => a.day.localeCompare(b.day));
}
