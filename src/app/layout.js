import "./globals.css";

export const metadata = {
  title: "ThreadCenter - Explore Interesting X/Twitter Threads",
  description: "Explore and Save Interesting X/Twitter Threads",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
