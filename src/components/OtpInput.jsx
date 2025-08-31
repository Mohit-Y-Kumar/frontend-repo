import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

const OtpInput = ({ value, onChange, length = 6, placeholder = "Enter OTP" }) => {
  const [showOtp, setShowOtp] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showOtp ? "text" : "password"}
        value={value || ""}
        onChange={onChange}
        maxLength={length}
        placeholder={placeholder}
        className="w-full    focus:outline-none "
      />

      <button
        type="button"
        onClick={() => setShowOtp(!showOtp)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default OtpInput;
