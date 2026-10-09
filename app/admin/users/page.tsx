import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { changeUserRoleAction, deleteUserAction } from "./actions";

type SearchParams = Promise<{ notice?: string }>;

const NOTICE_MESSAGES: Record<string, { text: string; error?: boolean }> = {
  "role-updated": { text: "Role updated." },
  "user-deleted": { text: "User deleted." },
  "self-role-error": { text: "You can't change your own role.", error: true },
  "self-delete-error": { text: "You can't delete your own account.", error: true },
  "invalid-role": { text: "That's not a valid role.", error: true },
  "delete-blocked": {
    text: "Can't delete this user - they have products with order history. Demote or remove their products first.",
    error: true,
  },
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { notice } = await searchParams;
  const noticeInfo = notice ? NOTICE_MESSAGES[notice] : undefined;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { products: true, ordersPlaced: true } },
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        All users ({users.length})
      </h2>

      {noticeInfo && (
        <p
          className={`rounded-md px-4 py-3 text-sm font-medium ${
            noticeInfo.error
              ? "bg-red-50 text-red-700"
              : "bg-accent/15 text-primary-dark"
          }`}
        >
          {noticeInfo.text}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-cream-dark">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium text-foreground">
                  {user.name}
                  {user.companyName && (
                    <span className="block text-xs text-muted">
                      {user.companyName}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    tone={user.role === "ADMIN" ? "accent" : "muted"}
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">{user._count.products}</td>
                <td className="px-4 py-3">{user._count.ordersPlaced}</td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">
                  {user.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <form
                      action={changeUserRoleAction.bind(null, user.id)}
                      className="flex items-center gap-1.5"
                    >
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="rounded-md border border-cream-dark bg-white py-1 px-2 text-xs focus:border-primary focus:outline-none"
                      >
                        <option value="FARMER">FARMER</option>
                        <option value="BUYER">BUYER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button
                        type="submit"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Save
                      </button>
                    </form>
                    <form action={deleteUserAction.bind(null, user.id)}>
                      <button
                        type="submit"
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
