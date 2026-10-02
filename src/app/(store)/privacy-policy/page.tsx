import Prose from "@/components/Prose";

export const metadata = { title: "Privacy policy" };

// ponytail: placeholder policy; client must review with their legal advisor before launch
export default function Privacy() {
  return (
    <Prose title="Privacy policy">
      <p>This policy explains what personal information BRAND NAME collects and how we use it.</p>
      <h2>Information we collect</h2>
      <ul>
        <li>Account details: name, email address and password (stored securely, never in plain text).</li>
        <li>Order details: delivery address, phone number and the items you buy.</li>
        <li>Messages you send us through the contact form.</li>
      </ul>
      <h2>How we use it</h2>
      <p>To process and deliver your orders, provide customer support, and keep your account secure. We do not sell your personal information.</p>
      <h2>Who we share it with</h2>
      <p>Only with service providers needed to run the store, such as delivery partners, our hosting and database providers, and payment providers once online payment is enabled.</p>
      <h2>Cookies and local storage</h2>
      <p>We use cookies to keep you signed in and your browser&apos;s local storage to remember the items in your cart.</p>
      <h2>Your rights</h2>
      <p>You can ask us to view, correct or delete your personal information at any time through our <a href="/contact">contact page</a>.</p>
    </Prose>
  );
}
