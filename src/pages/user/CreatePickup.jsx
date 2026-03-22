import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import LocationPicker from "../../components/LocationPicker";

function CreatePickup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    deviceType: "",
    brand: "",
    model: "",
    condition: "",
    quantity: 1,
    pickupAddress: "",
    remarks: ""
  });

  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: ""
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationSelect = (lat, lng) => {
    setCoordinates({
      latitude: lat,
      longitude: lng
    });
  };

  const handleAddressUpdate = (address) => {
    setFormData((prev) => ({
      ...prev,
      pickupAddress: address
    }));
  };

  // Append images (no replace)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const updatedImages = [...images, ...files];
    setImages(updatedImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);

    e.target.value = null;
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.append("latitude", coordinates.latitude);
      data.append("longitude", coordinates.longitude);

      images.forEach((img) => {
        data.append("images", img);
      });

      const response = await api.post("/requests", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        navigate("/user/my-requests");
      }

    } catch (error) {
      console.error(error);
      setMessage("Failed to create request");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔥 Premium Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 py-12 text-white text-center shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">
          Create E-Waste Pickup Request
        </h1>
        <p className="mt-2 text-sm opacity-90">
          Schedule safe and eco-friendly disposal of your electronic waste
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-8 mt-10 mb-12 rounded-2xl shadow-xl">

        {message && (
          <div className="mb-6 text-center text-red-600 font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Input Fields */}
          {["deviceType", "brand", "model", "condition"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          ))}

          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />

          <input
            type="text"
            name="pickupAddress"
            placeholder="Pickup Address"
            value={formData.pickupAddress}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />

          {/* Map */}
          <LocationPicker
            setLocation={handleLocationSelect}
            setAddress={handleAddressUpdate}
          />

          <textarea
            name="remarks"
            placeholder="Additional Remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />

          {/* Image Upload Section */}
          <div className="space-y-3">

            <label className="block text-sm font-semibold text-gray-700">
              Upload Images
            </label>

            <div className="flex items-center justify-between border border-gray-300 rounded-xl p-4 bg-gray-100">

              <label className="cursor-pointer bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm">
                Choose Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <span className="text-sm text-gray-600 pointer-events-none">
                {images.length === 0
                  ? "No images selected"
                  : `${images.length} selected`}
              </span>

            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {previews.map((src, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden shadow-md border"
                  >
                    <img
                      src={src}
                      alt="preview"
                      className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black bg-opacity-60 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition shadow-md disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-xl hover:bg-gray-400 transition shadow-sm"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreatePickup;