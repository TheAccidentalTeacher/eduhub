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
  ageAppropriateVocabulary?: string[]; // Vocabulary appropriate for the grade level
  avoidComplexity?: string[]; // Concepts to avoid as too advanced
  visualRequirements: VisualRequirement[];
  contentStructure: ContentSection[];
  modernDesignElements: DesignElement[];
  gradeLevelNotes?: string; // Specific notes about grade-level appropriateness
  parentGuidance?: string; // How parents can use this effectively
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
  
  // Enhanced grade-level specific guidance
  const gradeGuidance = getGradeLevelGuidance(userChoices.gradeLevel);
  
  const strategyPrompt = `
You are an expert elementary/middle/high school teacher with 20+ years of experience. You MUST create age-appropriate content.

USER SELECTIONS:
- Grade Level: ${userChoices.gradeLevel} 
- Topic: ${userChoices.topic}
- Subtopic: ${userChoices.subtopic}
- Learning Objective: ${userChoices.learningObjective}
- Style: ${userChoices.style}
- Worksheet Type: ${userChoices.worksheetType}

CRITICAL GRADE-LEVEL REQUIREMENTS:
${gradeGuidance}

ABSOLUTELY ESSENTIAL - GRADE APPROPRIATENESS:
${userChoices.gradeLevel} students should NEVER see:
- Complex vocabulary beyond their reading level
- Abstract concepts they can't understand
- Multi-step reasoning beyond their cognitive development
- Academic language without simple explanations

${userChoices.gradeLevel} students SHOULD see:
- Simple, concrete examples they can relate to
- Visual aids that help understanding
- Step-by-step explanations
- Real-world connections to their daily life

FOR THIS SPECIFIC TOPIC (${userChoices.subtopic}):
- How would you explain this to a ${userChoices.gradeLevel} student?
- What concrete examples from their world would help?
- What vocabulary is appropriate for their reading level?
- How can we make this hands-on and engaging?

ANALYZE AND DETERMINE:

1. CONTENT TYPE DECISION:
   - Should this be primarily educational material (teaching new concepts)?
   - Should this be assessment-focused (testing knowledge)?
   - Should this be hybrid (teach + assess)?
   
2. GRADE-APPROPRIATE EDUCATIONAL APPROACH:
   - What specific Bloom's Taxonomy levels match ${userChoices.gradeLevel} cognitive development?
   - How can we make this compete with TikTok engagement while being educationally sound?
   - What modern design elements would appeal to this exact age group?
   
3. VISUAL REQUIREMENTS:
   - What specific images/diagrams would help ${userChoices.gradeLevel} students understand?
   - How should visuals be styled for maximum comprehension at this age?
   - Where should visual breaks occur for optimal attention spans?

4. CONTENT STRUCTURE:
   - How should information be chunked for ${userChoices.gradeLevel} attention spans?
   - What's the optimal learning progression for this age group?
   - How many concepts can they handle at once?

QUALITY CONTROL:
- Would a typical ${userChoices.gradeLevel} student understand every word?
- Are the questions at the right cognitive level?
- Would this engage modern kids while teaching effectively?
- Can parents use this as quality educational material?

Respond with a detailed JSON strategy that prioritizes AGE-APPROPRIATENESS above all else:

{
  "contentType": "educational_material|assessment|hybrid",
  "difficultyLevel": 1-10,
  "bloomsTaxonomyFocus": ["remember", "understand", "apply", "analyze", "evaluate", "create"],
  "ageAppropriateVocabulary": ["list of appropriate words and concepts"],
  "avoidComplexity": ["list of concepts too advanced for this grade"],
  "visualRequirements": [
    {
      "type": "hero_image|diagram|infographic|illustration|chart",
      "placement": "header|section_break|inline|sidebar",
      "priority": 1-5,
      "detailedPrompt": "Ultra-detailed 250-500 word prompt for DALL-E, age-appropriate style",
      "style": "child-friendly|educational|colorful|simple"
    }
  ],
  "contentStructure": [
    {
      "type": "intro|educational_content|activity|assessment|summary",
      "title": "Age-appropriate section title",
      "content": "Description emphasizing grade-level appropriateness",
      "visualElements": ["specific visual aids needed for this age"],
      "pageBreak": false
    }
  ],
  "modernDesignElements": [
    {
      "type": "gradient_background|icon_system|color_coding|modern_typography",
      "properties": {"colors": ["age-appropriate color schemes"], "style": "child-friendly"}
    }
  ],
  "gradeLevelNotes": "Specific notes about making this perfect for ${userChoices.gradeLevel}",
  "parentGuidance": "How parents can use this effectively with ${userChoices.gradeLevel} children"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert teacher specializing in ${userChoices.gradeLevel} education. Your #1 priority is age-appropriateness. You have deep knowledge of child development, reading levels, and cognitive abilities for each grade. NEVER create content above the student's developmental level.`
        },
        {
          role: "user",
          content: strategyPrompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent, appropriate content
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No strategy received');

    return JSON.parse(response);
  } catch (error) {
    console.error('Strategy analysis failed:', error);
    // Fallback with grade-appropriate defaults
    return createGradeAppropriateDefaults(userChoices);
  }
}

