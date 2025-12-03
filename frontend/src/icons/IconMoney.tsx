import { SVGProps } from 'react';

const IconMoney = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 12h10" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export default IconMoney;

