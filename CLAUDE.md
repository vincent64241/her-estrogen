# Project: HerEstrogen

## Where to edit
Source of truth for edits: `/Users/isanguyen/her-estrogen/`

## Sync workflow (Mac, GitHub Desktop)

After every code change, automatically run this rsync to mirror the source
folder into the GitHub Desktop tracked folder (no duplicates, only the
updated version is kept):

```bash
rsync -av --delete \
  --exclude='.git/' \
  --exclude='.DS_Store' \
  --exclude='node_modules/' \
  /Users/isanguyen/her-estrogen/ \
  /Users/isanguyen/Documents/GitHub/her-estrogen/
```

The user then commits + pushes via the GitHub Desktop app. Do not attempt
`git push` from the CLI in either folder — terminal git is not authenticated
to GitHub.

Skip the sync only if:
- The change is incomplete / mid-refactor and would break the build
- The user explicitly says "don't sync" or "just edit locally"

## Do NOT
- Edit `/Users/isanguyen/Documents/GitHub/her-estrogen/` directly (always
  edit in the source folder and rsync over)
- Run `git push` from the terminal (CLI has no GitHub credentials)
- Commit `.env.local` or anything in `.git/` to the destination
