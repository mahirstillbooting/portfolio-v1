import React, { useEffect, useRef, useCallback } from 'react'
import { getAudioEnabled } from '../utils/audioState'
import pageTurnSoundUrl from '../assets/mixkit-page-turn-single-1104.wav'

export interface TechItem {
  id: string
  code: string
  name: string
  fullName: string
}

export const TECH_STACK_ITEMS: TechItem[] = [
  { id: 'javascript', code: 'N-01', name: 'JS', fullName: 'JavaScript' },
  { id: 'html5',      code: 'N-02', name: 'HTML', fullName: 'HTML5' },
  { id: 'css3',       code: 'N-03', name: 'CSS', fullName: 'CSS3 / Tailwind' },
  { id: 'sql',        code: 'N-04', name: 'SQL', fullName: 'Oracle SQL' },
  { id: 'c_lang',     code: 'N-05', name: 'C', fullName: 'C Language' },
  { id: 'cpp',        code: 'N-06', name: 'C++', fullName: 'C++' },
  { id: 'java',       code: 'N-07', name: 'JAVA', fullName: 'Java' },
  { id: 'firebase',   code: 'N-08', name: 'FIRE', fullName: 'Firestore' },
  { id: 'git',        code: 'N-09', name: 'GIT', fullName: 'Git & GitHub' },
  { id: 'figma',      code: 'N-10', name: 'FIGMA', fullName: 'Figma UI' },
  { id: 'ai_prompt',  code: 'N-11', name: 'AI', fullName: 'AI Prompting' },
  { id: 'qa_test',    code: 'N-12', name: 'QA', fullName: 'ISO-25010 QA' },
]

