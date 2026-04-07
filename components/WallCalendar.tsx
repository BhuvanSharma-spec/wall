'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  buildMonthGrid,
  compareKeys,
  countRangeDays,
  dateRangeLabel,
  defaultStorageKey,
  getSceneArt,
  isWithinRange,
  monthLabel,
  prettyKey,
  scenes,
  sameDayKey,
  toDateKey,
  weekdayLabels
} from '@/lib/calendar';
import { readStorage, writeStorage } from '@/lib/storage';

type StoredState = {
  monthOffset: number;
  sceneId: 'alpine' | 'coast' | 'desert';
  rangeStart?: string;
  rangeEnd?: string;
  monthNote: string;
  rangeNotes: Record<string, string>;
};

const initialState: StoredState = {
  monthOffset: 0,
  sceneId: 'alpine',
  monthNote: '',
  rangeNotes: {}
};

function rangeKey(start?: string, end?: string): string {
  if (!start || !end) return '';
  const a = compareKeys(start, end) <= 0 ? start : end;
  const b = compareKeys(start, end) <= 0 ? end : start;
  return `${a}__${b}`;
}

function sceneById(id: StoredState['sceneId']) {
  return scenes.find((scene) => scene.id === id) ?? scenes[0];
}

export default function WallCalendar() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<StoredState>(initialState);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  useEffect(() => {
    setState(readStorage(defaultStorageKey, initialState));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(defaultStorageKey, state);
  }, [hydrated, state]);

  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const viewingDate = useMemo(() => {
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth() + state.monthOffset, 1);
  }, [state.monthOffset]);

  const grid = useMemo(() => buildMonthGrid(viewingDate), [viewingDate]);
  const scene = sceneById(state.sceneId);
  const activeRangeKey = rangeKey(state.rangeStart, state.rangeEnd);
  const activeRangeNote = activeRangeKey ? state.rangeNotes[activeRangeKey] ?? '' : '';

  const rangeStart = state.rangeStart;
  const rangeEnd = state.rangeEnd;
  const selectedDays = countRangeDays(rangeStart, rangeEnd);

  const previewBounds = useMemo(() => {
    if (!rangeStart || rangeEnd || !hoveredDay) return null;
    return compareKeys(hoveredDay, rangeStart) >= 0
      ? { start: rangeStart, end: hoveredDay }
      : { start: hoveredDay, end: rangeStart };
  }, [hoveredDay, rangeEnd, rangeStart]);

  function updateRange(nextKey: string) {
    setState((current) => {
      if (!current.rangeStart || (current.rangeStart && current.rangeEnd)) {
        return { ...current, rangeStart: nextKey, rangeEnd: undefined };
      }

      if (compareKeys(nextKey, current.rangeStart) < 0) {
        return { ...current, rangeStart: nextKey, rangeEnd: current.rangeStart };
      }

      return { ...current, rangeEnd: nextKey };
    });
  }

  function clearRange() {
    setState((current) => ({ ...current, rangeStart: undefined, rangeEnd: undefined }));
    setHoveredDay(null);
  }

  function saveCurrentRangeNote() {
    if (!state.rangeStart || !state.rangeEnd) return;
    const key = rangeKey(state.rangeStart, state.rangeEnd);
    setState((current) => ({
      ...current,
      rangeNotes: {
        ...current.rangeNotes,
        [key]: activeRangeNote.trim()
      }
    }));
  }

  function removeSavedNote(key: string) {
    setState((current) => {
      const next = { ...current.rangeNotes };
      delete next[key];
      return { ...current, rangeNotes: next };
    });
  }

  const savedNotes = Object.entries(state.rangeNotes)
    .filter(([, note]) => note.trim().length > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <section className="calendar-shell" style={{ ['--accent' as string]: scene.accent }}>
      <header className="calendar-topbar">
        <div className="branding">
          <div className="branding-badge" aria-hidden="true" />
          <div>
            <h1>Wall Calendar Studio</h1>
            <p>Range selection, sticky notes, and a frame that behaves like paper.</p>
          </div>
        </div>

        <div className="toolbar" aria-label="calendar navigation">
          <button type="button" onClick={() => setState((s) => ({ ...s, monthOffset: s.monthOffset - 1 }))}>
            Prev month
          </button>
          <button type="button" className="active" onClick={() => setState((s) => ({ ...s, monthOffset: 0 }))}>
            Today
          </button>
          <button type="button" onClick={() => setState((s) => ({ ...s, monthOffset: s.monthOffset + 1 }))}>
            Next month
          </button>
        </div>
      </header>

      <div className="calendar-frame">
        <div className="calendar-grid">
          <aside className="left-panel">
            <div className="hero-card">
              <div
                className="hero-art"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: getSceneArt(scene.id) }}
              />
              <div className="hero-overlay">
                <h2>{scene.label} month mood</h2>
                <p>{scene.caption}</p>
              </div>
            </div>

            <div className="scene-strip" role="tablist" aria-label="hero scene selector">
              {scenes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`scene-chip ${state.sceneId === item.id ? 'active' : ''}`}
                  onClick={() => setState((s) => ({ ...s, sceneId: item.id }))}
                >
                  <span className="scene-dot" aria-hidden="true" style={{ color: item.accent }} />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="month-card">
              <div className="month-heading">
                <div>
                  <h2 className="month-title">{monthLabel(viewingDate)}</h2>
                  <p className="month-subtitle">Select a start day and an end day. The center days fill in automatically.</p>
                </div>
                <div className="month-actions">
                  <button type="button" className="icon-button" onClick={() => clearRange()}>
                    Clear range
                  </button>
                </div>
              </div>

              <div className="weekdays" aria-hidden="true">
                {weekdayLabels().map((label) => (
                  <div key={label} className="weekday">
                    {label}
                  </div>
                ))}
              </div>

              <div className="day-grid" role="grid" aria-label={monthLabel(viewingDate)}>
                {grid.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="day-cell empty" aria-hidden="true" />;
                  }

                  const isStart = sameDayKey(day, rangeStart ?? '');
                  const isEnd = sameDayKey(day, rangeEnd ?? '');
                  const inRange = isWithinRange(day, rangeStart, rangeEnd);
                  const previewRange = rangeStart && !rangeEnd && previewBounds ? isWithinRange(day, previewBounds.start, previewBounds.end) : false;
                  const isToday = sameDayKey(day, todayKey);
                  const holidayName =
                    [
                      { key: `${viewingDate.getMonth() + 1}-1`, label: 'New Year' },
                      { key: '1-26', label: 'Holiday' },
                      { key: '7-4', label: 'Holiday' },
                      { key: '12-25', label: 'Holiday' }
                    ].find((item) => {
                      const [month, date] = day.split('-');
                      return `${Number(month)}-${Number(date)}` === item.key;
                    })?.label ?? '';

                  return (
                    <button
                      key={day}
                      type="button"
                      className={[
                        'day-cell',
                        isToday ? 'today' : '',
                        isStart ? 'start' : '',
                        isEnd ? 'end' : '',
                        inRange ? 'range' : '',
                        previewRange && !inRange ? 'preview' : '',
                        day.startsWith(`${viewingDate.getFullYear()}-${String(viewingDate.getMonth() + 1).padStart(2, '0')}`)
                          ? ''
                          : 'muted'
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => updateRange(day)}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      aria-label={`${prettyKey(day)}${isStart ? ', start date' : ''}${isEnd ? ', end date' : ''}`}
                    >
                      <div className="day-meta">
                        <span className="day-number">{Number(day.slice(-2))}</span>
                        {holidayName ? <span className="holiday-tag">{holidayName}</span> : null}
                      </div>
                      <div className="day-pill">
                        {isStart && isEnd
                          ? 'Selected'
                          : isStart
                            ? 'Start'
                            : isEnd
                              ? 'End'
                              : isToday
                                ? 'Today'
                                : previewRange
                                  ? 'Preview'
                                  : 'Open'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="right-panel">
            <div className="details-card">
              <div className="info-row">
                <div className="info-chip">
                  <strong>Range</strong>
                  <span>{dateRangeLabel(rangeStart, rangeEnd)}</span>
                </div>
                <div className="info-chip">
                  <strong>Days selected</strong>
                  <span>{selectedDays || '0'}</span>
                </div>
                <div className="info-chip">
                  <strong>Theme</strong>
                  <span>{scene.label}</span>
                </div>
              </div>

              <div className="notes-layout">
                <div className="notes-card">
                  <h3>Monthly memo</h3>
                  <p>A general note for this month. It stays pinned even when the selected range changes.</p>
                  <textarea
                    value={state.monthNote}
                    onChange={(event) => setState((current) => ({ ...current, monthNote: event.target.value }))}
                    placeholder="Write a month-level reminder, agenda, or shopping list..."
                  />
                </div>

                <div className="notes-card">
                  <h3>Selected range note</h3>
                  <p>Attach a note to the exact date span that is currently active.</p>
                  <textarea
                    value={activeRangeNote}
                    onChange={(event) => {
                      const text = event.target.value;
                      if (!state.rangeStart || !state.rangeEnd) return;
                      const key = rangeKey(state.rangeStart, state.rangeEnd);
                      setState((current) => ({
                        ...current,
                        rangeNotes: {
                          ...current.rangeNotes,
                          [key]: text
                        }
                      }));
                    }}
                    placeholder={state.rangeStart && state.rangeEnd ? 'Write a note for the selected range...' : 'Select a full range first.'}
                    disabled={!state.rangeStart || !state.rangeEnd}
                  />
                  <div className="note-actions">
                    <button type="button" className="note-action primary" onClick={saveCurrentRangeNote} disabled={!state.rangeStart || !state.rangeEnd}>
                      Save range note
                    </button>
                    <button
                      type="button"
                      className="note-action"
                      onClick={() =>
                        setState((current) => {
                          if (!current.rangeStart || !current.rangeEnd) return current;
                          const key = rangeKey(current.rangeStart, current.rangeEnd);
                          const next = { ...current.rangeNotes };
                          delete next[key];
                          return { ...current, rangeNotes: next };
                        })
                      }
                      disabled={!state.rangeStart || !state.rangeEnd}
                    >
                      Clear this note
                    </button>
                  </div>
                </div>
              </div>

              <div className="notes-card">
                <h3>Saved range notes</h3>
                <p>Each card stores a note for one selected span. Nothing goes to a backend. It stays local.</p>
                <div className="saved-notes">
                  {savedNotes.length ? (
                    savedNotes.map(([key, value]) => {
                      const [start, end] = key.split('__');
                      return (
                        <article key={key} className="saved-note">
                          <header>
                            <strong>{prettyKey(start)} → {prettyKey(end)}</strong>
                            <button type="button" onClick={() => removeSavedNote(key)}>
                              Remove
                            </button>
                          </header>
                          <p>{value}</p>
                        </article>
                      );
                    })
                  ) : (
                    <div className="saved-note">
                      <p style={{ margin: 0, color: 'var(--muted)' }}>No saved range notes yet. Select dates, type a note, and save it.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="footer-hint">
                Click one day to set the start. Click another day to lock the range. Click a new day after that to start over.
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
