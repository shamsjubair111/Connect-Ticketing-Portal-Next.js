import "./globals.css";
import ClientLayout from "./ClientLayout"; // ✅ import client wrapper

export const metadata = {
  title: "Connect Ticket Portal",
  description: "Ticket Management System by Jubair",
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
