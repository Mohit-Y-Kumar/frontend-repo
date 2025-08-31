import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Calendar, LucideBatteryFull, SignalIcon, WifiIcon } from 'lucide-react';
import { AuthContext } from '../App';
import OtpInput from "../components/OtpInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Clock from '../components/Clock';

export default function Signup() {
  const { register, setValue,
    setError,
    handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (otpSent && !data.otp) {
        setError("otp", { type: "manual", message: "OTP is required" });
        setLoading(false);
        return;
      }

      if (!otpSent) {
        // Request OTP
        await API.post('/auth/request-otp', { email: data.email });
        localStorage.setItem('pendingEmail', data.email);
        setOtpSent(true);
      } else {
        // Verify OTP
        const pendingEmail = localStorage.getItem('pendingEmail');
        const res = await API.post('/auth/verify-otp', {
          email: pendingEmail,
          otp: data.otp,
          name: data.name,
          dob: data.dob // send dob to backend
        });

        if (!res.data.token) {
          alert('Token not received from backend');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setIsLoggedIn(true);
        navigate('/dashboard');
      }
    } catch (err) {
      if (otpSent) {
        setError("otp", {
          type: "manual",
          message: err.response?.data?.error || "Invalid or expired OTP",
        });
      } else {
        alert(err.response?.data?.error || "Error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 flex-col items-center justify-start md:justify-center min-h-screen px-4 py-6 md:px-0 md:py-0">
        <div className="w-full max-w-md md:max-w-sm lg:max-w-md xl:max-w-lg bg-white">

          {/* Mobile Header */}
          <div className="w-full h-[44px] flex justify-between items-center px-4 bg-white fixed top-0 left-0 z-50 md:static md:bg-transparent md:hidden">
            <span className="text-[14px] px-3 font-medium text-gray-900">  <Clock /></span>
            <div className="flex items-center space-x-2">
              <SignalIcon className="w-5 h-5" />
              <WifiIcon className="w-5 h-5" />
              <LucideBatteryFull className="w-6 h-6" />
            </div>
          </div>

          {/* Logo */}
          <div className="mb-8">
            <div className="md:hidden flex items-center justify-center mt-8 mb-8 w-full">
              <img src="/top.jpg" alt="Logo" className="h-12 object-contain" />
              <span className="text-3xl font-bold text-black">HD</span>
            </div>
            <div className="hidden md:flex items-center absolute top-4 left-4">
              <img src="/top.jpg" alt="Logo" className="h-12 object-contain" />
              <span className="text-3xl font-bold text-black">HD</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center md:mt-32 md:text-left">Sign up</h2>
          <p className="text-gray-500 text-center text-sm mt-1 md:text-left">
            Sign Up and enjoy the feature of HD
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">

            {/* Name */}
            <fieldset className="border border-gray-300 rounded-lg p-2">
              <legend className="text-sm font-medium text-gray-700">Name</legend>
              <input
                {...register('name', { required: true })}
                className="w-full focus:outline-none"
                placeholder="Enter your name"
              />
            </fieldset>
            {errors.name && <small className="text-red-500 text-sm">Name is required</small>}

            {/* Date of Birth */}
            <fieldset className="border border-gray-300 rounded-lg p-2">
              <legend className="block text-sm font-medium text-gray-700">Date of Birth</legend>
              <div className="relative ml-0">
                <Calendar className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer" size={20} />
                <DatePicker
                  selected={watch("dob") ? new Date(watch("dob")) : null}
                  onChange={(date) => setValue("dob", date)}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="11 January 1997"
                  className="ml-8 focus:outline-none w-full"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
            </fieldset>
            {errors.dob && <small className="text-red-500 text-sm">DOB is required</small>}

            {/* Email */}
            <fieldset className="border border-gray-300 rounded-lg p-2">
              <legend className="block text-sm font-medium text-gray-700">Email</legend>
              <input
                {...register('email', {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address"
                  }
                })}
                className="focus:outline-none"
                placeholder="Enter your email"
                disabled={otpSent}
              />
            </fieldset>
            {errors.email && <small className="text-red-500 text-sm">Valid email required</small>}

            {/* OTP */}
            {otpSent && (
              <fieldset className="border border-gray-300 rounded-lg p-2">
                <OtpInput
                  value={watch("otp")}
                  onChange={(e) => setValue("otp", e.target.value, { shouldValidate: true })}
                  length={6}
                  placeholder="Enter OTP"
                />
                {errors.otp && <small className="text-red-500 text-sm">{errors.otp.message}</small>}
              </fieldset>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg
   hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? "Processing..." : otpSent ? "Sign Up" : "Get OTP"}
            </button>
          </form>

          {/* OR separator */}
          <div className="flex items-center gap-2 my-6">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 py-3 border rounded-lg hover:bg-gray-50 transition"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-gray-700 font-medium">Sign up with Google</span>
          </button>

          <p className="pb-8 text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-cover bg-center" style={{ backgroundImage: "url('/container.png')" }}></div>
    </div>
  );
}
