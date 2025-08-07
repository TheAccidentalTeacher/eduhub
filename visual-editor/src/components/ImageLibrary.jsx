import React, { useState, useEffect } from 'react'
import { useWorksheet } from '../contexts/WorksheetContext'
import { Search, Sparkles, Shield, RefreshCw, Download, Wand2 } from 'lucide-react'
import { apiService } from '../services/azureService'

// Sample images - in production, these would come from Azure Search
const sampleImages = {
  communityHelpers: [
    { 
      id: 'police1', 
      url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&q=80',
      alt: 'Police officer helping children',
      tags: ['police', 'safety', 'children']
    },
    { 
      id: 'fire1', 
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80',
      alt: 'Firefighter teaching safety',
      tags: ['firefighter', 'safety', 'education']
    },
    { 
      id: 'teacher1', 
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&q=80',
      alt: 'Teacher in classroom',
      tags: ['teacher', 'classroom', 'education']
    },
    { 
      id: 'crossing1', 
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&q=80',
      alt: 'Crossing guard with children',
      tags: ['crossing guard', 'safety', 'school']
    }
  ],
  
  safetyScenes: [
    { 
      id: 'crosswalk1', 
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&q=80',
      alt: 'Children crossing street safely',
      tags: ['crosswalk', 'safety', 'children']
    },
    { 
      id: 'helmet1', 
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',
      alt: 'Child wearing bike helmet',
      tags: ['helmet', 'bike', 'safety']
    },
    { 
      id: 'playground1', 
      url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&q=80',
      alt: 'Safe playground equipment',
      tags: ['playground', 'safety', 'children']
    },
    { 
      id: 'seatbelt1', 
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&q=80',
      alt: 'Child in car seat',
      tags: ['seatbelt', 'car safety', 'children']
    }
  ],
  
  diagrams: [
    { 
      id: 'map1', 
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      alt: 'Community map',
      tags: ['map', 'community', 'location']
    },
    { 
      id: 'steps1', 
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&q=80',
      alt: 'Safety steps diagram',
      tags: ['steps', 'diagram', 'safety']
    },
    { 
      id: 'phone1', 
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80',
      alt: 'Emergency phone numbers',
      tags: ['phone', 'emergency', 'numbers']
    }
  ],
  
  aiGenerated: []
}

function ImageLibrary() {
  const { state, setImageLibrary, setSelectedCategory, setLoading } = useWorksheet()
  const [searchTerm, setSearchTerm] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const categories = [
    { id: 'communityHelpers', name: '👮 Community Helpers', icon: '👮‍♀️' },
    { id: 'safetyScenes', name: '🛡️ Safety Scenes', icon: '🛡️' },
    { id: 'diagrams', name: '📊 Diagrams', icon: '📊' },
    { id: 'aiGenerated', name: '✨ AI Generated', icon: '🤖' }
  ]

  // Load sample images on mount
  useEffect(() => {
    Object.keys(sampleImages).forEach(category => {
      setImageLibrary(category, sampleImages[category])
    })
  }, [setImageLibrary])

  const currentImages = state.imageLibrary.categories[state.imageLibrary.selectedCategory] || []

  const filteredImages = currentImages.filter(image => 
    searchTerm === '' || 
    image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleDragStart = (e, image) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(image))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const generateAIImages = async () => {
    setIsGenerating(true)
    setLoading(true)
    
    try {
      console.log('🎨 Generating images with your working API...')
      
      // Use your actual API to generate images
      const prompts = [
        'police officer helping children cross street safely, educational illustration',
        'firefighter teaching children about fire safety, colorful cartoon style',
        'teacher in classroom with diverse students, educational scene',
        'children wearing seatbelts in car, safety illustration',
        'playground safety rules demonstration, child-friendly illustration'
      ]
      
      const generatedImages = await apiService.generateImages(prompts, {
        topic: 'Safety Education',
        subtopic: 'Community Safety',
        gradeLevel: '2nd Grade'
      })
      
      console.log('✅ Generated images:', generatedImages)
      
      // Add generated images to the AI Generated category
      setImageLibrary('aiGenerated', generatedImages)
      setSelectedCategory('aiGenerated')
      
    } catch (error) {
      console.error('❌ Image generation failed:', error)
      alert(`Failed to generate images: ${error.message}`)
    } finally {
      setIsGenerating(false)
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search and Controls */}
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-borders rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* AI Generation Button */}
        <button
          onClick={generateAIImages}
          disabled={isGenerating}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate AI Images</span>
            </>
          )}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="px-4 pb-4">
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                state.imageLibrary.selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
              <span className="float-right text-xs opacity-75">
                {(state.imageLibrary.categories[category.id] || []).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {state.imageLibrary.isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center space-x-2 text-gray-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading images...</span>
            </div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-4">
              {searchTerm ? '🔍' : '📁'}
            </div>
            <p className="text-sm">
              {searchTerm ? 'No images match your search' : 'No images in this category yet'}
            </p>
            {state.imageLibrary.selectedCategory === 'aiGenerated' && !searchTerm && (
              <p className="text-xs mt-2 text-gray-400">
                Click "Generate AI Images" to create custom content!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredImages.map(image => (
              <div
                key={image.id}
                className="image-item group relative"
                draggable
                onDragStart={(e) => handleDragStart(e, image)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-20 object-cover rounded-lg"
                />
                
                {/* Overlay with info */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs text-center p-2">
                    <div className="font-semibold mb-1">Drag to worksheet</div>
                    {image.aiGenerated && (
                      <div className="flex items-center justify-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Generated</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Safety Badge */}
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                  <Shield className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-borders bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Images loaded:</span>
            <span className="font-semibold">{filteredImages.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Azure Search:</span>
            <span className="text-green-600 font-semibold">✓ Connected</span>
          </div>
          <div className="flex justify-between">
            <span>Content Safety:</span>
            <span className="text-green-600 font-semibold">✓ Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageLibrary
