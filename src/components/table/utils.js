export function formatRow(row) {
  return {
    "ID": row.id, //db primary key
    "Technology platform": row.technology_platform,
    "Insight name": row.insight_name,
    "Tag 1": row.tag1,
    "Tag 2": row.tag2,
    "Tag 3": row.tag3,
    "Description of technology": row.description,
    "Anticipated TRL": row.anticipated_trl,
    "Company": row.company,
    "Owner/named contact": row.owner_contact,
    "Country": row.country,
    "Relevance to paper sacks": row.relevance,
    "Environmental credentials": row.environmental_credentials,
    "Current status": row.current_status,
    "Potential challenges and points requiring further investigation": row.challenges,
    "General contact details": row.general_contact,
    "Email contact if available": row.email,
    "Web pages": row.web_pages,
    "Year of entry into the database": row.year_of_entry,
    "Additional notes": row.additional_notes,
    "Status update": row.status_update,
    "Recommended": row.recommended,
    "New entry": row.new_entry,
    "Image 1": row.s3key1,
    "Image 2": row.s3key2,
    "Image 3": row.s3key3
  };
}