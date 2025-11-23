/* eslint-disable @typescript-eslint/no-explicit-any */
// api/parse-resume.ts

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body ?? {};
    const fileName: string | undefined = body.fileName;

    // Very simple "fake AI" just so UI works
    const lowerName = (fileName ?? "").toLowerCase();
    const skills: string[] = [];

    if (lowerName.includes("react")) skills.push("React");
    if (lowerName.includes("ts") || lowerName.includes("typescript"))
      skills.push("TypeScript");
    if (skills.length === 0) skills.push("JavaScript");

    const parsedResume = {
      skills,
      totalExperienceYears: 1,
      inferredExperienceLevel: "1–3 years",
      preferredLocations: ["Remote"],
    };

    return res.status(200).json(parsedResume);
  } catch (err) {
    console.error("parse-resume error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
