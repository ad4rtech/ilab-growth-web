// src/components/admin/product-stat-cards.tsx
import { Package, DollarSign, ShoppingCart, Download, TrendingUp, TrendingDown } from "lucide-react";
import { formatKES } from "@/lib/format";
import type { ProductStats } from "@/lib/products-admin";

interface ProductStatCardsProps {
  stats: ProductStats;
}

function ChangeIndicator({ percent }: { percent: number | null }) {
  if (percent === null) {
    return <span className="text-muted-foreground">No prior month data yet</span>;
  }
  const positive = percent >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span className={positive ? "text-green-600" : "text-red-600"}>
      <Icon className="mr-1 inline h-3.5 w-3.5" />
      {positive ? "+" : ""}
      {percent}%{" "}
      <span className="text-muted-foreground">vs last month</span>
    </span>
  );
}

export function ProductStatCards({ stats }: ProductStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Package className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{stats.totalProducts}</p>
        <p className="mt-2 text-sm">
          <span className="text-orange-600">
            <TrendingUp className="mr-1 inline h-3.5 w-3.5" />+
            {stats.productsCreatedThisMonth}
          </span>{" "}
          <span className="text-muted-foreground">this month</span>
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Product Revenue</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <DollarSign className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{formatKES(stats.productRevenue)}</p>
        <p className="mt-2 text-sm">
          <ChangeIndicator percent={stats.salesChangePercent} />
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ShoppingCart className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{stats.totalSales.toLocaleString()}</p>
        <p className="mt-2 text-sm">
          <ChangeIndicator percent={stats.salesChangePercent} />
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Downloads Today</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Download className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold text-muted-foreground">—</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Not tracked yet — no download log exists.
        </p>
      </div>
    </div>
  );
}