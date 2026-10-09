import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

// 1. Инициализируем шрифт
const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "SkyFitnessPro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      {/* 2. Применяем roboto.className напрямую к body. */}
      <body className={`${roboto.className} bg-[#FAFAFA] min-h-full flex flex-col`}>
  {children}
</body>
    </html>
  );
}