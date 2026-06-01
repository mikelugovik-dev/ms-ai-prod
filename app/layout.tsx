import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MS AI Production — AI видео, рилсы, креативы",
  description: "Профессиональная AI-студия. Создаём ИИ-видео, рилсы и креативы для соцсетей нового поколения.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}