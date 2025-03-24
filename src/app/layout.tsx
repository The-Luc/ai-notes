import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "../provider/ThemeProvider";
import Header from "../components/Header";
import { Toaster } from "../components/ui/sonner";

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
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
        >
          <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 flex-col px-4 pt-10 xl:px-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
