import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await api.post("/auth/forgot-password", { email });

      setMessage("OTP sent to your email.");

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);

    } catch (err) {
      setError("Email not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-[400px]">

        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;
