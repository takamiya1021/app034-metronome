import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "メトロノーム",
  description: "シンプルで正確なメトロノームアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
