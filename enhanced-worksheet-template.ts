// 🎯 ENHANCED WORKSHEET TEMPLATE SYSTEM
// Based on your example worksheets - clean, structured, educational

export const modernWorksheetTemplate = {
  // Color scheme matching your examples
  colors: {
    primary: '#4A90E2',      // Blue headers
    secondary: '#7BB3F0',    // Light blue accents  
    background: '#F8FAFE',   // Very light blue background
    text: '#2C3E50',         // Dark text
    borders: '#B8D4F0'       // Light blue borders
  },

  // Layout structure matching your examples
  sections: {
    header: {
      title: 'large-centered',
      subtitle: 'medium-centered',
      nameDate: 'top-right-fields'
    },
    
    introduction: {
      type: 'paragraph',
      style: 'instructional-text',
      placement: 'after-header'
    },

    infoBoxes: {
      type: 'structured-grid',
      style: 'blue-rounded-boxes',
      columns: 3,
      content: 'key-concepts'
    },

    safetyRules: {
      type: 'numbered-list',
      style: 'blue-bordered-box',
      numbering: 'circle-numbers'
    },

    activities: {
      drawingBox: {
        type: 'large-rectangle',
        prompt: 'above-box',
        style: 'blue-border-rounded'
      },
      
      textBoxes: {
        type: 'multiple-rectangles',
        prompts: 'above-each-box',
        style: 'blue-border-rounded'
      }
    }
  }
};

// 🎨 ENHANCED VISUAL GENERATION
export const visualEnhancements = {
  // Community helpers imagery
  communityHelpers: [
    'police officer helping children cross street',
    'firefighter teaching fire safety to kids',
    'teacher in classroom with safety poster',
    'crossing guard with stop sign',
    'paramedic with ambulance'
  ],

  // Safety concepts imagery  
  safetyScenes: [
    'children wearing seatbelts in car',
    'kids looking both ways before crossing',
    'family practicing fire drill',
    'children wearing bike helmets',
    'playground safety rules poster'
  ],

  // Diagram styles
  diagrams: {
    communityMap: 'bird-eye view of neighborhood with helper locations',
    safetySteps: 'step-by-step illustrated instructions',
    emergencyNumbers: 'phone with important numbers display'
  }
};

// 🏗️ WORKSHEET STRUCTURE GENERATOR
export function generateStructuredWorksheet(topic: string, subtopic: string, gradeLevel: string) {
  return {
    layout: 'modern-education-template',
    
    header: {
      title: `${topic}: ${subtopic}`,
      nameField: 'Name: ________________',
      dateField: 'Date: ________________',
      styling: 'blue-header-gradient'
    },

    introduction: {
      text: `Today we are going to learn about ${subtopic.toLowerCase()}. We will explore how this connects to our daily lives and why it's important.`,
      styling: 'intro-paragraph'
    },

    mainContent: {
      type: 'info-grid',
      sections: generateContentSections(subtopic),
      styling: 'blue-rounded-boxes'
    },

    keyPoints: {
      type: 'numbered-list',
      title: `Important ${subtopic} Facts`,
      items: generateKeyPoints(subtopic),
      styling: 'blue-bordered-list'
    },

    activities: {
      drawing: {
        prompt: `Draw a picture of ${subtopic.toLowerCase()} and write why it's important.`,
        space: 'large-drawing-box'
      },
      
      reflection: {
        prompts: [
          `Why is this ${subtopic.toLowerCase()} important?`,
          `How can YOU help with ${subtopic.toLowerCase()}?`
        ],
        spaces: 'text-response-boxes'
      }
    },

    footer: {
      pageNumber: true,
      gradeLevel: gradeLevel,
      subject: topic
    }
  };
}

// 📚 CONTENT GENERATORS
function generateContentSections(subtopic: string) {
  const sections: Record<string, Array<{title: string, description: string, imagePrompt: string}>> = {
    'Safety in Our Community': [
      {
        title: 'Police Officers',
        description: 'Keep our neighborhoods safe and help people follow rules',
        imagePrompt: 'police officer helping children cross street safely'
      },
      {
        title: 'Firefighters', 
        description: 'Put out fires and teach us fire safety',
        imagePrompt: 'firefighter teaching children about fire safety'
      },
      {
        title: 'Teachers',
        description: 'Help us learn and keep us safe at school',
        imagePrompt: 'teacher with children in classroom'
      }
    ],
    
    'Environment and Nature': [
      {
        title: 'Plants',
        description: 'Give us oxygen and make our world beautiful',
        imagePrompt: 'children planting trees and flowers'
      },
      {
        title: 'Animals',
        description: 'Share our world and need our protection',
        imagePrompt: 'children observing animals in nature'
      },
      {
        title: 'Clean Water',
        description: 'Essential for all living things',
        imagePrompt: 'children learning about clean water'
      }
    ]
  };
  
  return sections[subtopic] || [
    {
      title: 'Key Concept 1',
      description: `Important aspect of ${subtopic.toLowerCase()}`,
      imagePrompt: `educational image about ${subtopic.toLowerCase()}`
    }
  ];
}

function generateKeyPoints(subtopic: string) {
  const keyPoints: Record<string, string[]> = {
    'Safety in Our Community': [
      'Know your personal information - name, address, and emergency phone number',
      'Stay with trusted adults and tell them where you are going',
      'Use the buddy system - play and walk with friends',
      'Know how to call 911 in an emergency',
      'Practice fire safety - stop, drop, and roll',
      'Be careful around strangers'
    ],
    
    'Environment and Nature': [
      'Reduce, reuse, and recycle to help our planet',
      'Plants need water, sunlight, and soil to grow',
      'Animals need food, water, and shelter to survive',
      'We can help by not littering and keeping spaces clean',
      'Every living thing has an important role in nature',
      'Small actions can make a big difference'
    ]
  };
  
  return keyPoints[subtopic] || [
    `Key fact about ${subtopic.toLowerCase()}`,
    `Important rule for ${subtopic.toLowerCase()}`,
    `How we can help with ${subtopic.toLowerCase()}`
  ];
}

// 🎨 VISUAL INTEGRATION 
export function integrateWithVisualEditor(worksheetData: any) {
  return {
    ...worksheetData,
    
    // Visual editor metadata
    designSystem: {
      colorScheme: modernWorksheetTemplate.colors,
      templateVersion: '2.0',
      azureIntegration: true
    },
    
    // Image slots for drag-and-drop
    imageSlots: extractImageSlots(worksheetData),
    
    // Export compatibility
    exportFormats: ['pdf', 'png', 'docx', 'html'],
    
    // Integration points
    integrations: {
      currentAPI: '/api/generate-enhanced-worksheet',
      visualEditor: '/visual-editor',
      azureServices: ['contentSafety', 'search', 'translator']
    }
  };
}

function extractImageSlots(worksheetData: any) {
  const slots = [];
  
  // Extract from main content sections
  if (worksheetData.mainContent?.sections) {
    worksheetData.mainContent.sections.forEach((section: any, index: number) => {
      slots.push({
        id: `section-${index}`,
        type: 'content-image',
        prompt: section.imagePrompt,
        placement: 'above-text',
        size: 'medium'
      });
    });
  }
  
  // Extract from activities
  if (worksheetData.activities?.drawing) {
    slots.push({
      id: 'drawing-area',
      type: 'activity-image',
      prompt: worksheetData.activities.drawing.prompt,
      placement: 'standalone',
      size: 'large'
    });
  }
  
  return slots;
}
