import { useEffect, useState } from "react";
import api from "../../services/api";

function MyRequests() {

  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");

  const [confirmSlotModal, setConfirmSlotModal] = useState(null);

  const timeSlots = [
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00"
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/requests/my");
      setRequests(res.data);
    } catch {
      alert("Failed to load requests");
    }
  };

  const confirmSlot = async (id) => {
    try {
      await api.put(`/requests/${id}/confirm-slot`);
      setConfirmSlotModal(null);
      fetchRequests();
    } catch {
      alert("Failed to confirm slot");
    }
  };

  const cancelRequest = async (id) => {
    try {
      await api.put(`/requests/${id}/cancel`);
      fetchRequests();
    } catch {
      alert("Cancel failed");
    }
  };

  const deleteRequest = async (id) => {
    try {
      await api.delete(`/requests/${id}`);
      fetchRequests();
    } catch {
      alert("Delete failed");
    }
  };

  const requestReschedule = async () => {
    try {
      await api.put(
        `/requests/${rescheduleId}/request-reschedule?requestedDate=${newDate}&requestedSlot=${newSlot}`
      );

      setRescheduleId(null);
      fetchRequests();
    } catch {
      alert("Failed to request reschedule");
    }
  };

  const openImage = (images, index) => {
    setCurrentImages(images);
    setImageIndex(index);
    setSelectedImage(images[index].imageName);
  };

  const nextImage = () => {
    const next = (imageIndex + 1) % currentImages.length;
    setImageIndex(next);
    setSelectedImage(currentImages[next].imageName);
  };

  const prevImage = () => {
    const prev =
      (imageIndex - 1 + currentImages.length) % currentImages.length;
    setImageIndex(prev);
    setSelectedImage(currentImages[prev].imageName);
  };

  const statusColor = (status) => {

    switch (status) {

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "APPROVED":
        return "bg-blue-100 text-blue-700";

      case "SLOT_PROPOSED":
        return "bg-purple-100 text-purple-700";

      case "SLOT_CONFIRMED":
        return "bg-indigo-100 text-indigo-700";

      case "RESCHEDULE_REQUESTED":
        return "bg-orange-100 text-orange-700";

      case "ASSIGNED":
        return "bg-cyan-100 text-cyan-700";

      case "IN_PROGRESS":
        return "bg-orange-200 text-orange-800";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "CANCELLED":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  /* USER FRIENDLY FILTER */

  const filteredRequests = requests.filter((req) => {

    if (filter === "ALL") return true;

    if (filter === "PENDING") {
      return ["PENDING","APPROVED","SLOT_PROPOSED","RESCHEDULE_REQUESTED"].includes(req.status);
    }

    if (filter === "SCHEDULED") {
      return ["SLOT_CONFIRMED","ASSIGNED","IN_PROGRESS"].includes(req.status);
    }

    if (filter === "COMPLETED") {
      return req.status === "COMPLETED";
    }

    if (filter === "CANCELLED") {
      return ["CANCELLED","REJECTED"].includes(req.status);
    }

    return true;

  });

  return (

    <div className="min-h-screen bg-gray-50 p-10">

      <h1 className="text-3xl font-bold mb-6">
        My Pickup Requests
      </h1>

      {/* FILTER BAR */}

      <div className="flex gap-2 mb-6 flex-wrap">

        {["ALL","PENDING","SCHEDULED","COMPLETED","CANCELLED"].map((f) => (

          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs rounded border ${
              filter === f ? "bg-emerald-600 text-white" : "bg-white"
            }`}
          >
            {f}
          </button>

        ))}

      </div>

      <div className="space-y-4">

        {filteredRequests.map((req) => (

          <div
            key={req.id}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
          >

            {/* LEFT SIDE INFO */}

            <div className="flex-1">

              <div className="flex justify-between mb-2">

                <h2 className="font-semibold">
                  Request #{req.id}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(req.status)}`}
                >
                  {req.status}
                </span>

              </div>

              <p className="text-sm">
                <b>Device:</b> {req.deviceType} {req.brand}
              </p>

              <p className="text-sm">
                <b>Address:</b> {req.pickupAddress}
              </p>

              {req.pickupDate && (
                <p className="text-sm">
                  <b>Pickup:</b> {req.pickupDate} ({req.pickupSlot})
                </p>
              )}

              <div className="flex gap-2 mt-3">

                {req.status === "PENDING" && (
                  <button
                    onClick={() => cancelRequest(req.id)}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                  >
                    Cancel
                  </button>
                )}

                {req.status === "CANCELLED" && (
                  <button
                    onClick={() => deleteRequest(req.id)}
                    className="bg-gray-700 text-white px-3 py-1 text-sm rounded"
                  >
                    Delete
                  </button>
                )}

                {req.status === "SLOT_PROPOSED" && (

                  <>
                    <button
                      onClick={() => setConfirmSlotModal(req.id)}
                      className="bg-green-600 text-white px-3 py-1 text-sm rounded"
                    >
                      Confirm Slot
                    </button>

                    <button
                      onClick={() => setRescheduleId(req.id)}
                      className="bg-orange-500 text-white px-3 py-1 text-sm rounded"
                    >
                      Request Reschedule
                    </button>
                  </>

                )}

              </div>

              {req.status === "RESCHEDULE_REQUESTED" && (
                <p className="text-orange-600 text-sm mt-2">
                  Your reschedule request is currently under review.
                </p>
              )}

            </div>

            {/* RIGHT IMAGE */}

            {req.images?.length > 0 && (

              <div
                className="relative w-24 h-24 ml-4 cursor-pointer"
                onClick={() => openImage(req.images, 0)}
              >

                <img
                  src={`http://localhost:3036/uploads/${req.images[0].imageName}`}
                  className="w-24 h-24 object-cover rounded"
                />

                {req.images.length > 1 && (

                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">

                    +{req.images.length - 1}

                  </div>

                )}

              </div>

            )}

          </div>

        ))}

      </div>

      {/* CONFIRM SLOT MODAL */}

      {confirmSlotModal && (

        <div className="fixed inset-0 bg-gray-200 bg-opacity-60 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl shadow w-96">

            <h2 className="font-semibold mb-3">
              Confirm Pickup Slot
            </h2>

            <p className="text-sm mb-4">
              Please confirm the proposed pickup time.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setConfirmSlotModal(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => confirmSlot(confirmSlotModal)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}

      {/* RESCHEDULE MODAL */}

      {rescheduleId && (

        <div className="fixed inset-0 bg-gray-200 bg-opacity-60 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-lg font-semibold mb-4">
              Request New Pickup Time
            </h2>

            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="border p-2 w-full mb-3"
            />

            <select
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              className="border p-2 w-full mb-4"
            >

              <option value="">Select Time Slot</option>

              {timeSlots.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}

            </select>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setRescheduleId(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={requestReschedule}
                className="bg-emerald-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>

            </div>

          </div>

        </div>

      )}

      {/* IMAGE VIEWER */}

      {selectedImage && (

        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >

          <button
            className="absolute top-24 right-10 text-white text-5xl"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-10 text-white text-4xl"
          >
            ‹
          </button>

          <img
            src={`http://localhost:3036/uploads/${selectedImage}`}
            className="max-h-[90%] max-w-[90%]"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-10 text-white text-4xl"
          >
            ›
          </button>

        </div>

      )}

    </div>
  );
}

export default MyRequests;