export interface User {
  id: string;
  email: string;
  name: string;
  exam_targets: ('ENEM' | 'UFPR' | 'UTFPR')[];
  weaknesses: string[];
  created_at: string;
  updated_at: string;
}

export interface Exam {
  id: string;
  name: string;
  type: 'ENEM' | 'UFPR' | 'UTFPR';
  year: number;
  dates: {
    registration_start?: string;
    registration_end?: string;
    exam_date?: string;
  };
  areas: string[];
}

export interface PDFResource {
  id: string;
  title: string;
  exam_id: string;
  year: number;
  storage_path: string;
  tags: string[];
  url: string;
  subject_area: string;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  topic: string;
  youtube_id: string;
  duration: number;
  exam_type: 'ENEM' | 'UFPR' | 'UTFPR';
  subject_area: string;
  thumbnail_url: string;
  created_at: string;
}

export interface StudyPlanItem {
  id: string;
  user_id: string;
  topic: string;
  exam_id: string;
  due_date: string;
  status: 'todo' | 'in_progress' | 'completed';
  resources: {
    pdf_ids: string[];
    video_ids: string[];
  };
  created_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  exam_type: 'ENEM' | 'UFPR' | 'UTFPR';
  subject_area: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  stem: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  answers: number[];
  time_taken: number;
  created_at: string;
}