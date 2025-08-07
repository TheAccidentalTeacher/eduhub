// External API service integrations for enhanced worksheets

export interface ImageResult {
  url: string;
  description: string;
  source: 'pexels' | 'pixabay' | 'unsplash';
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

// Enhanced fallback images for educational content
const getEducationalFallbackImage = (query: string): ImageResult => {
  const fallbackImages: { [key: string]: string } = {
    'map': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'compass': 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
    'navigation': 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&q=80',
    'geography': 'https://images.unsplash.com/photo-1597149254499-c6c5c3c74473?w=800&q=80',
    'history': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    'science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
    'math': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    'reading': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'writing': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'
  };

  // Find best match for query
  const queryLower = query.toLowerCase();
  let bestMatch = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80'; // default
  
  for (const [key, url] of Object.entries(fallbackImages)) {
    if (queryLower.includes(key)) {
      bestMatch = url;
      break;
    }
  }

  return {
    url: bestMatch,
    description: `Educational illustration: ${query}`,
    source: 'unsplash' as const
  };
};

// Combined image search across all platforms with fallbacks
export async function searchAllImages(query: string, count: number = 6): Promise<ImageResult[]> {
  try {
    const [pexelsImages, pixabayImages, unsplashImages] = await Promise.all([
      searchPexelsImages(query, Math.ceil(count / 3)),
      searchPixabayImages(query, Math.ceil(count / 3)),
      searchUnsplashImages(query, Math.ceil(count / 3))
    ]);

    const allImages = [...pexelsImages, ...pixabayImages, ...unsplashImages].slice(0, count);
    
    // If we don't have enough images, add fallbacks
    if (allImages.length < count) {
      const fallbackImage = getEducationalFallbackImage(query);
      const needed = count - allImages.length;
      for (let i = 0; i < needed; i++) {
        allImages.push(fallbackImage);
      }
    }
    
    return allImages;
  } catch (error) {
    console.error('Image search error, using fallbacks:', error);
    // Return fallback images if all APIs fail
    const fallbackImage = getEducationalFallbackImage(query);
    return Array(count).fill(null).map(() => ({ ...fallbackImage }));
  }
}
