import { useState } from 'react';
import { Video, VideoPlayer } from '@videojs/react/video';
import { MuxVideo } from '@videojs/react/media/mux-video';
import { EcrinSkin } from './EcrinSkin';
import type { SkinId } from './skins';

/** Mux asset used for the landscape demo (Mux animated demo). Swap for any playback ID. */
export const DEMO_PLAYBACK_ID = 'VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU';
/** Portrait demo clip (generated, self-hosted) used on phones. */
export const PORTRAIT_SRC = '/media/amalfi-portrait.mp4';
export const PORTRAIT_POSTER = '/media/amalfi-portrait.jpg';

type MediaShape = 'portrait' | 'landscape';

/**
 * Decided once at load, never on resize or skin change, so the media element is
 * never swapped under the viewer. `?media=portrait|landscape` overrides it.
 */
export function resolveMediaShape(search: string = typeof location === 'undefined' ? '' : location.search): MediaShape {
  try {
    const q = new URLSearchParams(search).get('media');
    if (q === 'portrait' || q === 'landscape') return q;
    return matchMedia('(max-width: 560px)').matches ? 'portrait' : 'landscape';
  } catch {
    return 'landscape';
  }
}

type Props = { skin: SkinId; onSelectSkin: (id: SkinId) => void };

export function EcrinPlayer({ skin, onSelectSkin }: Props) {
  const [media] = useState<MediaShape>(() => resolveMediaShape());
  return (
    <VideoPlayer>
      <EcrinSkin skin={skin} onSelectSkin={onSelectSkin} media={media}>
        {media === 'portrait' ? (
          <Video src={PORTRAIT_SRC} poster={PORTRAIT_POSTER} loop playsInline preload="metadata" />
        ) : (
          <MuxVideo
            source={{ playbackId: DEMO_PLAYBACK_ID }}
            poster={`https://image.mux.com/${DEMO_PLAYBACK_ID}/thumbnail.jpg?time=20&width=1280`}
            crossOrigin="anonymous"
            playsInline
            preload="metadata"
          />
        )}
      </EcrinSkin>
    </VideoPlayer>
  );
}