// Grade-level specific guidance
function getGradeLevelGuidance(gradeLevel: string): string {
  const grade = parseInt(gradeLevel.match(/\d+/)?.[0] || '5');
  
  if (grade <= 3) {
    return `
GRADES K-3 REQUIREMENTS:
- Reading Level: Simple sentences, 1-2 syllable words, sight words
- Vocabulary: Concrete nouns and action verbs they know
- Concepts: Basic cause and effect, simple patterns, familiar experiences
- Attention Span: 5-10 minutes max per activity
- Examples: Use toys, animals, family, playground, food they know
- Questions: Yes/no, simple choice, one-step thinking
- Visual: Lots of pictures, bright colors, cartoon-style
ABSOLUTELY NO: Abstract thinking, complex vocabulary, multi-step reasoning`;
  } else if (grade <= 5) {
    return `
GRADES 4-5 REQUIREMENTS:
- Reading Level: Short paragraphs, 2-3 syllable words, descriptive language
- Vocabulary: Can handle some new words with context clues
- Concepts: Simple cause/effect chains, basic categorization, concrete examples
- Attention Span: 10-15 minutes per activity  
- Examples: School, sports, popular culture, technology they use
- Questions: Simple compare/contrast, basic "why" questions, 2-step thinking
- Visual: Detailed illustrations, infographics, real photos
AVOID: Complex abstract concepts, advanced academic vocabulary`;
  } else if (grade <= 8) {
    return `
GRADES 6-8 REQUIREMENTS:
- Reading Level: Multi-paragraph text, some complex sentences
- Vocabulary: Can learn new academic terms with good explanations
- Concepts: Abstract thinking emerging, can handle hypotheticals
- Attention Span: 15-20 minutes per activity
- Examples: Pop culture, social issues, future planning, identity topics
- Questions: Analysis, comparison, basic evaluation, "what if" scenarios
- Visual: Modern graphics, charts, real-world images
CAN HANDLE: Some complexity but still need scaffolding and clear examples`;
  } else {
    return `
GRADES 9-12 REQUIREMENTS:
- Reading Level: Complex texts, academic vocabulary expected
- Vocabulary: Can handle discipline-specific terminology
- Concepts: Abstract thinking, complex analysis, synthesis
- Attention Span: 20-30+ minutes per activity
- Examples: Current events, career preparation, college readiness
- Questions: Critical thinking, evaluation, creation, synthesis
- Visual: Professional graphics, data visualization, technical diagrams
CAN HANDLE: Complex concepts with proper support and real-world relevance`;
  }
}

