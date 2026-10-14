# opus-guard

> Born when Claude felt dumb and it turned out to be running Fable 5.1 by accident.

A Claude Code mod that puts a warning band above the prompt whenever the session isn't on an Opus model:

```
⚠ Not on Opus: this session is running claude-fable-5-1. Switch with /model opus   [Dismiss]
```

It checks the live model on every redraw, after `/model` switches, and after each turn, so a fallback mid-session shows up too. **Dismiss** hides it until the model changes again.

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
