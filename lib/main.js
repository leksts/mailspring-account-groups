const { ComponentRegistry, PreferencesUIStore, WorkspaceStore } = require('mailspring-exports');
const AccountGroupsSidebar = require('./group-sidebar');
const Groups = require('./groups');
const { t } = require('./strings');

const SHORTCUT_COUNT = 9;

let preferencesTab = null;
let commandsDisposable = null;

function registerCommands() {
  const commands = {};
  for (let i = 1; i <= SHORTCUT_COUNT; i++) {
    commands[`account-groups:show-group-${i}`] = () => {
      const group = Groups.groups()[i - 1];
      if (group) {
        Groups.show(group.accountIds);
      }
    };
  }
  commandsDisposable = AppEnv.commands.add(document.body, commands);
}

function activate() {
  ComponentRegistry.register(AccountGroupsSidebar, {
    location: WorkspaceStore.Location.RootSidebar,
  });

  preferencesTab = new PreferencesUIStore.TabItem({
    tabId: 'Account Groups',
    displayName: t('preferencesTab'),
    componentClassFn: () => require('./preferences-account-groups'),
  });
  PreferencesUIStore.registerPreferencesTab(preferencesTab);

  registerCommands();
}

function deactivate() {
  ComponentRegistry.unregister(AccountGroupsSidebar);
  if (preferencesTab) {
    PreferencesUIStore.unregisterPreferencesTab(preferencesTab);
    preferencesTab = null;
  }
  if (commandsDisposable) {
    commandsDisposable.dispose();
    commandsDisposable = null;
  }
}

module.exports = { activate, deactivate };
