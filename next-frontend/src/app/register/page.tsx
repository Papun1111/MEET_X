"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthForm from "../../../components/forms/AuthForm";
import { apiRegister,apiLogin } from "../../../lib/api";
import { setToken, setUsername, setName,isAuthenticated } from "../../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center py-12">
      <AuthForm
        mode="register"
        onSubmit={async ({ name, username, password }) => {
          await apiRegister(name!, username, password);
          const { token } = await apiLogin(username, password);
          setToken(token);
          setUsername(username);
          setName(name!);
          router.push("/dashboard");
        }}
      />
    </main>
  );
}
