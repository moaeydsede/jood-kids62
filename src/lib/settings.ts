import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type CompanySettings = {
  whatsappNumber?: string;
  instagram?: string;
  facebook?: string;
  telegram?: string;
  factoryLocation?: string;
  shopLocation?: string;
};

export async function getCompanySettings(): Promise<CompanySettings | null> {
  const ref = doc(db, "settings", "company");
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as any;
}
