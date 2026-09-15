import treatmentsJson from './treatments.json';

export interface TreatmentStep {
  number: string;
  title: string;
  description: string;
}

export interface TreatmentFaq {
  question: string;
  answer: string;
}

export interface Treatment {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  summary: string;
  heroImage: string;
  highlights: string[];
  candidates: string[];
  steps: TreatmentStep[];
  faq: TreatmentFaq[];
  contentHtml: string;
  titleEn?: string;
  metaTitleEn?: string;
  metaDescriptionEn?: string;
  badgeEn?: string;
  summaryEn?: string;
  highlightsEn?: string[];
  candidatesEn?: string[];
  stepsEn?: TreatmentStep[];
  faqEn?: TreatmentFaq[];
  contentHtmlEn?: string;
  titleAr?: string;
  metaTitleAr?: string;
  metaDescriptionAr?: string;
  badgeAr?: string;
  summaryAr?: string;
  highlightsAr?: string[];
  candidatesAr?: string[];
  stepsAr?: TreatmentStep[];
  faqAr?: TreatmentFaq[];
  contentHtmlAr?: string;
  titleDe?: string;
  metaTitleDe?: string;
  metaDescriptionDe?: string;
  badgeDe?: string;
  summaryDe?: string;
  highlightsDe?: string[];
  candidatesDe?: string[];
  stepsDe?: TreatmentStep[];
  faqDe?: TreatmentFaq[];
  contentHtmlDe?: string;
}

export const TREATMENTS_DATA: Treatment[] = treatmentsJson as Treatment[];

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return TREATMENTS_DATA.find((t) => t.slug === slug);
}
