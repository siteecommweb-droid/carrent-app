import { useEffect, useState } from "react";

export default function AirportPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 2000);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-black text-white p-6 rounded-xl">
      <div>Book your car now before leaving airport</div>
      <button className="mt-3 bg-white text-black px-3 py-1 rounded">
        Book Now
      </button>
    </div>
  );
}








