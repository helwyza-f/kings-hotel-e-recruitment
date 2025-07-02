"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Filter {
  value: string;
  label: string;
  checked?: boolean;
}

interface CheckBoxContainerProps {
  data: Filter[];
  onChange: (dataValue: string[]) => void;
}

export default function CheckBoxContainer({
  data,
  onChange,
}: CheckBoxContainerProps) {
  const [filters, setFilters] = useState<Filter[]>(data);
  useEffect(() => {
    setFilters(data);
  }, [data]);

  const handleCheckChange = (filter: Filter) => {
    const updatedFilter = filters.map((f) => {
      if (f.value === filter.value) {
        return { ...f, checked: !f.checked };
      }
      return f;
    });
    setFilters(updatedFilter);
    onChange(updatedFilter.filter((f) => f.checked).map((f) => f.value));
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-2 flex-1">
      {filters.map((filter) => (
        <div
          key={filter.value}
          className={cn(
            "flex items-center gap-2 w-full text-md",
            filter.checked ? "text-purple-500" : "text-muted-foreground"
          )}
        >
          <Checkbox
            checked={filter.checked}
            onCheckedChange={() => {
              handleCheckChange(filter);
            }}
          />
          {filter.label}
        </div>
      ))}
    </div>
  );
}
