// utils.js

// helper to strip unwanted DB artifacts
function clean(value) {
  if (typeof value === "string") {
    return value.replace(/_x000B_/gi, "").trim();
  }
  return value ?? "";
}

export function formatRow(row) {
  return {
    ID: row.id,
    "Technology platform": clean(row.technology_platform),
    "Insight name": clean(row.insight_name),
    "Tag 1": clean(row.tag1),
    "Tag 2": clean(row.tag2),
    "Tag 3": clean(row.tag3),
    "Description of technology": clean(row.description),
    "Anticipated TRL": clean(row.anticipated_trl),
    "Company": clean(row.company),
    "Owner/named contact": clean(row.owner_contact),
    "Country": clean(row.country),
    "Relevance to paper sacks": clean(row.relevance),
    "Environmental credentials": clean(row.environmental_credentials),
    "Current status": clean(row.current_status),
    "Potential challenges and points requiring further investigation": clean(
      row.challenges
    ),
    "General contact details": clean(row.general_contact),
    "Email contact if available": clean(row.email),
    "Web pages": clean(row.web_pages),
    "Year of entry into the database": clean(row.year_of_entry),
    "Additional notes": clean(row.additional_notes),
    "Status update": clean(row.status_update),
    "Recommended": row.recommended,
    "New entry": row.new_entry,
    "Image 1": row.s3key1,
    "Image 2": row.s3key2,
    "Image 3": row.s3key3,
  };
}


// utils/fetchWithRetry.js
export async function fetchWithRetry(url, options = {}, retries = 3, delay = 2000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        // If it's a warm-up 500/503 error, retry
        if ([500, 503].includes(res.status) && attempt < retries - 1) {
          console.warn(
            `Fetch failed (status ${res.status}). Retrying in ${delay * (attempt + 1)} ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
          continue;
        }

        // Non-retryable error, throw
        throw new Error(`Request failed with status ${res.status}`);
      }

      // Parse and return JSON if successful
      return await res.json();
    } catch (err) {
      // Network or other fetch error
      if (attempt < retries - 1) {
        console.warn(`Fetch error: ${err.message}. Retrying in ${delay * (attempt + 1)} ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
      } else {
        throw err;
      }
    }
  }
}
