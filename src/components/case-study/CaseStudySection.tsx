import type { CaseStudySection as CaseStudySectionType } from '@/lib/case-studies';

interface CaseStudySectionProps {
  section: CaseStudySectionType;
}

export default function CaseStudySection({ section }: CaseStudySectionProps) {
  const paragraphs = section.body.split('\n\n');

  return (
    <section className="py-12">
      <h2 className="text-h2 tracking-[-0.8px] leading-[1.25] font-semibold text-contour-black">
        {section.heading}
      </h2>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="text-body leading-[1.65] text-stone-700 mt-4">
          {paragraph}
        </p>
      ))}
      {section.bullets && section.bullets.length > 0 && (
        <ul className="list-disc pl-6 mt-4 space-y-2">
          {section.bullets.map((bullet, i) => (
            <li key={i} className="text-body leading-[1.65] text-stone-700">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
