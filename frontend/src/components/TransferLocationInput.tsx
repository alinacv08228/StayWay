"use client";

import { useMemo, useState } from "react";
import { TransferLocation } from "../services/transferLocationService";

type TransferLocationInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSelect: (location: TransferLocation) => void;
    placeholder: string;
    locations: TransferLocation[];
};

export default function TransferLocationInput({
                                                  value,
                                                  onChange,
                                                  onSelect,
                                                  placeholder,
                                                  locations,
                                              }: TransferLocationInputProps) {
    const [isOpen, setIsOpen] = useState(false);

    const suggestions = useMemo(() => {
        const query = value.trim().toLowerCase();

        if (!query) {
            return [];
        }

        return locations
            .filter((location) => {
                const searchableText = [
                    location.name,
                    location.cityName,
                    location.code ?? "",
                    ...location.searchTerms,
                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(query);
            })
            .slice(0, 8);
    }, [value, locations]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onChange(event.target.value);
        setIsOpen(true);
    };

    const handleSelect = (location: TransferLocation) => {
        onChange(location.name);
        onSelect(location);
        setIsOpen(false);
    };

    return (
        <div className="transfer-location-input">
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onFocus={() => setIsOpen(true)}
                onBlur={() => {
                    setTimeout(() => {
                        setIsOpen(false);
                    }, 150);
                }}
                placeholder={placeholder}
                autoComplete="off"
                required
            />

            {isOpen && suggestions.length > 0 && (
                <div className="transfer-location-suggestions">
                    {suggestions.map((location) => (
                        <button
                            key={location.id}
                            type="button"
                            className="transfer-location-suggestion"
                            onMouseDown={(event) =>
                                event.preventDefault()
                            }
                            onClick={() =>
                                handleSelect(location)
                            }
                        >
                            <span className="transfer-location-icon">
                                {location.type === "airport"
                                    ? "✈"
                                    : "⌂"}
                            </span>

                            <span className="transfer-location-info">
                                <span className="transfer-location-name">
                                    {location.name}
                                </span>

                                <span className="transfer-location-meta">
                                    {location.type === "airport"
                                        ? `${location.cityName} · ${location.code}`
                                        : `${location.cityName} · Hotel`}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <style jsx>{`
                .transfer-location-input {
                    position: relative;
                    width: 100%;
                }

                .transfer-location-input input {
                    width: 100%;
                }

                .transfer-location-suggestions {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    width: 100%;
                    max-height: 280px;
                    overflow-y: auto;
                    background: white;
                    border: 1px solid #e5e0f5;
                    border-radius: 14px;
                    box-shadow: 0 12px 30px rgba(70, 45, 130, 0.15);
                    z-index: 1000;
                    padding: 6px;
                }

                .transfer-location-suggestion {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 12px;
                    border: none;
                    background: transparent;
                    border-radius: 10px;
                    cursor: pointer;
                    text-align: left;
                }

                .transfer-location-suggestion:hover {
                    background: #f4f0ff;
                }

                .transfer-location-icon {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    background: #f0ebff;
                    border-radius: 9px;
                    color: #6547e8;
                    font-size: 16px;
                }

                .transfer-location-info {
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .transfer-location-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #29233d;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .transfer-location-meta {
                    font-size: 11px;
                    color: #8a8499;
                }

                :global(html[data-theme="dark"]) .transfer-location-suggestions {
                    background: #17243a !important;
                    border-color: #3a4861 !important;
                    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.30) !important;
                }

                :global(html[data-theme="dark"]) .transfer-location-suggestion {
                    color: #f7f9ff !important;
                }

                :global(html[data-theme="dark"]) .transfer-location-suggestion:hover {
                    background: #22314a !important;
                }

                :global(html[data-theme="dark"]) .transfer-location-icon {
                    background: #26344f !important;
                    color: #a997ff !important;
                }

                :global(html[data-theme="dark"]) .transfer-location-name {
                    color: #f7f9ff !important;
                }

                :global(html[data-theme="dark"]) .transfer-location-meta {
                    color: #bfc8d8 !important;
                }
                
            `}</style>
        </div>
    );
}