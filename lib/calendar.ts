export type Scene = {
  id: 'alpine' | 'coast' | 'desert';
  label: string;
  accent: string;
  caption: string;
};

export const scenes: Scene[] = [
  {
    id: 'alpine',
    label: 'Alpine',
    accent: '#2f7ef8',
    caption: 'Cold air, clean lines, and a high-contrast mountain frame.'
  },
  {
    id: 'coast',
    label: 'Coast',
    accent: '#0f8b8d',
    caption: 'Soft water, muted skies, and a calm desktop mood.'
  },
  {
    id: 'desert',
    label: 'Desert',
    accent: '#c67a27',
    caption: 'Warm sand tones with a sharper, sunlit calendar accent.'
  }
];

export function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function monthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

export function weekdayLabels(): string[] {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
}

export function sameDayKey(a: Date | string, b: Date | string): boolean {
  const left = typeof a === 'string' ? a : toDateKey(a);
  const right = typeof b === 'string' ? b : toDateKey(b);
  return left === right;
}

export function compareKeys(a: string, b: string): number {
  return a.localeCompare(b);
}

export function isWithinRange(day: string, start?: string, end?: string): boolean {
  if (!start || !end) return false;
  return day >= start && day <= end;
}

export function buildMonthGrid(date: Date): Array<string | null> {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const leading = first.getDay();
  const cells: Array<string | null> = [];

  for (let i = 0; i < leading; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(toDateKey(new Date(date.getFullYear(), date.getMonth(), day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function countRangeDays(start?: string, end?: string): number {
  if (!start || !end) return 0;
  const a = fromDateKey(start).getTime();
  const b = fromDateKey(end).getTime();
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const day = 24 * 60 * 60 * 1000;
  return Math.floor((max - min) / day) + 1;
}

export function dateRangeLabel(start?: string, end?: string): string {
  if (!start && !end) return 'No range selected';
  if (start && !end) return `Start date: ${prettyKey(start)}`;
  if (!start && end) return `End date: ${prettyKey(end)}`;
  return `${prettyKey(start!)} → ${prettyKey(end!)}`;
}

export function prettyKey(key: string): string {
  return fromDateKey(key).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getSceneArt(sceneId: Scene['id']): string {
  if (sceneId === 'coast') {
    return `
      <svg viewBox="0 0 960 720" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Coastal scene">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#dfefff"/>
            <stop offset="100%" stop-color="#ffffff"/>
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#6cc6cf"/>
            <stop offset="100%" stop-color="#0f8b8d"/>
          </linearGradient>
        </defs>
        <rect width="960" height="720" fill="url(#sky)"/>
        <path d="M0 460C120 420 220 450 330 430C450 408 545 352 635 348C740 344 832 387 960 355V720H0V460Z" fill="url(#sea)"/>
        <path d="M0 500C90 470 180 470 300 490C418 510 533 560 640 540C758 518 850 460 960 480V720H0V500Z" fill="#175e71" opacity="0.7"/>
        <path d="M690 220L760 325L625 325Z" fill="#ffffff" opacity="0.9"/>
        <path d="M760 325L820 360L860 320L900 345L960 304V720H635V325Z" fill="#e9f6ff" opacity="0.82"/>
        <circle cx="156" cy="130" r="46" fill="#f7d974" opacity="0.95"/>
        <path d="M105 585C160 550 230 560 285 582C345 606 414 605 460 580" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
        <path d="M502 548C545 520 605 518 656 540" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.58"/>
      </svg>`;
  }
  if (sceneId === 'desert') {
    return `
      <svg viewBox="0 0 960 720" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Desert scene">
        <defs>
          <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f7ead6"/>
            <stop offset="100%" stop-color="#fff8ee"/>
          </linearGradient>
          <linearGradient id="dune" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#e8aa56"/>
            <stop offset="100%" stop-color="#c67a27"/>
          </linearGradient>
        </defs>
        <rect width="960" height="720" fill="url(#dsky)"/>
        <circle cx="760" cy="130" r="68" fill="#ffcf70" opacity="0.95"/>
        <path d="M0 510C160 410 264 420 388 474C506 524 590 612 760 598C850 591 917 551 960 520V720H0V510Z" fill="url(#dune)"/>
        <path d="M0 565C126 495 240 500 354 548C463 592 580 650 704 632C795 619 885 579 960 552V720H0V565Z" fill="#9f5919" opacity="0.64"/>
        <path d="M610 444C648 386 708 364 762 378C822 395 870 450 880 508C834 492 790 493 730 512C668 532 632 523 580 503C588 480 594 462 610 444Z" fill="#f6d49c" opacity="0.65"/>
        <path d="M440 338L470 278L508 337Z" fill="#f7d8a4"/>
        <path d="M455 278H485V460H455Z" fill="#f2c48b"/>
        <path d="M288 485C336 460 390 456 444 474" stroke="#fff7ea" stroke-width="8" stroke-linecap="round" opacity="0.88"/>
      </svg>`;
  }
  return `
    <svg viewBox="0 0 960 720" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Alpine scene">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#dcecff"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
        <linearGradient id="mountain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3f5d8d"/>
          <stop offset="100%" stop-color="#13213d"/>
        </linearGradient>
      </defs>
      <rect width="960" height="720" fill="url(#sky)"/>
      <circle cx="760" cy="136" r="64" fill="#f8d26a" opacity="0.98"/>
      <path d="M0 566C118 516 224 538 328 490C408 452 466 392 572 380C694 366 776 420 960 334V720H0V566Z" fill="url(#mountain)"/>
      <path d="M122 520L250 344L356 500L430 430L540 572H122Z" fill="#6e84aa" opacity="0.92"/>
      <path d="M366 500L442 392L520 498L572 450L656 560H330Z" fill="#a8b8d0" opacity="0.96"/>
      <path d="M247 362L296 295L345 366L313 364L296 339L277 361Z" fill="#f7fbff"/>
      <path d="M452 397L489 347L530 402L505 403L489 373L470 401Z" fill="#f7fbff"/>
      <path d="M0 610C126 572 214 574 332 598C442 620 562 660 708 650C814 643 898 611 960 592V720H0V610Z" fill="#1f3559" opacity="0.88"/>
      <path d="M540 602C572 560 622 535 674 526C732 517 794 536 840 573" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.45"/>
    </svg>`;
}

export const defaultStorageKey = 'wall-calendar-v1';
