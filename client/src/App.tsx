import { useState } from "react";
import "./App.css";

interface DailyAggregate {
  day: string;
  lowAverage: number;
  highAverage: number;
  volume: number;
}

const ROWS_PER_PAGE = 7;

function App() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState<DailyAggregate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (symbol.trim() === "") {
      setError("Please enter a stock symbol");
      return;
    }

    setLoading(true);
    setError("");
    setData([]);
    setCurrentPage(1);

    try {
      const response = await fetch(
        `http://localhost:3001/api/intraday/${symbol}`,
      );

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || "Something went wrong");
      }

      const result: DailyAggregate[] = await response.json();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ROWS_PER_PAGE);
  const rangeStart = data.length === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + ROWS_PER_PAGE, data.length);

  return (
    <div className="App">
      <p className="eyebrow">Intraday Market Data</p>
      <div className="title-row">
        <h1>{symbol ? symbol.toUpperCase() : "—"}</h1>
      </div>
      <hr className="divider" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter stock symbol"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}

      {data.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Low Average</th>
                <th>High Average</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row.day}>
                  <td>{row.day}</td>
                  <td>{row.lowAverage.toFixed(2)}</td>
                  <td>{row.highAverage.toFixed(2)}</td>
                  <td>{row.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span className="range">
              {rangeStart}–{rangeEnd} / {data.length}
            </span>
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              <span className="page-count">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
