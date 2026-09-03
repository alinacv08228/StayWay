import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserProvider } from "../context/UserContext";
import { SettingsProvider } from "../context/SettingsContext";

export const metadata: Metadata = {
    title: "StayWay",
    description: "Find your perfect stay with StayWay",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <UserProvider>
            <SettingsProvider>
                <Header />

                {children}

                <Footer />
            </SettingsProvider>
        </UserProvider>
        </body>
        </html>
    );
}