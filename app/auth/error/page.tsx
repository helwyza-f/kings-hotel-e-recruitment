import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/bg.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={80}
        />
        <div className="absolute inset-0 bg-black/60" /> {/* overlay */}
      </div>
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  Code error: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  An unspecified error occurred.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
