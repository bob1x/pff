
import type { JobQueryParams } from "@/hooks/jobs/useJobHook";

type TextFieldKey =
  | "search"
  | "category"
  | "location"
  | "experience_level"
  | "contract_type"; // text-ish but you might render as <select>

interface FilterSectionProps {
  filters: JobQueryParams;
  onFilterChange: (
    field: keyof JobQueryParams,
    value: string | boolean
  ) => void;
  onReset: () => void;
}

export function FilterSection({
  filters,
  onFilterChange,
  onReset,
}: FilterSectionProps) {
  const fields: Array<{
    id: TextFieldKey;
    label: string;
    placeholder: string;
  }> = [
    { id: "search", label: "Search Title", placeholder: "Developer…" },
    { id: "category", label: "Category", placeholder: "Engineering…" },
    { id: "location", label: "Location", placeholder: "Lyon, Remote…" },
    {
      id: "experience_level",
      label: "Experience Level",
      placeholder: "Junior, Senior…",
    },
    { id: "contract_type", label: "Contract Type", placeholder: "FT, PT, IN…" },
  ];

  return (
    <div className="bg-white p-6 shadow rounded-lg mb-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Filter Jobs</h2>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear Filters
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {fields.map(({ id, label, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium mb-1">
              {label}
            </label>
            <input
              id={id}
              type="text"
              value={String(filters[id] ?? "")}
              placeholder={placeholder}
              onChange={(e) => onFilterChange(id, e.target.value)}
              className="w-full border px-3 py-2 rounded border-gray-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
