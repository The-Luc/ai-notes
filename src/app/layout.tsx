import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from '../provider/ThemeProvider';

export const metadata: Metadata = {
  title: "AI Notes",
  description: "Keep your notes, ask AI for exploration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
