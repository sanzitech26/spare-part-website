import Prose from "@/components/Prose";

export const metadata = { title: "About us" };

// ponytail: placeholder copy; client to replace with real company story
export default function About() {
  return (
    <Prose title="About us">
      <p>BRAND NAME is an online store for genuine two-wheeler spare parts and accessories. We help riders and workshops across India find the exact part their bike needs, at a fair price, delivered to the door.</p>
      <h2>What we stand for</h2>
      <ul>
        <li><b>Original parts only.</b> Every item is sourced from authorised brands and distributors.</li>
        <li><b>Fair pricing.</b> MRP and our price are always shown side by side.</li>
        <li><b>Real support.</b> Call or message us and a person will help you pick the right part.</li>
      </ul>
      <h2>Brands we cover</h2>
      <p>Hero, Bajaj, Honda, TVS, Yamaha, Royal Enfield, KTM, Suzuki and Mahindra, plus engine oil and riding accessories.</p>
      <h2>Get in touch</h2>
      <p>Questions about a part or an order? <a href="/contact">Contact us</a>.</p>
    </Prose>
  );
}
