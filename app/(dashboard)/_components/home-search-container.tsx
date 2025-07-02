"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import qs from "query-string";
import Box from "@/components/box";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
export default function HomeSearchContainer() {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const handleClick = () => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: {
        title: title || undefined,
      },
    });
    router.push(href);
  };
  return (
    <div className="mt-4 hidden w-full items-center justify-center px-4 md:flex">
      <Box className="h-16 w-3/4 gap-3 rounded-full bg-neutral-50 p-4 px-12 text-muted-foreground shadow-lg">
        <Input
          placeholder="Search by Job Name..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-w-72 flex-1 border-none bg-transparent font-sans text-lg outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        />
        <Button
          onClick={handleClick}
          disabled={!title}
          className="bg-purple-600 hover:bg-purple-700"
          size={"icon"}
        >
          <SearchIcon className="h-5 w-5 min-w-5" />
        </Button>
      </Box>
    </div>
  );
}
