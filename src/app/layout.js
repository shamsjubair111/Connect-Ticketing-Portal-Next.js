import "./globals.css";
import ClientLayout from "./ClientLayout"; // ✅ import client wrapper

export const metadata = {
  title: "Brilliant Connect Ticketing",
  description: "Ticket Management System by Intercloud Ltd.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
