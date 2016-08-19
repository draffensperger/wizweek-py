#!/usr/bin/env bash
set -o errexit #abort if any command fails

git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# Decrypt the SSH key. Script taken from:
# https://gist.github.com/domenic/ec8b0fc8ab45f39403dd
# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV \
  -in bin/travis_gh_pages_deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key

# Now we can push to github pages
bin/push_to_gh_pages.sh
