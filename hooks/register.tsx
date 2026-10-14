import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const model = atom({ plugin: 'opus-guard', key: 'model' } as const, null)
const dismissedFor = atom({ plugin: 'opus-guard', key: 'dismissedFor' } as const, null)

export const isOpus = (m: string) => /opus/i.test(m)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const current = await $.session.model()
    await update($, model, () => current)
    return next(e)
  })

  on('classic.PostModelSwitch', async ($, e, next) => {
    await update($, model, () => e.to_model)
    return next(e)
  })

  // Catches changes no switch event reports, like a fallback mid-turn.
  on('turn.complete', async ($, e, next) => {
    const current = await $.session.model()
    if (current !== (await read($, model))) {
      await update($, model, () => current)
    }
    return next(e)
  })

  // Reads the live model on every draw: the atom writes above only trigger
  // redraws, and PostModelSwitch never fires where an organization manages
  // Claude Code.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const current = (await $.session.model()) || (await read($, model))
    if (e.props.hasSurvey || current === null || isOpus(current)) {
      return next(e)
    }
    if ((await read($, dismissedFor)) === current) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text color="warning" bold>
          ⚠ Not on Opus: this session is running {current}. Switch with /model opus{' '}
        </Text>
        <Button
          key="dismiss"
          label="Dismiss"
          onPress={() => update($, dismissedFor, () => current)}
        />
      </Box>
    )
  })
}
