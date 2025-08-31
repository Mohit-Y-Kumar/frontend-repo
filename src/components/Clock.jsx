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

    updateTime(); 
    const interval = setInterval(updateTime, 60000); 

    return () => clearInterval(interval); 
  }, []);

  return <span className={` ${className}`}>{time}</span>;
}
