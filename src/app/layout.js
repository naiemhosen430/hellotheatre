import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import AuthContexProvider from "@/Contexts/AuthContex";
import RoomContexProvider from "@/Contexts/RoomContext";
import ButtomBar from "./_components/shared/ButtomBar";
import Header from "./_components/shared/Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hello Theatre",
  description: "A social theatre of friends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <body className={inter.className}>
        <AuthContexProvider>
          <RoomContexProvider>
            <div className="bg-[#46007C] min-h-screen">
              <Header />
              {children}
              <ButtomBar />
            </div>
          </RoomContexProvider>
        </AuthContexProvider>
      </body>
    </html>
  );
}
