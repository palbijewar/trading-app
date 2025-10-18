import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle, Globe, LineChart, Clock } from "lucide-react";
import axios from "axios";

const API_BASE = "https://bearbull-backend.onrender.com";

export default function BearBullsLanding() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true); // 👈 mode toggle

  // 🧩 Handle Login
 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    setMessage("✅ Login successful!");
    console.log("JWT Token:", res.data.accessToken);

    // ✅ Redirect to MarketWatch after successful login
    setTimeout(() => {
      window.location.href = "/?#/MarketWatch";
    }, 800); // small delay for user feedback
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    setMessage("❌ Login failed. Check your credentials.");
  }
};

  // 🧩 Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(`${API_BASE}/users/signup`, { name, email, password });
      setMessage("🎉 Signup successful! You can now log in.");
      setIsLogin(true);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setMessage("❌ Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col-reverse lg:flex-row items-center justify-center px-6 py-10 gap-6 lg:gap-10">
      {/* Left Section */}
      <div className="flex-1 space-y-8 max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold"
        >
          Trade <span className="text-sky-500">500x</span> Margins <br /> With{" "}
          <span className="text-white">BearBulls</span>
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: <CheckCircle className="w-10 h-10 text-green-400" />, title: "Lowest Brokerage" },
            { icon: <Clock className="w-10 h-10 text-yellow-400" />, title: "24/7 Deposit & Withdrawal" },
            { icon: <LineChart className="w-10 h-10 text-blue-400" />, title: "Live Market Analysis" },
            { icon: <Globe className="w-10 h-10 text-teal-400" />, title: "Global Access" },
          ].map((item, i) => (
            <Card key={i} className="bg-[#161b22] border border-[#1f2937] hover:border-sky-600 transition">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                {item.icon}
                <h3 className="font-semibold text-lg">{item.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 max-w-md w-full bg-[#161b22] rounded-2xl p-8 shadow-lg border border-[#1f2937]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Login to" : "Register on"}{" "}
          <span className="text-sky-500">BearBulls</span>
        </h2>

        <form
          className="space-y-5"
          onSubmit={isLogin ? handleLogin : handleRegister}
        >
          {!isLogin && (
            <div>
              <label className="block mb-2 text-sm font-medium">Full Name</label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0d1117] border-[#30363d] focus:border-sky-500"
              />
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0d1117] border-[#30363d] focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0d1117] border-[#30363d] focus:border-sky-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-sky-400"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Dynamic Action Button */}
          <Button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 transition"
          >
            {isLogin ? "Login" : "Register"}
          </Button>

          {/* Switch Mode Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-sky-500 text-sky-400 hover:bg-sky-900/30 transition"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create new account" : "Back to Login"}
          </Button>

          {message && (
            <p className="text-center text-sm mt-4 text-gray-400">{message}</p>
          )}

          <div className="flex justify-between mt-6">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                window.location.hash = "/MarketWatch";
              }}
            >
              Instant Demo
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                window.location.href = "http://localhost:5173/?#/MarketWatch";
              }}
            >
              Install App
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
