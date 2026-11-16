"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { User, Lock, ArrowRight, Loader2, ShoppingBag, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Welcome back!");
      router.push("/protected");
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#e8f0fe] p-4 font-sans">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md z-10">
        
        {/* Logo Area */}
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 bg-[#f0f4f8] rounded-[2rem] shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <ShoppingBag className="w-14 h-14 text-indigo-600 drop-shadow-md" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-sm tracking-[0.2em] font-medium text-slate-500 uppercase">Sign in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-[#f0f4f8] rounded-2xl border border-white/50 text-slate-900 outline-none shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:shadow-[inset_1px_1px_3px_#d1d9e6,inset_-1px_-1px_3px_#ffffff] focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              placeholder="Username or Email"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-[#f0f4f8] rounded-2xl border border-white/50 text-slate-900 outline-none shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:shadow-[inset_1px_1px_3px_#d1d9e6,inset_-1px_-1px_3px_#ffffff] focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-slate-400 hover:text-indigo-500" /> : <Eye className="h-5 w-5 text-slate-400 hover:text-indigo-500" />}
            </button>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between px-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-[#f0f4f8] shadow-inner" />
              <span className="text-sm font-medium text-slate-600">Remember Me</span>
            </label>
            <Link href="/auth/forgot-password" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative flex items-center justify-center py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-[0_10px_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_15px_25px_-5px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span className="relative z-10">Login</span>
                <div className="absolute right-4 bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="font-bold text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>

        {/* Decorative Text */}
        <div className="mt-12 text-center">
          <p className="text-xs tracking-widest text-slate-400 font-semibold uppercase">
            Buy • Sell • Connect Together
          </p>
        </div>

      </div>
    </div>
  );
}