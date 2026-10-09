import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { createCategoryAction, deleteCategoryAction } from "./actions";

type SearchParams = Promise<{ notice?: string }>;

const NOTICE_MESSAGES: Record<string, { text: string; error?: boolean }> = {
  "category-created": { text: "Category created." },
  "category-deleted": { text: "Category deleted. Its products are now uncategorized." },
  "invalid-name": { text: "Enter a category name with at least 2 characters.", error: true },
  "duplicate-name": { text: "A category with that name already exists.", error: true },
};

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { notice } = await searchParams;
  const noticeInfo = notice ? NOTICE_MESSAGES[notice] : undefined;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Categories ({categories.length})
        </h2>
        <p className="text-sm text-muted">
          Categories farmers can assign their products to when listing them.
        </p>
      </div>

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

      <form
        action={createCategoryAction}
        className="flex max-w-md items-end gap-2 rounded-lg border border-cream-dark bg-white p-4"
      >
        <div className="flex-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground"
          >
            New category name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Herbs"
            className="mt-1 w-full rounded-md border border-cream-dark bg-cream/40 py-2 px-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-cream-dark">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3 font-medium text-foreground">
                  {category.name}
                </td>
                <td className="px-4 py-3 text-muted">{category.slug}</td>
                <td className="px-4 py-3">{category._count.products}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteCategoryAction.bind(null, category.id)}>
                    <button
                      type="submit"
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
