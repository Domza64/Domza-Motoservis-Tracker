"use client";

import { Chart } from "chart.js/auto";
import { useEffect, useRef } from "react";

export default function LineChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
          ],
          datasets: [
            {
              label: "My First dataset",
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
            },
            {
              label: "My Second dataset",
              backgroundColor: "rgba(153,102,255,0.4)",
              borderColor: "rgba(153,102,255,1)",
              data: [28, 48, 40, 19, 86, 27, 90],
              fill: false,
            },
          ],
        },
      });

      chartRef.current.chart = newChart;
    }
  }, []);

  return (
    <div className="relative w-full h-96">
      <canvas ref={chartRef} />
    </div>
  );
}
