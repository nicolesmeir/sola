import { AuthCard } from "@/components/auth/AuthCard";
import { signUp } from "../actions";

export const metadata = { title: "Sign up — SOLA" };

export default function SignupPage() {
  return <AuthCard mode="signup" action={signUp} />;
}
