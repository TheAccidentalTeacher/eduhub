import React, { useState } from 'react'
import { useWorksheet } from '../contexts/WorksheetContext'
import { 
  Settings, 
  Palette, 
  Type, 
  Layout, 
  Shield, 
  Cloud,
  Save,
  Download,
  RefreshCw,
  Check,
  AlertCircle
} from 'lucide-react'

function ControlPanel() {
  const { state, updateTitle, updateSection } = useWorksheet()
  const [activeSection, setActiveSection] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  const sections = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'azure', name: 'Azure AI', icon: Cloud },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Worksheet Title
        </label>
        <input
          type="text"
          value={state.worksheet.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="w-full px-4 py-2 border border-borders rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Grade Level
        </label>
        <select
          value={state.worksheet.gradeLevel}
          onChange={(e) => updateSection('header', { gradeLevel: e.target.value })}
          className="w-full px-4 py-2 border border-borders rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="Pre-K">Pre-K</option>
          <option value="K">Kindergarten</option>
          <option value="K-1">K-1</option>
          <option value="K-2">K-2</option>
          <option value="1st">1st Grade</option>
          <option value="2nd">2nd Grade</option>
          <option value="3rd">3rd Grade</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Topic
        </label>
        <input
          type="text"
          value={state.worksheet.topic}
          onChange={(e) => updateSection('header', { topic: e.target.value })}
          className="w-full px-4 py-2 border border-borders rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showName"
            checked={state.worksheet.sections.header.showNameField}
            onChange={(e) => updateSection('header', { showNameField: e.target.checked })}
            className="w-4 h-4 text-primary border-borders rounded focus:ring-primary/50"
          />
          <label htmlFor="showName" className="text-sm text-gray-700">
            Show Name Field
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showDate"
            checked={state.worksheet.sections.header.showDateField}
            onChange={(e) => updateSection('header', { showDateField: e.target.checked })}
            className="w-4 h-4 text-primary border-borders rounded focus:ring-primary/50"
          />
          <label htmlFor="showDate" className="text-sm text-gray-700">
            Show Date Field
          </label>
        </div>
      </div>
    </div>
  )

  const renderDesignSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Color Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Ocean Blue', primary: '#4A90E2', secondary: '#7BB3F0' },
            { name: 'Forest Green', primary: '#2ECC71', secondary: '#58D68D' },
            { name: 'Sunset Orange', primary: '#F39C12', secondary: '#F8C471' },
            { name: 'Purple Magic', primary: '#9B59B6', secondary: '#BB8FCE' },
            { name: 'Cherry Red', primary: '#E74C3C', secondary: '#F1948A' },
            { name: 'Teal Dream', primary: '#17A2B8', secondary: '#5DADE2' }
          ].map((theme) => (
            <button
              key={theme.name}
              className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors"
              onClick={() => {
                // Update color theme - would modify CSS variables
                console.log('Switching to theme:', theme.name)
              }}
            >
              <div className="flex space-x-1 mb-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.secondary }}
                />
              </div>
              <span className="text-xs font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Font Style
        </label>
        <select className="w-full px-4 py-2 border border-borders rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="comic-neue">Comic Neue (Friendly)</option>
          <option value="nunito">Nunito (Clean)</option>
          <option value="arial">Arial (Classic)</option>
          <option value="open-sans">Open Sans (Modern)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Layout Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 border-2 border-primary bg-primary/10 rounded-lg text-center">
            <Layout className="w-6 h-6 mx-auto mb-2 text-primary" />
            <span className="text-sm font-medium">Modern Cards</span>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary">
            <Type className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <span className="text-sm font-medium">Classic List</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderLayoutSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Page Layout
        </label>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input type="radio" name="layout" id="portrait" defaultChecked className="w-4 h-4 text-primary" />
            <label htmlFor="portrait" className="text-sm">Portrait (Recommended)</label>
          </div>
          <div className="flex items-center space-x-3">
            <input type="radio" name="layout" id="landscape" className="w-4 h-4 text-primary" />
            <label htmlFor="landscape" className="text-sm">Landscape</label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sections to Include
        </label>
        <div className="space-y-2">
          {[
            { id: 'header', label: 'Header with Title' },
            { id: 'intro', label: 'Introduction Text' },
            { id: 'infoBoxes', label: 'Information Boxes' },
            { id: 'safetyRules', label: 'Rules/Guidelines List' },
            { id: 'activities', label: 'Activity Sections' }
          ].map((section) => (
            <div key={section.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={section.id}
                defaultChecked
                className="w-4 h-4 text-primary border-borders rounded"
              />
              <label htmlFor={section.id} className="text-sm text-gray-700">
                {section.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Image Placement
        </label>
        <select className="w-full px-4 py-2 border border-borders rounded-lg">
          <option value="top">Above text</option>
          <option value="left">Left of text</option>
          <option value="right">Right of text</option>
          <option value="bottom">Below text</option>
        </select>
      </div>
    </div>
  )

  const renderAzureSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-800">Azure AI Services</span>
        </div>
        <p className="text-sm text-blue-700">
          Your Azure subscription provides powerful AI capabilities for content generation and safety checking.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-borders rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium">Content Safety</div>
              <div className="text-sm text-gray-600">Automatically check images for appropriateness</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-green-600 font-medium">Active</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-borders rounded-lg">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium">AI Search</div>
              <div className="text-sm text-gray-600">Smart image discovery and recommendations</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-green-600 font-medium">Connected</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-borders rounded-lg">
          <div className="flex items-center space-x-3">
            <Type className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium">Text Translation</div>
              <div className="text-sm text-gray-600">Multi-language worksheet support</div>
            </div>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Configure
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          AI Generation Settings
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Image Style</label>
            <select className="w-full px-3 py-2 text-sm border border-borders rounded">
              <option value="educational">Educational (child-friendly)</option>
              <option value="realistic">Realistic photography</option>
              <option value="illustration">Cartoon illustration</option>
              <option value="diagram">Technical diagram</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Safety Level</label>
            <select className="w-full px-3 py-2 text-sm border border-borders rounded">
              <option value="strict">Strict (Recommended for K-2)</option>
              <option value="moderate">Moderate</option>
              <option value="standard">Standard</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <h2 className="text-xl font-bold mb-2">Settings & Controls</h2>
        <p className="text-primary-light text-sm opacity-90">
          Customize your worksheet design and Azure AI integration
        </p>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 border-b-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-primary text-primary bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeSection === 'general' && renderGeneralSettings()}
        {activeSection === 'design' && renderDesignSettings()}
        {activeSection === 'layout' && renderLayoutSettings()}
        {activeSection === 'azure' && renderAzureSettings()}
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {saveStatus && (
              <div className={`flex items-center space-x-2 text-sm ${
                saveStatus === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {saveStatus === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>
                  {saveStatus === 'success' ? 'Settings saved!' : 'Save failed'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Template</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
