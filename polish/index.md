# Polish

Test the finishing touches on your skill!

---

```bash
# Add polish to your skill project
spruce setup.polish

```

## Polish script

Your skills polish script can be found at `src/{{namespace}}.polish.ts`

The default script has a working example of a polish run for the heartwood skill.

## Running Polish

```bash
# Running polish
yarn polish

```

If all steps have passed the command will return `0`, otherwise it will return `1`

## ENV Variables

- `BASE_URL` - Base url defaults to: `https://spruce.bot`
- `HEADLESS` - set to HEADLESS=false to watch the steps as they are performed

```bash
# Example Usage
BASE_URL=https://dev.spruce.bot HEADLESS=false yarn polish

```
