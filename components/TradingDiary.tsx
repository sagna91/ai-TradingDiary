import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import Papa from "papaparse";

export default function TradingDiary() {
  const [fileName, setFileName] = useState("");
  const [emotions, setEmotions] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data;
          const symbolStats = {};

          data.forEach((row) => {
            const item = row["Item"];
            const profit = parseFloat(row["Profit"]);
            if (!item || isNaN(profit)) return;
            if (!symbolStats[item]) {
              symbolStats[item] = { total: 0, count: 0 };
            }
            symbolStats[item].total += profit;
            symbolStats[item].count++;
          });

          const profitableSymbols = Object.entries(symbolStats)
            .filter(([_, val]) => val.total > 0)
            .map(([sym]) => sym);

          const losingSymbols = Object.entries(symbolStats)
            .filter(([_, val]) => val.total < 0)
            .map(([sym]) => sym);

          setAnalysisResult({
            profitableSymbols,
            losingSymbols,
            averageHoldingTime: "--:--", // Placeholder
            suggestions: [
              ...profitableSymbols.map((s) => `Символ ${s} стабильно прибыльный — можно масштабировать.`),
              ...losingSymbols.map((s) => `Символ ${s} убыточный — стоит проанализировать стратегию.`)
            ]
          });
        }
      });
    }
  };

  return (
    <div className="p-6 grid gap-6 max-w
