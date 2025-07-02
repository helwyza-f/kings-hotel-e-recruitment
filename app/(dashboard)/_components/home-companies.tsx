"use client";
import Box from "@/components/box";
import { Card } from "@/components/ui/card";
import { Company } from "@prisma/client";
import { useRouter } from "next/navigation";

interface HomeCompaniesProps {
  companies: Company[];
}

const CompanyItemCard = ({ company }: { company: Company }) => {
  const router = useRouter();

  return (
    <Card
      className="flex cursor-pointer items-center gap-2 p-3 text-muted-foreground hover:border-purple-500 hover:text-purple-500 hover:shadow-md"
      onClick={() => router.push(`/companies/${company.id}`)}
    >
      <h2 className="whitespace-nowrap font-serif font-semibold tracking-wider">
        {company.name}
      </h2>
    </Card>
  );
};

export default function HomeCompanies({ companies }: HomeCompaniesProps) {
  return (
    <Box className="my-12 flex flex-col">
      <h2 className="font-sans text-2xl font-bold tracking-wider text-neutral-600">
        Companies that now hiring
      </h2>
      <div className="mt-12 flex w-full flex-wrap items-center justify-center gap-4">
        {companies.map((item) => (
          <CompanyItemCard key={item.id} company={item} />
        ))}
      </div>
    </Box>
  );
}
