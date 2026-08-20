import Link from "next/link";
import { CheckCircle2, Download, Eye } from "lucide-react";
import { FavouriteButton } from "@/components/products/favourite-button";

export interface LibraryProduct {
  id: string;
  title: string;
  category: string | null;
  productType: string | null;
  badge: string | null;
  imageUrl: string | null;
  fileUrl: string | null;
  purchasedAt: string | null;
}

export function MyLibraryCard({
  product,
  userId,
  isFavourited,
}: {
  product: LibraryProduct;
  userId: string;
  isFavourited: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
        {product.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.title} className="absolute inset-0 h-full w-full object-cover" />
        )}
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            {product.badge}
          </span>
        )}
        <FavouriteButton
          userId={userId}
          productId={product.id}
          initialFavourited={isFavourited}
          className="absolute right-2 top-2"
        />
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <span className="inline-flex w-fit items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Owned
        </span>
        <p className="text-xs font-medium text-orange-600">
          {[product.category, product.productType].filter(Boolean).join(" · ")}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 style={{ fontFamily: "var(--font-ubuntu)" }} className="font-semibold leading-snug hover:underline">
            {product.title}
          </h3>
        </Link>
        {product.purchasedAt && (
          <p className="text-xs text-muted-foreground">
            Purchased{" "}
            {new Date(product.purchasedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          {product.fileUrl ? (
            <a
              href={product.fileUrl}
              download
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          ) : (
            <span className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
              File unavailable
            </span>
          )}
          <Link
            href={`/products/${product.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground hover:bg-muted"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}