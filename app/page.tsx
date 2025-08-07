'use client';

import { useState } from 'react';
import { topicsData } from '@/data/topics';
import { WorksheetRequest, WorksheetResponse, LearningProfile } from '@/types/worksheet';
import toast, { Toaster } from 'react-hot-toast';
import EnhancedWorksheetDisplay from '@/components/EnhancedWorksheetDisplay';
import LearningProfileManager from '@/components/LearningProfileManager';
import AssessmentDashboard from '@/components/AssessmentDashboard';

export default function WorksheetGenerator() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [learningObjective, setLearningObjective] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'colorful' | 'minimal' | 'playful' | 'modern-blue' | 'professional'>('colorful');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<WorksheetResponse | null>(null);
  const [isExporting, setIsExporting] = useState<'pdf' | 'docx' | null>(null);
  const [includeVisuals, setIncludeVisuals] = useState(true);
  const [includeCurrentEvents, setIncludeCurrentEvents] = useState(false);
  const [worksheetType, setWorksheetType] = useState<'standard' | 'interactive' | 'story-based' | 'puzzle' | 'hands-on' | 'modern-template'>('standard');
  const [useEnhancedGeneration, setUseEnhancedGeneration] = useState(true);
  const [useModernTemplates, setUseModernTemplates] = useState(true);
  
  // Step 3: Pedagogical Intelligence State
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [enableIntelligentMode, setEnableIntelligentMode] = useState(false);
  const [enableAdaptiveDifferentiation, setEnableAdaptiveDifferentiation] = useState(false);

  const gradeOptions = [
    'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade',
    '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
    '11th Grade', '12th Grade', 'College', 'Adult Education'
  ];

  const selectedTopicData = topicsData.find(t => t.topic === selectedTopic);

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(''); // Reset subtopic when topic changes
  };

  const handleGenerateWorksheet = async () => {
    if (!selectedTopic || !selectedSubtopic || !selectedGrade) {
      const errorMsg = 'Please select a topic, subtopic, and grade level';
      console.error('[WORKSHEET-GENERATOR]', errorMsg);
      toast.error(errorMsg);
      return;
    }

    console.log('[WORKSHEET-GENERATOR] Starting worksheet generation');
    setIsGenerating(true);
    
    try {
      const request: WorksheetRequest = {
        topic: selectedTopic,
        subtopic: selectedSubtopic,
        gradeLevel: selectedGrade,
        learningObjective,
        style: selectedStyle,
        includeVisuals,
        includeCurrentEvents,
        worksheetType,
        // NEW: Modern template system
        useModernTemplates,
        // Step 3: Pedagogical Intelligence
        learningProfile: learningProfile || undefined,
        enableAdaptiveDifferentiation: enableAdaptiveDifferentiation
      };

      console.log('[WORKSHEET-GENERATOR] Request payload:', request);

      // Choose API endpoint based on intelligent mode
      let apiEndpoint = '/api/generate-worksheet';
      if (enableIntelligentMode && learningProfile) {
        apiEndpoint = '/api/generate-intelligent-worksheet';
      } else if (useEnhancedGeneration) {
        apiEndpoint = '/api/generate-enhanced-worksheet';
      }
      
      console.log(`[WORKSHEET-GENERATOR] Using endpoint: ${apiEndpoint}`);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          // Additional flags for intelligent generation
          intelligentMode: enableIntelligentMode,
          adaptToLearner: !!learningProfile,
          generateAssessments: enableIntelligentMode,
          includeRecommendations: enableIntelligentMode
        }),
      });

      console.log('[WORKSHEET-GENERATOR] API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[WORKSHEET-GENERATOR] API error response:', errorData);
        throw new Error(errorData.details || errorData.error || `HTTP ${response.status}`);
      }

      const worksheet: WorksheetResponse = await response.json();
      console.log('[WORKSHEET-GENERATOR] Successfully received worksheet:', worksheet.id);
      
      setGeneratedWorksheet(worksheet);
      
      // Enhanced success messaging based on generation type
      if (enableIntelligentMode && learningProfile) {
        toast.success(`🧠 Intelligent worksheet generated with pedagogical intelligence!`);
      } else if (useEnhancedGeneration) {
        toast.success('✨ Enhanced worksheet generated with visual elements!');
      } else {
        toast.success('📝 Worksheet generated successfully!');
      }
      
    } catch (error) {
      console.error('[WORKSHEET-GENERATOR] Error generating worksheet:', error);
      
      // Enhanced error messaging for different scenarios
      if (error instanceof Error) {
        if (error.message.includes('OpenAI')) {
          toast.error('AI service configuration error. Please check the console for details.');
        } else if (error.message.includes('fetch')) {
          toast.error('Network error. Please check your internet connection.');
        } else {
          toast.error(`Generation failed: ${error.message}`);
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      console.log('[WORKSHEET-GENERATOR] Generation process completed');
      setIsGenerating(false);
    }
  };

  if (generatedWorksheet) {
    const handleExport = async (type: 'pdf' | 'docx') => {
      setIsExporting(type);
      try {
        toast.loading(`Generating ${type.toUpperCase()}...`, { id: `${type}-export` });
        if (type === 'pdf') {
          const { exportToPDF } = await import('@/utils/exportUtils');
          await exportToPDF(generatedWorksheet, 'worksheet-content');
        } else {
          const { exportToDocx } = await import('@/utils/exportUtils');
          await exportToDocx(generatedWorksheet);
        }
        toast.success(`${type.toUpperCase()} exported successfully!`, { id: `${type}-export` });
      } catch (error) {
        console.error(`Export error:`, error);
        toast.error(`Failed to export ${type.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: `${type}-export` });
      } finally {
        setIsExporting(null);
      }
    };

    const handlePrint = () => window.print();

    return (
      <>
        <AssessmentDashboard worksheet={generatedWorksheet} />
        <EnhancedWorksheetDisplay
          worksheet={generatedWorksheet}
          onExport={handleExport}
          onPrint={handlePrint}
          onGenerateNew={() => setGeneratedWorksheet(null)}
          exportingType={isExporting}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl w-full mx-auto py-8">
        <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 font-playfair">
          AI Worksheet Generator
        </h1>
        
        {/* Step 3: Learning Profile Manager */}
        <LearningProfileManager 
          onProfileChange={setLearningProfile}
          currentProfile={learningProfile}
        />
        
        <div className="app-container p-8 md:p-10">
          {/* Topic Selection */}
          <div className="mb-8">
            <label className="block text-white text-xl font-semibold mb-3">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50"
            >
              <option value="">Select a topic</option>
              {topicsData.map((topic) => (
                <option key={topic.topic} value={topic.topic} className="text-gray-800">
                  {topic.topic}
                </option>
              ))}
            </select>
          </div>
          
          {/* Subtopic Selection */}
          <div className="mb-8">
            <label className="block text-white text-xl font-semibold mb-3">Subtopic</label>
            <select
              value={selectedSubtopic}
              onChange={(e) => setSelectedSubtopic(e.target.value)}
              disabled={!selectedTopic}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 disabled:opacity-50"
            >
              <option value="">Select a subtopic</option>
              {selectedTopicData?.subtopics.map((subtopic) => (
                <option key={subtopic} value={subtopic} className="text-gray-800">
                  {subtopic}
                </option>
              ))}
            </select>
          </div>
          
          {/* Grade Level Selection */}
          <div className="mb-8">
            <label className="block text-white text-xl font-semibold mb-3">Grade Level</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50"
            >
              <option value="">Select a grade level</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade} className="text-gray-800">
                  {grade}
                </option>
              ))}
            </select>
          </div>
          
          {/* Learning Objective */}
          <div className="mb-8">
            <label className="block text-white text-xl font-semibold mb-3">Learning Objective</label>
            <input
              type="text"
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
              placeholder="e.g., Students will understand multiplication with visual models"
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
            />
          </div>
          
          {/* Style Preference */}
          <div className="mb-10">
            <label className="block text-white text-xl font-semibold mb-3">Style Preference</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <button
                onClick={() => setSelectedStyle('colorful')}
                className={`style-btn bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-medium transition-all hover:scale-105 ${
                  selectedStyle === 'colorful' ? 'active' : ''
                }`}
              >
                🎨 Colorful
              </button>
              <button
                onClick={() => setSelectedStyle('minimal')}
                className={`style-btn bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-medium transition-all hover:scale-105 ${
                  selectedStyle === 'minimal' ? 'active' : ''
                }`}
              >
                ✨ Minimal
              </button>
              <button
                onClick={() => setSelectedStyle('playful')}
                className={`style-btn bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium transition-all hover:scale-105 ${
                  selectedStyle === 'playful' ? 'active' : ''
                }`}
              >
                🎯 Playful
              </button>
            </div>
            
            {/* NEW: Modern Professional Templates */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedStyle('modern-blue')}
                className={`style-btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium transition-all hover:scale-105 ${
                  selectedStyle === 'modern-blue' ? 'active ring-2 ring-white' : ''
                }`}
              >
                🏫 Modern Education
              </button>
              <button
                onClick={() => setSelectedStyle('professional')}
                className={`style-btn bg-gradient-to-r from-slate-600 to-gray-600 text-white py-3 rounded-xl font-medium transition-all hover:scale-105 ${
                  selectedStyle === 'professional' ? 'active ring-2 ring-white' : ''
                }`}
              >
                📋 Professional
              </button>
            </div>
          </div>
          
          {/* NEW: Modern Template Toggle */}
          <div className="mb-8">
            <label className="flex items-center text-white text-lg font-semibold">
              <input
                type="checkbox"
                checked={useModernTemplates}
                onChange={(e) => setUseModernTemplates(e.target.checked)}
                className="mr-3 w-5 h-5 rounded border-white/30 bg-white/20 text-blue-500 focus:ring-blue-500 focus:ring-2"
              />
              🎨 Use Modern Template System
            </label>
            <p className="text-white/70 text-sm mt-2 ml-8">
              Professional blue-themed layouts with enhanced visual design
            </p>
          </div>
          
          {/* Enhanced Generation Toggle */}
          <div className="mb-8">
            <label className="flex items-center text-white text-lg font-semibold">
              <input
                type="checkbox"
                checked={useEnhancedGeneration}
                onChange={(e) => setUseEnhancedGeneration(e.target.checked)}
                className="mr-3 w-5 h-5 rounded border-white/30 bg-white/20 text-blue-500 focus:ring-blue-500 focus:ring-2"
              />
              🚀 Use Enhanced AI Generation
            </label>
            <p className="text-white/70 text-sm mt-2 ml-8">
              Includes images and pedagogically optimized content
            </p>
          </div>

          {/* Step 3: Intelligent Generation Toggle */}
          <div className="mb-8">
            <label className="flex items-center text-white text-lg font-semibold">
              <input
                type="checkbox"
                checked={enableIntelligentMode}
                onChange={(e) => setEnableIntelligentMode(e.target.checked)}
                className="mr-3 w-5 h-5 rounded border-white/30 bg-white/20 text-purple-500 focus:ring-purple-500 focus:ring-2"
              />
              🧠 Enable Pedagogical Intelligence
            </label>
            <p className="text-white/70 text-sm mt-2 ml-8">
              Advanced educational AI with learning profiles, assessment rubrics, and adaptive recommendations
            </p>
            
            {enableIntelligentMode && (
              <div className="mt-4 ml-8">
                <label className="flex items-center text-white/90 text-sm">
                  <input
                    type="checkbox"
                    checked={enableAdaptiveDifferentiation}
                    onChange={(e) => setEnableAdaptiveDifferentiation(e.target.checked)}
                    className="mr-2 w-4 h-4 rounded border-white/30 bg-white/20 text-purple-500 focus:ring-purple-500 focus:ring-1"
                  />
                  Generate differentiated versions for multiple learning levels
                </label>
              </div>
            )}
          </div>

          {/* Enhanced Options */}
          {useEnhancedGeneration && (
            <>
              <div className="mb-8">
                <label className="block text-white text-xl font-semibold mb-3">Worksheet Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'standard', label: '📄 Standard', desc: 'Traditional Q&A format' },
                    { value: 'story-based', label: '📚 Story-Based', desc: 'Narrative learning' },
                    { value: 'puzzle', label: '🧩 Puzzle', desc: 'Games and challenges' },
                    { value: 'hands-on', label: '🔬 Hands-On', desc: 'Experiments & crafts' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setWorksheetType(type.value as any)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                        worksheetType === type.value 
                          ? 'bg-white text-purple-700 shadow-lg' 
                          : 'bg-white/20 text-white border border-white/30'
                      }`}
                    >
                      <div className="font-bold">{type.label}</div>
                      <div className="text-xs opacity-80">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-white text-xl font-semibold mb-3">Content Enhancement</label>
                <div className="space-y-3">
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={includeVisuals}
                      onChange={(e) => setIncludeVisuals(e.target.checked)}
                      className="mr-3 w-4 h-4 rounded border-white/30 bg-white/20 text-blue-500"
                    />
                    📸 Include Images & Visual Elements
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={includeCurrentEvents}
                      onChange={(e) => setIncludeCurrentEvents(e.target.checked)}
                      className="mr-3 w-4 h-4 rounded border-white/30 bg-white/20 text-blue-500"
                    />
                    📰 Connect to Current Events
                  </label>
                </div>
              </div>
            </>
          )}
          
          {/* Generate Button */}
          <button
            onClick={handleGenerateWorksheet}
            disabled={isGenerating || !selectedTopic || !selectedSubtopic || !selectedGrade}
            className="w-full generate-btn text-white py-4 rounded-xl text-xl font-bold shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">⏳</span> 
                {useEnhancedGeneration ? 'Creating Enhanced Worksheet...' : 'Generating...'}
              </>
            ) : (
              <>
                <span className="mr-2">{useEnhancedGeneration ? '🚀' : '✨'}</span> 
                {useEnhancedGeneration ? 'Generate Enhanced Worksheet' : 'Generate with AI'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
