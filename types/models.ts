export type RecursoTipo = 'PDF_OFICIAL' | 'YOUTUBE' | 'SITE';

export interface Trilha {
  id: string;
  nome: string;
  descricao?: string;
  imgCoverUrl?: string;
  // Áreas/assuntos aos quais a trilha pertence (ex.: 'matematica')
  areas?: string[];
  // Exames aos quais a trilha está relacionada (ex.: 'enem', 'ufpr')
  exames?: string[];
}

export interface Recurso {
  id: string;
  trilhaId: string;
  tipo: RecursoTipo;
  titulo: string;
  urlOficial: string;
  origem?: string;
  observacao?: string;
  meta?: Record<string, any>;
}
