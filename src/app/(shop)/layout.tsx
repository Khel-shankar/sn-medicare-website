import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoStrip from "@/components/PromoStrip";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PromoStrip />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
