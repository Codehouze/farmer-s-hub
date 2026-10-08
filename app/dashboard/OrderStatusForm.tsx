import { updateOrderStatusAction } from "./actions";
import type { OrderStatus } from "@/app/generated/prisma/client";

// Which statuses a farmer may move an order to, from its current status.
const STATUS_OPTIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PENDING", "CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CONFIRMED", "COMPLETED", "CANCELLED"],
  COMPLETED: ["COMPLETED"],
  CANCELLED: ["CANCELLED"],
};

// Plain server-rendered form (no "use client") — the native <form> posts to
// the bound Server Action directly, so this works without any client JS.
export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const options = STATUS_OPTIONS[currentStatus] ?? [currentStatus];
  const locked = options.length <= 1;

  return (
    <form action={updateOrderStatusAction.bind(null, orderId)} className="flex items-center gap-2">
      <select
        name="status"
        defaultValue={currentStatus}
        disabled={locked}
        className="rounded-md border border-cream-dark bg-white px-2 py-1 text-sm disabled:opacity-50"
      >
        {options.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={locked}
        className="text-sm font-semibold text-primary hover:underline disabled:pointer-events-none disabled:opacity-50"
      >
        Update
      </button>
    </form>
  );
}
