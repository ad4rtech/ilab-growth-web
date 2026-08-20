import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProductsTable } from "@/components/products-table";
import {
  getAdminProductList,
  getProductStats,
  getTopProductsByRevenue,
  getMonthlySales,
} from "@/lib/products-admin";
import { ProductStatCards } from "@/components/admin/product-stat-cards";
import { MonthlySalesChart } from "@/components/admin/monthly-sales-chart";
import { TopProductsPanel } from "@/components/admin/top-products-panel";
import { ProductsToolbar } from "@/components/admin/products-toolbar";
import { ProductsPagination } from "@/components/admin/products-pagination";

export const dynamic = "force-dynamic";

interface AdminProductsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const status = params.status;
  const category = params.category;
  const search = params.search;

  const [listResponse, stats, topProducts, monthlySales] = await Promise.all([
    getAdminProductList({ page, status, category, search }),
    getProductStats(),
    getTopProductsByRevenue(3),
    getMonthlySales(12),
  ]);

  const urlSearchParams = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => !!entry[1]),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Products
        </h1>
        <p className="text-sm text-muted-foreground">Manage your digital product catalogue.</p>
      </div>

      <ProductStatCards stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <MonthlySalesChart data={monthlySales} />
        <TopProductsPanel products={topProducts} />
      </div>

      <ProductsToolbar />

      <Card>
        <CardHeader>
          <p className="font-semibold">
            {listResponse.total} product{listResponse.total === 1 ? "" : "s"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductsTable
            key={`${page}-${status ?? ""}-${category ?? ""}-${search ?? ""}`}
            initialProducts={listResponse.products}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {listResponse.products.length} of {listResponse.total} products
            </p>
            <ProductsPagination
              currentPage={listResponse.page}
              totalPages={listResponse.totalPages}
              searchParams={urlSearchParams}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}