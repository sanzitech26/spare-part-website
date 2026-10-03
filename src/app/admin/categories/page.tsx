import TaxonomyAdmin from "../taxonomy/TaxonomyAdmin";

export default function Categories() {
  return <TaxonomyAdmin table="categories" title="Categories" hint="Shown in the store menu in Order sequence (lowest first). Renaming keeps the part assignments." />;
}
