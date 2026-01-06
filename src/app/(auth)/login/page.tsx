import { Suspense } from "react";
import LoginPresets from "@/components/LoginPresets";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      }
    >
      <LoginPresets />
    </Suspense>
  );
}
