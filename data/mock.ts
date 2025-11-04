import { Recurso, Trilha } from '../types/models';

// Trilhas (mock)
export const trilhas: Trilha[] = [
  // Matemática primeiro, conforme prioridade
  {
    id: 'matematica-funcoes',
    nome: 'Matemática – Funções',
    descricao: 'Aulas selecionadas de funções de 1º e 2º grau.',
    imgCoverUrl: undefined,
    areas: ['matematica'],
  },
  {
    id: 'enem-base',
    nome: 'ENEM – Base',
    descricao: 'Materiais oficiais do INEP para praticar com provas reais.',
    imgCoverUrl: undefined,
    exames: ['enem'],
  },
  {
    id: 'vestibular-ufpr',
    nome: 'Vestibular UFPR',
    descricao: 'Páginas e provas oficiais da UFPR para consulta.',
    imgCoverUrl: undefined,
    exames: ['ufpr'],
  },
];

// Recursos (mock)
export const recursos: Recurso[] = [
  // ENEM – Base → PDF oficial (INEP)
  {
    id: 'enem-2022-caderno-azul',
    trilhaId: 'enem-base',
    tipo: 'PDF_OFICIAL',
    titulo: 'ENEM 2022 – Caderno Azul (1º dia) – Prova Objetiva',
    // URL oficial do INEP (exemplo público, pode ser substituído por outro oficial)
    urlOficial:
      'https://download.inep.gov.br/educacao_basica/enem/provas/2022/1_dia_caderno_1_azul_aplicacao_regular.pdf',
    origem: 'INEP',
    observacao: 'Link oficial público do INEP.',
  },

  // Matemática – Funções → Vídeo YouTube (canal oficial)
  {
    id: 'video-funcoes-1-grau',
    trilhaId: 'matematica-funcoes',
    tipo: 'YOUTUBE',
    titulo: 'Função do 1º grau – Aula completa',
    // Exemplo de URL de vídeo do YouTube (substituível por canal/professor de escolha)
    urlOficial: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    origem: 'YouTube',
    observacao: 'Tocado via player oficial do YouTube.',
  },

  // Vestibular UFPR → SITE oficial
  {
    id: 'ufpr-provas-editais',
    trilhaId: 'vestibular-ufpr',
    tipo: 'SITE',
    titulo: 'Provas e editais – UFPR (oficial)',
    urlOficial: 'https://www.nc.ufpr.br/concursos_institucionais/ufpr/ufpr_provas.html',
    origem: 'UFPR',
  },
];

export const getRecursosByTrilha = (trilhaId: string) =>
  recursos.filter((r) => r.trilhaId === trilhaId);

export const getRecursoById = (id: string) => recursos.find((r) => r.id === id);
