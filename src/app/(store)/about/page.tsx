import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata = { title: "About us" };

// ponytail: placeholder copy; client to replace with real company story
export default function About() {
  return (
    <Prose title="About us">
      <p>BRAND NAME supplies genuine and OEM spare parts for Mercedes-Benz cars and vans. We help owners and workshops across India find the exact part their car needs, with clear fitment information and delivery to the door.</p>
      <h2>What we stand for</h2>
      <ul>
        <li><b>Clearly labelled parts.</b> Every listing says whether a part is Genuine, OEM or otherwise, so you know what you are buying.</li>
        <li><b>Fitment you can trust.</b> Each part lists the models it fits. If it does not, tell us your model and VIN and we will confirm before you pay.</li>
        <li><b>Real support.</b> Call or message us and a person will help you pick the right part.</li>
      </ul>
      <h2>What we cover</h2>
      <p>Engine and transmission parts, cooling and A/C, electronics and sensors, brakes and suspension, bumpers and body panels, grilles, headlights and tail lights, wheels and interior parts for the A-Class, C-Class, E-Class, S-Class, GLC, GLE, GLS and Sprinter.</p>
      <h2>Get in touch</h2>
      <p>Looking for a part you cannot see? <Link href="/contact">Contact us</Link> and we will source it.</p>
      <p className="text-sm text-slate-500">BRAND NAME is an independent parts supplier and is not affiliated with or endorsed by Mercedes-Benz Group AG. Mercedes-Benz is a trademark of its owner.</p>
    </Prose>
  );
}
