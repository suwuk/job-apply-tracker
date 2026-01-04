"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Alert from "@/components/popupAlert";
import { useLoginModal } from "@/store/useLoginModal";

export default function LoginPresets() {
  const { push, refresh } = useRouter();
  const { onClose } = useLoginModal();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // useSearchParams harus berada di dalam komponen yang dibungkus Suspense
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const formElement = e.currentTarget;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (!res?.error) {
        formElement.reset();
        setIsLoading(false);
        onClose(); 
        push(res?.url || callbackUrl);
        refresh(); 
      } else {
        setIsLoading(false);
        if (res.status === 401) {
          setError("Email or Password is Incorrect");
        }
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <Alert id="alert-2" type="red" message={error} />}
      <div className="flex min-h-[50vh] items-center justify-center bg-transparent px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 space-y-6 sm:p-8">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Sign in to your account
            </h1>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-700">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 outline-none transition"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-end">
                <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg text-sm px-5 py-3 transition-all active:scale-95 shadow-md shadow-blue-100"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-slate-100"></div>
                <span className="shrink mx-4 text-slate-400 text-xs uppercase font-medium">Or</span>
                <div className="grow border-t border-slate-100"></div>
              </div>

              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl, redirect: false })}
                className="w-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center gap-2 transition"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="google logo"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                <span>Sign in with Google</span>
              </button>

              <p className="text-sm text-center text-slate-500">
                Don’t have an account yet?{" "}
                <Link href="/register" className="font-semibold text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}