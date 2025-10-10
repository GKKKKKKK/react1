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
    fetchPresignedUrl(bannerKey)
      .then(setUrl)
      .catch((err) => console.error("Banner error:", err));
  }, []);

  if (!url) return <p>Loading banner...</p>;

  return (
    <div style={{ width: "100%", marginBottom: "1rem" }}>
      <img
        src={url}
        alt="TechDB Banner"
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "250px",
          objectFit: "cover",
          display: "block",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}
