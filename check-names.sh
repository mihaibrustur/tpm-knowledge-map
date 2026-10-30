#!/bin/sh
# Fails if any term from the local, git-ignored .banned-terms appears in a tracked or new (not ignored) file,
# or if a draft page from `node build.js --drafts` is present.
# One term per line, matched as a whole word, ignoring case. Start a line with "=" to match
# case-sensitively (for names that are also common words). Lines starting with "#" are ignored.
cd "$(dirname "$0")" || exit 2

if [ ! -f .banned-terms ]; then
  echo "No .banned-terms file found. Create one (one term per line) and run again."
  exit 2
fi

found=0
while IFS= read -r term || [ -n "$term" ]; do
  case "$term" in ""|"#"*) continue ;; esac
  if [ "${term#=}" != "$term" ]; then
    hits=$(git ls-files -z -co --exclude-standard | xargs -0 grep -nwF -- "${term#=}")
  else
    hits=$(git ls-files -z -co --exclude-standard | xargs -0 grep -nwiF -- "$term")
  fi
  if [ -n "$hits" ]; then
    echo "$hits"
    found=1
  fi
done < .banned-terms

# draft pages from `node build.js --drafts` must never be committed
drafts=$(git ls-files -z -co --exclude-standard | xargs -0 grep -l "data-draft" -- 2>/dev/null | grep -vE "^(site.js|check-names.sh)$")
if [ -n "$drafts" ]; then
  echo "$drafts"
  echo "Draft pages found. Rebuild with: node build.js"
  found=1
fi

if [ "$found" -eq 1 ]; then
  echo "Check failed. Fix the files above before committing."
  exit 1
fi
echo "No banned terms found."
