import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setPhone(data.phone || "");
      });
  }, []);

  async function save() {
    setLoading(true);

    await fetch(`${import.meta.env.VITE_API_URL}/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, phone }),
    });

    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-10 space-y-6 text-white">

      <h1 className="text-3xl font-black">My Profile</h1>

      <div className="bg-black/40 p-6 rounded-xl space-y-4">

        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-black border border-gray-600"
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 rounded bg-black border border-gray-600"
        />

        <button
          onClick={save}
          disabled={loading}
          className="bg-red-600 px-6 py-3 rounded-xl"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

      </div>

    </div>
  );
}




