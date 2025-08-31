// Clock.jsx
import React, { useState, useEffect } from "react";

export default function Clock({ className = "" }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    updateTime(); // set initial time
    const interval = setInterval(updateTime, 60000); // update every minute

    return () => clearInterval(interval); // cleanup
  }, []);

  return <span className={` ${className}`}>{time}</span>;
}
