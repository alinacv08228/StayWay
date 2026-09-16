import type { Metadata } from "next";
import "./globals.css";

import { UserProvider } from "../context/UserContext";
import { SettingsProvider } from "../context/SettingsContext";
import { AxiosProvider } from "../context/AxiosContext";

import SiteShell from "../components/SiteShell";

export const metadata: Metadata = {
    title: "StayWay",
    description:
        "Find your perfect stay with StayWay",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <AxiosProvider>
            <UserProvider>
                <SettingsProvider>
                    <SiteShell>
                        {children}
                    </SiteShell>
                </SettingsProvider>
            </UserProvider>
        </AxiosProvider>
        </body>
        </html>
    );
}