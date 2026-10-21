import { useState, useEffect } from 'react'

type AudioListener = (enabled: boolean) => void

let isAudioEnabled = true
const listeners = new Set<AudioListener>()

export function getAudioEnabled(): boolean {
  return isAudioEnabled
}

export function setAudioEnabled(enabled: boolean): void {
  isAudioEnabled = enabled
  listeners.forEach((fn) => fn(isAudioEnabled))
}

export function toggleAudio(): boolean {
  setAudioEnabled(!isAudioEnabled)
  return isAudioEnabled
}

export function subscribeAudio(listener: AudioListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useAudioState(): [boolean, () => void] {
  const [enabled, setEnabled] = useState(getAudioEnabled)

  useEffect(() => {
    return subscribeAudio((val) => setEnabled(val))
  }, [])

  return [enabled, toggleAudio]
}
