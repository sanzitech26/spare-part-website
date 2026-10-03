// Primary links stay visible; the rest live under "More" (desktop) / the menu (mobile). Policies are repeated in the footer.
// Categories and car models come from the database (see Header), so adding one in admin adds it to the menu.
export const primary = [
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
export const more = [
  { href: "/about", label: "About us" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping-and-delivery", label: "Shipping & delivery" },
  { href: "/refund-and-return-policy", label: "Refund & return policy" },
  { href: "/privacy-policy", label: "Privacy policy" },
];
