"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import type { ProductFormState } from "./actions";

type Category = { id: string; name: string };

type ProductDefaults = {
  name?: string;
  description?: string;
  price?: number;
  unit?: string;
  quantityAvail?: number;
  location?: string;
  imageUrl?: string;
  categoryId?: string | null;
  available?: boolean;
};

const emptyState: ProductFormState = {};

export function ProductForm({
  action,
  categories,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: Category[];
  defaultValues?: ProductDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, emptyState);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <Field
        label="Product name"
        name="name"
        defaultValue={defaultValues?.name}
        error={fieldErrors.name}
        required
      />

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description}
          className="w-full rounded-md border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Price (RWF)"
          name="price"
          type="number"
          step="any"
          defaultValue={defaultValues?.price?.toString()}
          error={fieldErrors.price}
          required
        />
        <Field
          label="Unit"
          name="unit"
          placeholder="kg, crate, bag..."
          defaultValue={defaultValues?.unit ?? "kg"}
          error={fieldErrors.unit}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Quantity available"
          name="quantityAvail"
          type="number"
          step="any"
          defaultValue={defaultValues?.quantityAvail?.toString()}
          error={fieldErrors.quantityAvail}
          required
        />
        <Field
          label="Location"
          name="location"
          defaultValue={defaultValues?.location}
          error={fieldErrors.location}
          required
        />
      </div>

      <Field
        label="Image URL"
        name="imageUrl"
        defaultValue={defaultValues?.imageUrl}
        error={fieldErrors.imageUrl}
      />

      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-foreground">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={defaultValues?.categoryId ?? ""}
          className="w-full rounded-md border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="available"
          defaultChecked={defaultValues?.available ?? true}
          className="h-4 w-4 rounded border-cream-dark"
        />
        Available for sale
      </label>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  step,
  placeholder,
  defaultValue,
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-md border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-primary"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
