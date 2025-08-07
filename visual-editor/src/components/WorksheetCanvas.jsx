import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { useWorksheet } from '../contexts/WorksheetContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileTextIcon, 
  ImageIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Move,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Download
} from 'lucide-react'

function WorksheetCanvas() {
  const { state, addImageToSlot, selectElement } = useWorksheet()
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)

  const { worksheet } = state

  const ImageDropZone = ({ slotId, currentImage, className = "", children, prompt }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: 'image',
      drop: (item) => {
        try {
          const imageData = typeof item === 'string' ? JSON.parse(item) : item
          addImageToSlot(slotId, imageData)
        } catch (error) {
          console.error('Error dropping image:', error)
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }), [slotId])

    return (
      <div className="space-y-2">
        {prompt && (
          <div className="text-sm font-semibold text-primary mb-2">
            {prompt}
          </div>
        )}
        <div
          ref={drop}
          className={`
            dropzone relative group cursor-pointer
            ${isOver && canDrop ? 'ring-2 ring-primary ring-offset-2 bg-blue-50' : ''}
            ${currentImage ? 'border-solid border-primary' : 'border-dashed'}
            ${className}
          `}
          onClick={() => selectElement(slotId)}
        >
          {currentImage ? (
            <div className="relative w-full h-full">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                  <button className="bg-white text-gray-700 p-1 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation()
                      addImageToSlot(slotId, null)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 p-4">
              <ImageIcon className="w-8 h-8 mb-2" />
              <span className="text-sm text-center">
                {isOver ? 'Drop image here' : children || 'Drag image here'}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      {/* Canvas Controls */}
      <div className="sticky top-0 bg-white border-b border-borders p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-primary">
              Design Canvas
            </h2>
            <span className="text-sm text-gray-500">
              {worksheet.title} • Grade {worksheet.gradeLevel}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded ${showGrid ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
            
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Worksheet Content */}
      <div className="p-8">
        <div 
          className="max-w-4xl mx-auto bg-white shadow-xl"
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: 'top center',
            backgroundImage: showGrid ? 'radial-gradient(circle, #e0e7ff 1px, transparent 1px)' : 'none',
            backgroundSize: showGrid ? '20px 20px' : 'auto'
          }}
        >
          <div className="p-12">
            {/* Header Section */}
            <motion.div 
              className="text-center bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-xl mb-8 relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-4 right-6 text-sm space-y-1">
                {worksheet.sections.header.showNameField && (
                  <div>Name: _______________</div>
                )}
                {worksheet.sections.header.showDateField && (
                  <div>Date: _______________</div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">
                {worksheet.sections.header.title}
              </h1>
              {worksheet.subtitle && (
                <p className="text-lg opacity-90">{worksheet.subtitle}</p>
              )}
            </motion.div>

            {/* Introduction */}
            <motion.div 
              className="bg-background border-2 border-borders rounded-xl p-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-base leading-relaxed">
                {worksheet.sections.introduction.text}
              </p>
            </motion.div>

            {/* Info Boxes Grid */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-primary mb-6">
                {worksheet.sections.infoBoxes.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {worksheet.sections.infoBoxes.boxes.map((box, index) => (
                  <motion.div
                    key={box.id}
                    className="bg-blue-50 border-2 border-primary/30 rounded-xl p-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                  >
                    <h4 className="text-lg font-bold text-primary mb-4">
                      {box.title}
                    </h4>
                    
                    <ImageDropZone
                      slotId={box.imageSlot.id}
                      currentImage={box.imageSlot.image}
                      className="h-32 mb-4"
                    >
                      Drop {box.title.toLowerCase()} image
                    </ImageDropZone>
                    
                    <p className="text-sm leading-relaxed">
                      {box.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Safety Rules */}
            <motion.div 
              className="bg-background border-2 border-borders rounded-xl p-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-primary mb-6">
                {worksheet.sections.safetyRules.title}
              </h3>
              
              <ol className="space-y-4">
                {worksheet.sections.safetyRules.items.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-base leading-relaxed pt-1">{item}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Activities */}
            <div className="space-y-8">
              {worksheet.sections.activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="border-2 border-borders rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                >
                  <div className="text-lg font-bold text-primary mb-4">
                    {activity.prompt}
                  </div>
                  
                  {activity.type === 'drawing-box' ? (
                    <ImageDropZone
                      slotId={activity.imageSlot.id}
                      currentImage={activity.imageSlot.image}
                      className="h-64"
                    >
                      Drawing/Image Area - Drop image or draw here
                    </ImageDropZone>
                  ) : activity.type === 'text-box' ? (
                    <div className="border border-borders min-h-24 rounded-lg p-4 bg-white">
                      <span className="text-gray-400 text-sm">Write your answer here...</span>
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorksheetCanvas
