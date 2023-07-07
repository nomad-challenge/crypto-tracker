import { useQuery } from "@tanstack/react-query";
import { fetchCoinHistory } from "../api";
import ReactApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkState } from "../atoms";

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}
function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkState);
  const { isLoading, data } = useQuery<IHistorical[] | { error: string }>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  if (data && !Array.isArray(data)) {
    return <div>{data.error}</div>;
  }

  return (
    <div>
      <ReactApexChart
        type="candlestick"
        series={[
          {
            data: data?.map((coin) => ({
              x: new Date(coin.time_close * 1000),
              y: [coin.open, coin.high, coin.low, coin.close],
            })),
          },
        ]}
        options={{
          theme: {
            mode: isDark ? "dark" : "light",
          },
          chart: {
            type: "candlestick",
            height: 350,
            background: "transparent",
          },
          grid: {
            show: true,
          },
          title: {
            text: "",
            align: "left",
          },
          xaxis: {
            type: "datetime",
          },
          yaxis: {
            tooltip: {
              enabled: true,
            },
          },
        }}
      />
    </div>
  );
}

export default Chart;
