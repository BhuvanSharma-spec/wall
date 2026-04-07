# Wall Calendar Studio

A polished, interactive React/Next.js calendar component inspired by physical wall calendars. This is a fully frontend implementation with zero backend dependencies—all data persists client-side using localStorage.

## 🎯 Core Features

### ✨ Wall Calendar Aesthetic
- Hero image panel with beautiful SVG artwork spanning the full height
- Paper-textured design with realistic shadows and depth
- Glassmorphism styling with backdrop blur effects
- Pinned calendar ring effect (visual detail inspired by physical wall calendars)

### 📅 Interactive Date Range Selection
- **Click-to-select workflow**: Click a start date, then an end date to create a range
- **Visual feedback**: Clear states for start, end, and in-range days
- **Hover preview**: See the range before committing (desktop only)
- **Smart range logic**: Selecting again after range is set starts a new selection
- **Holiday markers**: Special styling for New Year, Independence Day, Christmas

### 📝 Integrated Notes System
- **Monthly memo**: Persistent general notes for the current month
- **Range-specific notes**: Attach notes to individual date ranges
- **Saved collections**: View all saved range notes with date labels
- **Easy management**: Remove or update any saved note instantly

### 🎨 Creative Features Beyond Requirements
- **Three scene themes**: Alpine (blue), Coast (teal), Desert (orange) with matching accent colors
- **Dynamic theming**: Accent color changes globally when theme switches
- **Smooth interactions**: Hover states, micro-animations, and gentle transitions
- **Responsive layout**:
  - Desktop (1240px max): Side-by-side panels
  - Tablet (1050px): Stacked centered layout
  - Mobile (720px): Optimized touch-friendly interface
- **Persistent state**: All selections, notes, and theme preference survive page reloads
- **Accessibility**: Full ARIA labels, semantic HTML, keyboard navigation support

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
Then visit `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start
```

## 📁 Project Structure
```
project/
├── app/
│   ├── page.tsx          # Main page entry
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # All styling (CSS variables, layout, responsive)
├── components/
│   └── WallCalendar.tsx  # Main interactive component (380 lines)
├── lib/
│   ├── calendar.ts       # Date utilities, scene definitions, SVG art
│   └── storage.ts        # localStorage wrapper with typing
└── public/               # Static assets (if any)
```

## 🛠️ Technical Highlights

- **No external dependencies**: Uses only React, Next.js, and CSS (no calendaring libraries)
- **TypeScript throughout**: Fully typed for safety and IDE support
- **State management**: Single centralized state with localStorage sync
- **CSS variables**: Theme switching via CSS custom properties
- **SVG artwork**: Embedded, responsive scenes (no image files)
- **Responsive first**: Mobile-first design with desktop enhancements

## 🎨 Design Choices

### Color Palette
- Dynamic: Adapts based on selected scene theme
- Alpine: `#2f7ef8` (cool blue)
- Coast: `#0f8b8d` (calm teal)
- Desert: `#c67a27` (warm orange)

### Typography
- System font stack (Inter, ui-sans-serif, system-ui)
- Responsive sizing using `clamp()` for smooth scaling
- Clear visual hierarchy with semantic heading levels

### Layout
- Max-width container (1240px) for desktop, full bleed on mobile
- Glassmorphic panels with subtle gradients
- Paper-textured background for depth
- Generous spacing for visual breathing room

## 💾 Data Persistence

All data is stored locally in `localStorage` under the key `wall-calendar-v1`. No backend is required or used:

```typescript
{
  monthOffset: number;           // Current month view offset
  sceneId: 'alpine' | 'coast' | 'desert';  // Selected theme
  rangeStart?: string;           // ISO date string (YYYY-MM-DD)
  rangeEnd?: string;             // ISO date string (YYYY-MM-DD)
  monthNote: string;             // Month-level memo
  rangeNotes: Record<string, string>;  // Per-range notes (keyed by "start__end")
}
```

## 🧪 Testing Checklist

- [x] Date range selection works across months
- [x] Notes save and persist on reload
- [x] Theme switching updates colors dynamically
- [x] Mobile layout stacks properly
- [x] Keyboard navigation functional
- [x] No console errors or warnings


## 📄 License

Open source, use freely for any purpose.

---

**Built with React + Next.js + TypeScript**
*A demonstration of clean component architecture, responsive design, and thoughtful UX*
