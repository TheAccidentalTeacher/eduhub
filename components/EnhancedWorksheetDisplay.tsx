'use client';

import React from 'react';
import { WorksheetResponse, VisualElement, InteractiveActivity, TeachingContent } from '@/types/worksheet';
import ActivityTemplate from './ActivityTemplate';
import VisualElementDisplay from './VisualElementDisplay';

interface EnhancedWorksheetDisplayProps {
  worksheet: WorksheetResponse;
  onExport: (type: 'pdf' | 'docx', isLoading: boolean) => void;
  onPrint: () => void;
  onGenerateNew: () => void;
  exportingType: 'pdf' | 'docx' | null;
}

export default function EnhancedWorksheetDisplay({
  worksheet,
  onExport,
  onPrint,
  onGenerateNew,
  exportingType
}: EnhancedWorksheetDisplayProps) {

  // Render visual elements with enhanced display
  const renderVisualElement = (visual: VisualElement, size: 'small' | 'medium' | 'large' | 'fullwidth' = 'medium') => {
    return <VisualElementDisplay visual={visual} size={size} />;
  };

  // Render different question types with TRADITIONAL WORKSHEET styling
  const renderQuestion = (question: any, index: number) => {
    return (
      <div key={question.id} className="question-item mb-6">
        {/* Traditional Question Layout */}
        <div className="flex items-start mb-3">
          <span className="font-bold text-black mr-3 text-lg min-w-[2rem]">
            {index + 1}.
          </span>
          <div className="flex-1">
            <p className="text-black font-medium text-lg leading-relaxed mb-3">
              {question.question}
            </p>

            {/* Question Content - Traditional Worksheet Style */}
            {question.type === 'multiple-choice' && question.options && (
              <div className="ml-4 space-y-2">
                {question.options.map((option: string, optIndex: number) => (
                  <div key={optIndex} className="flex items-start">
                    <span className="font-bold mr-3 text-black min-w-[1.5rem]">
                      {String.fromCharCode(65 + optIndex)}.
                    </span>
                    <span className="text-black">{option}</span>
                  </div>
                ))}
                <div className="mt-4 text-black">
                  <strong>Answer: ______</strong>
                </div>
              </div>
            )}

            {question.type === 'fill-blank' && (
              <div className="ml-4">
                <div className="text-black mb-2">
                  Complete the sentence:
                </div>
                <div className="border-b-2 border-black w-64 inline-block"></div>
              </div>
            )}

            {question.type === 'short-answer' && (
              <div className="ml-4 space-y-2">
                <div className="border-b border-black w-full h-6"></div>
                <div className="border-b border-black w-full h-6"></div>
                <div className="border-b border-black w-full h-6"></div>
              </div>
            )}

            {question.type === 'true-false' && (
              <div className="ml-4 flex space-x-8 mt-2">
                <div className="flex items-center">
                  <span className="border-2 border-black w-6 h-6 mr-2"></span>
                  <span className="text-black font-medium">True</span>
                </div>
                <div className="flex items-center">
                  <span className="border-2 border-black w-6 h-6 mr-2"></span>
                  <span className="text-black font-medium">False</span>
                </div>
              </div>
            )}

            {question.type === 'matching' && question.options && (
              <div className="ml-4 grid grid-cols-2 gap-8 mt-4">
                <div>
                  <p className="font-bold text-black mb-2">Column A:</p>
                  {question.options.slice(0, Math.ceil(question.options.length / 2)).map((option: string, idx: number) => (
                    <div key={idx} className="flex mb-2">
                      <span className="font-bold mr-2 text-black min-w-[1.5rem]">{idx + 1}.</span>
                      <span className="text-black">{option}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-black mb-2">Column B:</p>
                  {question.options.slice(Math.ceil(question.options.length / 2)).map((option: string, idx: number) => (
                    <div key={idx} className="flex mb-2">
                      <span className="font-bold mr-2 text-black min-w-[1.5rem]">{String.fromCharCode(65 + idx)}.</span>
                      <span className="text-black">{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {question.type === 'drawing' && (
              <div className="ml-4 mt-4">
                <div className="border-2 border-black h-32 w-full bg-white relative">
                  <div className="absolute inset-2 border border-gray-300 border-dashed"></div>
                  <p className="text-center text-gray-500 mt-12">Drawing Space</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render interactive activities using specialized templates
  const renderInteractiveActivity = (activity: InteractiveActivity) => {
    return <ActivityTemplate key={activity.id} activity={activity} />;
  };

  return (
    <div className="worksheet-container bg-white">
      {/* Print/Export Controls */}
      <div className="no-print mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Worksheet Actions</h2>
          <div className="flex gap-3">
            <button
              onClick={onPrint}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              🖨️ Print
            </button>
            <button
              onClick={() => onExport('pdf', true)}
              disabled={exportingType === 'pdf'}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {exportingType === 'pdf' ? 'Generating PDF...' : '📄 Export PDF'}
            </button>
            <button
              onClick={() => onExport('docx', true)}
              disabled={exportingType === 'docx'}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {exportingType === 'docx' ? 'Generating DOCX...' : '📝 Export DOCX'}
            </button>
            <button
              onClick={onGenerateNew}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              🔄 Generate New
            </button>
          </div>
        </div>
      </div>

      {/* TRADITIONAL WORKSHEET LAYOUT */}
      <div className="worksheet-content bg-white p-8 shadow-lg max-w-4xl mx-auto">
        
        {/* Header Section - Traditional */}
        <div className="worksheet-header mb-8 pb-4 border-b-2 border-black">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-black mb-2">
                {worksheet.title}
              </h1>
              <div className="text-black text-lg">
                <strong>Subject:</strong> {worksheet.title.split(' - ')[0] || 'General Studies'}
              </div>
            </div>
            <div className="text-right text-black">
              <div className="mb-2">
                <strong>Name:</strong> _____________________
              </div>
              <div className="mb-2">
                <strong>Date:</strong> _____________________
              </div>
              <div>
                <strong>Class:</strong> ___________________
              </div>
            </div>
          </div>
          
          {/* Instructions - Traditional Style */}
          {worksheet.instructions && (
            <div className="instructions-box border-2 border-black p-4 bg-gray-50">
              <h3 className="font-bold text-black mb-2">📋 Instructions:</h3>
              <p className="text-black text-base leading-relaxed">
                {worksheet.instructions}
              </p>
            </div>
          )}
        </div>

        {/* Header Visual Elements */}
        {worksheet.visualElements?.filter(v => v.placement === 'header').map((visual, index) => (
          <div key={index} className="mb-6 text-center">
            {renderVisualElement(visual, 'large')}
          </div>
        ))}

        {/* Teaching Content Section - Page 1 */}
        {worksheet.teachingContent && (
          <div className="teaching-content-section mb-8 p-6 border-2 border-black bg-blue-50">
            <h2 className="text-2xl font-bold text-black mb-6 text-center border-b-2 border-black pb-2">
              📚 Learn About This Topic
            </h2>
            
            {/* Introduction */}
            {worksheet.teachingContent.introduction && (
              <div className="mb-6">
                <p className="text-black text-lg leading-relaxed font-medium">
                  {worksheet.teachingContent.introduction}
                </p>
              </div>
            )}

            {/* Main Concepts */}
            {worksheet.teachingContent.mainConcepts && worksheet.teachingContent.mainConcepts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black mb-4 border-b border-gray-400 pb-1">
                  🔑 Key Concepts:
                </h3>
                {worksheet.teachingContent.mainConcepts.map((concept, index) => (
                  <div key={index} className="mb-4 p-4 bg-white border border-gray-300 rounded">
                    <h4 className="text-lg font-bold text-black mb-2">{concept.title}</h4>
                    <p className="text-black mb-3 leading-relaxed">{concept.explanation}</p>
                    {concept.examples && concept.examples.length > 0 && (
                      <div>
                        <strong className="text-black">Examples:</strong>
                        <ul className="list-disc list-inside ml-4 text-black">
                          {concept.examples.map((example, exIndex) => (
                            <li key={exIndex} className="mb-1">{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Vocabulary */}
            {worksheet.teachingContent.vocabulary && worksheet.teachingContent.vocabulary.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black mb-4 border-b border-gray-400 pb-1">
                  📖 Important Words:
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {worksheet.teachingContent.vocabulary.map((vocab, index) => (
                    <div key={index} className="p-3 bg-white border border-gray-300 rounded">
                      <strong className="text-black text-lg">{vocab.term}:</strong>
                      <span className="text-black ml-2">{vocab.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fun Facts */}
            {worksheet.teachingContent.funFacts && worksheet.teachingContent.funFacts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black mb-4 border-b border-gray-400 pb-1">
                  🌟 Fun Facts:
                </h3>
                <ul className="space-y-2">
                  {worksheet.teachingContent.funFacts.map((fact, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-black mr-2">•</span>
                      <span className="text-black leading-relaxed">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Summary */}
            {worksheet.teachingContent.summary && (
              <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500">
                <h3 className="text-lg font-bold text-black mb-2">📝 Summary:</h3>
                <p className="text-black leading-relaxed">{worksheet.teachingContent.summary}</p>
              </div>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div className="worksheet-body">
          
          {/* Questions Section */}
          {worksheet.questions && worksheet.questions.length > 0 && (
            <div className="questions-section mb-8">
              <h2 className="text-xl font-bold text-black mb-6 border-b border-black pb-2">
                Questions:
              </h2>
              {worksheet.questions.map((question, index) => renderQuestion(question, index))}
            </div>
          )}

          {/* Interactive Activities Section */}
          {worksheet.activities && worksheet.activities.length > 0 && (
            <div className="activities-section mb-8">
              <h2 className="text-xl font-bold text-black mb-6 border-b border-black pb-2">
                Activities:
              </h2>
              {worksheet.activities.map(renderInteractiveActivity)}
            </div>
          )}

          {/* Current Events Section */}
          {worksheet.currentEvents && worksheet.currentEvents.length > 0 && (
            <div className="current-events-section mb-8">
              <h2 className="text-xl font-bold text-black mb-6 border-b border-black pb-2">
                📰 Current Events Connection:
              </h2>
              {worksheet.currentEvents.map((event, index) => (
                <div key={index} className="mb-4 p-4 border border-black">
                  <h4 className="font-bold text-black mb-2">{event.title}</h4>
                  <p className="text-black text-sm mb-2">{event.summary}</p>
                  <p className="text-xs text-gray-600">Relevance: {event.relevance}</p>
                </div>
              ))}
            </div>
          )}

          {/* Footer Visual Elements */}
          {worksheet.visualElements?.filter(v => v.placement === 'background' || v.placement === 'sidebar').map((visual, index) => (
            <div key={index} className="mb-4 text-center">
              {renderVisualElement(visual, 'fullwidth')}
            </div>
          ))}
        </div>

        {/* Answer Key Section (if provided) */}
        {worksheet.answerKey && (
          <div className="answer-key-section mt-8 pt-6 border-t-2 border-black">
            <h2 className="text-xl font-bold text-black mb-4">📝 Answer Key:</h2>
            <div className="bg-gray-100 p-4 border border-black">
              {worksheet.answerKey?.map((answer, index) => (
                <div key={index} className="mb-2 text-black">
                  <strong>{index + 1}.</strong> {answer.answer}
                  {answer.explanation && (
                    <span className="ml-2 text-sm text-gray-700">
                      ({answer.explanation})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
