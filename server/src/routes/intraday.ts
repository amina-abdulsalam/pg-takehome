import { Router, Request, Response } from "express";
import { fetchData } from "../services/stockApiData";
import { aggregateByDay } from "../services/aggregateData";
import { InvalidSymbolError, ExternalApiError } from "../types/types";

const router = Router();

router.get("/:symbol", async (req: Request, res: Response) => {
  const { symbol } = req.params;

  try {
    const rawData = await fetchData(symbol);
    const dailyAggregates = aggregateByDay(rawData);
    res.json(dailyAggregates);
  } catch (error) {
    if (error instanceof InvalidSymbolError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof ExternalApiError) {
      res.status(502).json({ error: error.message });
    } else {
      console.error("Unexpected error fetching intraday data:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
});

export default router;
