"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { User, Lock, ArrowRight, Loader2, ShoppingBag, Mail, School, Phone } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [institution, setInstitution] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        router.push("/auth/login");
      } else {
        await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            student_id: studentId,
            institution: institution,
            whatsapp_number: whatsapp,
            role: 'buyer', 
          })
          .eq("id", authData.user.id);

        toast.success("Account created successfully!");
        router.push("/protected");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#e8f0fe] p-4 py-12 font-sans">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md z-10">
        
        {/* Logo Area */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#f0f4f8] rounded-3xl shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <ShoppingBag className="w-10 h-10 text-indigo-600 drop-shadow-md" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create Account</h1>
          <p className="text-sm tracking-[0.2em] font-medium text-slate-500 uppercase">Join the marketplace</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          
          {/* Full Name */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-14 pr-5 py-3.5 bg-[#f0f4f8] rounded-2xl border border-white/50 text-slate-900 outline-none shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              placeholder="Full Name"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-14 pr-5 py-3.5 bg-[#f0f4f8] rounded-2xl border border-white/50 text-slate-900 outline-none shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              placeholder="Student Email"
            />
          </div>

          {/* Student ID */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <School className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full pl-14 pr-5 py-3.5 bg-[#f0f4f8] rounded-2xl border border-white/50 text-slate-900 outline-none shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              placeholder="Student ID"
            />
          </div>

          {/* Institution */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
              <School className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <select
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full pl-14 pr-5 py-3.5 bg-[#f0f4f8] rounded-2xl border border-white/50 text-slate-900 outline-none shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
            >
              <option value="">Select Institution</option>
              <option value="University of Ghana">University of Ghana</option>
              <option value="KNUST">KNUST</option>
              <option value="UCC">UCC</option>
              <option value="UMaT">UMaT</option>
              <option value="UEW">UEW</option>
              <option value="GIMPA">GIMPA</option>
              <option value="UPSA">UPSA</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* WhatsApp */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full pl-14 pr-5 py-3.5 bg-[#f0f4f8] rounded-2xl border border-white/50 text-slate-900 outline-none shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              placeholder="WhatsApp Number"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-5 py-3.5 bg-[#f0f4f8] rounded-2xl border border-white/50 text-slate-900 outline-none shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              placeholder="Password"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative flex items-center justify-center py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-[0_10px_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_15px_25px_-5px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group mt-6"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span className="relative z-10">Sign Up</span>
                <div className="absolute right-4 bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}