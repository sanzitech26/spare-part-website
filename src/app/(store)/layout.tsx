import { CartProvider } from "@/components/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <WhatsAppButton />
      <Script src="//code.jivosite.com/widget/4XqeOYvYeg" strategy="afterInteractive" />
    </CartProvider>
  );
}
