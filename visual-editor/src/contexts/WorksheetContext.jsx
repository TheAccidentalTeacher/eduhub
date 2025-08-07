import React, { createContext, useContext, useReducer } from 'react'

// Worksheet state management - keeping your template structure!
const WorksheetContext = createContext()

const initialState = {
  worksheet: {
    id: null,
    title: 'Safety in Our Community',
    subtitle: '',
    topic: 'Community Safety',
    gradeLevel: 'K-2',
    template: 'modern-blue', // Using your color scheme
    
    // Sections matching your enhanced-worksheet-template.js
    sections: {
      header: {
        title: 'Safety in Our Community',
        showNameField: true,
        showDateField: true,
        style: 'blue-header-gradient'
      },
      
      introduction: {
        text: 'Today we are going to learn about safety in our community. We will talk about how people work together to keep everyone safe and how we can help too!',
        style: 'intro-paragraph'
      },
      
      infoBoxes: {
        title: 'Community Helpers Who Keep Us Safe',
        boxes: [
          {
            id: 'police',
            title: 'Police Officers',
            text: 'Police officers help keep our neighborhoods safe. They make sure people follow rules and laws.',
            imageSlot: { id: 'police-image', image: null },
            style: 'blue-rounded-box'
          },
          {
            id: 'fire',
            title: 'Firefighters', 
            text: 'Firefighters help put out fires and teach us how to prevent fires in our homes and schools.',
            imageSlot: { id: 'fire-image', image: null },
            style: 'blue-rounded-box'
          },
          {
            id: 'teacher',
            title: 'Teachers',
            text: 'Teachers help us learn and keep us safe at school. They teach us about safety rules.',
            imageSlot: { id: 'teacher-image', image: null },
            style: 'blue-rounded-box'
          }
        ]
      },
      
      safetyRules: {
        title: 'Important Safety Rules',
        items: [
          'Know your personal information - Your full name, address, and a phone number to call in case of emergency.',
          'Stay with trusted adults - Always tell an adult where you are going.',
          'Use the buddy system - Play and walk with friends, not alone.',
          'Know how to call for help - Learn how to call 911 in an emergency.',
          'Practice fire safety - Stop, drop, and roll if your clothes catch fire.',
          'Be careful around strangers - Never go with someone you don\'t know.'
        ],
        style: 'blue-bordered-list'
      },
      
      activities: [
        {
          id: 'drawing',
          type: 'drawing-box',
          prompt: 'Draw a picture of a community helper who keeps you safe and write why they are important.',
          imageSlot: { id: 'drawing-area', image: null },
          style: 'large-drawing-box'
        },
        {
          id: 'reflection1',
          type: 'text-box',
          prompt: 'Why is this community helper important?',
          style: 'text-response-box'
        },
        {
          id: 'reflection2',
          type: 'text-box', 
          prompt: 'How can YOU help keep your community safe?',
          style: 'text-response-box'
        }
      ]
    }
  },
  
  // Image library state
  imageLibrary: {
    categories: {
      communityHelpers: [],
      safetyScenes: [],
      diagrams: [],
      aiGenerated: []
    },
    selectedCategory: 'communityHelpers',
    isLoading: false
  },
  
  // Editor state
  editor: {
    selectedElement: null,
    isDragging: false,
    showGrid: true,
    zoom: 1.0
  },
  
  // Azure integration state
  azure: {
    connected: false,
    contentSafetyEnabled: true,
    searchEnabled: true
  }
}

function worksheetReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_WORKSHEET_TITLE':
      return {
        ...state,
        worksheet: {
          ...state.worksheet,
          title: action.payload
        }
      }
      
    case 'UPDATE_SECTION':
      return {
        ...state,
        worksheet: {
          ...state.worksheet,
          sections: {
            ...state.worksheet.sections,
            [action.sectionId]: {
              ...state.worksheet.sections[action.sectionId],
              ...action.payload
            }
          }
        }
      }
      
    case 'ADD_IMAGE_TO_SLOT':
      const { slotId, image } = action.payload
      
      // Find and update the image slot across all sections
      let updatedSections = { ...state.worksheet.sections }
      
      // Check infoBoxes
      if (updatedSections.infoBoxes?.boxes) {
        updatedSections.infoBoxes.boxes = updatedSections.infoBoxes.boxes.map(box => {
          if (box.imageSlot?.id === slotId) {
            return {
              ...box,
              imageSlot: { ...box.imageSlot, image }
            }
          }
          return box
        })
      }
      
      // Check activities
      if (updatedSections.activities) {
        updatedSections.activities = updatedSections.activities.map(activity => {
          if (activity.imageSlot?.id === slotId) {
            return {
              ...activity,
              imageSlot: { ...activity.imageSlot, image }
            }
          }
          return activity
        })
      }
      
      return {
        ...state,
        worksheet: {
          ...state.worksheet,
          sections: updatedSections
        }
      }
      
    case 'SET_IMAGE_LIBRARY':
      return {
        ...state,
        imageLibrary: {
          ...state.imageLibrary,
          categories: {
            ...state.imageLibrary.categories,
            [action.category]: action.images
          }
        }
      }
      
    case 'SET_SELECTED_CATEGORY':
      return {
        ...state,
        imageLibrary: {
          ...state.imageLibrary,
          selectedCategory: action.payload
        }
      }
      
    case 'SET_LOADING':
      return {
        ...state,
        imageLibrary: {
          ...state.imageLibrary,
          isLoading: action.payload
        }
      }
      
    case 'SELECT_ELEMENT':
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload
        }
      }
      
    case 'SET_DRAGGING':
      return {
        ...state,
        editor: {
          ...state.editor,
          isDragging: action.payload
        }
      }
      
    default:
      return state
  }
}

export function WorksheetProvider({ children }) {
  const [state, dispatch] = useReducer(worksheetReducer, initialState)
  
  const value = {
    state,
    dispatch,
    
    // Helper functions
    updateTitle: (title) => dispatch({ type: 'UPDATE_WORKSHEET_TITLE', payload: title }),
    updateSection: (sectionId, updates) => dispatch({ type: 'UPDATE_SECTION', sectionId, payload: updates }),
    addImageToSlot: (slotId, image) => dispatch({ type: 'ADD_IMAGE_TO_SLOT', payload: { slotId, image } }),
    setImageLibrary: (category, images) => dispatch({ type: 'SET_IMAGE_LIBRARY', category, images }),
    setSelectedCategory: (category) => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    selectElement: (element) => dispatch({ type: 'SELECT_ELEMENT', payload: element }),
    setDragging: (dragging) => dispatch({ type: 'SET_DRAGGING', payload: dragging })
  }
  
  return (
    <WorksheetContext.Provider value={value}>
      {children}
    </WorksheetContext.Provider>
  )
}

export function useWorksheet() {
  const context = useContext(WorksheetContext)
  if (!context) {
    throw new Error('useWorksheet must be used within a WorksheetProvider')
  }
  return context
}
