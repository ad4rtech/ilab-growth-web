// src/components/admin/top-products-panel.tsx
import { formatKES } from "@/lib/format";
import type { TopProduct } from "@/lib/products-admin";

interface TopProductsPanelProps {
  products: TopProduct[];
}

export function TopProductsPanel({ products }: TopProductsPanelProps) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-ubuntu)" }}>
        Top Products by Revenue
      </h3>

      {products.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No completed sales yet — this fills in once orders start coming through.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {products.map((tp, i) => (
            <li key={tp.product.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-200">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{tp.product.title}</p>
                  <p className="text-xs text-muted-foreground">{tp.sales} sales</p>
                </div>
              </div>
              <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
                {formatKES(tp.revenue)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}