export const TECH_SVGS: Record<string, string> = {
  javascript: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><g clip-path="url(#a)"><path fill="#f7df1e" d="M100 0H0v100h100z"/><path fill="#000" d="M67.175 78.125c2.014 3.29 4.634 5.707 9.27 5.707 3.893 0 6.38-1.946 6.38-4.635 0-3.222-2.555-4.364-6.84-6.238l-2.35-1.008c-6.781-2.89-11.286-6.508-11.286-14.159 0-7.047 5.37-12.413 13.762-12.413 5.975 0 10.27 2.08 13.365 7.524l-7.317 4.699c-1.612-2.89-3.35-4.027-6.048-4.027-2.752 0-4.497 1.746-4.497 4.027 0 2.819 1.746 3.96 5.778 5.706l2.35 1.006c7.983 3.424 12.491 6.915 12.491 14.762 0 8.46-6.646 13.096-15.571 13.096-8.727 0-14.365-4.16-17.124-9.61zm-33.196.815c1.477 2.619 2.82 4.833 6.048 4.833 3.087 0 5.035-1.208 5.035-5.905V45.916h9.397v32.08c0 9.73-5.705 14.158-14.032 14.158-7.524 0-11.881-3.894-14.097-8.583z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h100v100H0z"/></clipPath></defs></svg>`,
  html5: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#e44d26" d="M14.021 90.034 6 0h88.187l-8.022 89.985L50.02 100"/><path fill="#f16529" d="M50.093 92.344V7.39h36.048l-6.88 76.811"/><path fill="#ebebeb" d="M22.383 18.4h27.71v11.036H34.488L35.51 40.74h14.584v11.01H25.397zm3.5 38.893h11.084l.778 8.823 12.348 3.306v11.521l-22.654-6.32"/><path fill="#fff" d="M77.706 18.4H50.044v11.036h26.64zm-2.018 22.34H50.044v11.035h13.612l-1.288 14.341-12.324 3.306v11.473l22.606-6.271"/></svg>`,
  css3: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#264de4" d="m94.175 0-8.033 89.99L50.034 100l-36.01-9.996L6 0z"/><path fill="#2965f1" d="m79.265 84.26 6.865-76.9H50.088v84.988z"/><path fill="#ebebeb" d="m24.396 40.74.99 11.039h24.702V40.74zm25.692-22.342h-27.68l1.003 11.038h26.676zm0 62.495V69.408l-.049.013-12.294-3.32-.786-8.803H25.878l1.547 17.332 22.612 6.277z"/><path fill="#fff" d="m63.642 51.779-1.281 14.316-12.312 3.323v11.484l22.63-6.272.166-1.865 2.594-29.06.27-2.965L77.7 18.398H50.05v11.038h15.555L64.599 40.74H50.05v11.04z"/></svg>`,
  sql: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#ea1b22" d="M31.529 81.056C14.013 81.056 0 67.044 0 49.528s14.013-31.529 31.529-31.529H68.47c17.517 0 31.53 14.013 31.53 31.529S85.987 81.056 68.471 81.056zM67.516 69.91c11.465 0 20.382-9.236 20.382-20.382 0-11.465-9.236-20.382-20.382-20.382H32.484c-11.465 0-20.382 9.235-20.382 20.382 0 11.146 9.236 20.382 20.382 20.382z"/></svg>`,
  c_lang: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#659AD3" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/><path fill="#03599C" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z"/></svg>`,
  cpp: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#5c8dbc" d="M94.73 29.32c0-1.676-.359-3.158-1.084-4.43-.713-1.25-1.78-2.298-3.21-3.127C78.621 14.95 66.797 8.16 54.987 1.343c-3.183-1.839-6.27-1.772-9.43.093-4.702 2.773-28.243 16.26-35.258 20.323-2.889 1.672-4.295 4.232-4.295 7.559C6 43.016 6.005 56.714 6 70.413c0 1.64.344 3.093 1.037 4.345.713 1.289 1.795 2.366 3.26 3.213 7.014 4.063 30.559 17.55 35.26 20.323 3.16 1.865 6.248 1.932 9.432.093 11.81-6.818 23.635-13.609 35.45-20.42 1.464-.847 2.546-1.925 3.259-3.212.692-1.253 1.036-2.706 1.037-4.346 0 0 0-27.39-.005-41.088"/><path fill="#1a4674" d="M50.503 49.732 7.037 74.758c.713 1.289 1.795 2.366 3.26 3.213 7.014 4.063 30.559 17.55 35.26 20.323 3.16 1.866 6.248 1.932 9.432.094 11.81-6.82 23.635-13.61 35.45-20.42 1.464-.848 2.546-1.926 3.259-3.213z"/><path fill="#1a4674" d="M37.629 57.145c2.53 4.415 7.284 7.393 12.738 7.393 5.488 0 10.27-3.016 12.786-7.478l-12.65-7.328z"/><path fill="#1b598e" d="M94.73 29.321c0-1.677-.359-3.159-1.084-4.43L50.503 49.73l43.195 25.024c.692-1.252 1.036-2.706 1.037-4.346 0 0 0-27.39-.005-41.088"/><path fill="#fff" d="M92.355 51.52H88.98v3.376h-3.376V51.52h-3.375v-3.375h3.375V44.77h3.376v3.375h3.375zm-12.316 0h-3.375v3.376h-3.376V51.52h-3.375v-3.375h3.375V44.77h3.376v3.375h3.375z"/><path fill="#fff" d="M63.154 57.06c-2.517 4.463-7.299 7.479-12.787 7.479-5.454 0-10.209-2.979-12.738-7.394a14.6 14.6 0 0 1-1.935-7.28c0-8.104 6.57-14.673 14.673-14.673 5.42 0 10.15 2.941 12.691 7.311l12.826-7.385c-5.098-8.8-14.615-14.72-25.516-14.72-16.275 0-29.468 13.193-29.468 29.467 0 5.34 1.42 10.346 3.903 14.665 5.084 8.846 14.63 14.803 25.565 14.803 10.955 0 20.514-5.981 25.592-14.853z"/></svg>`,
  java: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#5382a1" d="M36.753 77.336s-3.822 2.222 2.72 2.974c7.924.904 11.973.774 20.706-.879 0 0 2.296 1.44 5.502 2.687-19.576 8.39-44.304-.486-28.928-4.782M34.36 66.387s-4.286 3.173 2.26 3.85c8.464.873 15.15.945 26.717-1.283 0 0 1.6 1.622 4.115 2.51-23.668 6.92-50.03.545-33.092-5.077"/><path fill="#e76f00" d="M54.527 47.815c4.823 5.554-1.267 10.551-1.267 10.551s12.247-6.322 6.622-14.24C54.63 36.743 50.6 33.074 72.41 20.425c0 0-34.234 8.55-17.883 27.39"/><path fill="#5382a1" d="M80.418 85.434s2.827 2.33-3.115 4.133c-11.3 3.423-47.03 4.456-56.956.136-3.568-1.552 3.124-3.706 5.228-4.159 2.195-.475 3.45-.387 3.45-.387-3.968-2.795-25.648 5.49-11.012 7.861 39.913 6.473 72.757-2.914 62.405-7.584M38.59 55.044s-18.174 4.317-6.436 5.884c4.956.664 14.837.514 24.04-.258 7.522-.634 15.075-1.983 15.075-1.983s-2.653 1.136-4.571 2.446c-18.457 4.854-54.11 2.596-43.846-2.37 8.68-4.195 15.738-3.72 15.738-3.72m32.603 18.224c18.762-9.75 10.088-19.118 4.033-17.856-1.484.309-2.146.576-2.146.576s.551-.863 1.603-1.236c11.978-4.212 21.19 12.42-3.867 19.007 0 0 .29-.26.377-.491"/><path fill="#e76f00" d="M59.882 0s10.39 10.395-9.855 26.377C33.793 39.2 46.325 46.51 50.02 54.861c-9.476-8.55-16.43-16.077-11.765-23.082C45.103 21.496 64.075 16.51 59.882 0"/><path fill="#5382a1" d="M40.434 99.686c18.009 1.153 45.663-.64 46.318-9.161 0 0-1.26 3.23-14.883 5.796-15.371 2.892-34.329 2.555-45.573.7 0 0 2.302 1.906 14.138 2.665"/></svg>`,
  firebase: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#ffa000" d="m61.405 36.118-10 9.311-9.284-18.733 4.796-10.77c1.212-2.15 3.194-2.177 4.406 0z"/><path fill="#f57f17" d="M51.409 45.425 14 80.22l28.126-53.523z"/><path fill="#ffca28" d="M72.371 21.877c1.792-1.707 3.636-1.131 4.103 1.293l9.725 56.58-32.257 19.364c-1.13.633-4.13.88-4.13.88s-2.729-.332-3.774-.908L14 80.219z"/><path fill="#ffa000" d="M42.126 26.697 14 80.219 26.535 1.99c.47-2.425 1.844-2.672 3.084-.524z"/></svg>`,
  git: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><g clip-path="url(#a)"><path fill="#de4c36" d="M98.114 45.544 54.454 1.886a6.44 6.44 0 0 0-9.108 0l-9.066 9.066 11.5 11.501a7.65 7.65 0 0 1 7.869 1.834 7.66 7.66 0 0 1 1.817 7.916L68.55 43.287c2.682-.923 5.776-.326 7.918 1.82a7.66 7.66 0 0 1 0 10.836 7.662 7.662 0 0 1-12.508-8.335L53.623 37.271v27.202a7.663 7.663 0 0 1 2.026 12.288 7.66 7.66 0 0 1-10.836 0 7.663 7.663 0 0 1 2.508-12.51V36.795a7.6 7.6 0 0 1-2.508-1.672 7.66 7.66 0 0 1-1.651-8.377l-11.338-11.34L1.887 45.344a6.44 6.44 0 0 0 0 9.11l43.661 43.659a6.44 6.44 0 0 0 9.108 0l43.458-43.457a6.444 6.444 0 0 0 0-9.11"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h100v100H0z"/></clipPath></defs></svg>`,
  figma: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><g clip-path="url(#a)"><path fill="#0acf83" d="M33.333 100C42.533 100 50 92.533 50 83.333V66.667H33.333c-9.2 0-16.666 7.466-16.666 16.666S24.133 100 33.333 100"/><path fill="#a259ff" d="M16.667 50c0-9.2 7.466-16.667 16.666-16.667H50v33.334H33.333c-9.2 0-16.666-7.467-16.666-16.667"/><path fill="#f24e1e" d="M16.667 16.667C16.667 7.467 24.133 0 33.333 0H50v33.333H33.333c-9.2 0-16.666-7.466-16.666-16.666"/><path fill="#ff7262" d="M50 0h16.667c9.2 0 16.666 7.467 16.666 16.667s-7.466 16.666-16.666 16.666H50z"/><path fill="#1abcfe" d="M83.333 50c0 9.2-7.466 16.667-16.666 16.667S50 59.2 50 50s7.467-16.667 16.667-16.667S83.333 40.8 83.333 50"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h100v100H0z"/></clipPath></defs></svg>`,
  ai_prompt: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><g clip-path="url(#a)"><path fill="#fff" d="M93.06 40.937c1.25-3.438 1.563-6.875 1.25-10.313-.312-3.437-1.562-6.875-3.125-10-2.812-4.687-6.875-8.437-11.562-10.625-5-2.187-10.313-2.812-15.625-1.562-2.5-2.5-5.313-4.688-8.438-6.25S48.685-.001 45.248-.001c-5.313 0-10.625 1.563-15 4.688a24.16 24.16 0 0 0-9.063 12.5c-3.75.937-6.875 2.5-10 4.374-2.812 2.188-5 5-6.875 7.813-2.812 4.688-3.75 10-3.125 15.313a27.2 27.2 0 0 0 6.25 14.375c-1.25 3.437-1.562 6.874-1.25 10.312s1.563 6.875 3.125 10c2.813 4.688 6.875 8.438 11.563 10.625 5 2.188 10.312 2.813 15.625 1.563 2.5 2.5 5.312 4.687 8.437 6.25s6.875 2.187 10.313 2.187c5.312 0 10.625-1.562 15-4.687s7.5-7.5 9.062-12.5c3.438-.626 6.875-2.188 9.688-4.376 2.812-2.187 5.312-4.687 6.875-7.812 2.812-4.687 3.75-10 3.125-15.312-.625-5.313-2.5-10.313-5.938-14.375m-37.5 52.5c-5 0-8.75-1.563-12.187-4.376 0 0 .312-.312.625-.312l20-11.562c.625-.313.937-.626 1.25-1.25.312-.626.312-.938.312-1.563V46.249l8.438 5v23.125c.312 10.938-8.438 19.063-18.438 19.063M15.248 76.249c-2.188-3.75-3.125-8.125-2.188-12.5 0 0 .313.312.625.312l20 11.563c.625.313.938.313 1.563.313s1.25 0 1.562-.313l24.375-14.062v9.687L40.873 83.124c-4.375 2.5-9.375 3.125-14.063 1.875-5-1.25-9.062-4.375-11.562-8.75M9.935 32.812c2.188-3.75 5.625-6.563 9.688-8.125v23.75c0 .625 0 1.25.312 1.562.313.625.625.938 1.25 1.25L45.56 65.311l-8.437 5-20-11.562c-4.375-2.5-7.5-6.562-8.75-11.25s-.938-10.312 1.562-14.687m69.063 15.937L54.623 34.687l8.437-5 20 11.562c3.125 1.875 5.625 4.375 7.188 7.5s2.5 6.563 2.187 10.313c-.312 3.437-1.562 6.874-3.75 9.687s-5 5-8.437 6.25v-23.75c0-.625 0-1.25-.313-1.562 0 0-.312-.625-.937-.938m8.437-12.5s-.312-.312-.625-.312l-20-11.563c-.625-.312-.937-.312-1.562-.312s-1.25 0-1.563.312L39.31 38.437v-9.688l20.313-11.875c3.125-1.875 6.562-2.5 10.312-2.5 3.438 0 6.875 1.25 10 3.437 2.813 2.188 5.313 5 6.563 8.125s1.562 6.876.937 10.313m-52.5 17.5-8.437-5V25.311c0-3.437.937-7.187 2.812-10 1.875-3.124 4.688-5.312 7.813-6.874 3.125-1.563 6.875-2.188 10.312-1.563 3.438.313 6.875 1.875 9.688 4.063 0 0-.313.312-.625.312l-20 11.562c-.625.313-.938.625-1.25 1.25s-.313.938-.313 1.563zm4.375-10 10.938-6.25 10.937 6.25v12.5l-10.937 6.25-10.938-6.25z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h100v100H0z"/></clipPath></defs></svg>`,
  qa_test: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><g clip-path="url(#a)"><path fill="#fcc72b" d="M75.045 31.659 51.138 66.224a2.058 2.058 0 0 1-3.389-.005 2.04 2.04 0 0 1-.352-1.251l.957-19.084-15.447-3.276a2.05 2.05 0 0 1-1.478-1.242 2.03 2.03 0 0 1 .218-1.914L55.554 4.886a2.06 2.06 0 0 1 2.35-.78 2.045 2.045 0 0 1 1.391 2.036l-.956 19.085 15.446 3.275c.33.07.637.22.895.437a2.036 2.036 0 0 1 .365 2.72"/><path fill="#729b1b" d="M50.01 95.224a4.83 4.83 0 0 1-3.424-1.417L23.997 71.219a4.84 4.84 0 0 1 6.846-6.845l19.166 19.164 41.755-41.752a4.84 4.84 0 0 1 6.845 6.845L53.432 93.807a4.82 4.82 0 0 1-3.423 1.417"/><path fill="#729b1b" fill-opacity=".5" d="M49.99 95.224a4.83 4.83 0 0 0 3.423-1.417l22.59-22.588a4.84 4.84 0 0 0-.01-6.835 4.84 4.84 0 0 0-6.836-.01L49.99 83.538 8.235 41.786A4.84 4.84 0 0 0 1.39 48.63l45.178 45.176a4.82 4.82 0 0 0 3.422 1.417"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h100v100H0z"/></clipPath></defs></svg>`,
}

