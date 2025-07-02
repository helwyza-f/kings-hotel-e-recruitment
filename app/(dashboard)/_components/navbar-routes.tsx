"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function NavbarRoutes() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [emailPendingConfirmation, setEmailPendingConfirmation] =
    useState(false); // Track email confirmation status
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setLoading(false);
        return;
      }

      if (user) {
        setUser(user);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user role:", profileError.message);
        } else {
          setRole(profileData?.role);
        }

        // Check if the email is pending confirmation
        setEmailPendingConfirmation(user.email_confirmed_at === null); // Assuming email_confirmed_at is null if email is not confirmed yet
      }

      setLoading(false);
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "USER_UPDATED" && session?.user) {
          console.log("User profile updated:", session);
          setUser(session.user);
          setEmailPendingConfirmation(session.user.email_confirmed_at === null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ml-auto flex gap-x-4 items-center text-foreground">
      {user ? (
        <div className="flex items-center gap-4 text-foreground">
          <span>
            Hey, {user.email}{" "}
            {emailPendingConfirmation && "(Pending Confirmation)"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut(); // Sign out the user
              setUser(null); // Clear the user state after logout
              toast.success("Logged out successfully");
              router.push("/"); // Redirect to login page
            }}
          >
            <LogOut />
            Logout
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant={"default"}>
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </div>
      )}
      <ThemeSwitcher />
    </div>
  );
}
