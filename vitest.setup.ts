import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom 不实现 window.matchMedia，但 ThemeToggle 等组件在 useEffect 里调用它。
// 不 mock 会导致 "matchMedia is not a function" 让整个组件渲染崩溃。
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}
