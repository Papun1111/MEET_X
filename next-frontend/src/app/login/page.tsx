"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthForm from "../../../components/forms/AuthForm";
import { apiLogin } from "../../../lib/api";
import { setToken, setUsername, setName, isAuthenticated } from "../../../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center py-12">
      <AuthForm
        mode="login"
        onSubmit={async ({ username, password }) => {
          const { token } = await apiLogin(username, password);
          setToken(token);
          setUsername(username);
          router.push("/dashboard");
        }}
      />
    </main>
  );
}
