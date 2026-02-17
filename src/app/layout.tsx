import type { Metadata } from "next";
import "styles/globals.css";

export const metadata: Metadata = {
  title: "Investt",
  description: "Learn finance safely through simulation and AI guidance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-var(--bg) text-var(--text)">
        {children}
      </body>
    </html>
  );
}
