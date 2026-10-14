import { describe, expect, test } from 'claude-code/testing'

const PROPS = {
  hasSurvey: false,
  isWorking: false,
  maxRows: 10,
  bodyColumns: 120,
  scroll: { offset: 0, bodyRows: 10 },
  view: {},
}

const BAND = { component: 'AbovePrompt', props: PROPS } as const

// Stands in for the engine: the session's model, and an empty band when
// the mod passes.
const model = (on: any, current: () => string) => {
  on('session.model', () => ({ value: current() }))
  on('ui.render', ($: any, e: any) => {
    const { Box } = $.ui.resolve(e)
    return <Box />
  })
}

const SURFACES = ['terminal', 'desktop'] as const

describe('opus-guard', () => {
  test('warns on Fable', async ($, on) => {
    model(on, () => 'claude-fable-5-1')
    for (const surface of SURFACES) {
      const ui = await $.ui.mount({ plugin: 'opus-guard', surface, ...BAND })
      expect(await ui.find({ type: 'Text', text: /Not on Opus.*claude-fable-5-1/ })).toBeDefined()
      await ui.unmount()
    }
  })

  test('stays quiet on Opus 5.5', async ($, on) => {
    model(on, () => 'claude-opus-5-5')
    for (const surface of SURFACES) {
      const ui = await $.ui.mount({ plugin: 'opus-guard', surface, ...BAND })
      expect(await ui.find({ type: 'Text', text: /Not on Opus/ })).toBeUndefined()
      await ui.unmount()
    }
  })

  test('dismiss hides it until the model changes', async ($, on) => {
    let current = 'claude-sonnet-5-5'
    model(on, () => current)
    const first = await $.ui.mount({ plugin: 'opus-guard', surface: 'terminal', ...BAND })
    await first.press({ key: 'dismiss' })
    await first.unmount()
    // Dismissed for the session, so every surface stays quiet.
    for (const surface of SURFACES) {
      const ui = await $.ui.mount({ plugin: 'opus-guard', surface, ...BAND })
      expect(await ui.find({ type: 'Text', text: /Not on Opus/ })).toBeUndefined()
      await ui.unmount()
    }
    current = 'claude-fable-5-1'
    const ui = await $.ui.mount({ plugin: 'opus-guard', surface: 'terminal', ...BAND })
    expect(await ui.find({ type: 'Text', text: /claude-fable-5-1/ })).toBeDefined()
    await ui.unmount()
  })

  test('stays out of the way of a survey', async ($, on) => {
    model(on, () => 'claude-fable-5-1')
    const ui = await $.ui.mount({
      plugin: 'opus-guard',
      surface: 'terminal',
      ...BAND,
      props: { ...PROPS, hasSurvey: true },
    })
    expect(await ui.find({ type: 'Text', text: /Not on Opus/ })).toBeUndefined()
    await ui.unmount()
  })
})
