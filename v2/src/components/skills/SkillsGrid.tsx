import { motion } from 'motion/react';

interface Skill {
  name: string;
  icon: string;
}

interface Category {
  name: string;
  skills: Skill[];
}

interface Props {
  categories: Category[];
}

// devicon CDN base URL
const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

// Map from JSON icon key → devicon path segment (icon-name/icon-name-variant.svg)
const DEVICON_MAP: Record<string, string> = {
  html5: 'html5/html5-original.svg',
  css3: 'css3/css3-original.svg',
  javascript: 'javascript/javascript-original.svg',
  react: 'react/react-original.svg',
  typescript: 'typescript/typescript-original.svg',
  ruby: 'ruby/ruby-original.svg',
  python: 'python/python-original.svg',
  nodejs: 'nodejs/nodejs-original.svg',
  rails: 'rails/rails-plain-wordmark.svg',
  django: 'django/django-plain.svg',
  aws: 'amazonwebservices/amazonwebservices-plain-wordmark.svg',
  gcp: 'googlecloud/googlecloud-original.svg',
  kubernetes: 'kubernetes/kubernetes-plain.svg',
  docker: 'docker/docker-original.svg',
  cplusplus: 'cplusplus/cplusplus-original.svg',
  google: 'google/google-original.svg',
};

function getIconUrl(icon: string): string | null {
  const path = DEVICON_MAP[icon];
  if (!path) return null;
  return `${DEVICON_BASE}/${path}`;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const skillVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function SkillsGrid({ categories }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="grid gap-10 md:grid-cols-2"
    >
      {categories.map((category) => (
        <motion.div key={category.name} variants={categoryVariants}>
          {/* Category heading */}
          <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
            {category.name}
          </h3>

          {/* Skills grid */}
          <motion.div
            variants={containerVariants}
            className="flex flex-wrap gap-3"
          >
            {category.skills.map((skill) => {
              const iconUrl = getIconUrl(skill.icon);
              return (
                <motion.div
                  key={skill.name}
                  variants={skillVariants}
                  className="border-border bg-card hover:border-[#686dff]/40 hover:bg-[rgba(104,109,255,0.04)] flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors"
                >
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={skill.name}
                      width={20}
                      height={20}
                      className="size-5 shrink-0 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[#686dff] size-5 shrink-0 text-center text-xs font-bold leading-5">
                      {skill.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="text-foreground text-sm font-medium">{skill.name}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
