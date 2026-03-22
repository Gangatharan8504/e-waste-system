import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    if (!/^[0-9]?$/.test(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next box automatically
    if (element.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace -> move to previous box
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setError("Please enter complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/verify-otp", {
        email,
        otp: finalOtp,
      });

      navigate("/login");

    } catch (err) {
      setError("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          Verify OTP
        </h2>

        <p className="text-center text-sm text-gray-600 mb-4">
          Code sent to <span className="font-medium">{email}</span>
        </p>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <button
          onClick={handleVerify}
          className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;
