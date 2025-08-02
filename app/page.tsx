'use client';

import { useState } from 'react';
import { topicsData } from '@/data/topics';
import { WorksheetRequest, WorksheetResponse } from '@/types/worksheet';
import toast from 'react-hot-toast';

export default function WorksheetGenerator() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [learningObjective, setLearningObjective] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'colorful' | 'minimal' | 'playful'>('colorful');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<WorksheetResponse | null>(null);

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
      toast.error('Please select a topic, subtopic, and grade level');
      return;
    }

    setIsGenerating(true);
    
    try {
      const request: WorksheetRequest = {
        topic: selectedTopic,
        subtopic: selectedSubtopic,
        gradeLevel: selectedGrade,
        learningObjective,
        style: selectedStyle,
      };

      const response = await fetch('/api/generate-worksheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate worksheet');
      }

      const worksheet: WorksheetResponse = await response.json();
      setGeneratedWorksheet(worksheet);
      toast.success('Worksheet generated successfully!');
      
    } catch (error) {
      console.error('Error generating worksheet:', error);
      toast.error('Failed to generate worksheet. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (generatedWorksheet) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{generatedWorksheet.title}</h1>
            <button
              onClick={() => setGeneratedWorksheet(null)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Generate New Worksheet
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Instructions</h2>
              <p className="text-gray-700">{generatedWorksheet.instructions}</p>
            </div>
            
            <div className="space-y-6">
              {generatedWorksheet.questions.map((question, index) => (
                <div key={question.id} className="border-b pb-4">
                  <h3 className="font-medium mb-2">
                    {index + 1}. {question.question} ({question.points} points)
                  </h3>
                  
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-1 ml-4">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center">
                          <span className="mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'fill-blank' && (
                    <div className="ml-4">
                      <div className="border-b border-gray-300 w-48 inline-block"></div>
                    </div>
                  )}
                  
                  {question.type === 'short-answer' && (
                    <div className="ml-4">
                      <div className="border border-gray-300 rounded p-3 h-20 bg-gray-50"></div>
                    </div>
                  )}
                  
                  {question.type === 'true-false' && (
                    <div className="ml-4 space-x-4">
                      <span>True ⬜</span>
                      <span>False ⬜</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {generatedWorksheet.answerKey && generatedWorksheet.answerKey.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h2 className="text-xl font-semibold mb-4">Answer Key</h2>
                <div className="space-y-3">
                  {generatedWorksheet.answerKey.map((answer, index) => (
                    <div key={answer.questionId} className="bg-gray-50 p-3 rounded">
                      <p><strong>Question {index + 1}:</strong> {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}</p>
                      {answer.explanation && (
                        <p className="text-sm text-gray-600 mt-1">{answer.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="hero-title text-4xl md:text-5xl font-bold text-center mb-8 font-playfair">
          AI Worksheet Generator
        </h1>
        
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
            <div className="grid grid-cols-3 gap-4">
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
          </div>
          
          {/* Generate Button */}
          <button
            onClick={handleGenerateWorksheet}
            disabled={isGenerating || !selectedTopic || !selectedSubtopic || !selectedGrade}
            className="w-full generate-btn text-white py-4 rounded-xl text-xl font-bold shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">⏳</span> Generating...
              </>
            ) : (
              <>
                <span className="mr-2">✨</span> Generate with AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
