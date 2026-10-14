declare module 'claude-code' {
  interface PluginState {
    'opus-guard': { model: string | null; dismissedFor: string | null }
  }
}
