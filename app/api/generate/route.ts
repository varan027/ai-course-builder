import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from 'next/server';

async function getGeminiResponse(inputText: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Server Error: GEMINI_API_KEY is not configured.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const contents = [{ role: "user", parts: [{ text: inputText }] }];
    
    const modelConfig = {
        model: "gemini-flash-latest",
        contents,
        tools: [{ googleSearch: {} }]
    };

    try {
        const response = await ai.models.generateContentStream(modelConfig);

        const responseChunks: string[] = [];
        for await (const chunk of response) {
            if (chunk.text) {
                responseChunks.push(chunk.text);
            }
        }
        
        const finalText = responseChunks.join('');
        
        if (finalText.length === 0) {
            console.error("[DEBUG] Gemini returned an empty response after streaming.");
            throw new Error("Gemini stream completed but returned zero content.");
        }

        return finalText; 

    } catch (error) {
        console.error("[DEBUG] Error during Gemini Stream/API Call:", error);
        throw new Error(`Gemini Stream Failed: ${error instanceof Error ? error.message : "Unknown stream error."}`);
    }
}


export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ message: 'Missing prompt in request body.' }, { status: 400 });
        }

        const resultText = await getGeminiResponse(prompt);
        
        return NextResponse.json({ result: resultText }, { status: 200 });
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
        
        console.error("API Route 500 Error:", errorMessage);
        
        return NextResponse.json(
            { 
                error: "Failed to generate content.", 
                message: `Server failed to process API request: ${errorMessage}` 
            },
            { status: 500 }
        );
    }
}