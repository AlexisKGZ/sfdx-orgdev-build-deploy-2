const core = require('@actions/core')
const execCommand = require('./exec-command.js');

//var fnInstallSFDX = function(){
    //core.info('=== Downloading and installing SFDX cli ===');
    //execCommand.run('wget', ['https://developer.salesforce.com/media/salesforce-cli/sf/channels/stable/sf-linux-x64.tar.xz']);
    //execCommand.run('mkdir', ['-p', 'sfdx-cli']);
    //execCommand.run('tar', ['xJf', 'sf-linux-x64.tar.xz', '-C', 'sfdx-cli', '--strip-components', '1']);
    //execCommand.run('export', ['PATH=sfdx-cli/bin:$PATH']);
    //execCommand.run('sf', ['--version']);
    //core.info('=== SFDX cli installed ===');
//};

var fnInstallSFDX = function(){
    core.info('=== Downloading and installing SFDX cli ===');
    execCommand.run('npm', ['install', 'sfdx-cli', '--global']);
    //execCommand.run('wget', ['https://developer.salesforce.com/media/salesforce-cli/sfdx-linux-amd64.tar.xz']);
    //execCommand.run('mkdir', ['-p', 'sfdx-cli']);
    //execCommand.run('tar', ['xJf', 'sfdx-v7.209.6-8ba3197-linux-x64.tar.xz', '-C', 'sfdx-cli', '--strip-components', '1']);
    //execCommand.run('tar', ['xJf', 'sfdx-linux-amd64.tar.xz', '-C', 'sfdx-cli', '--strip-components', '1']);
    //execCommand.run('./sfdx-cli/install', []);
    core.info('=== SFDX cli installed ===');
};

module.exports.install = function(command, args) {
    //Installs Salesforce DX CLI
    fnInstallSFDX(); 

};
