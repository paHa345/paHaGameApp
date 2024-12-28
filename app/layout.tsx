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
import { Orbitron, Sofia_Sans, Ubuntu, Roboto_Slab } from "next/font/google";
import TransitionTemplate from "./components/TransitionTemplate";

const inter = Inter({ subsets: ["latin"] });
const sofia_Sans = Sofia_Sans({ weight: "400", subsets: ["cyrillic"] });
const ubuntu = Ubuntu({ weight: "400", subsets: ["cyrillic"], style: "normal" });
const roboto_Slab = Roboto_Slab({ weight: "400", subsets: ["cyrillic"], style: "normal" });

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
      <body className={`${roboto_Slab.className} bg-gradient-to-tr from-slate-50 to-lime-50`}>
        <TelegramProvider>
          <MainLayout>
            <ReduxProvider>{children}</ReduxProvider>
          </MainLayout>
        </TelegramProvider>
        {/* <Script src="https://telegram.org/js/telegram-web-app.js?56" strategy="beforeInteractive" /> */}
      </body>
    </html>
  );
}
