import Prose from "@/components/Prose";

export const metadata = { title: "Refund & return policy" };

// ponytail: placeholder policy; client must review with their legal advisor before launch
export default function Refunds() {
  return (
    <Prose title="Refund & return policy">
      <h2>7-day returns</h2>
      <p>You can request a return within 7 days of delivery if the part is unused, uninstalled, in its original packaging and has all tags and labels intact.</p>
      <h2>Wrong, damaged or defective items</h2>
      <p>If you receive the wrong or a damaged item, contact us within 48 hours of delivery with your order number and photos or a short video. We will arrange a replacement or a full refund.</p>
      <h2>Fitment</h2>
      <p>Please check the part number and your car’s model, year and VIN before ordering. If you are unsure, <a href="/contact">contact us</a> first and we will confirm fitment. Parts that have been installed or used cannot be returned for a fitment error.</p>
      <h2>Not returnable</h2>
      <ul>
        <li>Opened fluids and consumables</li>
        <li>Electronic modules, ECUs and sensors once installed or coded to a car</li>
        <li>Special-order parts sourced for you on request</li>
        <li>Items damaged through misuse or incorrect installation</li>
      </ul>
      <h2>Refunds</h2>
      <p>Once your return is received and inspected, refunds are issued to the original payment method, or by bank transfer for pay-on-delivery orders, within 7 working days.</p>
      <h2>How to request a return</h2>
      <p>Use our <a href="/contact">contact page</a> or email us with your order number.</p>
    </Prose>
  );
}
