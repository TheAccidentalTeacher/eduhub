import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { WorksheetRequest, WorksheetResponse, VisualElement, InteractiveActivity } from '@/types/worksheet';
import { 
  searchAllImages, 
  searchRelevantNews, 
  generateCustomImage, 
  searchEducationalVideos,
  searchEducationalGifs 
} from '@/utils/apiServices';

// Initialize OpenAI client
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  return new OpenAI({ apiKey });
}

// Enhanced pedagogical prompts based on grade level
function getPedagogicalPrompt(gradeLevel: string, topic: string, subtopic: string) {
  const gradeNum = parseInt(gradeLevel.match(/\d+/)?.[0] || '1');
  
  if (gradeNum <= 2) {
    return `Create a worksheet for ${gradeLevel} focusing on ${subtopic}. Use:
    - Simple, concrete language
    - Visual learning opportunities 
    - Hands-on activities
    - Pattern recognition
    - Basic matching and sorting
    - Story-based contexts
    - Bloom's Taxonomy: Remember and Understand levels primarily`;
  } else if (gradeNum <= 5) {
    return `Create a worksheet for ${gradeLevel} focusing on ${subtopic}. Include:
    - Clear explanations with examples
    - Mix of concrete and beginning abstract thinking
    - Problem-solving activities
    - Real-world connections
    - Creative expression opportunities
    - Bloom's Taxonomy: Remember, Understand, and Apply levels`;
  } else if (gradeNum <= 8) {
    return `Create a worksheet for ${gradeLevel} focusing on ${subtopic}. Design for:
    - Abstract thinking development
    - Critical analysis skills
    - Research-based questions
    - Peer collaboration opportunities
    - Current event connections
    - Bloom's Taxonomy: All levels, emphasizing Analyze and Evaluate`;
  } else {
    return `Create a worksheet for ${gradeLevel} focusing on ${subtopic}. Emphasize:
    - Complex problem solving
    - Independent research
    - Critical evaluation of sources
    - Creative synthesis
    - Real-world application
    - Bloom's Taxonomy: Focus on Analyze, Evaluate, and Create levels`;
  }
}

