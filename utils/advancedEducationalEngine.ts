// Advanced Educational Content Strategy Engine
// Uses GPT-4 to analyze user choices and create comprehensive educational plans

import OpenAI from 'openai';

export interface UserChoiceAnalysis {
  gradeLevel: string;
  topic: string;
  subtopic: string;
  learningObjective: string;
  style: string;
  worksheetType: string;
  // Add any other user selections
}

export interface EducationalStrategy {
  contentType: 'educational_material' | 'assessment' | 'hybrid';
  difficultyLevel: number; // 1-10
  bloomsTaxonomyFocus: string[];
  visualRequirements: VisualRequirement[];
  contentStructure: ContentSection[];
  modernDesignElements: DesignElement[];
}

export interface VisualRequirement {
  type: 'hero_image' | 'diagram' | 'infographic' | 'illustration' | 'chart';
  placement: 'header' | 'section_break' | 'inline' | 'sidebar';
  priority: number;
  detailedPrompt: string; // 250-500 words
  style: 'modern' | 'technical' | 'friendly' | 'professional';
}

export interface ContentSection {
  type: 'intro' | 'educational_content' | 'activity' | 'assessment' | 'summary';
  title: string;
  content: string;
  visualElements: string[];
  pageBreak: boolean;
}

export interface DesignElement {
  type: 'gradient_background' | 'icon_system' | 'color_coding' | 'modern_typography';
  properties: Record<string, any>;
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key required');
  return new OpenAI({ apiKey });
}

// Master strategy analyzer - uses GPT-4 to understand user intent
export async function analyzeUserChoicesAndCreateStrategy(
  userChoices: UserChoiceAnalysis
): Promise<EducationalStrategy> {
  const openai = getOpenAIClient();
  
  const strategyPrompt = `
As an expert educational strategist and curriculum designer, analyze these user choices and create a comprehensive educational strategy:

USER SELECTIONS:
- Grade Level: ${userChoices.gradeLevel}
- Topic: ${userChoices.topic}
- Subtopic: ${userChoices.subtopic}
- Learning Objective: ${userChoices.learningObjective}
- Style: ${userChoices.style}
- Worksheet Type: ${userChoices.worksheetType}

ANALYZE AND DETERMINE:

1. CONTENT TYPE DECISION:
   - Should this be primarily educational material (teaching new concepts)?
   - Should this be assessment-focused (testing knowledge)?
   - Should this be hybrid (teach + assess)?
   
2. MODERN EDUCATIONAL APPROACH:
   - What Bloom's Taxonomy levels are most appropriate?
   - How can we make this compete with TikTok engagement?
   - What modern design elements would appeal to this grade level?
   
3. VISUAL REQUIREMENTS:
   - What specific images/diagrams are needed?
   - How should they be styled for maximum engagement?
   - Where should visual breaks occur for optimal flow?

4. CONTENT STRUCTURE:
   - How should information be chunked for modern attention spans?
   - Where should page breaks occur?
   - What's the optimal learning progression?

IMPORTANT CONSIDERATIONS:
- This should feel like premium educational content, not boring worksheets
- Visual appeal is crucial - think Instagram/TikTok quality
- Content must be grade-appropriate but engaging
- Parents should be able to use this as primary educational material
- Each worksheet should provide real educational value, not just busy work

Respond with a detailed JSON strategy that will guide content and image generation:

{
  "contentType": "educational_material|assessment|hybrid",
  "difficultyLevel": 1-10,
  "bloomsTaxonomyFocus": ["remember", "understand", "apply", "analyze", "evaluate", "create"],
  "visualRequirements": [
    {
      "type": "hero_image",
      "placement": "header",
      "priority": 1,
      "detailedPrompt": "Ultra-detailed 250-500 word prompt for DALL-E",
      "style": "modern"
    }
  ],
  "contentStructure": [
    {
      "type": "intro",
      "title": "Engaging section title",
      "content": "Brief description of what this section should contain",
      "visualElements": ["list of visual elements needed"],
      "pageBreak": false
    }
  ],
  "modernDesignElements": [
    {
      "type": "gradient_background",
      "properties": {"colors": ["#hex1", "#hex2"], "direction": "diagonal"}
    }
  ],
  "engagementStrategy": "How to make this TikTok-level engaging",
  "parentGuidance": "How parents can use this effectively"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational strategist with deep knowledge of modern learning psychology, visual design, and student engagement. Create strategies that rival commercial educational content."
        },
        {
          role: "user",
          content: strategyPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No strategy received');

    return JSON.parse(response);
  } catch (error) {
    console.error('Strategy analysis failed:', error);
    throw error;
  }
}

// Generate ultra-detailed prompts for image generation
export async function generateDetailedImagePrompt(
  visualReq: VisualRequirement,
  educationalContext: string,
  gradeLevel: string,
  topic: string
): Promise<string> {
  const openai = getOpenAIClient();
  
  const promptGenerationRequest = `
Create an ultra-detailed 250-500 word prompt for DALL-E image generation.

CONTEXT:
- Educational Topic: ${topic}
- Grade Level: ${gradeLevel}
- Visual Type: ${visualReq.type}
- Placement: ${visualReq.placement}
- Style: ${visualReq.style}
- Educational Context: ${educationalContext}

REQUIREMENTS:
- 250-500 words of specific visual details
- Modern, TikTok-generation appealing aesthetics
- Educationally appropriate for grade level
- Engaging and professional quality
- Specific color schemes, lighting, composition details
- Clear focus on educational value

AVOID:
- Generic descriptions
- Inappropriate content for school setting
- Outdated design elements
- Boring or sterile appearance

The prompt should result in an image that could compete with professional educational content and appeal to modern students while being classroom-appropriate.

Generate the detailed DALL-E prompt:
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert visual designer specializing in educational content that engages modern students."
        },
        {
          role: "user",
          content: promptGenerationRequest
        }
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No prompt generated');

    return response;
  } catch (error) {
    console.error('Detailed prompt generation failed:', error);
    return visualReq.detailedPrompt; // Fallback to basic prompt
  }
}

// Generate educational content using the strategy
export async function generateEducationalContent(
  strategy: EducationalStrategy,
  userChoices: UserChoiceAnalysis
): Promise<any> {
  const openai = getOpenAIClient();
  
  const contentPrompt = `
Based on this educational strategy, create comprehensive educational content:

STRATEGY: ${JSON.stringify(strategy, null, 2)}

USER CONTEXT:
- Grade Level: ${userChoices.gradeLevel}
- Topic: ${userChoices.topic}
- Subtopic: ${userChoices.subtopic}
- Learning Objective: ${userChoices.learningObjective}

CREATE:
1. EDUCATIONAL CONTENT (if needed):
   - Textbook-quality explanations appropriate for grade level
   - Engaging, modern language that competes with social media
   - Clear learning progression
   - Real-world connections and examples

2. ASSESSMENT QUESTIONS (if needed):
   - Varied question types matching Bloom's taxonomy focus
   - Creative, engaging formats
   - Clear point values and difficulty progression

3. MODERN DESIGN SPECIFICATIONS:
   - Color schemes and visual hierarchy
   - Typography choices for readability and appeal
   - Layout suggestions for maximum engagement

Format as detailed JSON with all content ready for immediate use.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use the latest model for content generation
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator who makes learning materials that rival commercial textbooks and engage modern students."
        },
        {
          role: "user",
          content: contentPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No content generated');

    return JSON.parse(response);
  } catch (error) {
    console.error('Content generation failed:', error);
    throw error;
  }
}
