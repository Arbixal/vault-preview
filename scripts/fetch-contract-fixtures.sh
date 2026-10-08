#!/usr/bin/env bash
set -euo pipefail

: "${API_CONTRACT_REF:?Set API_CONTRACT_REF to a pinned API commit SHA}"

destination="${1:-test/fixtures/vault-preview-v1}"
repository="${API_CONTRACT_REPOSITORY:-Arbixal/vault-preview-lambda}"

curl --fail --silent --show-error --location \
  "https://raw.githubusercontent.com/${repository}/${API_CONTRACT_REF}/contracts/v1/fixtures/fetch.sh" \
  | VAULT_PREVIEW_CONTRACT_REPOSITORY="${repository}" bash -s -- "${API_CONTRACT_REF}" "${destination}"
