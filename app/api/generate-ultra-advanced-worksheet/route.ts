import { NextRequest, NextResponse } from 'next/server';
import { WorksheetRequest, WorksheetResponse, VisualElement } from '@/types/worksheet';
import { searchRelevantNews } from '@/utils/apiServices';
import { generateIntelligentImage } from '@/utils/intelligentImageService';
import { 
  analyzeUserChoicesAndCreateStrategy,
  generateDetailedImagePrompt,
  generateEducationalContent,
  type UserChoiceAnalysis
} from '@/utils/advancedEducationalEngine';

function generateWorksheetId(): string {
  return `advanced_worksheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Ultra-Advanced Worksheet API - TikTok-level engagement
export async function POST(request: NextRequest) {
  console.log('[ULTRA-ADVANCED-API] Starting next-gen educational content generation...');
  
  try {
    const body: WorksheetRequest = await request.json();
    const { topic, subtopic, gradeLevel, learningObjective, style, worksheetType } = body;

    // Validate required fields
    if (!topic || !subtopic || !gradeLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('[ULTRA-ADVANCED-API] 🧠 Analyzing user choices with GPT-4...');

    // Step 1: Deep analysis of user choices to create educational strategy
    const userChoices: UserChoiceAnalysis = {
      gradeLevel,
      topic,
      subtopic,
      learningObjective,
      style,
      worksheetType: worksheetType || 'standard'
    };

    const educationalStrategy = await analyzeUserChoicesAndCreateStrategy(userChoices);
    console.log(`[ULTRA-ADVANCED-API] 📋 Strategy: ${educationalStrategy.contentType} (Confidence: ${educationalStrategy.difficultyLevel}/10)`);

    // Step 2: Generate ultra-detailed prompts for each visual element
    console.log('[ULTRA-ADVANCED-API] 🎨 Creating detailed image generation prompts...');
    const visualPromises = educationalStrategy.visualRequirements?.map(async (visualReq) => {
      try {
        const detailedPrompt = await generateDetailedImagePrompt(
          visualReq,
          `${topic}: ${subtopic} for ${gradeLevel} students`,
          gradeLevel,
          topic
        );
        
        console.log(`[ULTRA-ADVANCED-API] 🖼️ Generated ${visualReq.type} prompt: ${detailedPrompt.substring(0, 100)}...`);
        
        return await generateIntelligentImage(topic, subtopic, gradeLevel, detailedPrompt);
      } catch (error) {
        console.error(`[ULTRA-ADVANCED-API] Visual generation failed for ${visualReq.type}:`, error);
        return null;
      }
    }) || [];

    // Step 3: Generate comprehensive educational content
    console.log('[ULTRA-ADVANCED-API] 📚 Generating educational content with GPT-4...');
    const comprehensiveContent = await generateEducationalContent(educationalStrategy, userChoices);

    // Step 4: Execute all generation tasks in parallel
    console.log('[ULTRA-ADVANCED-API] ⚡ Executing parallel content generation...');
    const [generatedImages, currentEvents] = await Promise.allSettled([
      Promise.all(visualPromises),
      searchRelevantNews(topic, 2)
    ]);

    // Step 5: Process and prioritize visual elements
    const visualElements: VisualElement[] = [];
    
    if (generatedImages.status === 'fulfilled') {
      generatedImages.value.forEach((img, index) => {
        if (img) {
          const visualReq = educationalStrategy.visualRequirements?.[index];
          if (visualReq) {
            visualElements.push({
              id: `ultra_visual_${index}`,
              type: visualReq.type as any,
              url: img.url,
              description: img.description,
              source: `${img.source} (AI-Enhanced)`,
              placement: visualReq.placement as any
            });
            console.log(`[ULTRA-ADVANCED-API] ✅ Added ${visualReq.type} visual (${img.method})`);
          }
        }
      });
    }

    // Sort visuals by type priority (diagrams first, then illustrations, etc.)
    visualElements.sort((a, b) => {
      const typePriority: {[key: string]: number} = { 
        'diagram': 3, 'illustration': 2, 'image': 1, 'gif': 0, 'chart': 2 
      };
      return (typePriority[b.type] || 0) - (typePriority[a.type] || 0);
    });

    // Process current events for real-world connections
    let processedCurrentEvents: any[] = [];
    if (currentEvents.status === 'fulfilled') {
      processedCurrentEvents = currentEvents.value.slice(0, 2).map(event => ({
        id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title: event.title,
        summary: event.description,
        relevance: `Real-world application of ${subtopic} concepts`,
        discussionPoints: [
          `How does this connect to ${subtopic}?`,
          `What can we learn from this example?`,
          `How might this apply to your life?`
        ],
        ageAppropriate: true
      }));
    }

    // Step 6: Create the ultra-advanced worksheet response
    const worksheet: WorksheetResponse = {
      id: generateWorksheetId(),
      title: comprehensiveContent.title || `${subtopic}: Interactive Learning Experience`,
      content: JSON.stringify(comprehensiveContent),
      questions: comprehensiveContent.questions || [],
      instructions: comprehensiveContent.instructions || 
        `Welcome to your personalized ${subtopic} learning experience! This ${educationalStrategy.contentType} has been specially designed for ${gradeLevel} students.`,
      answerKey: comprehensiveContent.answerKey || [],
      createdAt: new Date().toISOString(),
      visualElements,
      activities: [], // Enhanced activities coming in future updates
      currentEvents: processedCurrentEvents,
      pedagogicalNotes: comprehensiveContent.teacherNotes || 
        `This worksheet uses advanced AI to adapt content for optimal ${gradeLevel} learning.`,
      difficultyProgression: comprehensiveContent.difficultyProgression || 'intelligently-scaffolded'
    };

    console.log('[ULTRA-ADVANCED-API] 🎉 Ultra-advanced worksheet generated successfully!');
    
    // Return enhanced response with metadata for modern rendering
    return NextResponse.json({
      ...worksheet,
      // Metadata for modern rendering
      metadata: {
        strategy: educationalStrategy,
        gradeLevel,
        topic,
        generationMethod: 'ultra-advanced-ai',
        engagementLevel: 'tiktok-competitive',
        visualCount: visualElements.length,
        contentQuality: 'textbook-grade'
      }
    });

  } catch (error) {
    console.error('[ULTRA-ADVANCED-API] Critical error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate ultra-advanced worksheet',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Try again with different parameters or contact support'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
