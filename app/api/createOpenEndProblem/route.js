import { NextResponse } from "next/server";
import OpenAI from "openai";
import { extractTextFromPDF } from "../../parsePDF";
const openai = new OpenAI();

export async function POST(req) {
    const reqJSON = await req.json();
    if (!reqJSON.topic || !reqJSON.course) {
        return NextResponse.json({ problem: "" });
    }
    let prompt;
    if (!reqJSON.studyGuide) {
        prompt = `Write a short answer practice problem for the following topic: ${reqJSON.topic}. The class is: ${reqJSON.course}. The student has solved the following problems: ${reqJSON.problems}.`
    }
    else {
        const text = await extractTextFromPDF(reqJSON.studyGuide);
        prompt = `Write a short answer practice problem for the following topic: ${reqJSON.topic}. The class is: ${reqJSON.course}. Here is the study guide the students were given: ${text}.  It should not be directly copied from the study guide. The student has solved the following problems: ${reqJSON.problems}.`
    }
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a tutor who generates practice problems for the user based on the topic they are studying and their class. Do not add a title, just write the problem." },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.8
    });
    return NextResponse.json({ problem: completion.choices[0].message.content });
}