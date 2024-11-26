import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import ReduxProvider from "./ReduxProvider";
import MainLayout from "./components/Layout/MainLayout";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Head from "next/head";
import { TelegramProvider } from "./telegramProvider";
import Script from "next/script";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "paHa Crossword App",
  description: "paHa Crossword App",
  // icons: {
  //   icon: ["/favicon.ico?v=4"],
  // },
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://telegram.org/js/telegram-web-app.js?56"
        strategy="beforeInteractive"
        defer
      />

      <body className={inter.className}>
        <TelegramProvider>
          <MainLayout>
            <ReduxProvider>{children}</ReduxProvider>
          </MainLayout>
        </TelegramProvider>
      </body>
    </html>
  );
}
