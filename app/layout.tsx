import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "江湖 (Jianghu) - Legend of the Condor Heroes",
  description: "A cinematic narrative RPG set in Jin Yong's Legend of the Condor Heroes universe. Experience the jianghu—the martial arts underworld.",
  keywords: ["wuxia", "rpg", "narrative game", "jin yong", "condor heroes", "martial arts"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-stone-900">
        {children}
      </body>
    </html>
  );
}
