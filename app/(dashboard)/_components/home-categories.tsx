"use client";

import Box from "@/components/box";
import { Card } from "@/components/ui/card";
import { iconMapping, IconName } from "@/lib/utils";
import { Category } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import qs from "query-string";
import { useRouter } from "next/navigation";

interface HomeCategoriesProps {
  categories: Category[];
}

export const Icon = ({ name }: { name: IconName }) => {
  const IconComponent = iconMapping[name];
  return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
};

export const CategoryItemCard = ({ category }: { category: Category }) => {
  const router = useRouter();
  const handleClick = (categoryId: string) => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: {
        categoryId: categoryId || undefined,
      },
    });
    router.push(href);
  };
  return (
    <Card
      className="flex cursor-pointer items-center gap-2 p-2 text-muted-foreground hover:border-purple-500 hover:text-purple-500 hover:shadow-md"
      onClick={() => handleClick(category.id)}
    >
      <Icon name={category.name as IconName} />
      <span className="w-28 truncate whitespace-nowrap">{category.name}</span>
      <ChevronRight className="h-4 w-4" />
    </Card>
  );
};

export default function HomeCategories({ categories }: HomeCategoriesProps) {
  return (
    <Box className="mt-12 flex flex-col">
      <div className="flex w-full flex-wrap items-center justify-center gap-4">
        {categories.map((item) => (
          <CategoryItemCard category={item} key={item.id} />
        ))}
      </div>
    </Box>
  );
}
