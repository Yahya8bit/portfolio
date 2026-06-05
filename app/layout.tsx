import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NodeGraph from "@/components/NodeGraph";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohamed Yahia Gazzeh — Software Engineering Student",
  description:
    "Personal portfolio of Mohamed Yahia Gazzeh, software engineering student at ENSI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col">
        <NodeGraph />
        {children}
      </body>
    </html>
  );
}
