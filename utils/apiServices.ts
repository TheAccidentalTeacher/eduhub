// External API service integrations for enhanced worksheets

export interface ImageResult {
  url: string;
  description: string;
  source: 'pexels' | 'pixabay' | 'unsplash' | 'ai-generated';
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

// Pexels API integration
export async function searchPexelsImages(query: string, count: number = 3): Promise<ImageResult[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`, {
      headers: {
        'Authorization': apiKey
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.photos?.map((photo: any) => ({
      url: photo.src.medium,
      description: photo.alt || query,
      source: 'pexels' as const
    })) || [];
  } catch (error) {
    console.error('Pexels API error:', error);
    return [];
  }
}

// Pixabay API integration
export async function searchPixabayImages(query: string, count: number = 3): Promise<ImageResult[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=${count}&safesearch=true`);

    if (!response.ok) return [];

    const data = await response.json();
    return data.hits?.map((hit: any) => ({
      url: hit.webformatURL,
      description: hit.tags || query,
      source: 'pixabay' as const
    })) || [];
  } catch (error) {
    console.error('Pixabay API error:', error);
    return [];
  }
}

// Unsplash API integration
export async function searchUnsplashImages(query: string, count: number = 3): Promise<ImageResult[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [];

  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&content_filter=high`, {
      headers: {
        'Authorization': `Client-ID ${accessKey}`
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.results?.map((result: any) => ({
      url: result.urls.regular,
      description: result.alt_description || query,
      source: 'unsplash' as const
    })) || [];
  } catch (error) {
    console.error('Unsplash API error:', error);
    return [];
  }
}

// News API integration for current events
export async function searchRelevantNews(topic: string, count: number = 2): Promise<NewsItem[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&sortBy=relevancy&pageSize=${count}&language=en`, {
      headers: {
        'X-API-Key': apiKey
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.articles?.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt
    })) || [];
  } catch (error) {
    console.error('News API error:', error);
    return [];
  }
}

// Replicate API for diverse image generation
export async function generateReplicateImage(prompt: string): Promise<GeneratedImage | null> {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // SDXL
        input: {
          prompt: `Educational illustration for children: ${prompt}, bright colors, simple style, child-friendly, cartoon illustration`,
          negative_prompt: "violent, scary, inappropriate, dark, complex",
          width: 768,
          height: 768,
          num_inference_steps: 25,
          guidance_scale: 7
        }
      }),
    });

    if (!response.ok) return null;

    const prediction = await response.json();
    
    // Poll for completion (simplified - in production you'd want webhooks)
    let result = prediction;
    let attempts = 0;
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${apiKey}` }
      });
      result = await pollResponse.json();
      attempts++;
    }

    if (result.status === 'succeeded' && result.output && result.output[0]) {
      return {
        url: result.output[0],
        prompt
      };
    }
    
    return null;
  } catch (error) {
    console.error('Replicate API error:', error);
    return null;
  }
}

// HuggingFace API for additional image diversity
export async function generateHuggingFaceImage(prompt: string): Promise<GeneratedImage | null> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `Educational children's illustration: ${prompt}, colorful, simple, cartoon style, child-friendly`,
          parameters: {
            negative_prompt: "violent, scary, inappropriate, dark, complex, realistic",
            num_inference_steps: 20,
            guidance_scale: 7
          }
        }),
      }
    );

    if (!response.ok) return null;

    const blob = await response.blob();
    if (blob.size === 0) return null;

    // Convert blob to base64
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    return {
      url: `data:image/jpeg;base64,${base64}`,
      prompt
    };
  } catch (error) {
    console.error('HuggingFace API error:', error);
    return null;
  }
}

// Stability AI image generation
export async function generateCustomImage(prompt: string): Promise<GeneratedImage | null> {
  const apiKey = process.env.STABILITY_AI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: `Educational illustration for children: ${prompt}, simple, colorful, child-friendly, cartoon style`,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 512,
        width: 512,
        steps: 20,
        samples: 1,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.artifacts && data.artifacts[0]) {
      // Convert base64 to data URL
      const imageData = `data:image/png;base64,${data.artifacts[0].base64}`;
      return {
        url: imageData,
        prompt
      };
    }
    return null;
  } catch (error) {
    console.error('Stability AI error:', error);
    return null;
  }
}

