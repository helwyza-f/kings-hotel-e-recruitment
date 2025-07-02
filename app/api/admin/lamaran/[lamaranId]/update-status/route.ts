import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ lamaranId: string }> }
) {
  const { lamaranId } = await params;
  const supabase = await createClient();
  const body = await req.json();

  const { error } = await supabase
    .from("lamaran")
    .update({ status: body.status })
    .eq("id", lamaranId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
