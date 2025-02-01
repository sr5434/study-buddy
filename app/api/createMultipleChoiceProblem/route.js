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
        prompt = `Write a multiple practice problem for the following topic: ${reqJSON.topic}. The class is: ${reqJSON.course}. `
    }
    else {
        const text = await extractTextFromPDF(reqJSON.studyGuide);
        prompt = `Write a multiple practice practice problem for the following topic: ${reqJSON.topic}. The class is: ${reqJSON.course}. Here is the study guide the students were given: ${text}. `
    }
    
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a tutor who generates practice problems for the user based on the topic they are studying and their class." },
            {
                role: "user",
                content: prompt,
            },
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                "name": "multiple_choice_problem",
                "schema": {
                  "type": "object",
                  "properties": {
                    "question": {
                      "type": "string",
                      "description": "The question being asked in the multiple choice problem."
                    },
                    "options": {
                      "type": "object",
                      "description": "The possible answers for the question.",
                      "properties": {
                        "A": {
                          "type": "string",
                          "description": "Option A for the multiple choice question."
                        },
                        "B": {
                          "type": "string",
                          "description": "Option B for the multiple choice question."
                        },
                        "C": {
                          "type": "string",
                          "description": "Option C for the multiple choice question."
                        },
                        "D": {
                          "type": "string",
                          "description": "Option D for the multiple choice question."
                        }
                      },
                      "required": [
                        "A",
                        "B",
                        "C",
                        "D"
                      ],
                      "additionalProperties": false
                    },
                    "correct_answer": {
                      "type": "string",
                      "description": "The correct answer to the multiple choice problem. Should be one of A, B, C, or D."
                    },
                    "explanation": {
                      "type": "string",
                      "description": "A detailed explanation for why the correct answer is the right choice."
                    }
                  },
                  "required": [
                    "question",
                    "options",
                    "correct_answer",
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