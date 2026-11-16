import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, className = "h-5 w-5", ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Brand mark: two weft threads passing over and under two warp threads. */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="8" fill="var(--color-ink)" />
      <g strokeWidth="3.2" strokeLinecap="round" fill="none">
        <path d="M7 12.5h18M7 19.5h18" stroke="#f9f7f3" />
        <path d="M12.5 7v18M19.5 7v18" stroke="var(--color-thread)" />
        <path d="M9.5 12.5h6M16.5 19.5h6" stroke="#f9f7f3" />
      </g>
    </svg>
  );
}

export const FactoryIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 21V10l6 4v-4l6 4V5h4a2 2 0 0 1 2 2v14H3Z" />
    <path d="M8 17h2M14 17h2" />
  </Svg>
);

export const PeopleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c.4-3.4 2.8-5.5 6-5.5s5.600 2.100 6 5.500" />
    <path d="M16 5.200a3.200 3.200 0 0 1 0 5.600M17.500 14.800c2 .700 3.200 2.500 3.500 5.200" />
  </Svg>
);

export const GearIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100" />
  </Svg>
);

export const CompassIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.500 8.500-2 5-5 2 2-5 5-2Z" />
  </Svg>
);

export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-6.500-5.600-6.500-11a6.500 6.500 0 0 1 13 0c0 5.400-6.500 11-6.500 11Z" />
    <circle cx="12" cy="10" r="2.300" />
  </Svg>
);

export const BuildingIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M3 21h18" />
    <path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="m5 12.500 4.500 4.500L19 7.500" />
  </Svg>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 5 5.500v6c0 4.300 2.900 7.700 7 9.500 4.100-1.800 7-5.200 7-9.500v-6L12 3Z" />
    <path d="m9 12 2.200 2.200L15.200 10" />
  </Svg>
);

/** Points toward the end of the line; mirrors itself in right-to-left pages. */
export const ArrowIcon = ({ className = "h-4 w-4", ...p }: IconProps) => (
  <Svg className={`${className} rtl:-scale-x-100`} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.500" />
    <path d="m16 16 4.500 4.500" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 4h3.500l1.500 4.500-2 1.500a12 12 0 0 0 6 6l1.500-2 4.500 1.500V19a2 2 0 0 1-2 2C10.500 21 3 13.500 3 6a2 2 0 0 1 2-2Z" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
);

export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.500 2.600 3.800 5.600 3.800 9s-1.300 6.400-3.800 9c-2.500-2.600-3.800-5.600-3.800-9S9.500 5.600 12 3Z" />
  </Svg>
);

export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.500a8.500 8.500 0 0 0-7.300 12.800L3.500 20.500l4.300-1.100A8.500 8.500 0 1 0 12 3.500Z" />
    <path d="M9 10.500h6M9 13.500h4" />
  </Svg>
);
