"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Alert from "@/components/popupAlert";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successRegis, setSuccessRegis] = useState(false);
  const { push } = useRouter();

  const handleRegis = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const form = e.currentTarget;
    const fullname = (form.fullname as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    const confirmPassword = (form["confirm-password"] as HTMLInputElement)
      .value;

    if (password !== confirmPassword) {
      setError("konfirmasi password tidak cocok");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, email, password }),
      });

      if (res.ok) {
        form.reset();
        setIsLoading(false);
        setSuccessRegis(true);
        push("/login");
      } else {
        setError("Email already taken");
        setIsLoading(false);
      }
    } catch {
      setError("Gagal terhubung ke server");
    }
  };
  return (
    <section className="bg-white min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center justify-center w-full sm:max-w-md">
        {error && <Alert id="alert-2" type="red" message={<>{error}.</>} />}

        {successRegis && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl w-full py-3 text-center mb-6 font-medium animate-in fade-in zoom-in duration-300">
            Berhasil Registrasi! Mengalihkan...
          </div>
        )}

        <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Create an account
            </h1>

            <form className="space-y-5" onSubmit={handleRegis}>
              <div>
                <label
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-medium text-slate-700"
                >
                  Your Fullname
                </label>
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-3 outline-none transition"
                  placeholder="write your name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-slate-700"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-3 outline-none transition"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-3 outline-none transition"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-slate-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-3 outline-none transition"
                  required
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-blue-300 cursor-pointer"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-slate-500">
                    I accept the{" "}
                    <Link
                      href="#"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg text-sm px-5 py-3 transition-all active:scale-95 shadow-md shadow-blue-100 disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Create an account"}
              </button>

              <p className="text-sm text-center text-slate-500 pt-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
