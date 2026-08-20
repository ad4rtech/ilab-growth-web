import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { PrivacyPolicyContent } from "@/components/privacy-policy-content";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const cartCount = user ? await getCartCount(user.id) : 0;

  return (
    <PrivacyPolicyContent
      user={
        user
          ? { fullName: user.name ?? "there", userId: user.id, imageUrl: user.image ?? null }
          : null
      }
      cartCount={cartCount}
    />
  );
}