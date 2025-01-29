import { NextResponse } from "next/server";
import OpenAI from "openai";
import { extractTextFromPDF } from "../../parsePDF";
const openai = new OpenAI();

export async function POST(req) {
    console.log("Called");
    const reqJSON = await req.json();
    // TODO: Parse the pdf and get the text from it
    const text = await extractTextFromPDF(reqJSON.studyGuide);
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a tutor who generates practice problems for the user based on the topic they are studying and their class." },
            {
                role: "user",
                content: "Write a practice problem for the following topic: " + reqJSON.topic + ". The class is: " + reqJSON.course,
            },
        ],
    });
    return NextResponse.json({ problem: completion.choices[0].message.content });
}