interface PixelTarget {
  r: number
  c: number
  x: number
  y: number
  color: string
}

interface TornadoParticle {
  r: number
  c: number
  startX: number
  startY: number
  targetX: number
  targetY: number
  startColor: string
  targetColor: string
  x: number
  y: number
  color: string
  extraRotations: number
  randomDelay: number
}

// Cubic ease in out for 650ms funnel swirl
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

interface MatrixCellProps {
  item: TechItem
  audioCtxRef: React.MutableRefObject<AudioContext | null>
}

function MatrixCell({ item, audioCtxRef }: MatrixCellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isHoveredRef = useRef(false)
  const animRef = useRef<{
    active: boolean
    startTime: number
    duration: number
    direction: 1 | -1 // 1: text -> icon, -1: icon -> text
  }>({
    active: false,
    startTime: 0,
    duration: 650,
    direction: 1,
  })

  const particlesRef = useRef<TornadoParticle[]>([])
  const textPixelsRef = useRef<PixelTarget[]>([])
  const iconPixelsRef = useRef<PixelTarget[]>([])

  const size = 280
  const grid = 28
  const cellSize = size / grid
  const center = size / 2

  // Play real page turn sound effect on card interaction
  const pageTurnAudioRef = useRef<HTMLAudioElement | null>(null)

  const playCardSound = useCallback(() => {
    if (!getAudioEnabled()) return
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )()
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {})
      }

      if (!pageTurnAudioRef.current) {
        pageTurnAudioRef.current = new Audio(pageTurnSoundUrl)
      }
      const audio = pageTurnAudioRef.current.cloneNode(true) as HTMLAudioElement
      audio.volume = 0.55
      audio.play().catch(() => {})
    } catch {
      // Audio fallback
    }
  }, [audioCtxRef])

  // Extract pixel matrices for text and icon on mount
  useEffect(() => {
    const off = document.createElement('canvas')
    off.width = grid
    off.height = grid
    const octx = off.getContext('2d', { willReadFrequently: true })!

    // 1. Render Tech Name (Default State)
    octx.fillStyle = '#000'
    octx.fillRect(0, 0, grid, grid)
    octx.fillStyle = '#fff'
    octx.textAlign = 'center'
    octx.textBaseline = 'middle'
    octx.font = item.name.length > 3 ? 'bold 8px monospace' : 'bold 10px monospace'
    octx.fillText(item.name, grid / 2, grid / 2)

    const textData = octx.getImageData(0, 0, grid, grid).data
    const textPixels: PixelTarget[] = []

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        const i = (r * grid + c) * 4
        const lum = (textData[i] + textData[i + 1] + textData[i + 2]) / 3
        if (lum > 70) {
          textPixels.push({
            r,
            c,
            x: c * cellSize + cellSize / 2,
            y: r * cellSize + cellSize / 2,
            color: '#E6E6E6',
          })
        }
      }
    }
    textPixelsRef.current = textPixels

    // 2. Render Icon / SVG bitmap (Hover State)
    const iconPixels: PixelTarget[] = []
    const svgStr = TECH_SVGS[item.id]

    const processIconData = (data: Uint8ClampedArray) => {
      iconPixels.length = 0
      for (let r = 0; r < grid; r++) {
        for (let c = 0; c < grid; c++) {
          const i = (r * grid + c) * 4
          const a = data[i + 3] / 255
          if (a > 0.25) {
            const red = data[i]
            const green = data[i + 1]
            const blue = data[i + 2]
            const hex = `rgb(${red},${green},${blue})`
            iconPixels.push({
              r,
              c,
              x: c * cellSize + cellSize / 2,
              y: r * cellSize + cellSize / 2,
              color: hex,
            })
          }
        }
      }
      iconPixelsRef.current = iconPixels
      initParticles()
    }

    if (svgStr && svgStr.trim().length > 0) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        octx.clearRect(0, 0, grid, grid)
        octx.drawImage(img, 2, 2, grid - 4, grid - 4)
        processIconData(octx.getImageData(0, 0, grid, grid).data)
      }
      img.onerror = () => {
        generateFallbackIcon(octx)
        processIconData(octx.getImageData(0, 0, grid, grid).data)
      }
      img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`
    } else {
      generateFallbackIcon(octx)
      processIconData(octx.getImageData(0, 0, grid, grid).data)
    }

    function generateFallbackIcon(ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, grid, grid)
      ctx.fillStyle = '#E2652B'
      // Draw technical geometric glyph representing the tool
      ctx.beginPath()
      ctx.arc(grid / 2, grid / 2, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#D71921'
      ctx.fillRect(10, 10, 8, 8)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(12, 12, 4, 4)
    }

    function initParticles() {
      const parts: TornadoParticle[] = []
      const tp = textPixelsRef.current
      const ip = iconPixelsRef.current
      const count = Math.max(tp.length, ip.length, 60)

      for (let i = 0; i < count; i++) {
        const textP = tp[i % tp.length] || { x: center, y: center, color: '#E6E6E6' }
        const iconP = ip[i % ip.length] || { x: center, y: center, color: '#E2652B' }

        parts.push({
          r: i % grid,
          c: Math.floor(i / grid),
          startX: textP.x,
          startY: textP.y,
          targetX: iconP.x,
          targetY: iconP.y,
          startColor: textP.color,
          targetColor: iconP.color,
          x: textP.x,
          y: textP.y,
          color: textP.color,
          extraRotations: (Math.random() * 1.5 + 2) * Math.PI * 2,
          randomDelay: Math.random() * 0.12,
        })
      }
      particlesRef.current = parts
      drawFrame(0)
    }

    function drawFrame(progress: number) {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, size, size)

      const parts = particlesRef.current
      const pRadius = cellSize * 0.42

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]

        if (progress === 0) {
          ctx.fillStyle = p.startColor
          ctx.beginPath()
          ctx.arc(p.startX, p.startY, pRadius, 0, Math.PI * 2)
          ctx.fill()
        } else if (progress === 1) {
          ctx.fillStyle = p.targetColor
          ctx.beginPath()
          ctx.arc(p.targetX, p.targetY, pRadius, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, pRadius, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
  }, [item, cellSize, grid, size])

  // Tornado Funnel Swirl Render Loop
  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop)
      const a = animRef.current
      if (!a.active) return

      const elapsed = now - a.startTime
      let rawT = Math.min(elapsed / a.duration, 1)
      const ease = easeInOutCubic(rawT)
      const sinBell = Math.sin(ease * Math.PI)

      ctx.clearRect(0, 0, size, size)
      const parts = particlesRef.current
      const pRadius = cellSize * 0.42
      const maxFunnelCompression = 0.15

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        const fromX = a.direction === 1 ? p.startX : p.targetX
        const fromY = a.direction === 1 ? p.startY : p.targetY
        const toX = a.direction === 1 ? p.targetX : p.startX
        const toY = a.direction === 1 ? p.targetY : p.startX

        const dx0 = fromX - center
        const dy0 = fromY - center
        const r0 = Math.hypot(dx0, dy0)
        const a0 = Math.atan2(dy0, dx0)

        const dx1 = toX - center
        const dy1 = toY - center
        const r1 = Math.hypot(dx1, dy1)
        const a1 = Math.atan2(dy1, dx1)

        // Funnel swirl radius compression and angular acceleration
        const targetR = r0 + (r1 - r0) * ease
        const funnel = 1 - sinBell * (1 - maxFunnelCompression)
        const curR = targetR * funnel

        const targetA = a0 + (a1 - a0) * ease
        const curA = targetA + sinBell * p.extraRotations * a.direction

        p.x = center + curR * Math.cos(curA)
        p.y = center + curR * Math.sin(curA)

        // Accent heat color during tornado swirl
        if (sinBell > 0.4) {
          p.color = sinBell > 0.7 ? '#D71921' : '#E2652B'
        } else {
          p.color = a.direction === 1 ? (ease > 0.5 ? p.targetColor : p.startColor) : (ease > 0.5 ? p.startColor : p.targetColor)
        }

        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, pRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      if (rawT >= 1) {
        a.active = false
        // Final frame render
        ctx.clearRect(0, 0, size, size)
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i]
          const finalX = a.direction === 1 ? p.targetX : p.startX
          const finalY = a.direction === 1 ? p.targetY : p.startY
          const finalColor = a.direction === 1 ? p.targetColor : p.startColor

          ctx.fillStyle = finalColor
          ctx.beginPath()
          ctx.arc(finalX, finalY, pRadius, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [cellSize, size, center])

  const handleMouseEnter = () => {
    isHoveredRef.current = true
    playCardSound()
    const a = animRef.current
    a.active = true
    a.startTime = performance.now()
    a.duration = 650
    a.direction = 1
  }

  const handleMouseLeave = () => {
    isHoveredRef.current = false
    const a = animRef.current
    a.active = true
    a.startTime = performance.now()
    a.duration = 650
    a.direction = -1
  }

  const handleTouchStart = () => {
    handleMouseEnter()
  }

  const handleTouchEnd = () => {
    // Keep visible briefly on mobile tap before reversing
    setTimeout(() => {
      handleMouseLeave()
    }, 700)
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        background: 'rgba(255, 255, 255, 0.025)',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="w-full h-[78px] sm:h-[98px] md:h-[155px] lg:h-[185px] p-1.5 sm:p-2.5 md:p-4 lg:p-5 rounded-xl sm:rounded-2xl hover:border-[#E2652B]/50 hover:bg-white/[0.05] hover:shadow-[0_16px_36px_rgba(0,0,0,0.85)] hover:-translate-y-1 active:scale-95 select-none group"
    >
      {/* Top telemetry: N-01 code and red/orange status dot */}
      <div className="w-full flex items-center justify-between text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-mono text-[#71717A] px-0.5 sm:px-1">
        <span>{item.code}</span>
        <span className="text-[6px] sm:text-[8px] md:text-[9px] text-[#E2652B]">●</span>
      </div>

      {/* Internal 280x280 Canvas (28x28 pixel matrix) */}
      <div className="relative w-7 h-7 sm:w-9 sm:h-9 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center my-auto">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="w-full h-full block"
        />
      </div>

      {/* Bottom telemetry: Full Tech Name */}
      <div className="w-full text-center text-[8px] sm:text-[10px] md:text-xs lg:text-[13px] font-mono font-medium text-[#D4D4D8] group-hover:text-white transition-colors truncate px-0.5 sm:px-1">
        {item.fullName}
      </div>
    </div>
  )
}

export default function TornadoGridMatrix() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  return (
    <div
      className="w-full grid grid-cols-4 gap-2 sm:gap-3.5 md:gap-5 lg:gap-6"
    >
      {TECH_STACK_ITEMS.map((item) => (
        <MatrixCell
          key={item.id}
          item={item}
          audioCtxRef={audioCtxRef}
        />
      ))}
    </div>
  )
}
