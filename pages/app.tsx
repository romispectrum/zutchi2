import { useEffect } from "react";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";

export default function AppPage() {
  const { ready, authenticated, logout, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/"); // kick back to landing if logged out
    }
  }, [ready, authenticated, router]);

  if (!ready) return <p className="p-6">Loading...</p>;
  if (!authenticated) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-6 text-2xl font-bold">Welcome to Zutchi</h1>
        <p className="mb-4">User ID: {user?.id}</p>
        <button
          onClick={() => {
            logout();
            router.replace("/"); // send back to landing
          }}
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
