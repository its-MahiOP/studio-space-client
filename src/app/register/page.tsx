import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a StudioSpace account to book creative space or list your own studio.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
