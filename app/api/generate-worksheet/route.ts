import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { WorksheetRequest, WorksheetResponse } from '@/types/worksheet';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body: WorksheetRequest = await request.json();
    const { topic, subtopic, gradeLevel, learningObjective, style } = body;

    // Validate required fields
    if (!topic || !subtopic || !gradeLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, subtopic, and gradeLevel' },
        { status: 400 }
      );
    }

    // Generate worksheet using OpenAI
    const prompt = `
Create an educational worksheet with the following specifications:

Topic: ${topic}
Subtopic: ${subtopic}
Grade Level: ${gradeLevel}
Learning Objective: ${learningObjective || 'General understanding of the topic'}
Style: ${style}

Please generate:
1. A clear worksheet title
2. Brief instructions for students
3. 8-12 varied questions appropriate for ${gradeLevel} level
4. Include different question types: multiple choice, fill-in-the-blank, short answer, and true/false
5. An answer key with explanations
6. Make the content ${style} and engaging for ${gradeLevel} students

Format the response as a structured JSON object with:
- title: string
- instructions: string
- questions: array of question objects with id, type, question, options (if applicable), points
- answerKey: array with questionId, answer, and explanation

Ensure all content is educationally appropriate and aligns with ${gradeLevel} learning standards.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator specializing in creating engaging, age-appropriate worksheets for students. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the AI response
    let worksheetData;
    try {
      worksheetData = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      worksheetData = {
        title: `${subtopic} Worksheet - ${gradeLevel}`,
        instructions: "Complete all questions to the best of your ability.",
        questions: [
          {
            id: "1",
            type: "short-answer",
            question: `Explain the main concepts of ${subtopic} in your own words.`,
            points: 10
          }
        ],
        answerKey: [
          {
            questionId: "1",
            answer: "Sample answer based on the topic",
            explanation: "This question tests basic understanding of the topic."
          }
        ]
      };
    }

    // Create response object
    const worksheet: WorksheetResponse = {
      id: generateWorksheetId(),
      title: worksheetData.title,
      content: aiResponse,
      questions: worksheetData.questions || [],
      instructions: worksheetData.instructions || "Complete the worksheet carefully.",
      answerKey: worksheetData.answerKey || [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(worksheet);

  } catch (error) {
    console.error('Error generating worksheet:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate worksheet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateWorksheetId(): string {
  return `worksheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
