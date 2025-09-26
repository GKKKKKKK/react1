import React, { useEffect, useState } from "react";
import { imageApiUrl } from "../../App"; 

async function fetchPresignedUrls(keys) {
  const res = await fetch(`${imageApiUrl}/presign`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ keys }),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export default function S3Images({ keys }) {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    if (!keys || keys.length === 0) return;

    async function loadUrls() {
      try {
        const presigned = await fetchPresignedUrls(keys.filter(Boolean));
        setUrls(presigned);
      } catch (err) {
        console.error("Error fetching presigned URLs:", err);
      }
    }

    loadUrls();
  }, [keys]);
  
  if (!keys || keys.length === 0) return <p>No images available</p>;
  if (urls.length === 0) return <p>Loading images...</p>;

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {urls.map(({ key, url }) => (
        <img
          key={key}
          src={url}
          alt={key}
          style={{ maxWidth: "400px", border: "1px solid #ccc" }}
        />
      ))}
    </div>
  );
}