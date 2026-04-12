import { Dock, DockIcon } from '@/components/ui/dock';
import ThemeLangControls from '@/components/common/ThemeLangControls';
import { getSocialIconPath } from '@/lib/social';
import { Home, User, Award, Code, Briefcase, Layers, Mail, Globe } from 'lucide-react';

interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

interface DockNavProps {
  lang: string;
  base: string;
  navItems: { label: string; href: string }[];
  langLabel: string;
  currentLang: string;
  socialLinks: SocialLink[];
}

const sectionIcons: Record<string, React.ReactNode> = {
  '#about': <User className="h-5 w-5" />,
  '#certifications': <Award className="h-5 w-5" />,
  '#skills': <Code className="h-5 w-5" />,
  '#experience': <Briefcase className="h-5 w-5" />,
  '#projects': <Layers className="h-5 w-5" />,
  '#contact': <Mail className="h-5 w-5" />,
};

export default function DockNav({
  lang,
  base,
  navItems,
  langLabel,
  currentLang,
  socialLinks,
}: DockNavProps) {
  return (
    <Dock
      iconSize={40}
      iconMagnification={56}
      iconDistance={120}
      direction="middle"
      className="border-border/50 bg-background/70 fixed bottom-6 left-1/2 z-50 -translate-x-1/2 shadow-2xl shadow-black/10"
    >
      {/* Home */}
      <DockIcon className="text-muted-foreground hover:text-foreground transition-colors">
        <a
          href={`${base}/${lang}/#hero`}
          aria-label="Home"
          className="flex items-center justify-center"
        >
          <Home className="h-5 w-5" />
        </a>
      </DockIcon>

      {/* Separator */}
      <div className="bg-border/50 mx-1 h-8 w-[1px]" />

      {/* Section navigation */}
      {navItems.map((item) => (
        <DockIcon
          key={item.href}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <a
            href={item.href}
            aria-label={item.label}
            className="flex items-center justify-center"
            title={item.label}
          >
            {sectionIcons[item.href] ?? <Layers className="h-5 w-5" />}
          </a>
        </DockIcon>
      ))}

      {/* Separator */}
      <div className="bg-border/50 mx-1 h-8 w-[1px]" />

      {/* SNS Links from data */}
      {socialLinks.map((link) => {
        const socialPath = getSocialIconPath(link.icon);
        return (
          <DockIcon
            key={link.name}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              title={link.name}
              className="flex items-center justify-center"
            >
              {socialPath ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={socialPath} />
                </svg>
              ) : (
                <Globe className="h-5 w-5" />
              )}
            </a>
          </DockIcon>
        );
      })}

      {/* Separator */}
      <div className="bg-border/50 mx-1 h-8 w-[1px]" />

      <ThemeLangControls
        currentLang={currentLang}
        base={base}
        langLabel={langLabel}
        iconClassName="h-5 w-5"
        renderControl={(control) => (
          <DockIcon
            key={control.key}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <button
              onClick={control.onClick}
              aria-label={control.label}
              title={control.title}
              className="flex items-center justify-center"
            >
              {control.icon}
            </button>
          </DockIcon>
        )}
      />
    </Dock>
  );
}
