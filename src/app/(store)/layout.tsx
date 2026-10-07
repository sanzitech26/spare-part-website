import { CartProvider } from "@/components/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <Script src="//code.jivosite.com/widget/4XqeOYvYeg" strategy="afterInteractive" />
    </CartProvider>
  );
}
