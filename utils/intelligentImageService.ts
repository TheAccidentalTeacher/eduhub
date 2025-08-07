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
export async function generateWithDALLE(prompt: string, topic: string, uniqueId?: string): Promise<GeneratedImageResult | null> {
  try {
    const openai = getOpenAIClient();
    
    // Add variety and uniqueness to prevent identical images
    const variations = [
      'vibrant and colorful',
      'clear and detailed',
      'bright and engaging',
      'professional yet friendly',
      'modern educational style'
    ];
    
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    const uniqueStyleNote = uniqueId ? ` (Unique variant: ${Math.random().toString(36).substr(2, 5)})` : '';
    
    const enhancedPrompt = `Educational illustration for children: ${prompt}. 
    Style: ${randomVariation}, clean, appropriate for educational materials${uniqueStyleNote}. 
    Avoid: Any inappropriate content, dark themes, scary elements, stock photo look.
    Focus: Clear, simple, engaging visuals that help learning.
    Make this unique and distinctive from other educational illustrations.`;

    console.log(`[DALL-E] Generating with unique prompt (${uniqueId}): ${enhancedPrompt.substring(0, 100)}...`);

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
      description: `AI-generated educational illustration: ${prompt} (ID: ${uniqueId})`,
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
export async function generateWithStability(prompt: string, uniqueId?: string): Promise<GeneratedImageResult | null> {
  const apiKey = process.env.STABILITY_AI_API_KEY;
  if (!apiKey) return null;

  try {
    const uniqueStyleNote = uniqueId ? `, unique variant ${Math.random().toString(36).substr(2, 5)}` : '';
    const enhancedPrompt = `Educational diagram: ${prompt}, clean illustration style, appropriate for children, educational materials, bright colors, clear details${uniqueStyleNote}`;

    console.log(`[STABILITY] Generating with unique prompt (${uniqueId}): ${enhancedPrompt.substring(0, 100)}...`);

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
      description: `AI-generated educational diagram: ${prompt} (ID: ${uniqueId})`,
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
export async function generateEducationalDiagram(topic: string, subtopic: string, uniqueId?: string): Promise<GeneratedImageResult | null> {
  // For sensitive topics, create simple educational diagrams with unique elements
  const randomColor = ['f0f8ff', 'fff5ee', 'f0fff0', 'fffaf0', 'f5f5dc'][Math.floor(Math.random() * 5)];
  const randomTextColor = ['2c3e50', '8b4513', '228b22', 'ff8c00', '4b0082'][Math.floor(Math.random() * 5)];
  const uniqueParam = uniqueId ? `+${Math.random().toString(36).substr(2, 5)}` : '';
  
  const diagramTypes: { [key: string]: string } = {
    'firearm': `https://via.placeholder.com/800x600/${randomColor}/${randomTextColor}?text=Educational+Diagram%3A+Types+and+Safety${uniqueParam}`,
    'weapon': `https://via.placeholder.com/800x600/${randomColor}/${randomTextColor}?text=Educational+Safety+Information${uniqueParam}`,
    'history': `https://via.placeholder.com/800x600/${randomColor}/${randomTextColor}?text=Historical+Timeline+Diagram${uniqueParam}`,
    'science': `https://via.placeholder.com/800x600/${randomColor}/${randomTextColor}?text=Scientific+Process+Diagram${uniqueParam}`,
    'math': `https://via.placeholder.com/800x600/${randomColor}/${randomTextColor}?text=Mathematical+Concept+Chart${uniqueParam}`
  };

  console.log(`[DIAGRAM] Generating educational diagram (${uniqueId}) for: ${topic}/${subtopic}`);

  const topicLower = `${topic} ${subtopic}`.toLowerCase();
  
  for (const [key, url] of Object.entries(diagramTypes)) {
    if (topicLower.includes(key)) {
      return {
        url,
        description: `Educational diagram for ${subtopic} (ID: ${uniqueId})`,
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
    // Add unique timestamp and random seed to ensure truly unique generations
    const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9);
    const contextWithUniqueness = `${questionContext || 'Educational illustration'} [Unique ID: ${uniqueId}]`;
    
    console.log(`[INTELLIGENT-IMAGE] Generating unique image for: ${topic}/${subtopic} - ID: ${uniqueId}`);
    
    // Step 1: Analyze and choose strategy
    const strategy = await analyzeImageRequirements(topic, subtopic, gradeLevel, contextWithUniqueness);
    
    console.log(`[INTELLIGENT-IMAGE] Strategy: ${strategy.method} (${strategy.confidence}) - ${strategy.reasoning}`);

    // Step 2: Execute based on strategy with uniqueness
    switch (strategy.method) {
      case 'dalle':
        if (strategy.prompt) {
          return await generateWithDALLE(strategy.prompt, topic, uniqueId);
        }
        break;
        
      case 'stability':
        if (strategy.prompt) {
          return await generateWithStability(strategy.prompt, uniqueId);
        }
        break;
        
      case 'educational_diagram':
        return await generateEducationalDiagram(topic, subtopic, uniqueId);
        
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
