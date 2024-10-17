const core = require('@actions/core');
const github = require('@actions/github');
const semver = require('semver');

async function createTag(major_tag) {
  const token = core.getInput('github_token', { required: false }) || github.context.token;
  const octokit = github.getOctokit(token);
  const sha = core.getInput('sha') || github.context.sha;
  const ref = `refs/tags/${major_tag}`;
  await octokit.rest.git.createRef({
    ...github.context.repo,
    ref,
    sha
  });

  console.log(`Tag: "${major_tag}" with sha: "${sha}" successfully written.`);
}

async function checkIfTagExists(major_tag) {
  const token = core.getInput('github_token', { required: false }) || github.context.token;
  const octokit = github.getOctokit(token);
  const owner = github.context.payload.repository.organization || github.context.payload.organization.login;
  const repo = github.context.payload.repository.name;
  const ref = `tags/${major_tag}`;
  
  core.debug(`Owner: ${owner} - Repo: ${repo} - REF: ${ref}`);

  try {
    await octokit.rest.git.getRef({
      owner,
      repo,
      ref,
    });

    try {
      console.log(`Ref "${ref}" already exists. Removing to replace.`);
      await octokit.rest.git.deleteRef({
        owner,
        repo,
        ref,
      });
      console.log(`Successfully deleted ref. (ref: "${ref}")`);
    }
    catch (error) {
      console.log(`Failed to delete ref (ref: ${ref}) -  Error: "${error.message}"`);
    }
  }
  catch (error) {
    console.log(`Ref does not exist. (ref: ${ref}) - Error: "${error.message}"`);
  }
}

async function run() {
  try {
    const tag = core.getInput('tag') || process.env.VERSION || (github.context.ref).replace('refs/tags/', '');
    console.log(`Using tag: "${tag}"`);
    const prefix = core.getInput('prefix') || "";
    let major_tag = prefix + semver.major(tag);
    core.setOutput('major_tag', major_tag);
    core.setOutput('origin_tag', tag);
    console.log(`Using tag prefix "${prefix}"`);
    console.log(`Major Release Tag: "${major_tag}" (origin tag: "${tag}")`);

    if (core.getInput('dry_run') !== 'true') {
      await checkIfTagExists(major_tag);
      await createTag(major_tag);
    }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