// Generate comprehensive worksheet content
async function generateEnhancedWorksheet(
  request: WorksheetRequest,
  visualElements: VisualElement[],
  currentEvents: any[]
): Promise<any> {
  const openai = getOpenAIClient();
  
  const pedagogicalPrompt = getPedagogicalPrompt(
    request.gradeLevel, 
    request.topic, 
    request.subtopic
  );

  const enhancedPrompt = `
${pedagogicalPrompt}

WORKSHEET SPECIFICATIONS:
Topic: ${request.topic}
Subtopic: ${request.subtopic}
Grade Level: ${request.gradeLevel}
Learning Objective: ${request.learningObjective}
Style: ${request.style}
Type: ${request.worksheetType || 'standard'}

CONTENT GUIDELINES:
- Age-appropriate language and concepts for ${request.gradeLevel}
- Educational focus with clear learning objectives
- Professional classroom-appropriate presentation

AVAILABLE VISUAL ELEMENTS:
${visualElements.map(v => `- ${v.description} (${v.type})`).join('\n')}

CURRENT EVENTS AVAILABLE:
${currentEvents.map(e => `- ${e.title}: ${e.description}`).join('\n')}

CREATE A COMPREHENSIVE WORKSHEET THAT INCLUDES:

1. ENGAGING TITLE with visual appeal
2. CLEAR INSTRUCTIONS that reference visual elements
3. 8-12 VARIED QUESTIONS with:
   - Different cognitive levels (Bloom's Taxonomy)
   - Multiple question types
   - Integration with visual elements
   - Progressive difficulty
   - Real-world connections

4. APPROPRIATE ACTIVITIES:
   - Choose 1-2 activities that make sense for this topic
   - For social studies/history: discussion, research, writing, analysis
   - For science: experiments, observations, diagrams
   - For language arts: creative writing, character analysis, vocabulary
   - For math: problem-solving, calculations, graphing
   - NO science experiments for non-science topics!

5. PEDAGOGICAL DESIGN:
   - Age-appropriate language and concepts
   - Scaffolded learning progression
   - Multiple learning modalities
   - Engagement strategies specific to ${request.gradeLevel}

5. ANSWER KEY with:
   - Correct answers
   - Detailed explanations
   - Teaching notes
   - Extension ideas

Format as structured JSON with:
{
  "title": "Creative, engaging title",
  "instructions": "Clear, comprehensive instructions",
  "questions": [
    {
      "id": "unique_id",
      "type": "question_type",
      "question": "Well-crafted question",
      "options": ["array if multiple choice"],
      "points": number,
      "bloomsLevel": "cognitive_level",
      "visualAidId": "id_if_applicable",
      "hint": "helpful_hint_if_needed"
    }
  ],
  "activities": [
    {
      "id": "activity_id",
      "type": "appropriate_activity_type",
      "title": "Activity title",
      "instructions": "Clear activity instructions"
    }
  ],
  "answerKey": [
    {
      "questionId": "matching_id",
      "answer": "correct_answer",
      "explanation": "detailed_explanation",
      "pedagogicalReasoning": "why_this_teaches_the_concept"
    }
  ],
  "pedagogicalNotes": "Teaching strategies and tips",
  "difficultyProgression": "how_questions_build_complexity"
}

Make this worksheet truly engaging and educational for ${request.gradeLevel} students!
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert educational designer with deep knowledge of child development, learning theories, and engaging pedagogy. Create worksheets that are both fun and educationally rigorous."
      },
      {
        role: "user",
        content: enhancedPrompt
      }
    ],
    temperature: 0.8,
    max_tokens: 3000,
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error('No response from OpenAI');

  return JSON.parse(response);
}

// Main API endpoint
export async function POST(request: NextRequest) {
  console.log('[ENHANCED-WORKSHEET-API] Received request');
  
  try {
    const body: WorksheetRequest = await request.json();
    const { topic, subtopic, gradeLevel, learningObjective, style } = body;

    // Validate required fields
    if (!topic || !subtopic || !gradeLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('[ENHANCED-WORKSHEET-API] Gathering visual and content resources...');

    // Step 1: Gather visual and multimedia content in parallel
    const [
      topicImages,
      currentEvents,
      educationalGifs,
      educationalVideos,
      customIllustration
    ] = await Promise.allSettled([
      searchAllImages(`${subtopic} education children ${gradeLevel}`, 4),
      searchRelevantNews(topic, 2),
      searchEducationalGifs(subtopic, 2),
      searchEducationalVideos(subtopic, gradeLevel, 2),
      generateCustomImage(`${subtopic} educational illustration`, gradeLevel)
    ]);

    // Process results and handle any failures gracefully
    const visualElements: VisualElement[] = [];
    let processedCurrentEvents: any[] = [];

    // Add images
    if (topicImages.status === 'fulfilled' && topicImages.value.length > 0) {
      topicImages.value.forEach((img, index) => {
        visualElements.push({
          id: `img_${index}`,
          type: 'image',
          url: img.url,
          description: img.description,
          source: img.source,
          placement: index === 0 ? 'header' : 'inline'
        });
      });
    }

    // Add GIFs
    if (educationalGifs.status === 'fulfilled' && educationalGifs.value.length > 0) {
      educationalGifs.value.forEach((gif, index) => {
        visualElements.push({
          id: `gif_${index}`,
          type: 'gif',
          url: gif.url,
          description: gif.title,
          source: 'giphy',
          placement: 'inline'
        });
      });
    }

    // Add custom illustration
    if (customIllustration.status === 'fulfilled' && customIllustration.value) {
      visualElements.push({
        id: 'custom_illustration',
        type: 'illustration',
        url: customIllustration.value.url,
        description: customIllustration.value.prompt,
        source: 'stability-ai',
        placement: 'header'
      });
    }

    // Process current events
    if (currentEvents.status === 'fulfilled') {
      processedCurrentEvents = currentEvents.value;
    }

    console.log('[ENHANCED-WORKSHEET-API] Generating AI content...');

    // Step 3: Generate comprehensive worksheet content
    const worksheetData = await generateEnhancedWorksheet(
      body,
      visualElements,
      processedCurrentEvents
    );

    // Step 4: Create enhanced response
    const worksheet: WorksheetResponse = {
      id: generateWorksheetId(),
      title: worksheetData.title,
      content: JSON.stringify(worksheetData),
      questions: worksheetData.questions || [],
      instructions: worksheetData.instructions,
      answerKey: worksheetData.answerKey || [],
      createdAt: new Date().toISOString(),
      visualElements,
      activities: worksheetData.activities || [], // Use AI-generated activities
      currentEvents: processedCurrentEvents.map(event => ({
        id: `news_${Date.now()}`,
        title: event.title,
        summary: event.description,
        relevance: `Connects to ${subtopic} concepts`,
        discussionPoints: [`How does this relate to ${subtopic}?`],
        ageAppropriate: true
      })),
      pedagogicalNotes: worksheetData.pedagogicalNotes,
      difficultyProgression: worksheetData.difficultyProgression
    };

    console.log('[ENHANCED-WORKSHEET-API] Successfully generated enhanced worksheet');
    return NextResponse.json(worksheet);

  } catch (error) {
    console.error('[ENHANCED-WORKSHEET-API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate enhanced worksheet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateWorksheetId(): string {
  return `enhanced_worksheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
