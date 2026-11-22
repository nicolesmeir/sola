import { AuthCard } from "@/components/auth/AuthCard";
import { logIn } from "../actions";

export const metadata = { title: "Log in — SOLA" };

export default function LoginPage() {
  return <AuthCard mode="login" action={logIn} />;
}
