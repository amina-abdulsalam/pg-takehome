import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import intradayRouter from "./routes/intraday";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/api/intraday", intradayRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
