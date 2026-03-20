"use client";

import { useState } from "react";
import Navbar from "../Components/Navbar";
import Input from "../Components/Input";
import Button from "../Components/Button";
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // TODO: connect to backend
    alert("Register functionality coming soon");
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <Navbar loggedIn={false} />
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Register</h1>
        <div className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          <Input placeholder="Email" value={email} onChange={setEmail} />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />
        </div>
        <button onClick={handleRegister} className="mt-4 w-full">
          Register
        </button>
      </div>
    </div>
  );
}
