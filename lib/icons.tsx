/**
 * Local icon components – no network required.
 * Same API as lucide-react: size, strokeWidth, className.
 */
import React from 'react';

type IconProps = { size?: number; strokeWidth?: number; className?: string; fill?: string };

const Icon = ({ size = 24, strokeWidth = 2, className, fill = "none", children }: IconProps & { children: React.ReactNode }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);

// BOLD / SOLID STYLE ICONS (Matching reference image)
export const FlowerBold = (p: IconProps) => (
  <Icon {...p} fill="currentColor" strokeWidth={0}>
    <circle cx="12" cy="12" r="3" fill="white" />
    <path d="M12 2c1.5 0 3 1.5 3 3s-1.5 3-3 3-3-1.5-3-3 1.5-3 3-3zM12 16c1.5 0 3 1.5 3 3s-1.5 3-3 3-3-1.5-3-3 1.5-3 3-3zM19 9c1.5 0 3 1.5 3 3s-1.5 3-3 3-3-1.5-3-3 1.5-3 3-3zM5 9c1.5 0 3 1.5 3 3s-1.5 3-3 3-3-1.5-3-3 1.5-3 3-3zM17 5.5c1.2 1 1.5 2.5.5 3.5s-2.5.7-3.5-.5-1.5-2.5-.5-3.5 2.5-.7 3.5.5zM10.5 15.5c1.2 1 1.5 2.5.5 3.5s-2.5.7-3.5-.5-1.5-2.5-.5-3.5 2.5-.7 3.5.5zM17 18.5c-1 1.2-2.5 1.5-3.5.5s-.7-2.5.5-3.5 2.5-1.5 3.5-.5.7 2.5-.5 3.5zM10.5 8.5c-1 1.2-2.5 1.5-3.5.5s-.7-2.5.5-3.5 2.5-1.5 3.5-.5.7 2.5-.5 3.5z" />
  </Icon>
);

export const PlanetBold = (p: IconProps) => (
  <Icon {...p} fill="none" strokeWidth={2.5}>
    <circle cx="12" cy="12" r="6" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-25 12 12)" stroke="currentColor" />
  </Icon>
);

export const LightbulbBold = (p: IconProps) => (
  <Icon {...p} fill="currentColor" strokeWidth={0}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1h-4c-.55 0-1 .45-1 1z" />
    <path d="M12 13c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1s1 .45 1 1v3c0 .55-.45 1-1 1z" fill="white" />
  </Icon>
);

export const BalloonBold = (p: IconProps) => (
  <Icon {...p} fill="currentColor" strokeWidth={0}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.87-3.13-7-7-7zm0 14l-1 2-1-1 1-1h2z" />
    <path d="M11.5 18s-1 1.5 0 3 2 1.5 1 3" fill="none" stroke="currentColor" strokeWidth={2} />
  </Icon>
);

export const CloverBold = (p: IconProps) => (
  <Icon {...p} fill="currentColor" strokeWidth={0}>
    <path d="M12 12c0-3 2-5 4-5s4 2 4 4-2 4-4 4c0 1 2 3 2 5s-2 5-4 5-4-2-4-4c0 2-2 4-4 4s-4-2-4-4 2-4 4-4c0-1-2-3-2-5s2-5 4-5 4 2 4 4z" />
  </Icon>
);

export const SparklesBold = (p: IconProps) => (
  <Icon {...p} fill="currentColor" strokeWidth={0}>
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5zM19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM6 14l.75 2.25L9 17l-2.25.75L6 20l-.75-2.25L3 17l2.25-.75z" />
  </Icon>
);

