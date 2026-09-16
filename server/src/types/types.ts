export interface TwelveDataMeta {
  symbol: string;
  interval: string;
  currency: string;
  exchange_timezone: string;
  exchange: string;
  mic_code: string;
  type: string;
}

export interface TwelveDataValue {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface TwelveDataIntradayResponse {
  meta: TwelveDataMeta;
  values: TwelveDataValue[];
}

export interface DailyAggregate {
  day: string;
  lowAverage: number;
  highAverage: number;
  volume: number;
}

// errors
export class InvalidSymbolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSymbolError";
  }
}

export class ExternalApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExternalApiError";
  }
}
