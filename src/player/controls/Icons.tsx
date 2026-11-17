import type { SVGProps } from 'react';

const base = (p: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  width: 24,
  height: 24,
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
  ...p,
});

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M8 5.2v13.6a.9.9 0 0 0 1.4.75l10.2-6.8a.9.9 0 0 0 0-1.5L9.4 4.45A.9.9 0 0 0 8 5.2z" /></svg>
);
export const PauseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><rect x="6.5" y="5" width="4" height="14" rx="1" /><rect x="13.5" y="5" width="4" height="14" rx="1" /></svg>
);
export const ReplayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 5V2.5L7.5 6 12 9.5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" /></svg>
);
export const VolumeIcon = ({ level, ...p }: SVGProps<SVGSVGElement> & { level: 'off' | 'low' | 'medium' | 'high' }) => (
  <svg {...base(p)}>
    <path d="M4 9.5v5h3.5l4.5 3.8V5.7L7.5 9.5H4z" />
    {level === 'off' ? (
      <path d="M15.2 9.2l5.2 5.6m0-5.6l-5.2 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    ) : (
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M15.2 9.6a3.6 3.6 0 0 1 0 4.8" />
        {(level === 'medium' || level === 'high') && <path d="M17.6 7.6a6.6 6.6 0 0 1 0 8.8" />}
        {level === 'high' && <path d="M19.9 5.6a9.6 9.6 0 0 1 0 12.8" />}
      </g>
    )}
  </svg>
);
export const GearIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zm8.2 5.3-1.6-.9c.1-.6.1-1.2 0-1.9l1.6-.9a.6.6 0 0 0 .2-.8l-1.7-2.9a.6.6 0 0 0-.8-.2l-1.6.9a7 7 0 0 0-1.6-.9l-.2-1.8a.6.6 0 0 0-.6-.5h-3.4a.6.6 0 0 0-.6.5l-.2 1.8c-.6.2-1.1.5-1.6.9l-1.6-.9a.6.6 0 0 0-.8.2L3.6 9.5a.6.6 0 0 0 .2.8l1.6.9c-.1.6-.1 1.2 0 1.9l-1.6.9a.6.6 0 0 0-.2.8l1.7 2.9c.2.3.5.4.8.2l1.6-.9c.5.4 1 .7 1.6.9l.2 1.8c0 .3.3.5.6.5h3.4c.3 0 .6-.2.6-.5l.2-1.8c.6-.2 1.1-.5 1.6-.9l1.6.9c.3.2.6.1.8-.2l1.7-2.9a.6.6 0 0 0-.2-.8z" />
  </svg>
);
export const FullscreenIcon = ({ exit, ...p }: SVGProps<SVGSVGElement> & { exit?: boolean }) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {exit ? (
      <path d="M9 4v4a1 1 0 0 1-1 1H4m11-5v4a1 1 0 0 0 1 1h4M9 20v-4a1 1 0 0 0-1-1H4m11 5v-4a1 1 0 0 1 1-1h4" />
    ) : (
      <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />
    )}
  </svg>
);
export const CaptionsIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm3.6 4.2c-1.5 0-2.4 1-2.4 2.8s.9 2.8 2.4 2.8c1 0 1.7-.5 1.9-1.4h-1.2c-.1.3-.3.5-.7.5-.6 0-.9-.5-.9-1.9s.3-1.9.9-1.9c.4 0 .6.2.7.5h1.2c-.2-.9-.9-1.4-1.9-1.4zm6.5 0c-1.5 0-2.4 1-2.4 2.8s.9 2.8 2.4 2.8c1 0 1.7-.5 1.9-1.4h-1.2c-.1.3-.3.5-.7.5-.6 0-.9-.5-.9-1.9s.3-1.9.9-1.9c.4 0 .6.2.7.5H17c-.2-.9-.9-1.4-1.9-1.4z" />
  </svg>
);
export const ChevronIcon = ({ back, ...p }: SVGProps<SVGSVGElement> & { back?: boolean }) => (
  <svg {...base(p)} width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={back ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);
export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
