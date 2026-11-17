import { VideoPlayer } from '@videojs/react/video';
import { MuxVideo } from '@videojs/react/media/mux-video';
import { EcrinSkin } from '../player/EcrinSkin';

/** Atelier film, hosted on Mux. */
export const FILM_PLAYBACK_ID = 'WyBNZnYANtL2pNTaTB5tVllvi1VboZRwvhqqHNFRcsY';
const POSTER = `https://image.mux.com/${FILM_PLAYBACK_ID}/thumbnail.jpg?time=15&width=1600`;

/**
 * The ÉCRIN player, locked to the Voyage skin. The skin picker is hidden because
 * SKIN_IDS holds a single entry, so there is only ever one skin to choose.
 */
export function BrandPlayer() {
  return (
    <VideoPlayer>
      <EcrinSkin skin="voyage" onSelectSkin={() => {}} media="landscape">
        <MuxVideo
          source={{ playbackId: FILM_PLAYBACK_ID }}
          poster={POSTER}
          crossOrigin="anonymous"
          playsInline
          preload="metadata"
        />
      </EcrinSkin>
    </VideoPlayer>
  );
}
