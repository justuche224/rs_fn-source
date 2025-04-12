import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

export function MarketData() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 400,
      symbolsGroups: [
        {
          name: "Crypto",
          symbols: [
            { name: "BINANCE:BTCUSDT", displayName: "Bitcoin" },
            { name: "BINANCE:ETHUSDT", displayName: "Ethereum" },
            { name: "BINANCE:XRPUSDT", displayName: "Ripple" },
            { name: "BINANCE:BNBUSDT", displayName: "Binance Coin" },
            { name: "BINANCE:DOGEUSDT", displayName: "Dogecoin" },
            { name: "BINANCE:SOLUSDT", displayName: "Solana" },
          ],
        },
        {
          name: "Indices",
          originalName: "Indices",
          symbols: [
            { name: "FOREXCOM:SPXUSD", displayName: "S&P 500" },
            { name: "FOREXCOM:NSXUSD", displayName: "US 100" },
            { name: "FOREXCOM:DJI", displayName: "Dow 30" },
            { name: "INDEX:NKY", displayName: "Nikkei 225" },
            { name: "INDEX:DEU40", displayName: "DAX Index" },
            { name: "FOREXCOM:UKXGBP", displayName: "UK 100" },
          ],
        },
      ],
      showSymbolLogo: true,
      colorTheme: "light",
      isTransparent: false,
      locale: "en",
    });

    const container = document.querySelector(".tradingview-widget-container");
    if (container) {
      container.appendChild(script);
      scriptRef.current = script;
    }

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market Data</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="tradingview-widget-container h-[400px]">
          <div className="tradingview-widget-container__widget h-full"></div>
        </div>
      </CardContent>
    </Card>
  );
}