// YouTube API integration for educational videos
export async function searchEducationalVideos(topic: string, gradeLevel: string, count: number = 2): Promise<any[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  try {
    const query = `${topic} education ${gradeLevel} kids learning`;
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=short&videoDefinition=high&maxResults=${count}&key=${apiKey}`);

    if (!response.ok) return [];

    const data = await response.json();
    return data.items?.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    })) || [];
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

// GIPHY API for educational GIFs
export async function searchEducationalGifs(topic: string, count: number = 2): Promise<any[]> {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) return [];

  try {
    const query = `${topic} education learning school`;
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=${count}&rating=g`);

    if (!response.ok) return [];

    const data = await response.json();
    return data.data?.map((gif: any) => ({
      id: gif.id,
      title: gif.title,
      url: gif.images.fixed_height.url,
      webp: gif.images.fixed_height.webp
    })) || [];
  } catch (error) {
    console.error('GIPHY API error:', error);
    return [];
  }
}

// Enhanced fallback images for educational content - DIVERSITY FOCUSED
let usedFallbackImages: Set<string> = new Set(); // Track used images to prevent repeats

const getEducationalFallbackImage = (query: string, forceUnique: boolean = true): ImageResult => {
  const fallbackImages: { [key: string]: string[] } = {
    'map': [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1597149254499-c6c5c3c74473?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    ],
    'compass': [
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
      'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&q=80',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80'
    ],
    'history': [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', // This was the repeated library!
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'
    ],
    'science': [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&q=80'
    ],
    'math': [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80',
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80'
    ],
    'reading': [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'
    ],
    'writing': [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
      'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&q=80',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80'
    ],
    'animal': [
      'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80',
      'https://images.unsplash.com/photo-1549339033-f0ad?w=800&q=80',
      'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=80'
    ],
    'nature': [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80'
    ]
  };

  // Massive pool of diverse default images to prevent any repetition
  const defaultImages = [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', // Education/learning
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80', // Student studying  
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80', // Classroom
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80', // Educational materials
    'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&q=80', // Learning tools
    'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80', // School supplies
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80', // Kids learning
    'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80', // Educational toys
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80', // Children playing
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', // School environment
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80', // Numbers/math
    'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&q=80', // Science experiment
    'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&q=80', // Writing/drawing
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80', // Calculator/math
    'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=80', // Nature/animals
    'https://images.unsplash.com/photo-1549339033-f0ad?w=800&q=80', // Animals close-up
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80', // Forest/nature
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80', // Geography tools
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', // Music/instruments
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', // Sports/activity
  ];

  // Find best match for query
  const queryLower = query.toLowerCase();
  let selectedUrl = null;
  
  // First try to find keyword matches with variety
  for (const [key, urls] of Object.entries(fallbackImages)) {
    if (queryLower.includes(key)) {
      // If we're forcing uniqueness, pick an unused URL from this category
      if (forceUnique) {
        const unusedUrls = urls.filter(url => !usedFallbackImages.has(url));
        if (unusedUrls.length > 0) {
          selectedUrl = unusedUrls[Math.floor(Math.random() * unusedUrls.length)];
        } else {
          // If all category images used, pick random from category
          selectedUrl = urls[Math.floor(Math.random() * urls.length)];
        }
      } else {
        selectedUrl = urls[Math.floor(Math.random() * urls.length)];
      }
      break;
    }
  }
  
  // If no keyword match, use unused default image
  if (!selectedUrl) {
    if (forceUnique) {
      const unusedDefaults = defaultImages.filter(url => !usedFallbackImages.has(url));
      if (unusedDefaults.length > 0) {
        selectedUrl = unusedDefaults[Math.floor(Math.random() * unusedDefaults.length)];
      } else {
        // Reset used images if we've exhausted all options
        usedFallbackImages.clear();
        selectedUrl = defaultImages[Math.floor(Math.random() * defaultImages.length)];
        console.log(`[FALLBACK] Reset used images pool, selected fresh image`);
      }
    } else {
      selectedUrl = defaultImages[Math.floor(Math.random() * defaultImages.length)];
    }
  }
  
  // Track this image as used
  if (forceUnique && selectedUrl) {
    usedFallbackImages.add(selectedUrl);
    console.log(`[FALLBACK] Selected unique image for "${query}" (${usedFallbackImages.size} images used)`);
  }

  return {
    url: selectedUrl!,
    description: `Educational illustration: ${query}`,
    source: 'unsplash' as const
  };
};

