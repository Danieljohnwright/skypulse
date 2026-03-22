"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import Input from "../Components/Input";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          localStorage.setItem("token", loginData.token);
          router.push("/Dashboard");
        } else {
          setSuccess("Account created! Please log in.");
          router.push("/Login");
        }
      }
    } catch (_err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <Navbar loggedIn={false} />
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Register</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={setName}
              className="text-gray-600 border-blue-300"
              id="name-input"
            />
            <Input
              className="text-gray-600 border-blue-300"
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />
            <Input
              className="text-gray-600 border-blue-300"
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
