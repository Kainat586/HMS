import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { patientName, disease, notes } = await req.json();

    if (!notes) {
      return NextResponse.json({ success: false, message: "Notes are required" }, { status: 400 });
    }

    const prompt = `
    Generate a professional medical report based strictly on the provided details. 
    Do NOT include placeholders like [Insert ...]. 
    If any detail is not provided, skip it completely.

    Patient: ${patientName || "N/A"}
    Disease/Condition: ${disease || "N/A"}
    Notes: ${notes}

    Format sections clearly:
    - Observations
    - Diagnosis
    - Prescription
    - Follow-up
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    function cleanReport(report) {
      return report.replace(/\[.*?\]/g, "").trim();
    }

    const rawReport = response.choices[0].message.content;
    const report = cleanReport(rawReport);

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Report generation failed:", error);
    return NextResponse.json({ success: false, message: "Failed to generate report" }, { status: 500 });
  }
}