export const Plus = (p: IconProps) => <Icon {...p}><path d="M5 12h14M12 5v14" /></Icon>;
export const X = (p: IconProps) => <Icon {...p}><path d="M18 6L6 18M6 6l12 12" /></Icon>;
export const Check = (p: IconProps) => <Icon {...p}><path d="M20 6L9 17l-5-5" /></Icon>;
export const Search = (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>;
export const Trash2 = (p: IconProps) => <Icon {...p}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></Icon>;
export const ArrowUpRight = (p: IconProps) => <Icon {...p}><path d="M7 17L17 7M17 7h-10v10" /></Icon>;
export const Sparkles = (p: IconProps) => <Icon {...p}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></Icon>;
export const Volume2 = (p: IconProps) => <Icon {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" /></Icon>;
export const VolumeX = (p: IconProps) => <Icon {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="16" y2="16" /><line x1="16" y1="9" x2="23" y2="16" /></Icon>;
export const Zap = (p: IconProps) => <Icon {...p}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></Icon>;
export const Quote = (p: IconProps) => <Icon {...p}><path d="M3 21c3 0 7-4 7-10V5H4v6c0 3 2 6 6 7" /><path d="M15 21c3 0 7-4 7-10V5h-6v6c0 3 2 6 6 7" /></Icon>;
export const Lightbulb = (p: IconProps) => <Icon {...p}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></Icon>;
export const Sun = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></Icon>;
export const Moon = (p: IconProps) => <Icon {...p}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></Icon>;
export const Smile = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></Icon>;
export const Brain = (p: IconProps) => <Icon {...p}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /></Icon>;
export const Coffee = (p: IconProps) => <Icon {...p}><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /></Icon>;
export const BatteryCharging = (p: IconProps) => <Icon {...p}><path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" /><path d="M6 7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M11 7l-4 6h6l-4 6" /></Icon>;
export const Target = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></Icon>;
export const Home = (p: IconProps) => <Icon {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></Icon>;
export const BarChart2 = (p: IconProps) => <Icon {...p}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Icon>;
export const MessageSquare = (p: IconProps) => <Icon {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>;
export const Settings = (p: IconProps) => <Icon {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></Icon>;
export const LogOut = (p: IconProps) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></Icon>;
export const Loader2 = (p: IconProps) => <Icon {...p}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></Icon>;
export const ArrowRight = (p: IconProps) => <Icon {...p}><path d="M5 12h14M12 5l7 7-7 7" /></Icon>;
export const Mail = (p: IconProps) => <Icon {...p}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></Icon>;
export const Lock = (p: IconProps) => <Icon {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>;
export const User = (p: IconProps) => <Icon {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>;
export const CheckCircle = (p: IconProps) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></Icon>;
export const ExternalLink = (p: IconProps) => <Icon {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></Icon>;
export const TrendingUp = (p: IconProps) => <Icon {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></Icon>;
export const Activity = (p: IconProps) => <Icon {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></Icon>;
export const Heart = (p: IconProps) => <Icon {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></Icon>;
export const Database = (p: IconProps) => <Icon {...p}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></Icon>;
export const Send = (p: IconProps) => <Icon {...p}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></Icon>;
export const Mic = (p: IconProps) => <Icon {...p}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></Icon>;
export const Wand2 = (p: IconProps) => <Icon {...p}><path d="m21 3-6 6" /><path d="M21 3v4M21 3h-4" /><path d="M3 21 9 15" /><path d="M3 21v-4M3 21h4" /><path d="m15 9 6-6" /><path d="M15 9v4M15 9h4" /><path d="m9 15-6 6" /><path d="M9 15v4M9 15h-4" /></Icon>;
export const Calendar = (p: IconProps) => <Icon {...p}><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /></Icon>;
export const ChevronRight = (p: IconProps) => <Icon {...p}><path d="m9 18 6-6-6-6" /></Icon>;
export const Clock = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>;
export const Music = (p: IconProps) => <Icon {...p}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></Icon>;
export const Wind = (p: IconProps) => <Icon {...p}><path d="M17.7 18.2a2 2 0 0 0-3.4 0" /><path d="M9 15h8" /><path d="M14 20a2 2 0 0 0 3.4 0" /><path d="M2 12h6" /></Icon>;
export const Droplets = (p: IconProps) => <Icon {...p}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" /></Icon>;
export const Map = (p: IconProps) => <Icon {...p}><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15" /><path d="M15 6v15" /></Icon>;
export const Crown = (p: IconProps) => <Icon {...p}><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15 7l2.5-2.5a.5.5 0 0 1 .894.447L17.5 10H6.5L5.106 5.947a.5.5 0 0 1 .894-.447L9 7z" /><path d="M20 13H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z" /></Icon>;
export const Bone = (p: IconProps) => <Icon {...p}><path d="M17 10c.7-.7 1.69 0 2.5 0 2.14 0 2.14 3 0 3-.81 0-1.8 1.4-2.5.7-.7.7-1.4 1.8-.7 2.5 0 2.14-3 2.14-3 0 0-.81-.7-1.8-1.4-2.5-.7.7 0 1.69 0 2.5 0 2.14 3 2.14 3 0 0-.81-1.4-1.8-.7-2.5l2.6-2.6c-.7.7-1.8 1.4-2.5.7l-2.6 2.6c-.7.7-1.4 1.8-.7 2.5 0 2.14-3 2.14-3 0 0-.81-.7-1.8-1.4-2.5-.7.7 0 1.69 0 2.5 0 2.14-3 2.14-3 0 0-.81-1.4-1.8-.7-2.5.7-.7.7-1.69 0-2.5-2.14 0-2.14-3 0-3 .81 0 1.8-1.4 2.5-.7.7-.7 1.4-1.8.7-2.5 0-2.14 3-2.14 3 0 0 .81.7 1.8 1.4 2.5.7-.7 0-1.69 0-2.5 0-2.14-3-2.14-3 0 0 .81 1.4 1.8.7 2.5-.7.7-.7 1.69 0 2.5 2.14 0 2.14 3 0 3-.81 0-1.8 1.4-2.5.7z" /></Icon>;

export const Users = (p: IconProps) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>;
export const AlertCircle = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>;
export const CheckCircle2 = (p: IconProps) => <Icon {...p}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></Icon>;
export const Flame = (p: IconProps) => <Icon {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></Icon>;
export const Ghost = (p: IconProps) => <Icon {...p}><path d="M9 10h.01" /><path d="M15 10h.01" /><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" /></Icon>;
export const ShieldAlert = (p: IconProps) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>;
export const Play = (p: IconProps) => <Icon {...p}><polygon points="5 3 19 12 5 21 5 3" /></Icon>;
export const Star = (p: IconProps) => <Icon {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>;
export const Shield = (p: IconProps) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>;
export const Rocket = (p: IconProps) => <Icon {...p}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.5-1 1-4c2 0 3 .5 3 2.5a.5.5 0 0 1-1 0c0-1.5-.5-1.5-1-1.5z" /><path d="M15 9h5s1-.5 4-1c0-2-1.5-3-3.5-3a.5.5 0 0 1 0 1c1.5 0 1.5.5 1.5 1z" /></Icon>;
export const Circle = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="10" /></Icon>;
export const Trophy = (p: IconProps) => <Icon {...p}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34c3.11-.27 6-2.66 6-5.66V3H4v6c0 3 2.89 5.39 6 5.66z" /></Icon>;
