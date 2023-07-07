import { useQuery } from "@tanstack/react-query";
import { fetchCoinHistory } from "../api";
import { styled } from "styled-components";

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

interface PriceProps {
  coinId: string;
}

const getDate = (datetime: number) => {
  const current = new Date(datetime * 1000);

  const yyyy = current.getFullYear();
  const mm = String(current.getMonth() + 1).padStart(2, "0");
  const dd = String(current.getDate()).padStart(2, "0");

  return `${yyyy}.${mm}.${dd}`;
};

const PriceWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px;
  background-color: ${(props) => props.theme.cargBgColor};
  /* border: 1px solid red; */
`;
const Column = styled.div<{ color?: TUpDown }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 33.33%;

  span:first-child {
    font-size: 12px;
    opacity: 0.7;
    margin-bottom: 4px;
  }
  span:last-child {
    font-weight: 500;
    color: ${(props) =>
      props.color === "up" ? "red" : props.color === "down" ? "blue" : ""};
  }
`;
const ColumnHeader = styled.div``;

type TUpDown = "up" | "down" | "equal" | "";
interface IPriceTab {
  coin: IHistorical;
  closeUpDown: TUpDown;
  volumeUpDown: TUpDown;
}
const PriceTab: React.FC<IPriceTab> = ({ coin, closeUpDown, volumeUpDown }) => {
  return (
    <PriceWrapper>
      <Column>
        <span>거래일</span>
        <span>{getDate(coin.time_close)}</span>
      </Column>
      <Column color={closeUpDown}>
        <ColumnHeader>
          <span>종가 </span>
          <span>
            {closeUpDown === "up" ? "▲" : closeUpDown === "down" ? "▼" : "-"}
          </span>
        </ColumnHeader>
        <span>{coin.close}</span>
      </Column>
      <Column color={volumeUpDown}>
        <ColumnHeader>
          <span>거래량 </span>
          <span>
            {volumeUpDown === "up" ? "▲" : volumeUpDown === "down" ? "▼" : "-"}
          </span>
        </ColumnHeader>

        <span>{Number(coin.volume).toFixed(2)}</span>
      </Column>
    </PriceWrapper>
  );
};

const Price = ({ coinId }: PriceProps) => {
  const { isLoading, data } = useQuery<IHistorical[] | { error: string }>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    { refetchInterval: 10000 }
  );

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  if (data && !Array.isArray(data)) {
    return <div>{data.error}</div>;
  }
  return (
    <div>
      {data
        .sort((a, b) => b.time_open - a.time_open)
        .map((coin, index, coins) => {
          let closeUpDown: TUpDown = "",
            volumeUpDown: TUpDown = "";
          if (index < coins.length - 1) {
            const nextCoin = coins[index + 1];
            if (Number(coin.close) > Number(nextCoin.close)) {
              closeUpDown = "up";
            } else if (Number(coin.close) < Number(nextCoin.close)) {
              closeUpDown = "down";
            } else {
              closeUpDown = "equal";
            }
            if (Number(coin.volume) > Number(nextCoin.volume)) {
              volumeUpDown = "up";
            } else if (Number(coin.volume) < Number(nextCoin.volume)) {
              volumeUpDown = "down";
            } else {
              volumeUpDown = "equal";
            }
          }
          return (
            <PriceTab
              coin={coin}
              closeUpDown={closeUpDown}
              volumeUpDown={volumeUpDown}
            />
          );
        })
        .slice(0, data.length - 1)}
    </div>
  );
};

export default Price;
