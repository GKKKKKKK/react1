import React, { useEffect, useState } from "react";
import { imageApiUrl } from "../../App";

const bannerKey =
  "uploads/4e2751fb-09fa-4dcf-9936-6f04853ed1cc-techdbBanner.jpg";

async function fetchPresignedUrl(key) {
  const res = await fetch(`${imageApiUrl}/presign`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ key }),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.results?.[0]?.url || null;
}

export default function MainBanner() {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    async function loadUrl() {
      try {
        const presignedUrl = await fetchPresignedUrl(bannerKey);
        setUrl(presignedUrl);
      } catch (err) {
        console.error("Error fetching banner URL:", err);
      }
    }
    loadUrl();
  }, []);

  if (!url) return <p>Loading banner...</p>;

  return (
    <div style={{ width: "100%", marginBottom: "1rem" }}>
      <img
        src={url}
        alt="TechDB Banner"
        style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }}
      />
    </div>
  );
}