// Smart image generation with multiple fallbacks and diversity
export async function generateDiverseImage(prompt: string, context: string = ''): Promise<GeneratedImage | null> {
  console.log(`[DIVERSE-IMAGE] Generating image for: ${prompt} (Context: ${context})`);
  
  // Add unique elements to ensure different results
  const uniqueId = Date.now() + Math.random().toString(36).substr(2, 5);
  const diversityElements = [
    'bright and colorful style',
    'soft pastel colors',
    'vibrant educational style',
    'clean modern illustration',
    'friendly cartoon style'
  ];
  
  const randomStyle = diversityElements[Math.floor(Math.random() * diversityElements.length)];
  const enhancedPrompt = `${prompt}, ${randomStyle}, unique educational illustration ${uniqueId}`;
  
  // Try different services in order of preference
  const services = [
    { name: 'Replicate', fn: () => generateReplicateImage(enhancedPrompt) },
    { name: 'DALL-E', fn: () => generateDALLEImage(enhancedPrompt) },
    { name: 'HuggingFace', fn: () => generateHuggingFaceImage(enhancedPrompt) },
    { name: 'Stability', fn: () => generateCustomImage(enhancedPrompt) }
  ];
  
  // Randomize service order to increase diversity
  const shuffledServices = services.sort(() => Math.random() - 0.5);
  
  for (const service of shuffledServices) {
    try {
      console.log(`[DIVERSE-IMAGE] Trying ${service.name}...`);
      const result = await service.fn();
      if (result) {
        console.log(`[DIVERSE-IMAGE] ✅ Success with ${service.name}`);
        return result;
      }
    } catch (error) {
      console.log(`[DIVERSE-IMAGE] ❌ ${service.name} failed:`, error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  console.log(`[DIVERSE-IMAGE] All services failed, returning null`);
  return null;
}

// DALL-E image generation (moved from intelligent service)
export async function generateDALLEImage(prompt: string): Promise<GeneratedImage | null> {
  const openai = getOpenAIClient();
  if (!openai) return null;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Educational illustration for children: ${prompt}. Style: Clean, colorful, friendly, appropriate for educational materials. Avoid: Any inappropriate content, dark themes, scary elements.`,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
      n: 1,
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) return null;

    return { url: imageUrl, prompt };
  } catch (error) {
    console.error('DALL-E generation failed:', error);
    return null;
  }
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  
  try {
    const OpenAI = require('openai');
    return new OpenAI({ apiKey });
  } catch (error) {
    console.error('OpenAI client error:', error);
    return null;
  }
}

// Combined image search across all platforms with fallbacks
export async function searchAllImages(query: string, count: number = 6): Promise<ImageResult[]> {
  console.log(`[SEARCH-ALL-IMAGES] Searching for ${count} diverse images: "${query}"`);
  
  try {
    // First, try to generate unique AI images for better relevance and diversity
    const aiImagePromises = Array(Math.min(count, 2)).fill(null).map((_, index) => 
      generateDiverseImage(query, `position_${index}`)
    );
    
    // Simultaneously search stock photo APIs
    const [aiImages, pexelsImages, pixabayImages, unsplashImages] = await Promise.all([
      Promise.allSettled(aiImagePromises),
      searchPexelsImages(query, Math.ceil(count / 4)),
      searchPixabayImages(query, Math.ceil(count / 4)), 
      searchUnsplashImages(query, Math.ceil(count / 4))
    ]);

    // Process AI images
    const successfulAiImages: ImageResult[] = aiImages
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => {
        const generatedImage = (result as PromiseFulfilledResult<GeneratedImage | null>).value!;
        return {
          url: generatedImage.url,
          description: `AI-generated: ${query}`,
          source: 'ai-generated' as const
        };
      });

    // Combine all sources, prioritizing AI-generated images for uniqueness
    const allImages = [
      ...successfulAiImages,
      ...pexelsImages,
      ...pixabayImages, 
      ...unsplashImages
    ].slice(0, count);
    
    console.log(`[SEARCH-ALL-IMAGES] Found ${allImages.length} images (${successfulAiImages.length} AI-generated)`);
    
    // If we don't have enough images, add unique fallbacks
    if (allImages.length < count) {
      const needed = count - allImages.length;
      console.log(`[SEARCH-ALL-IMAGES] Need ${needed} more images, using diverse fallbacks`);
      
      for (let i = 0; i < needed; i++) {
        // Each fallback gets a unique query to ensure diversity
        const uniqueQuery = `${query} variation ${i + 1}`;
        const fallbackImage = getEducationalFallbackImage(uniqueQuery, true);
        allImages.push(fallbackImage);
      }
    }
    
    // Final verification: remove any accidental duplicates
    const uniqueImages = allImages.filter((image, index, self) => 
      index === self.findIndex(other => other.url === image.url)
    );
    
    console.log(`[SEARCH-ALL-IMAGES] Returning ${uniqueImages.length} unique images`);
    return uniqueImages.slice(0, count);
    
  } catch (error) {
    console.error('Image search error, using diverse fallbacks:', error);
    
    // Emergency fallback: return diverse fallback images
    const fallbackImages: ImageResult[] = [];
    for (let i = 0; i < count; i++) {
      const fallback = getEducationalFallbackImage(`${query} emergency ${i}`, true);
      fallbackImages.push(fallback);
    }
    return fallbackImages;
  }
}
