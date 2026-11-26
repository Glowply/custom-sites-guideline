#!/bin/sh
# Runs one ability on a client store over SSH, as the store's first admin.
#   tools/ssh-ability.sh <user@host[:port]> <ability> [params.json] [wp-path]
#   tools/ssh-ability.sh shop1@203.0.113.5 breakdance/site-info
#   tools/ssh-ability.sh shop1@203.0.113.5 breakdance/html-to-page page.json
# Write params.json with a script (JSON.stringify), not by hand: element slugs hold a backslash
# ("EssentialElements\FImage") that hand-typed JSON and shell quoting both get wrong.
set -e
target=$1; ability=$2; params=$3; wp_path=${4:-public_html}
[ -n "$target" ] && [ -n "$ability" ] || { echo "usage: $0 <user@host[:port]> <ability> [params.json] [wp-path]" >&2; exit 1; }
host=${target%:*}; port=22; [ "$host" != "$target" ] && port=${target##*:}
p=$( [ -n "$params" ] && base64 -w0 "$params" || printf 'e30=' )
ssh -o BatchMode=yes -p "$port" "$host" \
  "cd $wp_path && AB_NAME='$ability' AB_PARAMS='$p' wp eval-file - --user=\$(wp user list --role=administrator --field=ID --orderby=ID --number=1)" \
  < "$(dirname "$0")/ability.php"
