"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Processing...");
    try {
      const res = await fetch('/api/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      
      setMessage("Registration successful! Proceeding to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-container">
        <h1 className="auth-title">Create Account</h1>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Your Full Name"
              value={name} onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {message && (
          <div className="text-center mt-4" style={{ fontSize: '0.9rem', color: message.includes('success') ? '#4ade80' : '#f87171' }}>
            {message}
          </div>
        )}
        <div className="auth-footer">
          <p>Already have an account? <Link href="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}
