import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserProvider } from "../context/UserContext";

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
          <Header />

          {children}

          <Footer />
      </UserProvider>
      </body>
      </html>
  );
}