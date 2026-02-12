import { useEffect, useState } from "react";

export default function LiveDateTime() {
  const [time, setTime] = useState(getFormatted());

  function getFormatted() {
    const now = new Date();

    const date = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const clock = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${date} • ${clock}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getFormatted());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:block text-gray-300 text-sm font-mono tracking-wide">
      {time}
    </div>
  );
}
