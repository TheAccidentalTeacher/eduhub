'use client';

import React from 'react';
import { VisualElement } from '@/types/worksheet';

interface VisualElementDisplayProps {
  visual: VisualElement;
  size?: 'small' | 'medium' | 'large' | 'fullwidth';
  showCaption?: boolean;
  className?: string;
}

export default function VisualElementDisplay({ 
  visual, 
  size = 'medium', 
  showCaption = true,
  className = ''
}: VisualElementDisplayProps) {
  
  const sizeClasses = {
    small: 'h-24 w-32',
    medium: 'h-48 w-64',
    large: 'h-64 w-80',
    fullwidth: 'h-64 w-full'
  };

  const getVisualIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'diagram': return '📊';
      case 'gif': return '🎞️';
      case 'illustration': return '🎨';
      case 'chart': return '📈';
      default: return '🖼️';
    }
  };

  const getPlacementStyle = () => {
    switch (visual.placement) {
      case 'header':
        return 'mb-8 text-center';
      case 'inline':
        return 'my-4 mx-auto';
      case 'sidebar':
        return 'float-right ml-4 mb-4';
      case 'background':
        return 'absolute inset-0 z-0 opacity-20';
      default:
        return 'my-4 text-center';
    }
  };

  return (
    <div className={`visual-element ${getPlacementStyle()} ${className}`}>
      <div className="relative inline-block group">
        {/* Main Image */}
        <div className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl ${
          visual.placement === 'header' ? 'shadow-2xl' : ''
        }`}>
          {visual.type === 'gif' ? (
            <img 
              src={visual.url} 
              alt={visual.description}
              className={`${sizeClasses[size]} object-cover mx-auto transition-transform duration-300 group-hover:scale-105`}
              style={{ imageRendering: 'auto' }}
              loading="lazy"
            />
          ) : (
            <img 
              src={visual.url} 
              alt={visual.description}
              className={`${sizeClasses[size]} object-cover mx-auto transition-transform duration-300 group-hover:scale-105`}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlhOWE5YSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
              }}
            />
          )}
          
          {/* Image Type Badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="mr-1">{getVisualIcon(visual.type)}</span>
            {visual.type}
          </div>

          {/* Source Badge */}
          {visual.source && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              {visual.source}
            </div>
          )}
        </div>

        {/* Caption */}
        {showCaption && visual.description && (
          <div className="mt-3 max-w-md mx-auto">
            <p className="text-sm text-gray-600 italic leading-relaxed text-center">
              {visual.description}
            </p>
          </div>
        )}
      </div>

      {/* Decorative elements for header placement */}
      {visual.placement === 'header' && (
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 rounded-2xl -z-10 opacity-30"></div>
      )}
    </div>
  );
}
