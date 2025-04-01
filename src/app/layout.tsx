import "@/styles/globals.css";
import type { Metadata } from "next";
import { AppSidebar } from "../components/AppSidebar";
import Header from "../components/Header";
import { SidebarProvider } from "../components/ui/sidebar";
import { Toaster } from "../components/ui/sonner";
import NoteProvider from "../provider/NoteProvider";
import { ThemeProvider } from "../provider/ThemeProvider";

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
          <NoteProvider>
            <SidebarProvider>
              <AppSidebar />
              <div className="flex min-h-screen w-full flex-col">
                <Header />
                <main className="flex-1 flex-col px-4 pt-10 xl:px-8">
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </NoteProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
