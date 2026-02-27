import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "JoodKids | جملة ملابس أطفال",
  description: "متجر جملة ملابس أطفال",
  manifest: "/manifest.webmanifest",
  themeColor: "#28B5F6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col">
        <ServiceWorkerRegister />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
