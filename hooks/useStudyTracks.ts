import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { StudyTrack, StudyTrackItem } from '../types/database';

export type StudyTrackWithItems = StudyTrack & {
  items: StudyTrackItem[];
};

type TrackState = {
  loading: boolean;
  error: string | null;
  tracks: StudyTrackWithItems[];
};

const initialState: TrackState = {
  loading: true,
  error: null,
  tracks: [],
};

export function useStudyTracks() {
  const [state, setState] = useState<TrackState>(initialState);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const { data, error } = await supabase
          .from('study_tracks')
          .select(
            '*, items:study_track_items(*, lesson:lessons(*, subject:subjects(name, slug, color_hex)))'
          )
          .order('title', { ascending: true })
          .order('order_index', { referencedTable: 'study_track_items', ascending: true });

        if (error) throw error;

        setState({
          loading: false,
          error: null,
          tracks: (data ?? []) as StudyTrackWithItems[],
        });
      } catch (error: any) {
        setState({
          loading: false,
          error: error?.message ?? 'Nao foi possivel carregar as trilhas.',
          tracks: [],
        });
      }
    };

    fetchTracks();
  }, []);

  const trackMap = useMemo(() => {
    const map = new Map<string, StudyTrackWithItems>();
    state.tracks.forEach((track) => map.set(track.slug, track));
    return map;
  }, [state.tracks]);

  const resources = useMemo(() => {
    const allResources: StudyTrackItem[] = [];
    state.tracks.forEach((track) => {
      track.items
        .filter((item) => item.kind === 'resource')
        .forEach((item) => allResources.push(item));
    });
    return allResources;
  }, [state.tracks]);

  return {
    ...state,
    trackMap,
    resources,
    getTrackBySlug: (slug?: string | null) => (slug ? trackMap.get(slug) : undefined),
  };
}
