const core = require('@actions/core')
const execCommand = require('./exec-command.js');

var fnInstallSFDX = function(){
    core.info('=== Downloading and installing SFDX cli ===');
    execCommand.run('wget', ['https://developer.salesforce.com/media/salesforce-cli/sf/channels/stable/sf-linux-x64.tar.xz']);
    execCommand.run('mkdir', ['-p', 'sfdx-cli']);
    execCommand.run('tar', ['xJf', 'sf-linux-x64.tar.xz', '-C', 'sfdx-cli', '--strip-components', '1']);
    execCommand.run('export', ['PATH=~/sfdx-cli/bin:$PATH']);
    execCommand.run('sf', ['--version']);
    core.info('=== SFDX cli installed ===');
};

wget https://developer.salesforce.com/media/salesforce-cli/sf/channels/stable/sf-linux-x64.tar.xz
            sudo mkdir ~/sfdx-cli
            sudo tar xJf sf-linux-x64.tar.xz -C ~/sfdx-cli --strip-components 1
            export PATH=$PATH:~/sfdx-cli/bin
            echo "~/sfdx-cli/bin" >> $GITHUB_PATH
            sudo chmod -R 777 ~/sfdx-cli
            sf --version

module.exports.install = function(command, args) {
    //Installs Salesforce DX CLI
    fnInstallSFDX(); 

};
