import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePlayer } from '@videojs/react/video';
import { SKIN_IDS, SKINS, preloadSkin, type SkinId } from '../skins';
import { CheckIcon, ChevronIcon, GearIcon } from './Icons';

type View = 'root' | 'speed' | 'appearance';
const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
const rateLabel = (r: number) => (r === 1 ? 'Normal' : `${r}×`);

type Props = { skin: SkinId; onSelectSkin: (id: SkinId) => void };

/**
 * One settings surface: root -> (Playback speed | Appearance). The panel stays
 * mounted at the same place in the tree for every skin, so switching a skin
 * never moves focus or closes the menu.
 */
export function SettingsPanel({ skin, onSelectSkin }: Props) {
  const store = usePlayer();
  const rate = usePlayer((s) => s.playbackRate);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('root');
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const supportsRate = typeof rate === 'number';

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    setView('root');
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Move focus into the panel whenever it opens or changes view.
  useEffect(() => {
    if (!open) return;
    const target =
      panelRef.current?.querySelector<HTMLElement>('input:checked') ??
      panelRef.current?.querySelector<HTMLElement>('[data-autofocus]');
    target?.focus();
  }, [open, view]);

  // Escape closes; keys inside the panel must not reach player hotkeys (Space, arrows).
  useEffect(() => {
    const el = panelRef.current;
    if (!open || !el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
      }
      e.stopPropagation();
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Outside press closes without stealing focus or touching playback.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, close]);

  const Back = ({ label }: { label: string }) => (
    <button type="button" className="ecrin-menu-back" data-autofocus onClick={() => setView('root')}>
      <ChevronIcon back />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="ecrin-settings" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className="ecrin-btn ecrin-settings-trigger"
        aria-label="Settings"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        data-open={open || undefined}
        onClick={() => (open ? close(false) : setOpen(true))}
      >
        <GearIcon />
      </button>

      <div
        id={panelId}
        ref={panelRef}
        className="ecrin-panel"
        role="dialog"
        aria-label="Settings"
        hidden={!open}
        data-view={view}
      >
        {view === 'root' && (
          <ul className="ecrin-menu" role="list">
            {supportsRate && (
              <li>
                <button type="button" className="ecrin-menu-row" data-autofocus onClick={() => setView('speed')}>
                  <span className="row-label">Playback speed</span>
                  <span className="row-value">{rateLabel(rate as number)}</span>
                  <ChevronIcon />
                </button>
              </li>
            )}
            {SKIN_IDS.length > 1 && (
            <li>
              <button type="button" className="ecrin-menu-row" data-autofocus={!supportsRate || undefined} onClick={() => setView('appearance')}>
                <span className="row-label">Appearance</span>
                <span className="row-value">{SKINS[skin].label}</span>
                <ChevronIcon />
              </button>
            </li>
            )}
          </ul>
        )}

        {view === 'speed' && (
          <div className="ecrin-subpage">
            <Back label="Playback speed" />
            <fieldset className="ecrin-radios">
              <legend className="ecrin-sr">Playback speed</legend>
              {RATES.map((r) => (
                <label key={r} className="ecrin-option" data-selected={r === rate || undefined}>
                  <input type="radio" name="ecrin-rate" checked={r === rate} onChange={() => store.setPlaybackRate(r)} />
                  <span className="opt-name">{rateLabel(r)}</span>
                  <span className="opt-check" aria-hidden="true"><CheckIcon /></span>
                </label>
              ))}
            </fieldset>
          </div>
        )}

        {view === 'appearance' && (
          <div className="ecrin-subpage">
            <Back label="Appearance" />
            <fieldset className="ecrin-radios ecrin-skins">
              <legend className="ecrin-legend">Skin</legend>
              {SKIN_IDS.map((id) => (
                <label
                  key={id}
                  className="ecrin-option ecrin-skin-card"
                  data-selected={id === skin || undefined}
                  onPointerEnter={() => preloadSkin(id)}
                >
                  <input
                    type="radio"
                    name="ecrin-skin"
                    value={id}
                    checked={id === skin}
                    onFocus={() => preloadSkin(id)}
                    onChange={() => onSelectSkin(id)}
                  />
                  <span className="ecrin-swatch" data-swatch={id} aria-hidden="true" />
                  <span className="opt-text">
                    <span className="opt-name">{SKINS[id].label}</span>
                    <span className="opt-desc">{SKINS[id].description}</span>
                  </span>
                  <span className="opt-check" aria-hidden="true"><CheckIcon /></span>
                </label>
              ))}
            </fieldset>
          </div>
        )}
      </div>
    </div>
  );
}
