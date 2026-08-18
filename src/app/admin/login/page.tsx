import { Suspense } from "react";
import AdminLoginPage from "./LoginClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
          Loading…
        </div>
      }
    >
      <AdminLoginPage />
    </Suspense>
  );
}
