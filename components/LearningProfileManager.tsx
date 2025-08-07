'use client';

import React, { useState } from 'react';
import { LearningProfile } from '@/types/worksheet';

interface LearningProfileManagerProps {
  onProfileChange: (profile: LearningProfile | null) => void;
  currentProfile?: LearningProfile | null;
}

export default function LearningProfileManager({ onProfileChange, currentProfile }: LearningProfileManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [profile, setProfile] = useState<Partial<LearningProfile>>(currentProfile || {});

  const updateProfile = (updates: Partial<LearningProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    
    // Create complete profile with required ID if we have enough info
    if (newProfile.learningStyle && newProfile.difficultyLevel) {
      const completeProfile: LearningProfile = {
        id: `profile-${Date.now()}`,
        learningStyle: newProfile.learningStyle,
        difficultyLevel: newProfile.difficultyLevel,
        specialNeeds: newProfile.specialNeeds,
        englishLanguageLearner: newProfile.englishLanguageLearner || false,
        interests: newProfile.interests || [],
        strengths: newProfile.strengths || [],
        challenges: newProfile.challenges || [],
        accommodations: newProfile.accommodations || []
      };
      onProfileChange(completeProfile);
    } else {
      onProfileChange(null);
    }
  };

  const clearProfile = () => {
    setProfile({});
    onProfileChange(null);
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <span className="text-2xl mr-3">🧠</span>
          <div>
            <h3 className="font-bold text-purple-800">Learning Profile (Optional)</h3>
            <p className="text-sm text-purple-600">Customize worksheet for individual learning needs</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentProfile && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
              Profile Active
            </span>
          )}
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ⬇️
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-6">
          {/* Learning Style */}
          <div>
            <label className="block text-purple-800 font-semibold mb-2">Primary Learning Style</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'visual', icon: '👁️', label: 'Visual', desc: 'Learns through images, diagrams, colors' },
                { value: 'auditory', icon: '👂', label: 'Auditory', desc: 'Learns through listening, discussion' },
                { value: 'kinesthetic', icon: '🤚', label: 'Kinesthetic', desc: 'Learns through hands-on activities' },
                { value: 'reading-writing', icon: '📚', label: 'Reading/Writing', desc: 'Learns through text, note-taking' }
              ].map((style) => (
                <button
                  key={style.value}
                  onClick={() => updateProfile({ learningStyle: style.value as any })}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    profile.learningStyle === style.value
                      ? 'border-purple-500 bg-purple-100 text-purple-800'
                      : 'border-gray-200 hover:border-purple-300 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{style.icon}</div>
                  <div className="font-medium text-sm">{style.label}</div>
                  <div className="text-xs mt-1 opacity-75">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-purple-800 font-semibold mb-2">Academic Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'below-grade', icon: '📚', label: 'Below Grade', desc: 'Needs extra support' },
                { value: 'on-grade', icon: '🎯', label: 'On Grade', desc: 'At grade level' },
                { value: 'above-grade', icon: '🚀', label: 'Above Grade', desc: 'Advanced learner' },
                { value: 'gifted', icon: '⭐', label: 'Gifted', desc: 'Highly advanced' }
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => updateProfile({ difficultyLevel: level.value as any })}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    profile.difficultyLevel === level.value
                      ? 'border-purple-500 bg-purple-100 text-purple-800'
                      : 'border-gray-200 hover:border-purple-300 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{level.icon}</div>
                  <div className="font-medium text-sm">{level.label}</div>
                  <div className="text-xs mt-1 opacity-75">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Special Needs */}
          <div>
            <label className="block text-purple-800 font-semibold mb-2">Special Accommodations</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'dyslexia', icon: '📖', label: 'Dyslexia Support' },
                { value: 'adhd', icon: '🎯', label: 'ADHD Support' },
                { value: 'autism', icon: '🧩', label: 'Autism Support' },
                { value: 'visual-impairment', icon: '👓', label: 'Visual Support' },
                { value: 'hearing-impairment', icon: '👂', label: 'Hearing Support' }
              ].map((need) => (
                <button
                  key={need.value}
                  onClick={() => updateProfile({ 
                    specialNeeds: profile.specialNeeds === need.value ? undefined : need.value as any 
                  })}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    profile.specialNeeds === need.value
                      ? 'border-green-500 bg-green-100 text-green-800'
                      : 'border-gray-200 hover:border-green-300 text-gray-600'
                  }`}
                >
                  <div className="text-xl mb-1">{need.icon}</div>
                  <div className="font-medium text-xs">{need.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* English Language Learner */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={profile.englishLanguageLearner || false}
                onChange={(e) => updateProfile({ englishLanguageLearner: e.target.checked })}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div>
                <span className="text-purple-800 font-semibold">English Language Learner (ELL)</span>
                <p className="text-sm text-purple-600">Student is learning English as a second language</p>
              </div>
            </label>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-purple-800 font-semibold mb-2">Student Interests (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {['Sports', 'Art', 'Music', 'Technology', 'Animals', 'Space', 'History', 'Science'].map((interest) => (
                <button
                  key={interest}
                  onClick={() => {
                    const currentInterests = profile.interests || [];
                    const newInterests = currentInterests.includes(interest)
                      ? currentInterests.filter(i => i !== interest)
                      : [...currentInterests, interest];
                    updateProfile({ interests: newInterests });
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    (profile.interests || []).includes(interest)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-purple-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-purple-200">
            <button
              onClick={clearProfile}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Profile
            </button>
            <div className="text-sm text-purple-600">
              {currentProfile ? '✅ Profile will be used for intelligent generation' : '📝 Create profile to enable adaptive features'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
