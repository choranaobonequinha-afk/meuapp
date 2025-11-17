export type OfficialResource = {
  id: string;
  trackSlug: string;
  trackTitle: string;
  trackDescription: string;
  title: string;
  description: string;
  url: string;
  exam: string;
  trackColor: string;
  minutes: number;
};

export const OFFICIAL_RESOURCES: OfficialResource[] = [
  {
    id: 'resource-enem-bank',
    trackSlug: 'enem-oficial',
    trackTitle: 'Banco oficial ENEM',
    trackDescription: 'Coleção de provas e gabaritos oficiais do ENEM atualizados.',
    title: 'Banco oficial ENEM',
    description: 'PDF com as provas mais recentes direto do INEP.',
    url: 'https://download.inep.gov.br/educacao_basica/enem/provas/2022/1_dia_caderno_1_azul_aplicacao_regular.pdf',
    exam: 'ENEM',
    trackColor: '#F97316',
    minutes: 40,
  },
  {
    id: 'resource-ufpr-simulados',
    trackSlug: 'ufpr-oficial',
    trackTitle: 'Simulados UFPR',
    trackDescription: 'Material público produzido pela UFPR com simulados e comentários.',
    title: 'Banco oficial UFPR',
    description: 'Simulados oficiais com gabarito comentado.',
    url: 'https://www.provar.ufpr.br/portal/wp-content/uploads/2023/10/prova_ufpr_2023.pdf',
    exam: 'UFPR',
    trackColor: '#0EA5E9',
    minutes: 35,
  },
  {
    id: 'resource-mentoria-lgpd',
    trackSlug: 'guias-legais',
    trackTitle: 'Guias e orientações',
    trackDescription: 'Documentos públicos importantes para o estudante.',
    title: 'Cartilha LGPD para estudantes',
    description: 'Entenda como funciona a privacidade dos seus dados.',
    url: 'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/lgpd/cartilha-lgpd.pdf',
    exam: 'Guias',
    trackColor: '#8B5CF6',
    minutes: 20,
  },
];
