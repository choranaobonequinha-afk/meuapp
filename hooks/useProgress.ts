import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type {
  Lesson,
  LessonProgress,
  Subject,
  SubjectProgressSummary,
  RecentActivity,
  DailyStudyStat,
} from '../types/database';

export type ProgressOverview = {
  overallPercent: number;
  completedLessons: number;
  totalLessons: number;
  todayMinutes: number;
  weeklyMinutes: number;
  streak: number;
};

type ProgressState = {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  subjects: SubjectProgressSummary[];
  activities: RecentActivity[];
  overview: ProgressOverview;
};

const initialOverview: ProgressOverview = {
  overallPercent: 0,
  completedLessons: 0,
  totalLessons: 0,
  todayMinutes: 0,
  weeklyMinutes: 0,
  streak: 0,
};

const initialState: ProgressState = {
  loading: true,
  refreshing: false,
  error: null,
  subjects: [],
  activities: [],
  overview: initialOverview,
};

type LessonProgressRow = LessonProgress & {
  lesson: Lesson | null;
};

export function useProgress() {
  const user = useAuthStore((state) => state.user);
  const [state, setState] = useState<ProgressState>(initialState);

  const fetchData = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!user?.id) {
        setState((prev) => ({
          ...prev,
          loading: false,
          refreshing: false,
          subjects: [],
          activities: [],
          overview: initialOverview,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        loading: opts?.silent ? prev.loading : true,
        refreshing: opts?.silent ? true : prev.refreshing,
        error: null,
      }));

      try {
        const [subjectsRes, lessonsRes, progressRes, statsRes] = await Promise.all([
          supabase.from('subjects').select('id, name, color_hex, slug, icon'),
          supabase
            .from('lessons')
            .select('id, subject_id, title, module, duration_minutes, difficulty'),
          supabase
            .from('lesson_progress')
            .select(
              'id, lesson_id, user_id, percent_complete, status, updated_at, completed_at, lesson:lessons(id, subject_id, title)'
            )
            .eq('user_id', user.id),
          supabase
            .from('daily_study_stats')
            .select('day, minutes, completed_lessons, streak')
            .eq('user_id', user.id)
            .order('day', { ascending: false })
            .limit(7),
        ]);

        if (subjectsRes.error) throw subjectsRes.error;
        if (lessonsRes.error) throw lessonsRes.error;
        if (progressRes.error) throw progressRes.error;
        if (statsRes.error) throw statsRes.error;

        const subjects = (subjectsRes.data ?? []) as Subject[];
        const lessons = (lessonsRes.data ?? []) as Lesson[];
        const progressRows = (progressRes.data as LessonProgressRow[]) ?? [];
        const stats = (statsRes.data as DailyStudyStat[]) ?? [];

        const subjectsMap = new Map<string, Subject>(
          subjects.map((subject) => [subject.id, subject as Subject])
        );

        const progressMap = new Map<string, LessonProgressRow>();
        progressRows.forEach((row) => {
          if (row.lesson_id) {
            progressMap.set(row.lesson_id, row);
          }
        });

        type Acc = {
          subject: Subject;
          totalLessons: number;
          completedLessons: number;
          accumulatedPercent: number;
        };
        const subjectAccumulator = new Map<string, Acc>();

        lessons.forEach((lesson) => {
          const subject = subjectsMap.get(lesson.subject_id);
          if (!subject) return;

          const progress = progressMap.get(lesson.id);
          const percent = progress?.percent_complete ?? 0;
          const isDone = (progress?.status ?? 'todo') === 'done' || percent >= 100;

          if (!subjectAccumulator.has(subject.id)) {
            subjectAccumulator.set(subject.id, {
              subject,
              totalLessons: 0,
              completedLessons: 0,
              accumulatedPercent: 0,
            });
          }

          const acc = subjectAccumulator.get(subject.id)!;
          acc.totalLessons += 1;
          acc.accumulatedPercent += percent;
          if (isDone) acc.completedLessons += 1;
        });

        const subjectSummaries: SubjectProgressSummary[] = Array.from(
          subjectAccumulator.values()
        ).map((entry) => ({
          subject_id: entry.subject.id,
          subject_name: entry.subject.name,
          subject_slug: entry.subject.slug,
          color_hex: entry.subject.color_hex,
          icon: entry.subject.icon,
          completed_lessons: entry.completedLessons,
          total_lessons: entry.totalLessons,
          percent:
            entry.totalLessons > 0
              ? Math.round(entry.accumulatedPercent / entry.totalLessons)
              : 0,
        }));

        const completedLessons = subjectSummaries.reduce(
          (sum, item) => sum + item.completed_lessons,
          0
        );
        const totalLessons = subjectSummaries.reduce(
          (sum, item) => sum + item.total_lessons,
          0
        );

        const overview: ProgressOverview = {
          overallPercent:
            subjectSummaries.length > 0
              ? Math.round(
                  subjectSummaries.reduce((sum, item) => sum + item.percent, 0) /
                    subjectSummaries.length
                )
              : 0,
          completedLessons,
          totalLessons,
          todayMinutes: stats[0]?.minutes ?? 0,
          weeklyMinutes: stats.reduce((sum, item) => sum + (item.minutes ?? 0), 0),
          streak: stats[0]?.streak ?? 0,
        };

        const activities: RecentActivity[] = progressRows
          .filter((row) => row.lesson)
          .sort((a, b) => {
            const dateA = new Date(a.updated_at ?? a.created_at ?? '').getTime();
            const dateB = new Date(b.updated_at ?? b.created_at ?? '').getTime();
            return dateB - dateA;
          })
          .slice(0, 5)
          .map((row) => {
            const lesson = row.lesson!;
            const subjectName =
              subjectsMap.get(lesson.subject_id)?.name ?? 'Conteudo';
            return {
              id: row.id,
              lesson_title: lesson.title,
              subject_name: subjectName,
              status: row.status,
              updated_at: row.updated_at,
            };
          });

        setState({
          loading: false,
          refreshing: false,
          error: null,
          subjects: subjectSummaries,
          activities,
          overview,
        });
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          refreshing: false,
          error: error?.message ?? 'Nao foi possivel carregar o progresso.',
        }));
      }
    },
    [user?.id]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`lesson-progress-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lesson_progress', filter: `user_id=eq.${user.id}` },
        () => fetchData({ silent: true })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchData]);

  const refresh = useCallback(() => fetchData({ silent: true }), [fetchData]);

  return useMemo(
    () => ({
      ...state,
      refresh,
    }),
    [state, refresh]
  );
}
