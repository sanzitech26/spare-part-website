import TaxonomyAdmin from "../taxonomy/TaxonomyAdmin";

export default function Models() {
  return <TaxonomyAdmin table="models" title="Car models" hint="The Mercedes-Benz model ranges parts can fit (A-Class, GLC...). Tick them per part in the product form." />;
}
