import { NextResponse } from "next/server";
import OpenAI from "openai";
import { extractTextFromPDF } from "../../parsePDF";

const openai = new OpenAI();

export async function POST(req) {
    const reqJSON = await req.json();
    let systemPrompt;
    if (!reqJSON.studyGuide) {
      systemPrompt = `You are a tutor who grades student responses to practice problems. Users are in this class: ${reqJSON.course}. They are being assigned problems of the following difficulty:  ${reqJSON.difficulty}.`
    } else {
      const text = await extractTextFromPDF(reqJSON.studyGuide);
      systemPrompt = `You are a tutor who grades student responses to practice problems. Users are in this class: ${reqJSON.course}. They are being assigned problems of the following difficulty:  ${reqJSON.difficulty}. Here is the study guide the students were given: ${text}.`
    }
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: `A student was presented with the following problem: ${reqJSON.problem} This is their response: ${reqJSON.answer}.`,
            },
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                "name": "letter_grade",
                "schema": {
                  "type": "object",
                  "properties": {
                    "grade": {
                      "type": "string",
                      "description": "The letter grade received.",
                      "enum": [
                        "A+",
                        "A",
                        "A-",
                        "B+",
                        "B",
                        "B-",
                        "C+",
                        "C",
                        "C-",
                        "D+",
                        "D",
                        "D-",
                        "F"
                      ]
                    },
                    "explanation": {
                      "type": "string",
                      "description": "The reasoning behind the assigned letter grade, along with detailed feedback for how the user can improve."
                    }
                  },
                  "required": [
                    "grade",
                    "explanation"
                  ],
                  "additionalProperties": false
                },
                "strict": true
            }
        }
    });
    return NextResponse.json(JSON.parse(completion.choices[0].message.content));
}