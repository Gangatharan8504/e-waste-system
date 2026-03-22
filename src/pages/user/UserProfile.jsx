import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

function UserProfile() {

  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(location.state?.message || "");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setProfile(response.data);
      } catch {
        setMessage("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await api.put("/user/profile", profile);
      setEditMode(false);
      setMessage("Profile updated successfully");
    } catch {
      setMessage("Update failed");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  const initials =
    (profile.firstName?.charAt(0) || "") +
    (profile.lastName?.charAt(0) || "");

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">

      <div className="max-w-5xl mx-auto space-y-10">

        {/* HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-10 flex flex-col md:flex-row items-center md:items-start justify-between">

          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="w-20 h-20 bg-emerald-600 text-white flex items-center justify-center rounded-full text-2xl font-bold shadow-md">
              {initials || "U"}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-500">{profile.email}</p>
              <p className="text-sm text-gray-400 mt-2">
                Manage your personal details and account settings.
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Save Changes
              </button>
            )}
          </div>

        </div>

        {/* MESSAGE */}
        {message && (
          <div className="text-center text-emerald-600 font-medium">
            {message}
          </div>
        )}

        {/* PERSONAL INFO CARD */}
        <div className="bg-white rounded-3xl shadow-md p-10">

          <h3 className="text-xl font-semibold text-gray-900 mb-8">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm text-gray-500">First Name</label>
              <input
                name="firstName"
                value={profile.firstName || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Last Name</label>
              <input
                name="lastName"
                value={profile.lastName || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Mobile</label>
              <input
                name="mobile"
                value={profile.mobile || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                value={profile.email || ""}
                disabled
                className="w-full mt-2 p-3 border rounded-lg bg-gray-100"
              />
            </div>

          </div>

          <div className="mt-6">
            <label className="text-sm text-gray-500">Address</label>
            <textarea
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
              disabled={!editMode}
              rows="3"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate("/user/change-password")}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Change Password
            </button>
          </div>

        </div>

        {/* ACCOUNT SUMMARY */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h4 className="text-2xl font-bold text-emerald-600">Active</h4>
            <p className="text-sm text-gray-500 mt-2">
              Account Status
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h4 className="text-2xl font-bold text-emerald-600">
              {new Date().getFullYear()}
            </h4>
            <p className="text-sm text-gray-500 mt-2">
              Member Since
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h4 className="text-2xl font-bold text-emerald-600">
              Secure
            </h4>
            <p className="text-sm text-gray-500 mt-2">
              Account Protection
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default UserProfile;