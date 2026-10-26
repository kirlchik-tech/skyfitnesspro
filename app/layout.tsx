import type { Metadata } from "next";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";


const stratos = localFont({
  src: "../public/fonts/stratosskyengweb-regular.woff2", // Путь к файлу
  variable: "--font-stratos", // Создаем CSS переменную
  weight: "400",
});


const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto", // Создаем CSS переменную
});

export const metadata: Metadata = {
  title: "SkyFitnessPro",
  description: "Онлайн-тренировки для занятий дома",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${stratos.variable} ${roboto.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}