import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { TermsOfServiceContent } from "@/components/terms-of-service-content";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function TermsOfServicePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const cartCount = user ? await getCartCount(user.id) : 0;

  return (
    <TermsOfServiceContent
      user={
        user
          ? { fullName: user.name ?? "there", userId: user.id, imageUrl: user.image ?? null }
          : null
      }
      cartCount={cartCount}
    />
  );
}