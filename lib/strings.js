// Mailspring's own translation tables only cover built-in strings, so this plugin carries
// its own. The language follows Preferences > General, falling back to the system locale.
const STRINGS = {
  en: {
    groups: 'Groups',
    group: 'Group',
    allAccounts: 'All Accounts',
    newGroup: 'New Group',
    newGroupName: 'New group',
    preferencesTab: 'Account Groups',
    intro:
      'Groups appear in the sidebar next to All Accounts. Choosing a group shows the mailboxes of only its accounts, combined. Alt+1 to Alt+9 open the first nine groups.',
    noGroups: 'You have no groups yet.',
    name: 'Name',
    accounts: 'Accounts',
    deleteGroup: 'Delete Group',
    confirmDelete: 'Delete the group "%@"? Your accounts and mail are not affected.',
  },
  nl: {
    groups: 'Groepen',
    group: 'groep',
    allAccounts: 'Alle accounts',
    newGroup: 'Nieuwe groep',
    newGroupName: 'Nieuwe groep',
    preferencesTab: 'Accountgroepen',
    intro:
      'Groepen staan in de zijbalk naast Alle accounts. Kies je een groep, dan zie je de mappen van alleen die accounts, samengevoegd. Met Alt+1 t/m Alt+9 open je de eerste negen groepen.',
    noGroups: 'Je hebt nog geen groepen.',
    name: 'Naam',
    accounts: 'Accounts',
    deleteGroup: 'Groep verwijderen',
    confirmDelete: 'Groep "%@" verwijderen? Je accounts en mail blijven gewoon bestaan.',
  },
};

function currentLanguage() {
  const chosen = AppEnv.config.get('core.intl.language');
  const locale = chosen || navigator.language || 'en';
  return locale.split('-')[0].toLowerCase();
}

function t(key, ...args) {
  const table = STRINGS[currentLanguage()] || STRINGS.en;
  let value = table[key] || STRINGS.en[key] || key;
  for (const arg of args) {
    value = value.replace('%@', arg);
  }
  return value;
}

module.exports = { t };
