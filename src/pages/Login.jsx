import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import OtpInput from "../components/OtpInput";
import { LucideBatteryFull, SignalIcon, WifiIcon } from "lucide-react";
import { AuthContext } from "../App";
import Clock from "../components/Clock";

export default function Login() {
  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { remember: false }
  });

  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useContext(AuthContext);

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (!otpSent) {
        await API.post("/auth/request-otp", { email: data.email });
        localStorage.setItem("pendingEmail", data.email);
        setOtpSent(true);
      } else {
        const pendingEmail = localStorage.getItem("pendingEmail");
        const res = await API.post("/auth/verify-otp", {
          email: pendingEmail,
          otp: data.otp,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setUser(res.data.user);
        setIsLoggedIn(true);

        if (data.remember) {
          localStorage.setItem("remember", "true");
        }

        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const pendingEmail = localStorage.getItem("pendingEmail");
      if (pendingEmail) {
        await API.post("/auth/request-otp", { email: pendingEmail });
        alert("OTP resent successfully!");
      }
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 px-4 py-18 md:items-center md:justify-center">
        <div className="w-full max-w-md">
          <div className="w-full h-[44px] flex justify-between items-center px-4 bg-white fixed top-0 left-0 z-50 md:static md:bg-transparent md:hidden">
            <span className="px-4 font-medium text-gray-900">  <Clock /></span>
          
            <div className="flex items-center space-x-2">
              <SignalIcon className="w-5 h-5" />
              <WifiIcon className="w-5 h-5" />
              <LucideBatteryFull className="w-6 h-6" />
            </div>
          </div>

          <div className="mb-8">
            <div className="md:hidden flex items-center justify-center w-full">
              <img src="/top.jpg" alt="Logo" className="h-12 object-contain" />
              <span className="text-3xl font-bold text-black">HD</span>
            </div>
            <div className="hidden md:flex items-center absolute top-4 left-4">
              <img src="/top.jpg" alt="Logo" className="h-12 object-contain" />
              <span className="text-3xl font-bold text-black">HD</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center md:mt-32 md:text-left">Sign in</h2>
          <p className="text-gray-500 text-center text-sm mt-1 md:text-left">
            Please login to continue to your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <fieldset className="border border-gray-300 rounded-lg p-2">
              <legend className="block text-sm font-medium text-gray-700">Email</legend>
              <input
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                disabled={otpSent}
                className="w-full focus:outline-none"
              />
            </fieldset>
            {errors.email && <small className="text-red-500 text-sm">{errors.email.message}</small>}

            {otpSent && (
              <div>
                <fieldset className="border border-gray-300 rounded-lg p-2">
                  <OtpInput
                    value={watch("otp")}
                    onChange={(e) => setValue("otp", e.target.value, { shouldValidate: true })}
                    length={6}
                    placeholder="Enter OTP"
                  />
                  {errors.otp && <small className="text-red-500 text-sm">{errors.otp.message}</small>}
                </fieldset>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="mt-2 text-sm text-blue-600 underline"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {otpSent && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("remember")}
                  id="remember"
                  className="h-4 w-4 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Keep me logged in
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? "Processing..." : otpSent ? "Sign in" : "Get OTP"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Need an account?{" "}
            <a href="/signup" className="text-blue-600 underline font-medium">
              Create one
            </a>
          </p>
        </div>
      </div>

      <div
        className="hidden md:flex flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/container.png')" }}
      ></div>
    </div>
  );
}
