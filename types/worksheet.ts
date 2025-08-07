// Types for worksheet generation
export interface WorksheetRequest {
  topic: string;
  subtopic: string;
  gradeLevel: string;
  learningObjective: string;
  style: 'colorful' | 'minimal' | 'playful';
  includeVisuals?: boolean;
  includeCurrentEvents?: boolean;
  worksheetType?: 'standard' | 'interactive' | 'story-based' | 'puzzle' | 'hands-on';
}

export interface WorksheetResponse {
  id: string;
  title: string;
  content: string;
  questions: WorksheetQuestion[];
  instructions: string;
  answerKey?: WorksheetAnswer[];
  createdAt: string;
  visualElements?: VisualElement[];
  activities?: InteractiveActivity[];
  currentEvents?: NewsReference[];
  pedagogicalNotes?: string;
  difficultyProgression?: 'easy-to-hard' | 'mixed' | 'scaffolded';
}

export interface WorksheetQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'short-answer' | 'essay' | 'matching' | 'true-false' | 'drawing' | 'ordering' | 'categorizing';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  bloomsLevel?: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  visualAid?: VisualElement;
  hint?: string;
}

export interface WorksheetAnswer {
  questionId: string;
  answer: string | string[];
  explanation?: string;
  pedagogicalReasoning?: string;
}

export interface VisualElement {
  id: string;
  type: 'image' | 'diagram' | 'gif' | 'illustration' | 'chart';
  url: string;
  description: string;
  source: string;
  placement: 'header' | 'inline' | 'sidebar' | 'background';
  relatedQuestionIds?: string[];
}

export interface InteractiveActivity {
  id: string;
  type: 'cut-and-paste' | 'coloring' | 'maze' | 'word-search' | 'crossword' | 'matching-game' | 'role-play' | 'experiment';
  title: string;
  instructions: string;
  materials?: string[];
  estimatedTime?: string;
  visualAids?: VisualElement[];
}

export interface NewsReference {
  id: string;
  title: string;
  summary: string;
  relevance: string;
  discussionPoints: string[];
  ageAppropriate: boolean;
}

export interface TopicData {
  topic: string;
  subtopics: string[];
}
