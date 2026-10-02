"use client";
import { useEffect } from "react";
import { useCart } from "@/components/cart";

export default function ClearCart() {
  const { clear } = useCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { clear(); }, []);
  return null;
}
