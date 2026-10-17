const { React, Actions, AccountStore } = require('mailspring-exports');
const { OutlineView } = require('mailspring-component-kit');
const Groups = require('./groups');
const { t } = require('./strings');

const h = React.createElement;

function openPreferences() {
  Actions.switchPreferencesTab('Account Groups');
  Actions.openPreferences();
}

function allAccountsItem() {
  const accountIds = AccountStore.accountIds();
  return {
    id: 'account-groups-all',
    name: t('allAccounts'),
    iconName: 'inbox.png',
    children: [],
    count: Groups.unreadInboxCount(accountIds),
    selected: Groups.isShowing(accountIds),
    onSelect: () => Groups.show(accountIds),
  };
}

function groupItem(group) {
  return {
    id: `account-groups-${group.id}`,
    name: group.name,
    iconName: 'people.png',
    className: group.accountIds.length === 0 ? 'account-group-empty' : undefined,
    children: [],
    contextMenuLabel: t('group'),
    count: Groups.unreadInboxCount(group.accountIds),
    selected: Groups.isShowing(group.accountIds),
    onSelect: () => (group.accountIds.length > 0 ? Groups.show(group.accountIds) : openPreferences()),
    onEdited: (item, value) => {
      if (value && value.trim()) {
        Groups.updateGroup(group.id, { name: value.trim() });
      }
    },
    onDelete: () => Groups.confirmAndDeleteGroup(group),
  };
}

/**
 * The "Groups" section at the top of the account sidebar. It sits next to the built-in
 * sidebar rather than inside it: that sidebar builds its sections internally and offers no
 * way to insert a level between All Accounts and the single accounts.
 */
class AccountGroupsSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._stateFromStores();
  }

  componentDidMount() {
    this._unlisten = Groups.listen(() => this.setState(this._stateFromStores()));
  }

  componentWillUnmount() {
    if (this._unlisten) {
      this._unlisten();
    }
  }

  _stateFromStores() {
    return {
      groups: Groups.groups(),
      collapsed: Groups.isSidebarCollapsed(),
      accountCount: AccountStore.accounts().length,
    };
  }

  render() {
    const { groups, collapsed, accountCount } = this.state;
    // With a single account there is nothing to group.
    if (accountCount < 2) {
      return null;
    }
    const items = groups.length > 0 ? [allAccountsItem(), ...groups.map(groupItem)] : [];

    return h(
      'nav',
      { className: 'account-groups-sidebar', 'aria-label': t('groups') },
      h(OutlineView, {
        title: t('groups'),
        items,
        collapsed,
        onCollapseToggled: () => Groups.setSidebarCollapsed(!collapsed),
        onItemCreated: (name) => {
          if (name && name.trim()) {
            Groups.createGroup(name);
            openPreferences();
          }
        },
      })
    );
  }
}

AccountGroupsSidebar.displayName = 'AccountGroupsSidebar';
AccountGroupsSidebar.containerRequired = false;

module.exports = AccountGroupsSidebar;
