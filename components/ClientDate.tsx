"use client";
import { useEffect, useState } from "react";

export default function ClientDate({ timestamp }: { timestamp: number }) {
  const [text, setText] = useState("...");

  useEffect(() => {
    if (!timestamp) return;
    const d = new Date(timestamp * 1000);
    setText(d.toLocaleString());
  }, [timestamp]);

  return <span suppressHydrationWarning>{text}</span>;
}
