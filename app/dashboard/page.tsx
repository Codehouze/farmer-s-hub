import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FarmerDashboard } from "./FarmerDashboard";
import { BuyerDashboard } from "./BuyerDashboard";

type SearchParams = Promise<{ notice?: string; detail?: string }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const { notice, detail } = await searchParams;

  if (session.user.role === "FARMER") {
    const [products, orders] = await Promise.all([
      prisma.product.findMany({
        where: { farmerId: session.user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        where: { product: { farmerId: session.user.id } },
        include: { product: true, buyer: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return (
      <FarmerDashboard
        userName={session.user.name ?? "Farmer"}
        products={products}
        orders={orders}
        notice={notice}
        noticeDetail={detail}
      />
    );
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: { product: { include: { farmer: true } } },
    orderBy: { createdAt: "desc" },
  });

  return <BuyerDashboard userName={session.user.name ?? "Buyer"} orders={orders} />;
}
