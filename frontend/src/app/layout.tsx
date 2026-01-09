import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "../components/layout/NavBar";

export const metadata: Metadata = {
  title: "CoopTrack - Application Tracker + Resume Versioning",
  description:
    "Track your co-op and internship applications with built-in resume version control",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <NavBar></NavBar>
        <main className="px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
