// Types for worksheet generation
export interface WorksheetRequest {
  topic: string;
  subtopic: string;
  gradeLevel: string;
  learningObjective: string;
  style: 'colorful' | 'minimal' | 'playful';
}

export interface WorksheetResponse {
  id: string;
  title: string;
  content: string;
  questions: WorksheetQuestion[];
  instructions: string;
  answerKey?: WorksheetAnswer[];
  createdAt: string;
}

export interface WorksheetQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'short-answer' | 'essay' | 'matching' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

export interface WorksheetAnswer {
  questionId: string;
  answer: string | string[];
  explanation?: string;
}

export interface TopicData {
  topic: string;
  subtopics: string[];
}
