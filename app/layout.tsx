import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

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
    //передаем состояние авторизации для всех страниц
    <html lang="ru">
      <body className={`${roboto.className} bg-[#FAFAFA] min-h-full flex flex-col`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}