// Fallback defaults that are always grade-appropriate
function createGradeAppropriateDefaults(userChoices: UserChoiceAnalysis): EducationalStrategy {
  const grade = parseInt(userChoices.gradeLevel.match(/\d+/)?.[0] || '5');
  
  return {
    contentType: grade <= 3 ? 'educational_material' : 'hybrid',
    difficultyLevel: Math.min(grade + 1, 10),
    bloomsTaxonomyFocus: grade <= 3 ? ['remember', 'understand'] : 
                        grade <= 5 ? ['remember', 'understand', 'apply'] :
                        grade <= 8 ? ['understand', 'apply', 'analyze'] :
                        ['apply', 'analyze', 'evaluate'],
    visualRequirements: [{
      type: 'illustration',
      placement: 'header',
      priority: 1,
      detailedPrompt: `Child-friendly illustration of ${userChoices.subtopic} appropriate for ${userChoices.gradeLevel}`,
      style: 'friendly'
    }],
    contentStructure: [{
      type: 'educational_content',
      title: userChoices.subtopic,
      content: `Grade-appropriate introduction to ${userChoices.subtopic}`,
      visualElements: ['simple diagrams'],
      pageBreak: false
    }],
    modernDesignElements: [{
      type: 'color_coding',
      properties: { style: 'child-friendly', colors: ['bright', 'engaging'] }
    }]
  };
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
  
  // Get grade-specific content guidelines
  const gradeGuidelines = getContentGuidelines(userChoices.gradeLevel);
  
  const contentPrompt = `
You are creating educational content for ${userChoices.gradeLevel} students. AGE-APPROPRIATENESS IS CRITICAL.

STRATEGY: ${JSON.stringify(strategy, null, 2)}

USER CONTEXT:
- Grade Level: ${userChoices.gradeLevel}
- Topic: ${userChoices.topic}
- Subtopic: ${userChoices.subtopic}
- Learning Objective: ${userChoices.learningObjective}

CRITICAL GRADE-LEVEL GUIDELINES:
${gradeGuidelines}

MANDATORY REQUIREMENTS:

1. VOCABULARY CHECK:
   - Every single word must be appropriate for ${userChoices.gradeLevel}
   - No academic jargon without simple definitions
   - Use words a typical ${userChoices.gradeLevel} student knows
   - If you use a new word, define it immediately in simple terms

2. CONCEPT COMPLEXITY:
   - Match the cognitive development level of ${userChoices.gradeLevel}
   - Break complex ideas into simple, digestible parts
   - Use concrete examples from their daily life
   - Avoid abstract thinking beyond their development stage

3. QUESTION DIFFICULTY:
   - Questions must match the developmental stage
   - Start with easy questions to build confidence
   - Gradually increase difficulty within grade-appropriate limits
   - Include visual cues and hints for younger grades

4. ENGAGEMENT STRATEGIES:
   - Use examples from their world (popular culture, toys, school, family)
   - Include interactive elements appropriate for their attention span
   - Make it visually appealing for their age group
   - Connect to their interests and experiences

FORBIDDEN FOR ${userChoices.gradeLevel}:
${strategy.avoidComplexity ? strategy.avoidComplexity.join(', ') : 'Complex abstract concepts'}

REQUIRED VOCABULARY LEVEL:
${strategy.ageAppropriateVocabulary ? strategy.ageAppropriateVocabulary.join(', ') : 'Age-appropriate words only'}

CREATE CONTENT THAT:

1. EDUCATIONAL CONTENT (if strategy includes):
   - Textbook-quality explanations but at perfect grade level
   - Engaging, modern language that feels like talking to the student
   - Clear learning progression from simple to more complex (within grade limits)
   - Real-world connections they can actually understand and relate to
   - Visual descriptions that support comprehension

2. ASSESSMENT QUESTIONS (if strategy includes):
   - Questions that test understanding without being overwhelming
   - Multiple choice options that are all reasonable for the grade level
   - Clear, simple question stems without confusing language
   - Activities that feel fun, not like tests
   - Gradual difficulty progression within developmental limits

3. MODERN DESIGN SPECIFICATIONS:
   - Color schemes that appeal to this specific age group
   - Typography that supports their reading level
   - Layout that matches their attention span and visual processing
   - Age-appropriate visual elements and icons

QUALITY ASSURANCE CHECKLIST:
- Would a typical ${userChoices.gradeLevel} student understand every word?
- Are the questions at the right cognitive level for their development?
- Would this engage kids this age while teaching effectively?
- Can parents confidently use this with their ${userChoices.gradeLevel} child?
- Does this respect their intelligence while being age-appropriate?

Format as detailed JSON with all content ready for immediate use. Include a gradeAppropriatenessCheck section explaining why this content is perfect for ${userChoices.gradeLevel}.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use the latest model for content generation
      messages: [
        {
          role: "system",
          content: `You are an expert ${userChoices.gradeLevel} teacher with deep knowledge of child development and age-appropriate education. You create content that is perfectly matched to students' developmental stage - never too advanced, never condescending. Your content engages modern students while being educationally sound.`
        },
        {
          role: "user",
          content: contentPrompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent, appropriate content
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

// Grade-specific content guidelines
function getContentGuidelines(gradeLevel: string): string {
  const grade = parseInt(gradeLevel.match(/\d+/)?.[0] || '5');
  
  if (grade <= 3) {
    return `
GRADES K-3 CONTENT GUIDELINES:
- Reading Level: Use simple sentences (5-8 words), familiar sight words, basic phonics patterns
- Vocabulary: Only words they use in daily conversation, concrete nouns and action verbs
- Concepts: Focus on "what" and "where", basic cause and effect with obvious connections
- Sentence Structure: Subject-verb-object, no complex clauses or abstract concepts
- Examples: Family, pets, toys, playground, favorite foods, daily routines
- Questions: Yes/no, simple choice between 2 options, one-step thinking only
- Attention: 5-10 minutes maximum, frequent visual breaks
- Cognitive Level: Concrete operational thinking only, no abstract reasoning
- Emotional Level: Positive, encouraging, builds confidence`;
  } else if (grade <= 5) {
    return `
GRADES 4-5 CONTENT GUIDELINES:
- Reading Level: 2-3 sentence paragraphs, up to 10 words per sentence, some descriptive language
- Vocabulary: Can introduce 1-2 new words per section with immediate definitions
- Concepts: Simple cause/effect chains (if X then Y), basic categorization, concrete comparisons
- Sentence Structure: Can handle some complex sentences with connecting words (because, so, but)
- Examples: School subjects, sports, video games, popular movies/shows, future goals
- Questions: Simple compare/contrast, basic "why" questions, 2-step problem solving
- Attention: 10-15 minutes per section, need variety in activities
- Cognitive Level: Transitioning to abstract thinking but still need concrete examples
- Emotional Level: Building independence, can handle mild challenges`;
  } else if (grade <= 8) {
    return `
GRADES 6-8 CONTENT GUIDELINES:
- Reading Level: Multi-paragraph text, complex sentences, some academic vocabulary
- Vocabulary: Can learn subject-specific terms with good context and explanations
- Concepts: Abstract thinking emerging, can handle hypothetical situations, multiple perspectives
- Sentence Structure: Complex sentences, varied paragraph structure, transitional phrases
- Examples: Social issues, identity topics, future planning, technology, pop culture
- Questions: Analysis questions, comparison, evaluation, "what if" scenarios
- Attention: 15-20 minutes per activity, can sustain longer focus with engaging content
- Cognitive Level: Formal operational thinking beginning, can handle some abstraction
- Emotional Level: Identity formation, peer influence important, want to be treated maturely`;
  } else {
    return `
GRADES 9-12 CONTENT GUIDELINES:
- Reading Level: Complex academic texts, discipline-specific vocabulary expected
- Vocabulary: Can handle technical terms and academic language with support
- Concepts: Abstract thinking, complex analysis, synthesis of multiple ideas
- Sentence Structure: Sophisticated writing, academic discourse, nuanced expression
- Examples: Current events, career preparation, college readiness, real-world applications
- Questions: Critical thinking, evaluation, creation, synthesis, argumentation
- Attention: 20-30+ minutes per activity, can handle sustained intellectual effort
- Cognitive Level: Full formal operational thinking, abstract reasoning
- Emotional Level: Future-oriented, desire for autonomy and real-world relevance`;
  }
}
