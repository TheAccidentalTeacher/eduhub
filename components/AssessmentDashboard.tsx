'use client';

import React, { useState } from 'react';
import { WorksheetResponse, PedagogicalFramework, AssessmentCriteria, AdaptiveRecommendation } from '@/types/worksheet';

interface AssessmentDashboardProps {
  worksheet: WorksheetResponse;
}

export default function AssessmentDashboard({ worksheet }: AssessmentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'framework' | 'assessment' | 'recommendations' | 'analytics'>('framework');

  if (!worksheet.pedagogicalFramework && !worksheet.assessmentCriteria && !worksheet.adaptiveRecommendations) {
    return null; // Don't show if no pedagogical data
  }

  const tabs = [
    { id: 'framework', label: 'Pedagogical Framework', icon: '🎯' },
    { id: 'assessment', label: 'Assessment Criteria', icon: '📊' },
    { id: 'recommendations', label: 'Adaptive Recommendations', icon: '💡' },
    { id: 'analytics', label: 'Learning Analytics', icon: '📈' }
  ];

  const renderFramework = () => {
    if (!worksheet.pedagogicalFramework) return null;
    
    const framework = worksheet.pedagogicalFramework;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Bloom's Taxonomy */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🌸</span>
              <h4 className="font-bold text-blue-800">Bloom's Taxonomy</h4>
            </div>
            <div className="bg-blue-100 px-3 py-2 rounded-full text-center">
              <span className="font-semibold text-blue-900 capitalize">{framework.bloomsLevel}</span>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Questions target {framework.bloomsLevel}-level thinking skills
            </p>
          </div>

          {/* Depth of Knowledge */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🎚️</span>
              <h4 className="font-bold text-green-800">DOK Level</h4>
            </div>
            <div className="bg-green-100 px-3 py-2 rounded-full text-center">
              <span className="font-semibold text-green-900">Level {framework.dokLevel}</span>
            </div>
            <p className="text-sm text-green-700 mt-2">
              {framework.dokLevel === 1 && 'Recall & Recognition'}
              {framework.dokLevel === 2 && 'Skills & Concepts'}
              {framework.dokLevel === 3 && 'Strategic Thinking'}
              {framework.dokLevel === 4 && 'Extended Thinking'}
            </p>
          </div>

          {/* Multiple Intelligence */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🧠</span>
              <h4 className="font-bold text-purple-800">Multiple Intelligence</h4>
            </div>
            <div className="bg-purple-100 px-3 py-2 rounded-full text-center">
              <span className="font-semibold text-purple-900 capitalize text-sm">
                {framework.multipleIntelligence.replace('-', ' ')}
              </span>
            </div>
            <p className="text-sm text-purple-700 mt-2">
              Designed for {framework.multipleIntelligence.replace('-', ' ')} learners
            </p>
          </div>

          {/* UDL Principle */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">♿</span>
              <h4 className="font-bold text-orange-800">UDL Principle</h4>
            </div>
            <div className="bg-orange-100 px-3 py-2 rounded-full text-center">
              <span className="font-semibold text-orange-900 capitalize text-sm">
                {framework.udlPrinciple.replace('-', ' ')}
              </span>
            </div>
            <p className="text-sm text-orange-700 mt-2">
              Universal Design for Learning focus
            </p>
          </div>

          {/* Cognitive Load */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">⚡</span>
              <h4 className="font-bold text-yellow-800">Cognitive Load</h4>
            </div>
            <div className="bg-yellow-100 px-3 py-2 rounded-full text-center">
              <span className="font-semibold text-yellow-900 capitalize">{framework.cognitiveLoad}</span>
            </div>
            <p className="text-sm text-yellow-700 mt-2">
              Optimized information processing load
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAssessment = () => {
    if (!worksheet.assessmentCriteria) return null;
    
    const assessment = worksheet.assessmentCriteria;
    
    return (
      <div className="space-y-6">
        {/* Assessment Type */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">📋</span>
            <h4 className="font-bold text-indigo-800">Assessment Type</h4>
          </div>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
            {assessment.type}
          </span>
        </div>

        {/* Learning Objectives */}
        {assessment.learningObjectives && assessment.learningObjectives.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">🎯</span>
              <h4 className="font-bold text-green-800">Learning Objectives</h4>
            </div>
            <ul className="space-y-2">
              {assessment.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-green-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Success Criteria */}
        {assessment.successCriteria && assessment.successCriteria.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">✅</span>
              <h4 className="font-bold text-blue-800">Success Criteria</h4>
            </div>
            <ul className="space-y-2">
              {assessment.successCriteria.map((criteria, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="text-blue-700">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rubric */}
        {assessment.rubric && assessment.rubric.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">📏</span>
              <h4 className="font-bold text-purple-800">Assessment Rubric</h4>
            </div>
            {assessment.rubric.map((criterion, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h5 className="font-semibold text-purple-700 mb-2">{criterion.criterion}</h5>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {criterion.levels.map((level) => (
                    <div key={level.level} className="bg-white border border-purple-200 rounded p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-purple-800">Level {level.level}</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          {level.points} pts
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{level.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderRecommendations = () => {
    if (!worksheet.adaptiveRecommendations || worksheet.adaptiveRecommendations.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl block mb-2">💡</span>
          <p>No adaptive recommendations available</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {worksheet.adaptiveRecommendations.map((rec, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {rec.type === 'next-steps' && '⏭️'}
                  {rec.type === 'prerequisite' && '📚'}
                  {rec.type === 'extension' && '🚀'}
                  {rec.type === 'remediation' && '🔧'}
                  {rec.type === 'accommodation' && '♿'}
                </span>
                <div>
                  <h4 className="font-bold text-gray-800">{rec.title}</h4>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium capitalize">
                    {rec.type.replace('-', ' ')}
                  </span>
                </div>
              </div>
              {rec.estimatedTime && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  ⏱️ {rec.estimatedTime}
                </span>
              )}
            </div>
            
            <p className="text-gray-700 mb-3">{rec.description}</p>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Reasoning:</span> {rec.reasoning}
              </p>
            </div>
            
            {rec.resources && rec.resources.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-gray-700 mb-1">Additional Resources:</p>
                <ul className="text-sm text-gray-600">
                  {rec.resources.map((resource, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2">📄</span>
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!worksheet.learningAnalytics) {
      return (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl block mb-2">📈</span>
          <p>No learning analytics available</p>
        </div>
      );
    }
    
    const analytics = worksheet.learningAnalytics;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analytics.completionTime && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">⏱️</span>
              <h4 className="font-bold text-blue-800">Estimated Time</h4>
            </div>
            <div className="text-2xl font-bold text-blue-900">{analytics.completionTime} min</div>
          </div>
        )}
        
        {analytics.difficultyRating && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">⭐</span>
              <h4 className="font-bold text-orange-800">Difficulty</h4>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < analytics.difficultyRating! ? 'text-orange-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        )}
        
        {analytics.engagementLevel && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🎯</span>
              <h4 className="font-bold text-green-800">Engagement</h4>
            </div>
            <div className={`px-3 py-1 rounded-full text-center font-semibold ${
              analytics.engagementLevel === 'high' ? 'bg-green-200 text-green-800' :
              analytics.engagementLevel === 'medium' ? 'bg-yellow-200 text-yellow-800' :
              'bg-red-200 text-red-800'
            }`}>
              {analytics.engagementLevel.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-200 no-print">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🧠</span>
          <h2 className="text-xl font-bold text-gray-800">Pedagogical Intelligence Dashboard</h2>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-800 shadow-sm'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'framework' && renderFramework()}
        {activeTab === 'assessment' && renderAssessment()}
        {activeTab === 'recommendations' && renderRecommendations()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
}
