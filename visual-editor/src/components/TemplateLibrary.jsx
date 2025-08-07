import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { modernWorksheetTemplate } from '../utils/templates';

const TemplateLibrary = ({ onTemplateSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 'modern-blue',
      name: 'Modern Blue Education',
      preview: 'https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Modern+Blue',
      description: 'Clean, professional design with blue accents perfect for elementary education',
      category: 'Educational',
      features: ['Header sections', 'Info grids', 'Activity spaces', 'Key points list']
    },
    {
      id: 'nature-green',
      name: 'Nature & Environment',
      preview: 'https://via.placeholder.com/300x400/059669/FFFFFF?text=Nature+Green',
      description: 'Earth-friendly green theme for environmental and science topics',
      category: 'Science',
      features: ['Nature graphics', 'Environmental colors', 'Activity sections']
    },
    {
      id: 'safety-orange',
      name: 'Safety & Community',
      preview: 'https://via.placeholder.com/300x400/EA580C/FFFFFF?text=Safety+Orange',
      description: 'Bright, attention-grabbing design for safety and community topics',
      category: 'Social Studies',
      features: ['Safety icons', 'Clear instructions', 'Emergency info sections']
    },
    {
      id: 'creative-purple',
      name: 'Creative Arts',
      preview: 'https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Creative+Purple',
      description: 'Artistic and colorful template for creative and arts activities',
      category: 'Arts',
      features: ['Drawing spaces', 'Creative layouts', 'Color schemes']
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    onTemplateSelect({
      ...template,
      config: modernWorksheetTemplate // Apply the modern template config
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Template Library</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardHeader className="pb-2">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {template.category}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm mb-3">{template.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Features:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Use This Template
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Customization Panel */}
      {selectedTemplate && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Customize Template</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Scheme
              </label>
              <div className="flex gap-2">
                {modernWorksheetTemplate.colors.primary.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Kindergarten</option>
                <option>1st Grade</option>
                <option>2nd Grade</option>
                <option>3rd Grade</option>
                <option>4th Grade</option>
                <option>5th Grade</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Science</option>
                <option>Social Studies</option>
                <option>Math</option>
                <option>Language Arts</option>
                <option>Art</option>
                <option>Health & Safety</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Apply Customizations
            </button>
            <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;
