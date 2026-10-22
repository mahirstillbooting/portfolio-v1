import { Volume2, VolumeX } from 'lucide-react'
import { useAudioState } from '../utils/audioState'

export default function SoundToggle() {
  const [audioEnabled, toggleAudio] = useAudioState()

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-7 sm:right-7 z-40 pointer-events-auto">
      <button
        type="button"
        onClick={toggleAudio}
        title={audioEnabled ? 'Mute sound' : 'Enable sound'}
        aria-label={audioEnabled ? 'Mute sound' : 'Enable sound'}
        style={{
          background: 'rgba(18, 18, 20, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/14 flex items-center justify-center text-neutral-300 hover:text-white hover:border-[#E2652B] hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
      >
        {audioEnabled ? (
          <Volume2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#E2652B] animate-pulse transition-transform group-hover:scale-110" />
        ) : (
          <VolumeX className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-neutral-500 group-hover:text-neutral-300 transition-colors" />
        )}
      </button>
    </div>
  )
}
