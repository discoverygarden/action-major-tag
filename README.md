# Action Major Tagger

A Github action to automatically update action repos with a new major only tag for the latest generated tag.

## Inputs
- **tag:** Newly minted tag to grab the major version release from.
- **token:** Token to use to push to the repo. Pass in using `secrets.GITHUB_TOKEN`. Default to github.token.
- **sha:** SHA for the tag used to generate a major version release.
- **prefix:** The prefix prepended to the version number. Default is `v`.
- **dry_run:** Set when testing workflow. Will result in tags not being deleted or minted.
**NOTE:** None of the inputs are expressly required (except for prefix, if one exists) and will automatically be pulled from the repository.

## Outputs
- **major_tag:** The major tag generated by the workflow.
- **origin_tag:** The origin tag discovered and used by the workflow to make the major tag.

## Secrets
This action does not use any secrets.

## Usage
Learn more about GitHub Actions in general [here](https://docs.github.com/en/actions/quickstart).

To use this action in your repo, follow these steps:

 1. Create a YAML file in the `.github/workflows/` directory of your repo.
 2. Copy the following into the YAML file:
```yaml
---
name: Action Major Tag
on:
  push:
    tags:
      - '*'
jobs:
  new-major-tag:
    runs-on: ubuntu-latest
    steps:
      - name: Run Action Major Tagger
        uses: discoverygarden/action-major-tag@v1
        with:
          prefix: v
```

When a tag is generated, typically as part of our current auto-semvar workflow, this will generate a new major version release tag for the repository. If there is one existing previously, it will be deleted before the new one can be made.
**NOTE:** This major version release tag at this time is really only used on our github actions, allowing them to be referenced only by their major version.
