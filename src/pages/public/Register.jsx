import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordValid, setPasswordValid] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$]).{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPasswordValid(strongPasswordRegex.test(value));
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordValid) {
      setError("Password does not meet required strength.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobile: form.mobile,
        address: form.address,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      navigate("/verify-otp", { state: { email: form.email } });

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* ✅ GREEN HEADER SECTION */}
        <div className="bg-emerald-600 text-white px-10 py-8 text-center">
          <h2 className="text-3xl font-bold">
            Create Your Account
          </h2>
          <p className="text-emerald-100 mt-2 text-sm">
            Join EcoSync and manage your e-waste responsibly
          </p>
        </div>

        {/* FORM SECTION */}
        <div className="p-10">

          <form onSubmit={handleRegister} className="space-y-6">

            {/* Name */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>
            </div>

            {/* Email & Mobile */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className={`w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                  passwordValid
                    ? "border-emerald-500 focus:ring-emerald-500"
                    : "border-gray-300 focus:ring-red-400"
                }`}
              />

              <p className="text-xs text-gray-500 mt-2">
                Must contain 8+ characters, uppercase, lowercase, number and special character (!@#$).
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />

              {form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!passwordValid || loading}
              className={`w-full py-3 rounded-xl font-semibold transition shadow-md ${
                passwordValid
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-emerald-600 font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

          </form>
        </div>

      </div>

    </div>
  );
}

export default Register;