export function normalizePhone(num?: string) {
  return (num || "").replace(/[^0-9]/g, "");
}

export function waLink(phone: string, text: string) {
  const p = normalizePhone(phone);
  const msg = encodeURIComponent(text);
  return p ? `https://wa.me/${p}?text=${msg}` : `https://wa.me/?text=${msg}`;
}
