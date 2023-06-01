#!/bin/bash

set -e

git tag -d ${1}                  # delete the old tag locally
git push origin :refs/tags/${1}  # delete the old tag remotely
