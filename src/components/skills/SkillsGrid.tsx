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

// Pinned to a stable release to avoid breaking icon path changes
const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';

// Map from JSON icon key → devicon path segment
// If an icon key is not listed here, a text initials badge is shown as fallback.
const DEVICON_MAP: Record<string, string> = {
  html5: 'html5/html5-original.svg',
  css3: 'css3/css3-original.svg',
  javascript: 'javascript/javascript-original.svg',
  react: 'react/react-original.svg',
  typescript: 'typescript/typescript-original.svg',
  python: 'python/python-original.svg',
  fastapi: 'fastapi/fastapi-original.svg',
  nodejs: 'nodejs/nodejs-original.svg',
  rails: 'rails/rails-plain-wordmark.svg',
  java: 'java/java-original.svg',
  mongodb: 'mongodb/mongodb-original.svg',
  scala: 'scala/scala-original.svg',
  apachespark: 'apachespark/apachespark-original.svg',
  aws: 'amazonwebservices/amazonwebservices-plain-wordmark.svg',
  azure: 'azure/azure-original.svg',
  gcp: 'googlecloud/googlecloud-original.svg',
  docker: 'docker/docker-original.svg',
  kubernetes: 'kubernetes/kubernetes-plain.svg',
  cplusplus: 'cplusplus/cplusplus-original.svg',
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

          {/* Skills pills */}
          <motion.div variants={containerVariants} className="flex flex-wrap gap-3">
            {category.skills.map((skill) => {
              const iconUrl = getIconUrl(skill.icon);
              return (
                <motion.div
                  key={skill.name}
                  variants={skillVariants}
                  className="border-glow border-border bg-card flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors hover:bg-[#686dff]/[0.04]"
                >
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 shrink-0 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="size-5 shrink-0 text-center text-xs leading-5 font-bold text-[#686dff]"
                    >
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
