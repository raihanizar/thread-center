import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Provider } from "@/components/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ThreadCenter - Explore Interesting X/Twitter Threads",
  description: "Explore and Save Interesting X/Twitter Threads",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
