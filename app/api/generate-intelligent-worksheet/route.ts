import { NextRequest, NextResponse } from 'next/server';
import { WorksheetRequest, WorksheetResponse, LearningProfile, PedagogicalFramework, AssessmentCriteria, AdaptiveRecommendation } from '@/types/worksheet';
import { searchAllImages, generateCustomImage, searchRelevantNews } from '@/utils/apiServices';

interface IntelligentWorksheetRequest extends WorksheetRequest {
  intelligentMode: boolean;
  adaptToLearner: boolean;
  generateAssessments: boolean;
  includeRecommendations: boolean;
}

export async function POST(request: NextRequest) {
  try {
    console.log('[INTELLIGENT-WORKSHEET] Starting intelligent generation...');
    
    const body: IntelligentWorksheetRequest = await request.json();
    console.log('[INTELLIGENT-WORKSHEET] Request received:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.topic || !body.gradeLevel) {
      return NextResponse.json(
        { error: 'Topic and grade level are required' },
        { status: 400 }
      );
    }

    // Step 1: Analyze Learning Profile and Generate Adaptive Content Strategy
    const contentStrategy = generateContentStrategy(body.learningProfile, body.gradeLevel);
    console.log('[INTELLIGENT-WORKSHEET] Content strategy:', contentStrategy);

    // Step 2: Create Pedagogical Framework
    const pedagogicalFramework = await generatePedagogicalFramework(body);
    console.log('[INTELLIGENT-WORKSHEET] Pedagogical framework:', pedagogicalFramework);

    // Step 3: Generate Intelligent Prompts
    const intelligentPrompts = createIntelligentPrompts(body, contentStrategy, pedagogicalFramework);
    
    // Step 4: Call OpenAI with Enhanced Pedagogical Intelligence
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: intelligentPrompts.systemPrompt
          },
          {
            role: 'user',
            content: intelligentPrompts.userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const rawWorksheet = JSON.parse(openaiData.choices[0].message.content);

    // Step 5: Enhance with Visual Intelligence
    let visualElements: any[] = [];
    if (body.includeVisuals && contentStrategy.visualIntensity > 0.3) {
      console.log('[INTELLIGENT-WORKSHEET] Generating visual content...');
      try {
        const visualSearchTerms = extractVisualSearchTerms(body.topic, rawWorksheet.questions);
        const primarySearchTerm = visualSearchTerms[0] || body.topic;
        const imageResults = await searchAllImages(primarySearchTerm, 5);
        
        visualElements = imageResults.map((img, index) => ({
          id: `visual-${index}`,
          type: determineVisualType(img, contentStrategy),
          url: img.url,
          description: img.description || `Visual aid for ${body.topic}`,
          source: img.source || 'Generated',
          placement: determineOptimalPlacement(index, contentStrategy),
          relatedQuestionIds: assignToQuestions(rawWorksheet.questions, index)
        }));
      } catch (error) {
        console.error('[INTELLIGENT-WORKSHEET] Visual generation error:', error);
      }
    }

    // Step 6: Generate Assessment Criteria
    const assessmentCriteria = await generateAssessmentCriteria(body, rawWorksheet);

    // Step 7: Create Adaptive Recommendations
    const adaptiveRecommendations = generateAdaptiveRecommendations(body, contentStrategy, rawWorksheet);

    // Step 8: Generate Differentiated Versions
    let differentiatedVersions = {};
    if (body.enableAdaptiveDifferentiation) {
      differentiatedVersions = await generateDifferentiatedVersions(body, rawWorksheet);
    }

    // Step 9: Calculate Learning Analytics
    const learningAnalytics = calculateLearningAnalytics(rawWorksheet, contentStrategy);

    // Step 10: Assemble Intelligent Worksheet Response
    const intelligentWorksheet: WorksheetResponse = {
      id: `intelligent-${Date.now()}`,
      title: rawWorksheet.title,
      content: rawWorksheet.content || '',
      instructions: enhanceInstructions(rawWorksheet.instructions, contentStrategy),
      questions: rawWorksheet.questions,
      answerKey: rawWorksheet.answerKey || [],
      createdAt: new Date().toISOString(),
      visualElements,
      currentEvents: rawWorksheet.currentEvents || [],
      pedagogicalNotes: generatePedagogicalNotes(contentStrategy, pedagogicalFramework),
      difficultyProgression: contentStrategy.progressionType,
      pedagogicalFramework,
      assessmentCriteria,
      adaptiveRecommendations,
      learningAnalytics,
      differentiatedVersions
    };

    console.log('[INTELLIGENT-WORKSHEET] Generation completed successfully');
    return NextResponse.json(intelligentWorksheet);

  } catch (error) {
    console.error('[INTELLIGENT-WORKSHEET] Generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate intelligent worksheet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper Functions for Pedagogical Intelligence

function generateContentStrategy(learningProfile?: LearningProfile, gradeLevel?: string) {
  const strategy = {
    visualIntensity: 0.5,
    interactiveLevel: 0.5,
    textComplexity: 'medium' as 'low' | 'medium' | 'high',
    cognitiveLoad: 'medium' as 'low' | 'medium' | 'high',
    progressionType: 'scaffolded' as 'easy-to-hard' | 'mixed' | 'scaffolded',
    accommodations: [] as string[],
    engagementTechniques: [] as string[]
  };

  if (!learningProfile) return strategy;

  // Adapt based on learning style
  switch (learningProfile.learningStyle) {
    case 'visual':
      strategy.visualIntensity = 0.8;
      strategy.engagementTechniques.push('diagrams', 'color-coding', 'charts');
      break;
    case 'auditory':
      strategy.engagementTechniques.push('discussion-prompts', 'read-aloud-sections');
      break;
    case 'kinesthetic':
      strategy.interactiveLevel = 0.8;
      strategy.engagementTechniques.push('hands-on-activities', 'movement-based-tasks');
      break;
    case 'reading-writing':
      strategy.textComplexity = 'high';
      strategy.engagementTechniques.push('note-taking-spaces', 'writing-prompts');
      break;
  }

  // Adapt based on difficulty level
  switch (learningProfile.difficultyLevel) {
    case 'below-grade':
      strategy.cognitiveLoad = 'low';
      strategy.progressionType = 'easy-to-hard';
      strategy.accommodations.push('simplified-language', 'extra-examples');
      break;
    case 'above-grade':
    case 'gifted':
      strategy.cognitiveLoad = 'high';
      strategy.engagementTechniques.push('extension-activities', 'open-ended-questions');
      break;
  }

  // Special needs accommodations
  if (learningProfile.specialNeeds) {
    switch (learningProfile.specialNeeds) {
      case 'dyslexia':
        strategy.accommodations.push('dyslexia-friendly-font', 'reduced-text-density');
        break;
      case 'adhd':
        strategy.accommodations.push('clear-sections', 'frequent-breaks', 'reduced-distractions');
        break;
      case 'visual-impairment':
        strategy.accommodations.push('high-contrast', 'large-text', 'descriptive-alt-text');
        break;
    }
  }

  // ELL support
  if (learningProfile.englishLanguageLearner) {
    strategy.accommodations.push('vocabulary-support', 'visual-context-clues', 'simplified-syntax');
  }

  return strategy;
}

async function generatePedagogicalFramework(request: IntelligentWorksheetRequest): Promise<PedagogicalFramework> {
  // Default framework based on grade level and topic
  const gradeNum = parseInt(request.gradeLevel) || 5;
  
  return {
    bloomsLevel: gradeNum <= 3 ? 'understand' : gradeNum <= 6 ? 'apply' : 'analyze',
    dokLevel: gradeNum <= 2 ? 1 : gradeNum <= 5 ? 2 : 3,
    multipleIntelligence: determineIntelligenceType(request.topic),
    udlPrinciple: request.learningProfile?.learningStyle === 'visual' ? 'representation' : 
                  request.learningProfile?.learningStyle === 'kinesthetic' ? 'action-expression' : 'engagement',
    cognitiveLoad: request.learningProfile?.difficultyLevel === 'below-grade' ? 'low' : 
                   request.learningProfile?.difficultyLevel === 'above-grade' ? 'high' : 'medium'
  };
}

function createIntelligentPrompts(request: IntelligentWorksheetRequest, strategy: any, framework: PedagogicalFramework) {
  const systemPrompt = `You are an expert educational content creator with deep knowledge of pedagogical best practices, learning science, and differentiated instruction.

PEDAGOGICAL FRAMEWORK:
- Bloom's Level: ${framework.bloomsLevel}
- DOK Level: ${framework.dokLevel}
- Multiple Intelligence: ${framework.multipleIntelligence}
- UDL Principle: ${framework.udlPrinciple}
- Cognitive Load: ${framework.cognitiveLoad}

CONTENT STRATEGY:
- Visual Intensity: ${strategy.visualIntensity}
- Interactive Level: ${strategy.interactiveLevel}
- Text Complexity: ${strategy.textComplexity}
- Progression: ${strategy.progressionType}
- Accommodations: ${strategy.accommodations.join(', ')}
- Engagement Techniques: ${strategy.engagementTechniques.join(', ')}

Create an educational worksheet that demonstrates deep understanding of learning science and implements evidence-based pedagogical practices.`;

  const userPrompt = `Create an intelligent, pedagogically-sound worksheet for:

Topic: ${request.topic}
Subtopic: ${request.subtopic}
Grade Level: ${request.gradeLevel}
Learning Objective: ${request.learningObjective}
Worksheet Type: ${request.worksheetType}

INTELLIGENT REQUIREMENTS:
1. Questions must align with ${framework.bloomsLevel} level of Bloom's taxonomy
2. Implement DOK Level ${framework.dokLevel} depth of knowledge
3. Address ${framework.multipleIntelligence} intelligence type
4. Follow UDL ${framework.udlPrinciple} principle
5. Maintain ${framework.cognitiveLoad} cognitive load

ADAPTIVE FEATURES:
${strategy.accommodations.length > 0 ? `- Include these accommodations: ${strategy.accommodations.join(', ')}` : ''}
${strategy.engagementTechniques.length > 0 ? `- Use these engagement techniques: ${strategy.engagementTechniques.join(', ')}` : ''}

Return a JSON object with the following structure:
{
  "title": "Engaging, descriptive title",
  "instructions": "Clear, age-appropriate instructions with pedagogical notes",
  "questions": [
    {
      "id": "q1",
      "type": "question type",
      "question": "The actual question",
      "options": ["array", "of", "options"] // if multiple choice
      "points": number,
      "bloomsLevel": "${framework.bloomsLevel}",
      "dokLevel": ${framework.dokLevel},
      "hint": "helpful hint if needed"
    }
  ],
  "answerKey": [
    {
      "questionId": "q1",
      "answer": "correct answer",
      "explanation": "why this is correct",
      "pedagogicalReasoning": "teaching strategy explanation"
    }
  ]
}`;

  return { systemPrompt, userPrompt };
}

function determineIntelligenceType(topic: string): PedagogicalFramework['multipleIntelligence'] {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('math') || topicLower.includes('science') || topicLower.includes('logic')) {
    return 'logical-mathematical';
  } else if (topicLower.includes('art') || topicLower.includes('visual') || topicLower.includes('design')) {
    return 'spatial';
  } else if (topicLower.includes('music') || topicLower.includes('rhythm')) {
    return 'musical';
  } else if (topicLower.includes('physical') || topicLower.includes('movement') || topicLower.includes('sports')) {
    return 'bodily-kinesthetic';
  } else if (topicLower.includes('nature') || topicLower.includes('environment') || topicLower.includes('biology')) {
    return 'naturalist';
  } else if (topicLower.includes('social') || topicLower.includes('group') || topicLower.includes('teamwork')) {
    return 'interpersonal';
  } else if (topicLower.includes('reflection') || topicLower.includes('personal') || topicLower.includes('self')) {
    return 'intrapersonal';
  } else {
    return 'linguistic';
  }
}

function extractVisualSearchTerms(topic: string, questions: any[]): string[] {
  const terms = [topic];
  
  // Extract key terms from questions
  questions.forEach(q => {
    const words = q.question.split(' ').filter((word: string) => 
      word.length > 4 && !['what', 'when', 'where', 'which', 'explain', 'describe'].includes(word.toLowerCase())
    );
    terms.push(...words.slice(0, 2));
  });
  
  return terms.slice(0, 5);
}

function determineVisualType(img: any, strategy: any): 'image' | 'diagram' | 'gif' | 'illustration' | 'chart' {
  if (strategy.interactiveLevel > 0.7) return 'gif';
  if (strategy.visualIntensity > 0.8) return 'illustration';
  return 'image';
}

function determineOptimalPlacement(index: number, strategy: any): 'header' | 'inline' | 'sidebar' | 'background' {
  if (index === 0) return 'header';
  if (strategy.visualIntensity > 0.7) return 'inline';
  return 'sidebar';
}

function assignToQuestions(questions: any[], visualIndex: number): string[] {
  if (questions.length === 0) return [];
  const questionIndex = visualIndex % questions.length;
  return [questions[questionIndex]?.id].filter(Boolean);
}

async function generateAssessmentCriteria(request: IntelligentWorksheetRequest, worksheet: any): Promise<AssessmentCriteria> {
  return {
    type: 'formative',
    successCriteria: [
      `Students can demonstrate understanding of ${request.topic}`,
      `Students can apply concepts to new situations`,
      `Students can explain their reasoning clearly`
    ],
    learningObjectives: [request.learningObjective],
    rubric: [
      {
        criterion: 'Understanding',
        levels: [
          { level: 1, description: 'Limited understanding', points: 1 },
          { level: 2, description: 'Basic understanding', points: 2 },
          { level: 3, description: 'Proficient understanding', points: 3 },
          { level: 4, description: 'Advanced understanding', points: 4 }
        ]
      }
    ]
  };
}

function generateAdaptiveRecommendations(request: IntelligentWorksheetRequest, strategy: any, worksheet: any): AdaptiveRecommendation[] {
  const recommendations: AdaptiveRecommendation[] = [];

  // Next steps recommendation
  recommendations.push({
    type: 'next-steps',
    title: `Continue Learning: Advanced ${request.topic}`,
    description: `Based on performance, try these follow-up activities`,
    reasoning: `Students who master this content should be challenged with higher-order thinking tasks`,
    estimatedTime: '15-20 minutes'
  });

  // Prerequisite check
  if (strategy.cognitiveLoad === 'high') {
    recommendations.push({
      type: 'prerequisite',
      title: 'Foundation Check',
      description: 'Ensure students have mastered prerequisite concepts',
      reasoning: 'High cognitive load requires solid foundational knowledge'
    });
  }

  // Extension for gifted learners
  if (request.learningProfile?.difficultyLevel === 'gifted') {
    recommendations.push({
      type: 'extension',
      title: 'Enrichment Activities',
      description: 'Advanced challenges for accelerated learners',
      reasoning: 'Gifted students need intellectual challenge to maintain engagement'
    });
  }

  return recommendations;
}

async function generateDifferentiatedVersions(request: IntelligentWorksheetRequest, baseWorksheet: any) {
  // This would generate simplified and advanced versions
  // For now, return a basic structure
  return {
    belowGrade: {
      instructions: 'Simplified instructions with visual supports',
      questions: baseWorksheet.questions.slice(0, Math.ceil(baseWorksheet.questions.length * 0.7))
    },
    aboveGrade: {
      instructions: 'Enhanced instructions with extension challenges',
      questions: [...baseWorksheet.questions, {
        id: 'extension-1',
        type: 'essay',
        question: `How might the concepts in ${request.topic} apply to real-world scenarios?`,
        points: 10,
        bloomsLevel: 'create'
      }]
    }
  };
}

function calculateLearningAnalytics(worksheet: any, strategy: any): any {
  return {
    estimatedCompletionTime: worksheet.questions.length * 3, // 3 minutes per question
    difficultyRating: strategy.cognitiveLoad === 'low' ? 2 : strategy.cognitiveLoad === 'high' ? 4 : 3,
    engagementLevel: strategy.interactiveLevel > 0.7 ? 'high' : strategy.interactiveLevel > 0.4 ? 'medium' : 'low'
  };
}

function enhanceInstructions(baseInstructions: string, strategy: any): string {
  let enhanced = baseInstructions;
  
  if (strategy.accommodations.includes('simplified-language')) {
    enhanced += '\n\n📝 Take your time and read each question carefully.';
  }
  
  if (strategy.accommodations.includes('frequent-breaks')) {
    enhanced += '\n\n⏰ Remember to take breaks if you need them.';
  }
  
  if (strategy.engagementTechniques.includes('discussion-prompts')) {
    enhanced += '\n\n💬 Discuss your answers with a partner when indicated.';
  }
  
  return enhanced;
}

function generatePedagogicalNotes(strategy: any, framework: PedagogicalFramework): string {
  const notes = [
    `This worksheet targets ${framework.bloomsLevel} level thinking according to Bloom's taxonomy.`,
    `Designed for ${framework.multipleIntelligence} intelligence type.`,
    `Implements ${framework.udlPrinciple} principle of Universal Design for Learning.`
  ];
  
  if (strategy.accommodations.length > 0) {
    notes.push(`Special accommodations included: ${strategy.accommodations.join(', ')}.`);
  }
  
  return notes.join(' ');
}
