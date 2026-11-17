import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  BufferingIndicator,
  CaptionsButton,
  Container,
  ErrorDialog,
  FullscreenButton,
  Hotkey,
  PlayButton,
  StatusAnnouncer,
  Time,
  TimeSlider,
} from '@videojs/react';
import { SKINS, type SkinId } from './skins';
import { CaptionsIcon, FullscreenIcon, PauseIcon, PlayIcon, ReplayIcon } from './controls/Icons';
import { SettingsPanel } from './controls/SettingsPanel';
import { VolumeControl } from './controls/Volume';
import './style/tokens.css';
import './style/base.css';
import './style/voyage.css';
import './style/mobile.css';

type Props = { skin: SkinId; onSelectSkin: (id: SkinId) => void; media?: 'portrait' | 'landscape'; children: ReactNode };

/**
 * The skin: one stable tree. `data-ecrin-skin` on the root swaps tokens, textures
 * and the signature controls via CSS. `skin` is never used as a React key, so the
 * Container and the media element are never remounted.
 */
export function EcrinSkin({ skin, onSelectSkin, media = 'landscape', children }: Props) {
  const [announcement, setAnnouncement] = useState('');
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setAnnouncement(`${SKINS[skin].label} appearance selected.`);
  }, [skin]);

  return (
    <Container className="ecrin" data-ecrin-skin={skin} data-media={media}>
      <div className="ecrin-case">
        <div className="ecrin-ornaments" aria-hidden="true">
          <i className="orn orn-corner tl" /><i className="orn orn-corner tr" />
          <i className="orn orn-corner bl" /><i className="orn orn-corner br" />
          <i className="orn orn-strap l" /><i className="orn orn-strap r" />
          <i className="orn orn-screw tl" /><i className="orn orn-screw tr" />
          <i className="orn orn-screw bl" /><i className="orn orn-screw br" />
          <span className="orn orn-plaque"><b>VERANE</b><em>{SKINS[skin].label}</em></span>
          <i className="orn orn-jewel" />
        </div>

        <div className="ecrin-screen">
          {children}
          <PlayButton
            className="ecrin-screen-tap"
            tabIndex={-1}
            aria-hidden="true"
            render={(props, state) => (
              <button {...props} tabIndex={-1} aria-hidden="true" data-idle={!state.paused || undefined}>
                <span className="ecrin-bigplay">{state.ended ? <ReplayIcon /> : <PlayIcon />}</span>
              </button>
            )}
          />
          <BufferingIndicator
            className="ecrin-buffering"
            render={(props) => (
              <div {...props}>
                <span className="ecrin-spinner" />
              </div>
            )}
          />
          <ErrorDialog.Root>
            <ErrorDialog.Popup className="ecrin-error">
              <ErrorDialog.Title />
              <ErrorDialog.Description />
              <ErrorDialog.Close className="ecrin-error-close" />
            </ErrorDialog.Popup>
          </ErrorDialog.Root>
        </div>

        <div className="ecrin-deck" role="group" aria-label="Player controls">
          <PlayButton
            className="ecrin-btn ecrin-play"
            render={(props, state) => (
              <button {...props}>
                {state.ended ? <ReplayIcon /> : state.paused ? <PlayIcon /> : <PauseIcon />}
              </button>
            )}
          />

          <Time.Group className="ecrin-time">
            <Time.Value type="current" />
            <Time.Separator />
            <Time.Value type="duration" />
          </Time.Group>

          <TimeSlider.Root className="ecrin-seek">
            <TimeSlider.Track className="ecrin-seek-track">
              <TimeSlider.Buffer className="ecrin-seek-buffer" />
              <TimeSlider.Fill className="ecrin-seek-fill" />
            </TimeSlider.Track>
            <TimeSlider.Thumb className="ecrin-seek-thumb" />
            <TimeSlider.Preview className="ecrin-seek-preview">
              <TimeSlider.Value type="pointer" />
            </TimeSlider.Preview>
          </TimeSlider.Root>

          <VolumeControl skin={skin} />

          <div className="ecrin-tools">
            <CaptionsButton
              className="ecrin-btn ecrin-cc"
              render={(props) => (
                <button {...props}>
                  <CaptionsIcon />
                </button>
              )}
            />
            <SettingsPanel skin={skin} onSelectSkin={onSelectSkin} />
            <FullscreenButton
              className="ecrin-btn ecrin-fs"
              render={(props, state) => (
                <button {...props}>
                  <FullscreenIcon exit={state.fullscreen} />
                </button>
              )}
            />
          </div>
        </div>
      </div>

      <Hotkey keys="Space" action="togglePaused" />
      <Hotkey keys="k" action="togglePaused" />
      <Hotkey keys="m" action="toggleMuted" />
      <Hotkey keys="f" action="toggleFullscreen" />
      <Hotkey keys="c" action="toggleSubtitles" />
      <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
      <Hotkey keys="ArrowRight" action="seekStep" value={5} />
      <Hotkey keys="ArrowUp" action="volumeStep" value={0.05} />
      <Hotkey keys="ArrowDown" action="volumeStep" value={-0.05} />

      <StatusAnnouncer />
      <div className="ecrin-sr" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
    </Container>
  );
}
