"use client";

import { useSettings } from "../context/SettingsContext";
import { currencyInfo } from "../data/currency";

type PriceProps = {
    amount: number;
};

export default function Price({
                                  amount,
                              }: PriceProps) {
    const { currency } = useSettings();

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    const convertedAmount =
        amount * selectedCurrency.rate;

    return (
        <>
            {selectedCurrency.symbol}
            {Math.round(
                convertedAmount
            ).toLocaleString()}
        </>
    );
}