// 🎯 IMPROVED WORKSHEET GENERATION FLOW
// Let's work together to design this logic step by step

/*
CURRENT PROBLEM:
- Images generated in bulk without question-specific context
- Same images appearing across multiple questions  
- Generic images that don't match specific question content

PROPOSED SOLUTION:
Step-by-step generation with question-specific image targeting
*/

// 📋 PHASE 1: CONTENT GENERATION FIRST
async function generateWorksheetContent(request) {
  console.log('🎯 PHASE 1: Generating question content first...');
  
  // Generate the worksheet questions and content WITHOUT images
  const contentData = await generateEnhancedWorksheet(request, [], [], []);
  
  return {
    questions: contentData.questions,
    title: contentData.title,
    instructions: contentData.instructions,
    // ... other content
  };
}

// 🖼️ PHASE 2: QUESTION-SPECIFIC IMAGE GENERATION  
async function generateQuestionSpecificImages(questions, topic, gradeLevel) {
  console.log('🖼️ PHASE 2: Generating images tailored to each question...');
  
  const imagePromises = [];
  const usedImageIds = new Set(); // Prevent duplicates
  
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    // Create specific image prompt for THIS question
    const specificPrompt = `${topic} education: ${question.question.substring(0, 100)}`;
    const uniqueId = `question_${i}_${Date.now()}`;
    
    // Only generate if we haven't used this image concept before
    if (!usedImageIds.has(specificPrompt)) {
      imagePromises.push(
        generateIntelligentImage(
          topic,
          question.topic || question.category || 'general',
          gradeLevel,
          specificPrompt,
          uniqueId
        )
      );
      usedImageIds.add(specificPrompt);
    }
  }
  
  const imageResults = await Promise.allSettled(imagePromises);
  return processImageResults(imageResults);
}

// 🔄 PHASE 3: SMART IMAGE ASSIGNMENT
async function assignImagesToQuestions(questions, availableImages) {
  console.log('🔄 PHASE 3: Intelligently assigning images to questions...');
  
  const assignedQuestions = questions.map((question, index) => {
    // Try to find the most relevant image for this specific question
    const bestImage = findMostRelevantImage(question, availableImages, index);
    
    return {
      ...question,
      visualAid: bestImage?.url,
      visualDescription: bestImage?.description,
      relatedImageId: bestImage?.id
    };
  });
  
  return assignedQuestions;
}

// 🧠 SMART IMAGE MATCHING LOGIC
function findMostRelevantImage(question, availableImages, questionIndex) {
  // Strategy 1: Keyword matching
  const questionKeywords = extractKeywords(question.question);
  
  for (const image of availableImages) {
    const imageKeywords = extractKeywords(image.description);
    const overlap = calculateKeywordOverlap(questionKeywords, imageKeywords);
    
    if (overlap > 0.3) { // 30% keyword overlap threshold
      // Remove from available to prevent reuse
      const imageIndex = availableImages.indexOf(image);
      availableImages.splice(imageIndex, 1);
      return image;
    }
  }
  
  // Strategy 2: Round-robin assignment if no good match
  if (availableImages.length > 0) {
    const imageIndex = questionIndex % availableImages.length;
    return availableImages.splice(imageIndex, 1)[0];
  }
  
  return null; // No image available
}

// 🚀 MAIN IMPROVED GENERATION FLOW
export async function generateWorksheetWithSmartImages(request) {
  try {
    console.log('🚀 Starting improved worksheet generation...');
    
    // Phase 1: Content first
    const content = await generateWorksheetContent(request);
    
    // Phase 2: Question-specific images
    const images = await generateQuestionSpecificImages(
      content.questions, 
      request.topic, 
      request.gradeLevel
    );
    
    // Phase 3: Smart assignment
    const finalQuestions = await assignImagesToQuestions(content.questions, images);
    
    // Phase 4: Header image (separate from question images)
    const headerImage = await generateIntelligentImage(
      request.topic,
      request.subtopic,
      request.gradeLevel,
      `header illustration for ${request.topic} worksheet`,
      'header_main'
    );
    
    return {
      ...content,
      questions: finalQuestions,
      visualElements: [
        {
          id: 'main_header',
          type: 'illustration',
          url: headerImage.url,
          description: headerImage.description,
          placement: 'header'
        },
        ...images.map((img, i) => ({
          id: `question_${i}`,
          type: 'illustration', 
          url: img.url,
          description: img.description,
          placement: 'inline',
          relatedQuestionIds: [finalQuestions[i]?.id]
        }))
      ]
    };
    
  } catch (error) {
    console.error('❌ Error in improved generation:', error);
    throw error;
  }
}

/*
🤔 QUESTIONS FOR YOU:

1. Do you like this phase-by-phase approach?
2. Should we generate MORE images than questions and pick the best ones?
3. How strict should the keyword matching be?
4. Should we have fallback categories (science, math, etc.) for better matching?
5. Any other logic you think we should add?

Let me know what you think and what to adjust!
*/
