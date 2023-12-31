# SFDX Org Development Model Github Action - Build & Deploy

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting Started](#getting-started)
- [Usage Sample](#usage-sample)
  - [Inputs:](#inputs)
  - [Note for destructives changes.](#note-for-destructives-changes)
- [Contributing to the Repository](#contributing-to-the-repository)
- [Reporting Issues](#reporting-issues)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

This repository implements a Github Action that's is a variation of the [Bitbucket Pipelines examples with org development](https://github.com/forcedotcom/sfdx-bitbucket-org/).

This action is usefull to deploy to non-scratch orgs (sandbox or production) with [Github Workflow](https://guides.github.com/introduction/flow/).

It's a Javascript [Github Action](https://github.com/features/actions), that will once is executed will run the following steps:
- Download and install Salesforce CLI
- Decrypt the certificate
- Auth in the target sandbox/org 
- Deploy/Check one or more deploy package
- Deploy/Check destructive changes (optional)
- Execute Data Factory Apex

> [!WARNING]
> This repository was cloned and updated from https://github.com/tiagonnascimento/sfdx-orgdev-build-deploy as this repository was not updated for two years, at the time of this writing. Some URLs, configuration and dependencies are deprecated or do not exist anymore.

## Getting Started

1) If you intent to use it, please go through the Readme of the referred repo, make sure you understand the concept and execute the *Getting Started* (of the referred repo) steps #4, 5, 6 and 10

2) Also you will need to add the following [Github Secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) on your github repository, that will be later used on your Github Workflow:

- CONSUMER_KEY: holds the client_id of the connected app that you created on step #4 of the referred repo
- USERNAME: holds the username that will be used to connect to the target org/sandbox
- DECRYPTION_KEY: holds the Key value you generated on step #6 of the referred repo - will be used to decrypt the certificate
- DECRYPTION_IV: holds the IV value you generated on step #6 of the referred repo - will be used to decrypt the certificate

## Usage Sample

You can execute the action as per the following sample:

```yaml
# Unique name for this workflow
name: On push develop - Deploy to TI01

# Definition when the workflow should run
on:
    push:
        branches:
            - develop

# Jobs to be executed
jobs:
    build-deploy:
        runs-on: ubuntu-latest
        steps:

            # Checkout the code in the pull request
            - name: 'Checkout source code'
              uses: actions/checkout@v2

            - name: 'Build and Deploy'
              uses: tiagonnascimento/sfdx-orgdev-build-deploy@v2
              with:
                type: 'sandbox'
                certificate_path: devops/server.key.enc
                decryption_key: ${{ secrets.DECRYPTION_KEY_NON_PRODUCTIVE }}
                decryption_iv: ${{ secrets.DECRYPTION_IV_NON_PRODUCTIVE }}
                client_id: ${{ secrets.CONSUMER_KEY_TI01 }}
                username: ${{ secrets.USERNAME_TI01 }}
                checkonly: false
                deploy_wait_time: '10'
                manifest_path: manifest/package-01.xml,manifest/package-02.xml,manifest/package-03.xml
                destructive_path: destructive
                data_factory: scripts/apex/CreateBaseData.apex
                default_source_path: force-app/main/default
```

### Inputs:

| Name                  | Requirement | Description |
| --------------------- | ----------- | ----------- |
| `type`                | _required_  | Whether to deploy on `production` or on `sandbox` (default value) |
| `certificate_path`    | _required_  | Path on the repo where the encrypted certificate is stored |
| `decryption_key`      | _required_  | Decryption KEY to be used to decrypt the certificate |
| `decryption_iv`       | _required_  | Decryption IV to be used to decrypt the certificate |
| `client_id`           | _required_  | Client ID that will be used to connect into the target org/sandbox |
| `username`            | _required_  | Username that will be used to connect into the target org/sandbox |
| `checkonly`           | _required_  | Boolean value to indicate whether this action should execute the deploy or only check it, default is false, but if true it will add -c parameter on the force:mdapi:deploy commands |
| `manifest_path`       | _required_  | Path on the current repository (or on the root folder of the sfdx project if sfdx_root_folder is set) to one or more package.xml that represents the packages to be deployed. Based on this files the metadata package will be created and deployed in the order specified. Ex:  | manifest/package-01.xml,manifest/package-02.xml,manifest/package-03.xml
| `sfdx_root_folder`    | _optional_  | Path on the current repository to the root folder of sfdx folder. Ex: sfdx_project
| `deploy_testlevel`    | _optional_  | TestLevel applied on the deploy. Default is `RunLocalTests`. If specified `RunSpecifiedTests`, the action will execute only the classes mentioned in the manifest file that contains `@isTest` tag |
| `deploy_wait_time`    | _optional_  | Wait time for deployment to finish in minutes. Default is `60` |
| `destructive_path`    | _optional_  | Path on the repo where the destructive changes directory is - if not informed, it's not executed |
| `data_factory`        | _optional_  | Path on the repo where an APEX script used as a data factory is stored. if not informed, it's not executed |
| `default_source_path` | _optional_  | Path on the repo where your source files are stored, for SFDX project this is normally `force-app/main/default`


### Note for destructives changes.

The `destructive_path` input is a path folder, with two files inside. For example if we have the following folder structure

```bash
  |-- config
  |-- devops
  |-- force-app
  |-- manifest
  |-- releases
    |-- 01_releases
       |-- destructive
          |-- package.xml
          |-- destructiveChanges.xml
  |-- scripts
  |-- .forceignore
  |-- .gitignore
  ...
  |-- sfdx-project.json 
```

The `destructive_path` will be `releases/01_releases/destructive`.


## Contributing to the Repository

If you find any issues or opportunities for improving this repository, fix them! Feel free to contribute to this project by [forking](http://help.github.com/fork-a-repo/) this repository and making changes to the content. Once you've made your changes, share them back with the community by sending a pull request. See [How to send pull requests](http://help.github.com/send-pull-requests/) for more information about contributing to GitHub projects.

Update to the Github action code should be compiled and the distribution artifact (`dist/index.js`) should be added to the repository (according to the [Documentation of Github](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github))

To do so, follow the following steps:

1. Install `vercel/ncc by` running this command in your terminal.

```bash
npm i -g @vercel/ncc
```

2. Install dependencies

  ```bash
  npm ci
  ```

3. Compile your `index.js` file, after entering the `src` directory

  ```bash
  cd src
  ncc build index.js --license licenses.txt --out ../dist
  ```

  You'll see a new `dist/index.js` file, at the root of the repository folder, with your code and the compiled modules. You will also see an accompanying `dist/licenses.txt` file containing all the licenses of the `node_modules` you are using.

  Change the `main` keyword in your `action.yml` file to use the new `dist/index.js` file.

  ```yml
  main: 'dist/index.js'
  ```

3. Commit `dist/index.js` alongside your updated files.

   ```bash
   git add dist/index.js action.yml ...
   git commit -m "..."
   ```

## Reporting Issues

If you find any issues with this demo that you can't fix, feel free to report them in the [issues](https://github.com/forcedotcom/sfdx-bitbucket-org/issues) section of this repository.
