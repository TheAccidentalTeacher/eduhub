import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { WorksheetRequest, WorksheetResponse, VisualElement } from '@/types/worksheet';
import { 
  searchAllImages, 
  searchRelevantNews, 
  generateCustomImage, 
  searchEducationalVideos,
  searchEducationalGifs 
} from '@/utils/apiServices';
import { generateIntelligentImage } from '@/utils/intelligentImageService';
import { 
  analyzeUserChoicesAndCreateStrategy,
  generateDetailedImagePrompt,
  generateEducationalContent,
  type UserChoiceAnalysis
} from '@/utils/advancedEducationalEngine';

// Import the new template system
import { 
  generateStructuredWorksheet, 
  integrateWithVisualEditor 
} from '../../../enhanced-worksheet-template';

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

4. PEDAGOGICAL DESIGN:
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
      "options": ["option1", "option2", "option3", "option4"],
      "points": number,
      "bloomsLevel": "cognitive_level",
      "visualAidId": "id_if_applicable",
      "hint": "helpful_hint_if_needed"
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

IMPORTANT: For multiple choice questions, "options" must be an array of strings, NOT an object. Example:
✅ CORRECT: "options": ["First option", "Second option", "Third option", "Fourth option"]
❌ WRONG: "options": {"First option": "value", "Second option": "value"}

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

  const parsedData = JSON.parse(response);
  
  // Fix any malformed options (objects instead of arrays)
  if (parsedData.questions) {
    parsedData.questions = parsedData.questions.map((question: any) => {
      if (question.options && typeof question.options === 'object' && !Array.isArray(question.options)) {
        // Convert object to array by taking the keys
        question.options = Object.keys(question.options);
      }
      return question;
    });
  }
  
  return parsedData;
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

    console.log('[ENHANCED-WORKSHEET-API] NEW APPROACH: Generating content first, then question-specific images...');

    // STEP 1: Generate worksheet content WITHOUT images first
    console.log('[ENHANCED-WORKSHEET-API] Step 1: Generating questions and content...');
    const initialWorksheetData = await generateEnhancedWorksheet(
      body,
      [], // No images yet
      []  // No current events yet  
    );

    // STEP 2: Generate current events and activities in parallel
    const [currentEvents] = await Promise.allSettled([
      searchRelevantNews(topic, 2)
    ]);

    let processedCurrentEvents: any[] = [];
    if (currentEvents.status === 'fulfilled') {
      processedCurrentEvents = currentEvents.value;
    }

    // STEP 3: Generate question-specific images (1 per question)
    console.log('[ENHANCED-WORKSHEET-API] Step 2: Generating targeted images for each question...');
    const visualElements: VisualElement[] = [];
    const usedImagePrompts = new Set<string>(); // Track used prompts to prevent duplicates
    
    // Generate header image first
    const headerImagePromise = generateIntelligentImage(
      topic, 
      subtopic, 
      gradeLevel, 
      `header illustration for ${topic} ${subtopic} worksheet`
    );

    // Generate question-specific images
    const questionImagePromises = initialWorksheetData.questions.map(async (question: any, index: number) => {
      // Create specific prompt for THIS question
      const questionContent = question.question.substring(0, 150); // First 150 chars
      const specificPrompt = `${topic} ${subtopic}: ${questionContent}`;
      
      // Check if we've already used this concept (prevent duplicates)
      const promptKey = `${topic}_${subtopic}_${index}`;
      if (usedImagePrompts.has(promptKey)) {
        console.log(`[ENHANCED-WORKSHEET-API] Skipping duplicate image for question ${index + 1}`);
        return null;
      }
      
      usedImagePrompts.add(promptKey);
      
      try {
        const imageResult = await generateIntelligentImage(
          topic,
          subtopic, 
          gradeLevel,
          specificPrompt
        );
        
        if (imageResult) {
          console.log(`[ENHANCED-WORKSHEET-API] Generated image for question ${index + 1}: ${imageResult.description.substring(0, 50)}...`);
          
          return {
            questionIndex: index,
            questionId: question.id,
            imageData: imageResult
          };
        }
        return null;
      } catch (error) {
        console.error(`[ENHANCED-WORKSHEET-API] Failed to generate image for question ${index + 1}:`, error);
        return null;
      }
    });

    // Wait for all images to generate
    const [headerImageResult, ...questionImageResults] = await Promise.allSettled([
      headerImagePromise,
      ...questionImagePromises
    ]);

    // Process header image
    if (headerImageResult.status === 'fulfilled' && headerImageResult.value) {
      visualElements.push({
        id: 'main_header',
        type: headerImageResult.value.method === 'educational_diagram' ? 'diagram' : 'illustration',
        url: headerImageResult.value.url,
        description: headerImageResult.value.description,
        source: headerImageResult.value.source,
        placement: 'header'
      });
      console.log('[ENHANCED-WORKSHEET-API] Added header image');
    }

    // Process question-specific images and assign to questions
    const updatedQuestions = [...initialWorksheetData.questions];
    questionImageResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value && result.value.imageData) {
        const { questionIndex, questionId, imageData } = result.value;
        
        // Add to visual elements
        visualElements.push({
          id: `question_${questionIndex}_image`,
          type: imageData.method === 'educational_diagram' ? 'diagram' : 'illustration', 
          url: imageData.url,
          description: imageData.description,
          source: imageData.source,
          placement: 'inline',
          relatedQuestionIds: [questionId]
        });

        // Assign image directly to the question
        if (updatedQuestions[questionIndex]) {
          updatedQuestions[questionIndex].visualAid = imageData.url;
          updatedQuestions[questionIndex].visualDescription = imageData.description;
        }
        
        console.log(`[ENHANCED-WORKSHEET-API] Assigned unique image to question ${questionIndex + 1}`);
      }
    });

    // Update worksheet data with images
    initialWorksheetData.questions = updatedQuestions;

    console.log('[ENHANCED-WORKSHEET-API] Generating AI content...');

    // Step 4: Apply modern template system if requested
    let finalWorksheetData = initialWorksheetData;
    if (body.useModernTemplates) {
      console.log('[ENHANCED-WORKSHEET-API] Applying modern template system...');
      try {
        const structuredWorksheet = generateStructuredWorksheet(topic, subtopic, gradeLevel);
        const integratedWorksheet = integrateWithVisualEditor({
          ...structuredWorksheet,
          content: initialWorksheetData,
          questions: updatedQuestions,
          images: visualElements
        });
        
        finalWorksheetData = {
          ...initialWorksheetData,
          title: `${topic}: ${subtopic}`,
          templateData: integratedWorksheet,
          useModernStyling: true,
          styling: {
            theme: body.style === 'modern-blue' ? 'modern-blue' : 'professional',
            layout: 'modern-education-template',
            colorScheme: 'blue-header-gradient'
          }
        };
        
        console.log('[ENHANCED-WORKSHEET-API] Modern template applied successfully');
      } catch (templateError) {
        console.error('[ENHANCED-WORKSHEET-API] Template system error:', templateError);
        // Continue with regular generation if template fails
      }
    }

    // Step 5: Create enhanced response with question-specific images
    try {
      // Ensure data is JSON-serializable before creating worksheet
      const contentData = {
        ...finalWorksheetData,
        questions: updatedQuestions
      };
      
      // Test JSON serialization to catch any circular references or issues
      const testSerialization = JSON.stringify(contentData);
      console.log('[ENHANCED-WORKSHEET-API] Content data serialization successful');
      
      const worksheet: WorksheetResponse = {
        id: generateWorksheetId(),
        title: finalWorksheetData.title,
        content: testSerialization,
        questions: finalWorksheetData.questions || [],
        instructions: finalWorksheetData.instructions,
        answerKey: finalWorksheetData.answerKey || [],
        createdAt: new Date().toISOString(),
        visualElements,
        currentEvents: processedCurrentEvents.map(event => ({
          id: `news_${Date.now()}`,
          title: event.title,
          summary: event.description,
          relevance: `Connects to ${subtopic} concepts`,
          discussionPoints: [`How does this relate to ${subtopic}?`],
          ageAppropriate: true
        })),
        pedagogicalNotes: finalWorksheetData.pedagogicalNotes,
        difficultyProgression: finalWorksheetData.difficultyProgression
      };

      console.log(`[ENHANCED-WORKSHEET-API] Successfully generated worksheet with ${visualElements.length} unique images (${visualElements.filter(v => v.relatedQuestionIds).length} question-specific)`);
      return NextResponse.json(worksheet);
      
    } catch (jsonError) {
      console.error('[ENHANCED-WORKSHEET-API] JSON serialization error:', jsonError);
      console.error('[ENHANCED-WORKSHEET-API] Problematic data:', {
        title: finalWorksheetData.title,
        questionsCount: finalWorksheetData.questions?.length,
        visualElementsCount: visualElements.length
      });
      
      // Return a simplified response if JSON fails
      return NextResponse.json({
        error: 'JSON serialization failed',
        details: jsonError instanceof Error ? jsonError.message : 'Unknown JSON error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[ENHANCED-WORKSHEET-API] Error:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('[ENHANCED-WORKSHEET-API] Error message:', error.message);
      console.error('[ENHANCED-WORKSHEET-API] Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate enhanced worksheet',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
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
