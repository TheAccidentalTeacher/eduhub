// Modern Worksheet Renderer - TikTok-level visual appeal for print
'use client';

import React from 'react';
import { WorksheetResponse } from '@/types/worksheet';

interface ModernWorksheetRendererProps {
  worksheet: WorksheetResponse;
  strategy?: any; // EducationalStrategy from advanced engine
  gradeLevel?: string;
  topic?: string;
}

export default function ModernWorksheetRenderer({ 
  worksheet, 
  strategy,
  gradeLevel = '5',
  topic = 'General'
}: ModernWorksheetRendererProps) {

  // Modern color palettes based on grade level and topic
  const getModernColorScheme = (gradeLevel: string, topic: string) => {
    const grade = parseInt(gradeLevel.match(/\d+/)?.[0] || '5');
    
    if (grade <= 3) {
      return {
        primary: 'from-pink-400 to-purple-500',
        secondary: 'from-blue-300 to-cyan-400',
        accent: 'from-yellow-300 to-orange-400',
        background: 'bg-gradient-to-br from-pink-50 to-purple-50',
        text: 'text-gray-800'
      };
    } else if (grade <= 8) {
      return {
        primary: 'from-blue-500 to-indigo-600',
        secondary: 'from-green-400 to-teal-500',
        accent: 'from-orange-400 to-red-500',
        background: 'bg-gradient-to-br from-blue-50 to-indigo-100',
        text: 'text-gray-900'
      };
    } else {
      return {
        primary: 'from-gray-700 to-gray-900',
        secondary: 'from-blue-600 to-purple-700',
        accent: 'from-green-500 to-blue-600',
        background: 'bg-gradient-to-br from-gray-50 to-blue-50',
        text: 'text-gray-900'
      };
    }
  };

  const colors = getModernColorScheme(gradeLevel, topic);

  // Modern section headers with TikTok-style appeal
  const ModernSectionHeader = ({ 
    icon, 
    title, 
    subtitle, 
    colorScheme = 'primary' 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    colorScheme?: 'primary' | 'secondary' | 'accent';
  }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${colors[colorScheme]} p-6 mb-8 shadow-xl`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white/10 -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white/10 translate-x-12 translate-y-12"></div>
      </div>
      
      <div className="relative flex items-center">
        <div className="text-4xl mr-4 filter drop-shadow-lg">{icon}</div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-white/90 text-lg font-medium">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Modern question card with Instagram-like appeal
  const ModernQuestionCard = ({ question, index }: { question: any; index: number }) => (
    <div className="mb-8 page-break-inside-avoid">
      {/* Question container with modern styling */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Question header with gradient */}
        <div className={`bg-gradient-to-r ${colors.primary} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">{index + 1}</span>
              </div>
              <span className="text-white font-semibold text-lg">Question {index + 1}</span>
            </div>
            <div className="flex gap-2">
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {question.points} pts
              </span>
              {question.bloomsLevel && (
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {question.bloomsLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Question content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 leading-relaxed">
            {question.question}
          </h3>

          {/* Visual aid if present */}
          {question.visualAid && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-lg w-full">
              <img 
                src={question.visualAid} 
                alt="Question visual aid"
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Hint section */}
          {question.hint && (
            <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-400">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">💡</span>
                <span className="font-bold text-yellow-800">Helpful Hint</span>
              </div>
              <p className="text-yellow-700 font-medium">{question.hint}</p>
            </div>
          )}

          {/* Answer options based on type */}
          {question.type === 'multiple-choice' && question.options && (
            <div className="space-y-3">
              {question.options.map((option: string, optIndex: number) => (
                <div 
                  key={optIndex}
                  className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 border-3 border-blue-400 rounded-full mr-4 flex items-center justify-center font-bold text-blue-600 group-hover:bg-blue-400 group-hover:text-white transition-all">
                    {String.fromCharCode(65 + optIndex)}
                  </div>
                  <span className="text-gray-800 font-medium text-lg">{option}</span>
                </div>
              ))}
            </div>
          )}

          {/* Other question types */}
          {question.type === 'short-answer' && (
            <div className="mt-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-dashed border-blue-300">
                <div className="text-center mb-4">
                  <span className="text-3xl">✍️</span>
                  <p className="text-blue-700 font-bold text-lg mt-2">Write Your Answer Here</p>
                </div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b-2 border-blue-300 h-8"></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {question.type === 'true-false' && (
            <div className="flex gap-6 mt-4">
              <div className="flex-1 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300 cursor-pointer group hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-green-500 rounded-full mx-auto mb-3 group-hover:bg-green-500 transition-all"></div>
                  <span className="text-green-700 font-bold text-xl">TRUE</span>
                </div>
              </div>
              <div className="flex-1 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border-2 border-red-300 cursor-pointer group hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-red-500 rounded-full mx-auto mb-3 group-hover:bg-red-500 transition-all"></div>
                  <span className="text-red-700 font-bold text-xl">FALSE</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Page break component
  const PageBreak = () => (
    <div className="page-break-before-always h-0 w-full"></div>
  );

  return (
    <div className={`min-h-screen ${colors.background} print:bg-white`}>
      <div className="max-w-4xl mx-auto px-6 py-8 print:px-0 print:py-0">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 mb-12 shadow-2xl print:shadow-none print:rounded-none">
          {/* Background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white/30 -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white/20 translate-x-16 translate-y-16"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white/10"></div>
          </div>
          
          <div className="relative">
            {/* Main visual element */}
            {worksheet.visualElements?.find(v => v.placement === 'header') && (
              <div className="mb-6 text-center w-full">
                <img 
                  src={worksheet.visualElements.find(v => v.placement === 'header')?.url}
                  alt="Main illustration"
                  className="w-full h-48 object-cover rounded-2xl mx-auto shadow-xl max-w-lg"
                />
              </div>
            )}
            
            <div className="text-center">
              <h1 className="text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                {worksheet.title}
              </h1>
              <div className="flex justify-center gap-4 flex-wrap">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold">
                  📚 Enhanced with AI
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold">
                  🎯 {gradeLevel || 'Grade Appropriate'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <ModernSectionHeader 
          icon="📋" 
          title="Instructions" 
          subtitle="Read carefully before starting"
          colorScheme="secondary"
        />
        
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-xl border border-gray-100">
          <p className="text-gray-700 text-lg leading-relaxed font-medium">
            {worksheet.instructions}
          </p>
          
          {worksheet.pedagogicalNotes && (
            <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-l-4 border-amber-400">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">👨‍🏫</span>
                <span className="font-bold text-amber-800 text-lg">Teacher Notes</span>
              </div>
              <p className="text-amber-700 font-medium">{worksheet.pedagogicalNotes}</p>
            </div>
          )}
        </div>

        {/* Questions Section */}
        <ModernSectionHeader 
          icon="❓" 
          title="Questions" 
          subtitle={worksheet.difficultyProgression || "Challenge yourself!"}
          colorScheme="accent"
        />

        {worksheet.questions.map((question, index) => (
          <React.Fragment key={question.id}>
            {index > 0 && index % 3 === 0 && <PageBreak />}
            <ModernQuestionCard question={question} index={index} />
          </React.Fragment>
        ))}

        {/* Answer Key */}
        {worksheet.answerKey && worksheet.answerKey.length > 0 && (
          <>
            <PageBreak />
            <ModernSectionHeader 
              icon="🔑" 
              title="Answer Key" 
              subtitle="For teachers and parents"
              colorScheme="primary"
            />
            
            <div className="space-y-6">
              {worksheet.answerKey.map((answer, index) => (
                <div key={answer.questionId} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mr-4 mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-green-800 mb-3 text-lg">
                        Answer: {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                      </p>
                      {answer.explanation && (
                        <div className="bg-green-50 p-4 rounded-xl mb-3">
                          <span className="font-semibold text-green-800">Explanation:</span>
                          <p className="text-green-700 mt-1">{answer.explanation}</p>
                        </div>
                      )}
                      {(answer as any).pedagogicalReasoning && (
                        <div className="bg-blue-50 p-4 rounded-xl">
                          <span className="font-semibold text-blue-800">Teaching Note:</span>
                          <p className="text-blue-700 mt-1">{(answer as any).pedagogicalReasoning}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .page-break-before-always {
            page-break-before: always;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
