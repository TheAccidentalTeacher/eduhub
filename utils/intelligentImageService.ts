// Intelligent Image Service - Uses AI logic to choose best image generation approach
import OpenAI from 'openai';

export interface ImageGenerationStrategy {
  method: 'dalle' | 'stability' | 'stock' | 'educational_diagram';
  reasoning: string;
  prompt?: string;
  confidence: number;
}

export interface GeneratedImageResult {
  url: string;
  description: string;
  source: string;
  method: string;
  prompt?: string;
}

// Initialize OpenAI for DALL-E and decision making
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key required');
  return new OpenAI({ apiKey });
}

// Analyze content and decide best image generation strategy
export async function analyzeImageRequirements(
  topic: string, 
  subtopic: string, 
  gradeLevel: string, 
  questionContext?: string
): Promise<ImageGenerationStrategy> {
  const openai = getOpenAIClient();
  
  const analysisPrompt = `
As an AI image strategist for educational content, analyze this worksheet request and determine the BEST image generation approach:

Topic: ${topic}
Subtopic: ${subtopic}
Grade Level: ${gradeLevel}
Question Context: ${questionContext || 'General worksheet illustration'}

Choose the optimal strategy:

1. "dalle" - Use DALL-E 3 for:
   - Creative educational illustrations
   - Safe, child-friendly content
   - Abstract concepts that need visualization
   - Scenarios that don't exist in stock photos

2. "stability" - Use Stability AI for:
   - Highly detailed technical diagrams
   - Scientific illustrations
   - Historical recreations
   - Complex educational graphics

3. "stock" - Use curated stock photos for:
   - Real-world objects/locations
   - People in educational settings
   - Nature/animals
   - Common everyday items

4. "educational_diagram" - Use custom diagram generation for:
   - Charts, graphs, maps
   - Technical drawings
   - Process flows
   - Mathematical illustrations

IMPORTANT CONTENT FILTERING:
- Avoid: weapons, violence, inappropriate content
- If topic involves sensitive content (like firearms), recommend "educational_diagram" or appropriate stock alternatives
- For controversial topics, suggest neutral educational approaches

Respond in JSON format:
{
  "method": "chosen_method",
  "reasoning": "detailed explanation of why this method is best",
  "prompt": "optimized prompt for the chosen method (if applicable)",
  "confidence": 0.85
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in educational content and image generation. Always prioritize child safety and educational value."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No strategy analysis received');

    return JSON.parse(response);
  } catch (error) {
    console.error('Strategy analysis failed:', error);
    // Fallback to conservative approach
    return {
      method: 'stock',
      reasoning: 'Fallback to stock photos due to analysis error',
      confidence: 0.5
    };
  }
}

// DALL-E 3 Image Generation
export async function generateWithDALLE(prompt: string, topic: string): Promise<GeneratedImageResult | null> {
  try {
    const openai = getOpenAIClient();
    
    const enhancedPrompt = `Educational illustration for children: ${prompt}. 
    Style: Clean, colorful, friendly, appropriate for educational materials. 
    Avoid: Any inappropriate content, dark themes, scary elements.
    Focus: Clear, simple, engaging visuals that help learning.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
      n: 1,
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) throw new Error('No image generated');

    return {
      url: imageUrl,
      description: `AI-generated educational illustration: ${prompt}`,
      source: 'DALL-E 3',
      method: 'dalle',
      prompt: enhancedPrompt
    };
  } catch (error) {
    console.error('DALL-E generation failed:', error);
    return null;
  }
}

// Stability AI Image Generation
export async function generateWithStability(prompt: string): Promise<GeneratedImageResult | null> {
  const apiKey = process.env.STABILITY_AI_API_KEY;
  if (!apiKey) return null;

  try {
    const enhancedPrompt = `Educational diagram: ${prompt}, clean illustration style, appropriate for children, educational materials, bright colors, clear details`;

    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text_prompts: [{ text: enhancedPrompt, weight: 1 }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
        style_preset: 'digital-art'
      }),
    });

    if (!response.ok) throw new Error('Stability API error');

    const data = await response.json();
    const imageData = data.artifacts?.[0]?.base64;
    if (!imageData) throw new Error('No image data received');

    return {
      url: `data:image/png;base64,${imageData}`,
      description: `AI-generated educational diagram: ${prompt}`,
      source: 'Stability AI',
      method: 'stability',
      prompt: enhancedPrompt
    };
  } catch (error) {
    console.error('Stability AI generation failed:', error);
    return null;
  }
}

// Educational Diagram Generator (using simple graphics)
export async function generateEducationalDiagram(topic: string, subtopic: string): Promise<GeneratedImageResult | null> {
  // For sensitive topics, create simple educational diagrams
  const diagramTypes: { [key: string]: string } = {
    'firearm': 'https://via.placeholder.com/800x600/f0f8ff/2c3e50?text=Educational+Diagram%3A+Types+and+Safety',
    'weapon': 'https://via.placeholder.com/800x600/f0f8ff/2c3e50?text=Educational+Safety+Information',
    'history': 'https://via.placeholder.com/800x600/fff5ee/8b4513?text=Historical+Timeline+Diagram',
    'science': 'https://via.placeholder.com/800x600/f0fff0/228b22?text=Scientific+Process+Diagram',
    'math': 'https://via.placeholder.com/800x600/fffaf0/ff8c00?text=Mathematical+Concept+Chart'
  };

  const topicLower = `${topic} ${subtopic}`.toLowerCase();
  
  for (const [key, url] of Object.entries(diagramTypes)) {
    if (topicLower.includes(key)) {
      return {
        url,
        description: `Educational diagram for ${subtopic}`,
        source: 'Educational Generator',
        method: 'educational_diagram'
      };
    }
  }

  return null;
}

// Main intelligent image generation function
export async function generateIntelligentImage(
  topic: string,
  subtopic: string,
  gradeLevel: string,
  questionContext?: string
): Promise<GeneratedImageResult | null> {
  try {
    // Step 1: Analyze and choose strategy
    const strategy = await analyzeImageRequirements(topic, subtopic, gradeLevel, questionContext);
    
    console.log(`[INTELLIGENT-IMAGE] Strategy: ${strategy.method} (${strategy.confidence}) - ${strategy.reasoning}`);

    // Step 2: Execute based on strategy
    switch (strategy.method) {
      case 'dalle':
        if (strategy.prompt) {
          return await generateWithDALLE(strategy.prompt, topic);
        }
        break;
        
      case 'stability':
        if (strategy.prompt) {
          return await generateWithStability(strategy.prompt);
        }
        break;
        
      case 'educational_diagram':
        return await generateEducationalDiagram(topic, subtopic);
        
      case 'stock':
      default:
        // Fall back to existing stock photo system
        return null; // Let existing system handle this
    }

    return null;
  } catch (error) {
    console.error('Intelligent image generation failed:', error);
    return null;
  }
}
