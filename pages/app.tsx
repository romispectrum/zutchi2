"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function App() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Privy Auth Demo</h1>

      {authenticated ? (
        <>
          <p className="mb-4">Welcome, {user?.id}</p>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={login}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Login
        </button>
      )}
    </main>
  );
}
