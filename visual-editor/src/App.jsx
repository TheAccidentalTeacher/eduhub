import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ImageLibrary from './components/ImageLibrary'
import WorksheetCanvas from './components/WorksheetCanvas'
import ControlPanel from './components/ControlPanel'
import TemplateLibrary from './components/TemplateLibrary'
import { WorksheetProvider } from './contexts/WorksheetContext'
import { PaletteIcon, FileTextIcon, ImageIcon, SettingsIcon } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('templates')

  return (
    <DndProvider backend={HTML5Backend}>
      <WorksheetProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Header */}
          <header className="bg-white shadow-sm border-b-2 border-primary/20">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <PaletteIcon className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold text-primary">
                      Visual Worksheet Designer
                    </h1>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Azure-Powered ✨
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setActiveTab('design')}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'design' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <PaletteIcon className="w-4 h-4" />
                    <span>Design</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'preview' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FileTextIcon className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'settings' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <SettingsIcon className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Layout */}
          <div className="flex h-[calc(100vh-80px)]">
            {/* Left Sidebar - Navigation */}
            <div className="w-80 bg-white border-r-2 border-borders shadow-lg overflow-y-auto">
              <div className="p-4 border-b border-borders">
                <div className="flex items-center space-x-2 mb-4">
                  <PaletteIcon className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-lg">Design Tools</h2>
                </div>
                
                {/* Navigation Tabs */}
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => setActiveTab('templates')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'templates' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FileTextIcon className="w-4 h-4" />
                    <span>Templates</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('images')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'images' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Images</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('controls')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'controls' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <SettingsIcon className="w-4 h-4" />
                    <span>Controls</span>
                  </button>
                </div>
              </div>
              
              {/* Content based on active tab */}
              {activeTab === 'templates' && <TemplateLibrary onTemplateSelect={(template) => console.log('Selected:', template)} />}
              {activeTab === 'images' && <ImageLibrary />}
              {activeTab === 'controls' && <ControlPanel />}
            </div>
            
            {/* Center - Worksheet Canvas */}
            <div className="flex-1 overflow-auto bg-gray-50">
              {(activeTab === 'design' || activeTab === 'templates' || activeTab === 'images' || activeTab === 'controls') && <WorksheetCanvas />}
              {activeTab === 'preview' && (
                <div className="p-8">
                  <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-6 text-primary">
                      Worksheet Preview Mode
                    </h2>
                    <p className="text-center text-gray-600">
                      Preview functionality coming soon! This will show your worksheet 
                      exactly as students will see it.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="p-8">
                  <div className="max-w-2xl mx-auto">
                    <ControlPanel />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Status Bar */}
          <footer className="bg-white border-t border-borders px-4 py-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>🟢 Azure Services Connected</span>
                <span>•</span>
                <span>🛡️ Content Safety: Active</span>
              </div>
              <div>
                Ready to create amazing worksheets! 🎨
              </div>
            </div>
          </footer>
        </div>
      </WorksheetProvider>
    </DndProvider>
  )
}

export default App
