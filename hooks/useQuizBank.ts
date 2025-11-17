import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { QuizQuestion } from '../types/database';

export type QuizFilters = {
  exam?: string;
  subject?: string;
};

type QuizState = {
  loading: boolean;
  error: string | null;
  questions: QuizQuestion[];
};

const initialState: QuizState = {
  loading: true,
  error: null,
  questions: [],
};

export function useQuizBank(filters?: QuizFilters) {
  const [state, setState] = useState<QuizState>(initialState);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let query = supabase.from('quiz_questions').select('*');
        if (filters?.exam) query = query.eq('exam', filters.exam);
        if (filters?.subject) query = query.eq('subject', filters.subject);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        setState({ loading: false, error: null, questions: data ?? [] });
      } catch (error: any) {
        setState({
          loading: false,
          error: error?.message ?? 'Nao foi possivel carregar os quizzes.',
          questions: [],
        });
      }
    };

    fetchQuestions();
  }, [filters?.exam, filters?.subject]);

  const exams = useMemo(() => {
    const map = new Map<string, QuizQuestion[]>();
    state.questions.forEach((question) => {
      const key = question.exam || 'geral';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(question);
    });
    return Array.from(map.entries()).map(([exam, list]) => ({
      exam,
      count: list.length,
    }));
  }, [state.questions]);

  const subjects = useMemo(() => {
    const map = new Map<string, QuizQuestion[]>();
    state.questions.forEach((question) => {
      const key = question.subject || 'geral';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(question);
    });
    return Array.from(map.entries()).map(([subject, list]) => ({
      subject,
      count: list.length,
    }));
  }, [state.questions]);

  const randomQuestion = useMemo(() => {
    if (state.questions.length === 0) return null;
    const idx = Math.floor(Math.random() * state.questions.length);
    return state.questions[idx];
  }, [state.questions]);

  return {
    ...state,
    exams,
    subjects,
    randomQuestion,
  };
}
