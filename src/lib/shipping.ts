// Display copy of the shipping rule; the real total is computed in SQL (place_order) from these same numbers.
export const FREE_SHIPPING_OVER = 999;
export const FLAT_SHIPPING = 60;
export const shippingFor = (subtotal: number) => (subtotal >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING);
