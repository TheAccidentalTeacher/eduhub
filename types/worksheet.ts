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
  // Step 3: Pedagogical Intelligence
  learningProfile?: LearningProfile;
  pedagogicalFramework?: Partial<PedagogicalFramework>;
  assessmentCriteria?: Partial<AssessmentCriteria>;
  enableAdaptiveDifferentiation?: boolean;
}

export interface TeachingContent {
  introduction: string;
  mainConcepts: MainConcept[];
  vocabulary: VocabularyTerm[];
  funFacts: string[];
  summary: string;
}

export interface MainConcept {
  title: string;
  explanation: string;
  examples: string[];
}

export interface VocabularyTerm {
  term: string;
  definition: string;
}

export interface WorksheetResponse {
  id: string;
  title: string;
  content: string;
  teachingContent?: TeachingContent;
  questions: WorksheetQuestion[];
  instructions: string;
  answerKey?: WorksheetAnswer[];
  createdAt: string;
  visualElements?: VisualElement[];
  activities?: InteractiveActivity[];
  currentEvents?: NewsReference[];
  pedagogicalNotes?: string;
  difficultyProgression?: 'easy-to-hard' | 'mixed' | 'scaffolded';
  // Step 3: Pedagogical Intelligence
  pedagogicalFramework?: PedagogicalFramework;
  assessmentCriteria?: AssessmentCriteria;
  adaptiveRecommendations?: AdaptiveRecommendation[];
  learningAnalytics?: LearningAnalytics;
  differentiatedVersions?: {
    belowGrade?: Partial<WorksheetResponse>;
    aboveGrade?: Partial<WorksheetResponse>;
    specialNeeds?: Partial<WorksheetResponse>;
    ell?: Partial<WorksheetResponse>;
  };
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
  type: 'cut-and-paste' | 'coloring' | 'maze' | 'word-search' | 'crossword' | 'matching-game' | 'role-play' | 'research' | 'discussion' | 'presentation';
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

// Step 3: Advanced Pedagogical Intelligence Types

export interface LearningProfile {
  id: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
  difficultyLevel: 'below-grade' | 'on-grade' | 'above-grade' | 'gifted';
  specialNeeds?: 'dyslexia' | 'adhd' | 'autism' | 'visual-impairment' | 'hearing-impairment';
  englishLanguageLearner?: boolean;
  interests?: string[];
  strengths?: string[];
  challenges?: string[];
  accommodations?: string[];
}

export interface PedagogicalFramework {
  bloomsLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  dokLevel: 1 | 2 | 3 | 4; // Webb's Depth of Knowledge
  multipleIntelligence: 'linguistic' | 'logical-mathematical' | 'spatial' | 'bodily-kinesthetic' | 
                       'musical' | 'interpersonal' | 'intrapersonal' | 'naturalist';
  udlPrinciple: 'engagement' | 'representation' | 'action-expression';
  cognitiveLoad: 'low' | 'medium' | 'high';
}

export interface AssessmentCriteria {
  type: 'formative' | 'summative' | 'diagnostic' | 'self-assessment';
  rubric?: RubricCriteria[];
  successCriteria: string[];
  learningObjectives: string[];
  standardsAlignment?: string[];
}

export interface RubricCriteria {
  criterion: string;
  levels: {
    level: number;
    description: string;
    points: number;
  }[];
}

export interface AdaptiveRecommendation {
  type: 'next-steps' | 'prerequisite' | 'extension' | 'remediation' | 'accommodation';
  title: string;
  description: string;
  reasoning: string;
  resources?: string[];
  estimatedTime?: string;
}

export interface LearningAnalytics {
  completionTime?: number;
  difficultyRating?: number;
  engagementLevel?: 'low' | 'medium' | 'high';
  masteryLevel?: 'not-met' | 'approaching' | 'met' | 'exceeded';
  strugglingAreas?: string[];
  strengthAreas?: string[];
}
