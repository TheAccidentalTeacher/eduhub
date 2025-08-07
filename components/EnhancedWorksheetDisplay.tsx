'use client';

import React from 'react';
import { WorksheetResponse, VisualElement, InteractiveActivity } from '@/types/worksheet';
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

  // Render different question types with enhanced styling
  const renderQuestion = (question: any, index: number) => {
    // Use direct visualAid assignment from improved generation logic
    const hasVisualAid = question.visualAid;

    return (
      <div key={question.id} className="question-item mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Question Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-gray-800 flex-1">
            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 inline-flex">
              {index + 1}
            </span>
            {question.question}
          </h3>
          <div className="flex items-center gap-2 ml-4">
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
              {question.points} pts
            </span>
            {question.bloomsLevel && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {question.bloomsLevel}
              </span>
            )}
          </div>
        </div>

        {/* Question-Specific Visual Aid */}
        {hasVisualAid && (
          <div className="mb-4">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={question.visualAid} 
                alt={question.visualDescription || "Question illustration"}
                className="w-full h-64 object-cover"
              />
              {question.visualDescription && (
                <div className="p-3 bg-gray-50 text-sm text-gray-600 italic">
                  {question.visualDescription}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Question Hint */}
        {question.hint && (
          <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <div className="flex items-center">
              <span className="text-amber-600 mr-2">💡</span>
              <span className="text-amber-800 font-medium">Hint:</span>
            </div>
            <p className="text-amber-700 mt-1 ml-6">{question.hint}</p>
          </div>
        )}

        {/* Question Content Based on Type */}
        <div className="ml-2">
          {question.type === 'multiple-choice' && question.options && (
            <div className="space-y-3">
              {(() => {
                // Handle both array and object formats for options
                let optionsArray: string[] = [];
                if (Array.isArray(question.options)) {
                  optionsArray = question.options;
                } else if (typeof question.options === 'object') {
                  // If options is an object, convert keys to array
                  optionsArray = Object.keys(question.options);
                }
                
                return optionsArray.map((option: string, optIndex: number) => (
                  <div key={optIndex} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                    <div className="w-6 h-6 border-2 border-blue-400 rounded-full mr-4 flex items-center justify-center font-bold text-blue-600">
                      {String.fromCharCode(65 + optIndex)}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                ));
              })()}
            </div>
          )}

          {question.type === 'fill-blank' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Answer:</span>
                <div className="border-b-3 border-blue-400 border-dashed w-48 pb-1"></div>
              </div>
            </div>
          )}

          {question.type === 'short-answer' && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[120px] bg-gray-50">
                <div className="flex items-center text-gray-400 mb-2">
                  <span className="mr-2">✏️</span>
                  <span className="text-sm">Write your answer here...</span>
                </div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-b border-gray-300 h-4"></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {question.type === 'true-false' && (
            <div className="flex space-x-6">
              <div className="flex items-center p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                <div className="w-6 h-6 border-2 border-green-500 rounded mr-3"></div>
                <span className="text-green-700 font-semibold text-lg">True</span>
              </div>
              <div className="flex items-center p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                <div className="w-6 h-6 border-2 border-red-500 rounded mr-3"></div>
                <span className="text-red-700 font-semibold text-lg">False</span>
              </div>
            </div>
          )}

          {question.type === 'drawing' && (
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 min-h-[200px] bg-purple-50">
              <div className="text-center">
                <span className="text-purple-600 text-lg">🎨</span>
                <p className="text-purple-700 mt-2 font-medium">Draw your answer in this space</p>
                <p className="text-purple-600 text-sm mt-1">Use pencils, crayons, or markers</p>
              </div>
            </div>
          )}

          {question.type === 'matching' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 mb-3">Column A</h4>
                {/* This would be populated by the AI with matching items */}
                <div className="p-3 border rounded bg-blue-50">Item 1</div>
                <div className="p-3 border rounded bg-blue-50">Item 2</div>
                <div className="p-3 border rounded bg-blue-50">Item 3</div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 mb-3">Column B</h4>
                <div className="p-3 border rounded bg-green-50">Match A</div>
                <div className="p-3 border rounded bg-green-50">Match B</div>
                <div className="p-3 border rounded bg-green-50">Match C</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render interactive activities using specialized templates
  const renderInteractiveActivity = (activity: InteractiveActivity) => {
    return <ActivityTemplate key={activity.id} activity={activity} />;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50 worksheet-container">
      <div className="max-w-5xl mx-auto">
        {/* Header with Export Controls */}
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4 no-print">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{worksheet.title}</h1>
            {worksheet.pedagogicalNotes && (
              <p className="text-gray-600 text-sm bg-blue-50 px-3 py-1 rounded-full inline-block">
                📚 Enhanced with pedagogical intelligence
              </p>
            )}
          </div>
          
          <div className="flex gap-3 flex-wrap export-buttons">
            <button
              onClick={() => onExport('pdf', true)}
              disabled={exportingType === 'pdf'}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md"
            >
              {exportingType === 'pdf' ? '⏳' : '📄'} Export PDF
            </button>
            <button
              onClick={() => onExport('docx', true)}
              disabled={exportingType === 'docx'}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md"
            >
              {exportingType === 'docx' ? '⏳' : '📝'} Export DOCX
            </button>
            <button
              onClick={onPrint}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md"
            >
              🖨️ Print
            </button>
            <button
              onClick={onGenerateNew}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md"
            >
              ✨ Generate New
            </button>
          </div>
        </div>

        {/* Main Worksheet Content */}
        <div id="worksheet-content" className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header Visual Elements */}
          {worksheet.visualElements?.filter(v => v.placement === 'header').map((visual) => (
            <div key={visual.id} className="mb-8">
              {renderVisualElement(visual, 'fullwidth')}
            </div>
          ))}

          {/* Enhanced Instructions */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📋</span>
              <h2 className="text-2xl font-bold text-blue-800">Instructions</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{worksheet.instructions}</p>
            
            {/* Pedagogical Notes for Teachers */}
            {worksheet.pedagogicalNotes && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 no-print">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-600 mr-2">👩‍🏫</span>
                  <span className="font-semibold text-yellow-800">Teacher Notes:</span>
                </div>
                <p className="text-yellow-700 text-sm">{worksheet.pedagogicalNotes}</p>
              </div>
            )}
          </div>

          {/* Current Events Connection */}
          {worksheet.currentEvents && worksheet.currentEvents.length > 0 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🌍</span>
                <h3 className="text-xl font-bold text-green-800">Real-World Connection</h3>
              </div>
              {worksheet.currentEvents.map((event) => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-bold text-green-700 mb-2">{event.title}</h4>
                  <p className="text-gray-600 mb-2">{event.summary}</p>
                  <p className="text-green-600 italic text-sm">🔗 {event.relevance}</p>
                </div>
              ))}
            </div>
          )}

          {/* Questions Section */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">❓</span>
              <h2 className="text-2xl font-bold text-gray-800">Questions</h2>
              {worksheet.difficultyProgression && (
                <span className="ml-auto bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  📈 {worksheet.difficultyProgression}
                </span>
              )}
            </div>
            {worksheet.questions.map((question, index) => renderQuestion(question, index))}
          </div>

          {/* Interactive Activities */}
          {worksheet.activities && worksheet.activities.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">🎮</span>
                <h2 className="text-2xl font-bold text-gray-800">Interactive Activities</h2>
              </div>
              <div className="space-y-6">
                {worksheet.activities.map((activity) => renderInteractiveActivity(activity))}
              </div>
            </div>
          )}

          {/* Enhanced Answer Key */}
          {worksheet.answerKey && worksheet.answerKey.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-gray-200 answer-key">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">🔑</span>
                <h2 className="text-2xl font-bold text-green-800">Answer Key</h2>
                <span className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm no-print">
                  For Teachers Only
                </span>
              </div>
              <div className="space-y-4">
                {worksheet.answerKey.map((answer, index) => (
                  <div key={answer.questionId} className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-start">
                      <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-green-800 mb-2">
                          Answer: {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                        </p>
                        {answer.explanation && (
                          <div className="bg-white p-3 rounded-lg text-sm text-gray-700 mb-2">
                            <span className="font-semibold">Explanation:</span> {answer.explanation}
                          </div>
                        )}
                        {(answer as any).pedagogicalReasoning && (
                          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                            <span className="font-semibold">Teaching Note:</span> {(answer as any).pedagogicalReasoning}
                          </div>
                        )}
                      </div>
                    </div>
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
