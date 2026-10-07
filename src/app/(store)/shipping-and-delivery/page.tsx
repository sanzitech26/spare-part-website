import Prose from "@/components/Prose";
import { FLAT_SHIPPING, FREE_SHIPPING_OVER } from "@/lib/shipping";

export const metadata = { title: "Shipping & delivery" };

// ponytail: placeholder policy; client must review timelines and carriers before launch
export default function Shipping() {
  return (
    <Prose title="Shipping & delivery">
      <h2>Shipping charges</h2>
      <p>Orders of £{FREE_SHIPPING_OVER} and above ship free. Orders below £{FREE_SHIPPING_OVER} have a flat shipping charge of £{FLAT_SHIPPING}. The exact amount is shown in your cart and at checkout before you place the order.</p>
      <h2>Processing time</h2>
      <p>Orders are packed and handed to the courier within 1–2 working days of being placed. Orders placed on Sundays or public holidays are processed the next working day.</p>
      <h2>Delivery time</h2>
      <p>Most orders arrive within 3–7 working days, depending on your location. Highlands, islands and other remote postcodes may take longer.</p>
      <h2>Payment on delivery</h2>
      <p>Currently orders are paid on delivery. Please keep the exact amount ready. Online payment options will be added.</p>
      <h2>Damaged or wrong item</h2>
      <p>If your parcel arrives damaged, please record a short video while opening it and contact us within 48 hours. See our <a href="/refund-and-return-policy">refund & return policy</a>.</p>
    </Prose>
  );
}
