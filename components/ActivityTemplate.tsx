'use client';

import React from 'react';
import { InteractiveActivity } from '@/types/worksheet';

interface ActivityTemplateProps {
  activity: InteractiveActivity;
}

export default function ActivityTemplate({ activity }: ActivityTemplateProps) {
  const renderActivityContent = () => {
    switch (activity.type) {
      case 'coloring':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 bg-white min-h-[300px] coloring-area">
              <div className="text-center text-orange-600">
                <span className="text-6xl block mb-4">🎨</span>
                <p className="font-bold text-xl mb-2">Coloring Activity</p>
                <p className="text-lg">Use your favorite colors to bring this to life!</p>
                <div className="mt-6 flex justify-center space-x-4">
                  {['🖍️', '✏️', '🖊️', '🎨'].map((emoji, idx) => (
                    <span key={idx} className="text-3xl">{emoji}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'cut-and-paste':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50 min-h-[200px] cut-paste-area">
                <div className="text-center text-blue-700">
                  <span className="text-4xl block mb-3">✂️</span>
                  <p className="font-bold text-lg mb-2">Cut Items From Here</p>
                  <p className="text-sm">Carefully cut along the dotted lines</p>
                  <div className="mt-4 space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="border-2 border-dashed border-blue-400 p-3 bg-white rounded">
                        <p className="text-gray-600">Item {item} to cut</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-green-300 rounded-lg p-6 bg-green-50 min-h-[200px]">
                <div className="text-center text-green-700">
                  <span className="text-4xl block mb-3">📋</span>
                  <p className="font-bold text-lg mb-2">Paste Items Here</p>
                  <p className="text-sm">Arrange the cut items in the correct order</p>
                  <div className="mt-4 space-y-3">
                    {[1, 2, 3, 4].map((slot) => (
                      <div key={slot} className="border-2 border-dashed border-green-400 p-4 bg-white rounded min-h-[50px] flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Slot {slot}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'matching-game':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="font-bold text-gray-700 mb-4 text-center bg-blue-100 p-2 rounded">Column A</h4>
                {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item, idx) => (
                  <div key={idx} className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50 flex items-center">
                    <div className="w-8 h-8 border-2 border-blue-500 rounded-full mr-4 flex items-center justify-center font-bold text-blue-600">
                      {idx + 1}
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-bold text-gray-700 mb-4 text-center bg-green-100 p-2 rounded">Column B</h4>
                {['Match A', 'Match B', 'Match C', 'Match D'].map((match, idx) => (
                  <div key={idx} className="p-4 border-2 border-green-200 rounded-lg bg-green-50 flex items-center">
                    <div className="w-8 h-8 border-2 border-green-500 rounded-full mr-4 flex items-center justify-center font-bold text-green-600">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-gray-700">{match}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-center">
                <span className="font-bold">Instructions:</span> Draw lines to connect items in Column A with their matches in Column B
              </p>
            </div>
          </div>
        );

      case 'maze':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-bold text-purple-800 mb-4 text-center">Navigate the Maze</h4>
              <div className="bg-white p-4 rounded border-2 border-purple-200">
                <div className="grid grid-cols-10 gap-1" style={{ minHeight: '300px' }}>
                  {Array.from({ length: 100 }, (_, i) => {
                    const isPath = Math.random() > 0.3; // 70% walls, 30% paths
                    const isStart = i === 0;
                    const isEnd = i === 99;
                    return (
                      <div 
                        key={i} 
                        className={`w-6 h-6 border border-gray-200 ${
                          isStart ? 'bg-green-400' : 
                          isEnd ? 'bg-red-400' : 
                          isPath ? 'bg-white' : 'bg-gray-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-purple-700">
                  <span className="inline-block w-4 h-4 bg-green-400 mr-2"></span>Start 
                  <span className="inline-block w-4 h-4 bg-red-400 ml-4 mr-2"></span>Finish
                </p>
              </div>
            </div>
          </div>
        );

      case 'crossword':
        return (
          <div className="space-y-4">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h4 className="font-bold text-indigo-800 mb-4 text-center">Crossword Puzzle</h4>
              <div className="grid grid-cols-8 gap-1 bg-white p-4 rounded">
                {Array.from({ length: 64 }, (_, i) => {
                  const isBlack = Math.random() > 0.7;
                  const hasNumber = Math.random() > 0.8;
                  return (
                    <div key={i} className={`w-8 h-8 border border-gray-300 flex items-center justify-center text-xs ${
                      isBlack ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      {!isBlack && hasNumber && <span className="text-xs">{Math.floor(Math.random() * 20) + 1}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-indigo-700 mb-2">Across</h5>
                  <div className="space-y-1 text-sm">
                    <p>1. First clue (5 letters)</p>
                    <p>3. Second clue (4 letters)</p>
                    <p>5. Third clue (6 letters)</p>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-indigo-700 mb-2">Down</h5>
                  <div className="space-y-1 text-sm">
                    <p>2. First down clue (3 letters)</p>
                    <p>4. Second down clue (7 letters)</p>
                    <p>6. Third down clue (5 letters)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'role-play':
        return (
          <div className="space-y-6">
            <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
              <h4 className="font-bold text-pink-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🎭</span>
                Role-Play Activity
              </h4>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">🎭 Your Character:</h5>
                  <div className="border-2 border-dashed border-gray-300 p-4 rounded min-h-[60px]">
                    <p className="text-gray-500 text-center">Describe your character here</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">📝 Scene Setting:</h5>
                  <div className="border-2 border-dashed border-gray-300 p-4 rounded min-h-[60px]">
                    <p className="text-gray-500 text-center">What is happening in this scene?</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">💬 Key Dialogue:</h5>
                  <div className="space-y-2">
                    {[1, 2, 3].map((line) => (
                      <div key={line} className="flex items-center space-x-2">
                        <span className="font-medium text-gray-600">Line {line}:</span>
                        <div className="border-b-2 border-gray-300 flex-1 h-6"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'word-search':
        return (
          <div className="space-y-4">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h4 className="font-bold text-indigo-800 mb-4 text-center">Word Search Puzzle</h4>
              <div className="grid grid-cols-10 gap-1 bg-white p-4 rounded">
                {Array.from({ length: 100 }, (_, i) => (
                  <div key={i} className="w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-mono">
                    {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {['WORD1', 'WORD2', 'WORD3', 'WORD4'].map((word) => (
                  <div key={word} className="bg-white p-2 rounded text-center border">
                    <span className="text-sm font-medium text-gray-700">{word}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'research':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Research Project
              </h4>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">🎯 Research Question:</h5>
                  <div className="border-b-2 border-gray-300 w-full h-8"></div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">� Sources to Explore:</h5>
                  <div className="space-y-2">
                    {[1, 2, 3].map((source) => (
                      <div key={source} className="flex items-center space-x-2">
                        <span className="font-medium text-gray-600">Source {source}:</span>
                        <div className="border-b-2 border-gray-300 flex-1 h-6"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">📝 Key Findings:</h5>
                  <div className="space-y-2">
                    {[1, 2, 3].map((finding) => (
                      <div key={finding} className="border-b border-gray-300 h-6"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'discussion':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h4 className="font-bold text-green-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">💬</span>
                Discussion Activity
              </h4>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">🤔 Discussion Questions:</h5>
                  <div className="space-y-3">
                    {[1, 2, 3].map((q) => (
                      <div key={q} className="flex items-start space-x-2">
                        <span className="font-medium text-gray-600 mt-1">{q}.</span>
                        <div className="border-b border-gray-300 flex-1 h-6"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">� Your Thoughts:</h5>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((line) => (
                      <div key={line} className="border-b border-gray-300 h-6"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'presentation':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🎤</span>
                Presentation Activity
              </h4>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">📋 Presentation Plan:</h5>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-600">Topic:</span>
                      <div className="border-b border-gray-300 mt-1 h-6"></div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Main Points:</span>
                      <div className="space-y-1 mt-1">
                        {[1, 2, 3].map((point) => (
                          <div key={point} className="border-b border-gray-300 h-6"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">🎯 Visual Aids Needed:</h5>
                  <div className="space-y-2">
                    {[1, 2].map((aid) => (
                      <div key={aid} className="border-b border-gray-300 h-6"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <span className="text-4xl block mb-2">🎯</span>
            <p className="font-medium text-gray-700">Interactive Activity</p>
            <p className="text-sm text-gray-500 mt-2">Follow the instructions for this activity</p>
          </div>
        );
    }
  };

  return (
    <div className="activity-container p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200 shadow-sm">
      {/* Activity Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="text-3xl mr-3">🎨</span>
          <div>
            <h3 className="font-bold text-xl text-orange-800">{activity.title}</h3>
            <p className="text-orange-600 text-sm">{activity.type.replace('-', ' ').toUpperCase()}</p>
          </div>
        </div>
        
        {activity.estimatedTime && (
          <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
            ⏱️ {activity.estimatedTime}
          </div>
        )}
      </div>

      {/* Activity Instructions */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-orange-100">
        <p className="text-gray-700 leading-relaxed">{activity.instructions}</p>
      </div>

      {/* Materials Section */}
      {activity.materials && activity.materials.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">📦</span>
            Materials Needed:
          </h4>
          <div className="flex flex-wrap gap-2">
            {activity.materials.map((material, idx) => (
              <span key={idx} className="bg-white px-3 py-2 rounded-full text-sm text-gray-600 border border-orange-200 shadow-sm">
                {material}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Activity Content */}
      <div className="activity-content">
        {renderActivityContent()}
      </div>
    </div>
  );
}
