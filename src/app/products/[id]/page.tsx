import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { BuyNowButton } from "@/components/buy-now-button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductGallery } from "@/components/products/product-gallery";
import { ShareButtons } from "@/components/products/share-buttons";
import { RelatedProducts } from "@/components/products/related-products";
import { getCartCount } from "@/lib/cart";
import { formatKES } from "@/lib/format";
import {
  ChevronRight,
  CheckCircle2,
  Download,
  Zap,
  RefreshCw,
  Smartphone,
  CreditCard,
  Wallet,
  ShieldCheck,
  FolderOpen,
  HardDrive,
  Globe,
  Check,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  category: string | null;
  productType: string | null;
  badge: string | null;
  imageUrl: string | null;
  whatsIncluded: string[];
  format: string | null;
  fileSizeLabel: string | null;
  language: string | null;
  images: { id: string; url: string }[];
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function checkOwned(userId: string, productId: string): Promise<{ owned: boolean; fileUrl: string | null }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/orders?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return { owned: false, fileUrl: null };
    const orders: Array<{ status: string; item: { type: string; id: string; fileUrl?: string | null } | null }> = await res.json();
    const match = orders.find((o) => o.status === "completed" && o.item?.type === "product" && o.item.id === productId);
    return { owned: !!match, fileUrl: match?.item?.fileUrl ?? null };
  } catch {
    return { owned: false, fileUrl: null };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as (typeof session extends null ? never : NonNullable<typeof session>["user"]) & { role?: string } | undefined;

  const ownership = user ? await checkOwned(user.id, product.id) : { owned: false, fileUrl: null };
  const cartCount = user ? await getCartCount(user.id) : 0;

  const badgeLabel = product.price === 0 ? "Free" : product.badge;
  const percentOff =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  const galleryImages = product.images.length > 0 ? product.images.map((img) => img.url) : product.imageUrl ? [product.imageUrl] : [];

  const specs = [
    product.format && { icon: FolderOpen, label: "Format:", value: product.format },
    product.fileSizeLabel && { icon: HardDrive, label: "File size:", value: product.fileSizeLabel },
    product.language && { icon: Globe, label: "Language:", value: product.language },
  ].filter((s): s is { icon: typeof FolderOpen; label: string; value: string } => !!s);

  const detailPath = `/products/${product.id}`;

  return (
    <div className="flex min-h-screen flex-col">
      {user ? (
        <DashboardHeader fullName={user.name ?? "there"} userId={user.id} imageUrl={user.image ?? null} initialCartCount={cartCount} />
      ) : (
        <SiteHeader />
      )}

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/products" className="hover:underline">Products</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{product.title}</span>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <ProductGallery images={galleryImages} alt={product.title} badgeLabel={badgeLabel} />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-xl bg-orange-50 p-4">
                <Zap className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-semibold">Instant Download</p>
                  <p className="text-xs text-muted-foreground">Get files immediately after payment</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-orange-50 p-4">
                <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-semibold">Lifetime Updates</p>
                  <p className="text-xs text-muted-foreground">Free updates to all future versions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-orange-50 p-4">
                <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-semibold">M-Pesa Accepted</p>
                  <p className="text-xs text-muted-foreground">Easy checkout via M-Pesa</p>
                </div>
              </div>
            </div>

            {product.whatsIncluded.length > 0 && (
              <div className="mt-8 rounded-xl border p-6">
                <h2 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold">What&apos;s Included</h2>
                <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                  {product.whatsIncluded.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <RelatedProducts productId={product.id} />
          </div>

          <div>
            <div className="rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-orange-600">
                  {[product.category, product.productType].filter(Boolean).join(" · ")}
                </p>
                {badgeLabel && (
                  <span className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-medium text-white">{badgeLabel}</span>
                )}
              </div>

              <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-2 text-2xl font-bold">{product.title}</h1>

              <div className="mt-4 flex items-baseline gap-3">
                <p className="text-3xl font-bold text-gray-900">{formatKES(product.price)}</p>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <p className="text-lg text-muted-foreground line-through">{formatKES(product.compareAtPrice)}</p>
                    {percentOff !== null && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">{percentOff}% off</span>
                    )}
                  </>
                )}
              </div>

              <div className="mt-5 space-y-2">
                {ownership.owned ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">You already own this product</span>
                    </div>
                    {ownership.fileUrl ? (
                      <a
                        href={ownership.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
                >
                        <Download className="h-4 w-4" />
                        Download Now
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">No file has been attached to this product yet — we&apos;ll be in touch.</p>
                    )}
                  </div>
                ) : (
                  <>
                    <BuyNowButton
                      itemType="product"
                      itemId={product.id}
                      price={product.price}
                      userId={user?.id}
                      redirectPath={detailPath}
                    />
                    <AddToCartButton productId={product.id} title={product.title} price={product.price} userId={user?.id} />
                  </>
                )}
              </div>

              {specs.length > 0 && (
                <div className="mt-6 space-y-2 border-t pt-5 text-sm">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <spec.icon className="h-3.5 w-3.5" />
                        {spec.label}
                      </span>
                      <span className="font-medium text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t pt-5">
                <p className="text-center text-xs text-muted-foreground">Secure payment via</p>
                <div className="mt-2 flex justify-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs">
                    <CreditCard className="h-3.5 w-3.5" />Card
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs">
                    <Smartphone className="h-3.5 w-3.5" />M-Pesa
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs">
                    <Wallet className="h-3.5 w-3.5" />PayPal
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                <p>30-day money-back guarantee. If this product doesn&apos;t meet your expectations, we&apos;ll refund you — no questions asked.</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border p-4">
              <p className="text-sm font-medium">Share this product</p>
              <ShareButtons path={detailPath} title={product.title} />
            </div>
          </div>
        </div>
      </div>

      {user ? <DashboardFooter /> : <SiteFooter />}
    </div>
  );
}