'use client';

import { motion } from 'framer-motion';
import type { CaseStudy } from '@/lib/case-studies';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import TechTag from '@/components/case-study/TechTag';

interface CaseStudyHeroProps {
  study: CaseStudy;
}

export default function CaseStudyHero({ study }: CaseStudyHeroProps) {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {(study.year || study.status) && (
        <motion.div variants={fadeInUp} className="flex gap-4 mb-3">
          {study.year && (
            <span className="text-label tracking-[0.5px] uppercase text-stone-500">
              {study.year}
            </span>
          )}
          {study.status && (
            <span className="text-label tracking-[0.5px] uppercase text-stone-500">
              {study.status}
            </span>
          )}
        </motion.div>
      )}

      <motion.h1
        variants={fadeInUp}
        className="text-h1 tracking-[-1.2px] leading-[1.15] font-bold text-contour-black"
      >
        {study.title}
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        className="text-body-lg leading-[1.7] text-stone-700 mt-4"
      >
        {study.hook}
      </motion.p>

      {study.tech.length > 0 && (
        <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mt-6">
          {study.tech.map((tag) => (
            <TechTag key={tag.label} label={tag.label} category={tag.category} />
          ))}
        </motion.div>
      )}

      {study.links.length > 0 && (
        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mt-6">
          {study.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-mono-label uppercase tracking-[0.3px] text-coral-peak hover:text-coral-deep transition-colors"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
