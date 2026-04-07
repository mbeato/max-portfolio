import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCaseStudy, getAllSlugs } from '@/lib/case-studies';
import CaseStudyHero from '@/components/case-study/CaseStudyHero';
import CaseStudySection from '@/components/case-study/CaseStudySection';

export function generateStaticParams(): { slug: string }[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | Record<string, never>> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.hook,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main className="max-w-[720px] mx-auto px-6 pt-24 pb-16">
      <CaseStudyHero study={study} />
      <CaseStudySection section={study.problem} />
      <CaseStudySection section={study.approach} />
      <CaseStudySection section={study.outcome} />
      <CaseStudySection section={study.tradeoffs} />
      <Link
        href="/"
        className="inline-block mt-12 font-mono text-mono-label uppercase tracking-[0.3px] text-stone-500 hover:text-contour-black transition-colors"
      >
        back to home
      </Link>
    </main>
  );
}
