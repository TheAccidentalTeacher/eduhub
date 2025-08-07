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

// Combined image search across all platforms
export async function searchAllImages(query: string, count: number = 6): Promise<ImageResult[]> {
  const [pexelsImages, pixabayImages, unsplashImages] = await Promise.all([
    searchPexelsImages(query, Math.ceil(count / 3)),
    searchPixabayImages(query, Math.ceil(count / 3)),
    searchUnsplashImages(query, Math.ceil(count / 3))
  ]);

  return [...pexelsImages, ...pixabayImages, ...unsplashImages].slice(0, count);
}
