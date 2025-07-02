import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { first_name, last_name, email } = await req.json();

  const supabaseClient = await createClient();

  const { data: sessionData, error: sessionError } =
    await supabaseClient.auth.getSession();

  if (sessionError || !sessionData.session) {
    return NextResponse.json(
      { error: "Unauthorized or session error" },
      { status: 401 }
    );
  }

  const userId = sessionData.session.user.id;

  try {
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .update({ first_name, last_name })
      .eq("id", userId);

    if (profileError) {
      throw profileError;
    }

    const { error: emailError } = await supabaseClient.auth.updateUser({
      email: email,
      data: {
        first_name,
        last_name,
      },
    });

    if (emailError) {
      throw emailError;
    }

    return NextResponse.json(
      { message: "Profile updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
