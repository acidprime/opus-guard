# opus-guard

> Born when Claude felt dumb and it turned out to be running Fable 5.1 by accident.

A Claude Code mod that puts a warning band above the prompt whenever the session isn't on an Opus model:

```
⚠ Not on Opus: this session is running claude-fable-5-1. Switch with /model opus   [Dismiss]
```

It checks the live model on every redraw, after `/model` switches, and after each turn, so a fallback mid-session shows up too. **Dismiss** hides it until the model changes again.

## What it hooks

Every hook only reads; none changes what passes through it.

- `session.start`, `turn.complete`: read the session's model.
- `classic.PostModelSwitch`: reads the model a `/model` switch landed on, to redraw the band. It doesn't change the switch or settings.
- `ui.render` (`AbovePrompt`): draws the warning when the model isn't Opus, and passes otherwise. It steps aside while a survey holds the band.

It makes no network calls and writes no files; the one value it keeps is which model you dismissed the warning for.

## Install

At the prompt of a terminal session:

```
/plugin install opus-guard --marketplace acidprime/opus-guard
```

Answer `y` to add the marketplace, then pick a scope (user is the usual one).

From a shell:

```
claude plugin install opus-guard --marketplace acidprime/opus-guard
```

In the desktop app: click + next to the prompt box, then Plugins, Add marketplace with `acidprime/opus-guard`, then Add plugin.

## Develop

```
claude plugin validate .
claude plugin test .
```

## License

MIT. See [LICENSE](LICENSE). Privacy: [PRIVACY.md](PRIVACY.md).
