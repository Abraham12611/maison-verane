import { MuteButton, VolumeSlider } from '@videojs/react';
import { usePlayer } from '@videojs/react/video';
import type { SkinId } from '../skins';
import { VolumeIcon } from './Icons';
import { RotaryVolume } from './RotaryVolume';

const DIALS: Partial<Record<SkinId, string>> = {};

function LinearVolume() {
  const volume = usePlayer((s) => s.volume);
  const pct = typeof volume === 'number' ? Math.round(volume * 100) : 0;
  return (
    <VolumeSlider.Root
      className="ecrin-volume"
      // Keep the pull where the user left the volume even while muted.
      style={{ ['--ecrin-vol' as string]: `${pct}%` }}
    >
      <VolumeSlider.Track className="ecrin-volume-track">
        <VolumeSlider.Fill className="ecrin-volume-fill" />
      </VolumeSlider.Track>
      <VolumeSlider.Thumb className="ecrin-volume-thumb" />
      <span className="ecrin-volume-readout" aria-hidden="true">{pct}%</span>
    </VolumeSlider.Root>
  );
}

export function VolumeControl({ skin }: { skin: SkinId }) {
  const dial = DIALS[skin];
  const volume = usePlayer((s) => s.volume);
  const muted = usePlayer((s) => s.muted);
  const pct = typeof volume === 'number' ? Math.round(volume * 100) : 0;
  return (
    <div className="ecrin-audio">
      <MuteButton
        className="ecrin-btn ecrin-mute"
        render={(props, state) => (
          <button {...props}>
            <VolumeIcon level={state.volumeLevel} />
          </button>
        )}
      />
      {dial ? <RotaryVolume image={dial} /> : <LinearVolume />}
      {typeof volume === 'number' && (
        <output className="ecrin-vol-text" aria-hidden="true">
          {muted ? 'Muted' : `${pct}%`}
        </output>
      )}
    </div>
  );
}
