const { React, AccountStore } = require('mailspring-exports');
const Groups = require('./groups');
const { t } = require('./strings');

const h = React.createElement;

/** Commits the name on blur or Enter, so typing doesn't rewrite config.json per keystroke. */
class GroupNameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.group.name };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.group.name !== this.props.group.name) {
      this.setState({ value: this.props.group.name });
    }
  }

  _commit = () => {
    const value = this.state.value.trim();
    if (value && value !== this.props.group.name) {
      Groups.updateGroup(this.props.group.id, { name: value });
    } else {
      this.setState({ value: this.props.group.name });
    }
  };

  render() {
    return h('input', {
      type: 'text',
      className: 'account-group-name',
      'aria-label': t('name'),
      value: this.state.value,
      onChange: (e) => this.setState({ value: e.target.value }),
      onBlur: this._commit,
      onKeyDown: (e) => {
        if (e.key === 'Enter') {
          e.target.blur();
        }
      },
    });
  }
}

function GroupEditor({ group, accounts, index }) {
  const shortcut = index < 9 ? h('span', { className: 'account-group-shortcut' }, `Alt+${index + 1}`) : null;

  return h(
    'div',
    { className: 'account-group-editor' },
    h(
      'div',
      { className: 'account-group-header' },
      h(GroupNameInput, { group }),
      shortcut,
      h(
        'button',
        {
          className: 'btn account-group-delete',
          onClick: () => Groups.confirmAndDeleteGroup(group),
        },
        t('deleteGroup')
      )
    ),
    h(
      'div',
      { className: 'account-group-accounts', role: 'group', 'aria-label': t('accounts') },
      accounts.map((account) =>
        h(
          'label',
          { key: account.id, className: 'account-group-account' },
          h('input', {
            type: 'checkbox',
            checked: group.accountIds.includes(account.id),
            onChange: (e) => Groups.setAccountInGroup(group.id, account.id, e.target.checked),
          }),
          account.color
            ? h('span', {
                className: 'account-group-color',
                style: { backgroundColor: account.color },
              })
            : null,
          h('span', { className: 'account-group-label' }, account.label),
          account.label !== account.emailAddress
            ? h('span', { className: 'account-group-email' }, account.emailAddress)
            : null
        )
      )
    )
  );
}

class PreferencesAccountGroups extends React.Component {
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
    return { groups: Groups.groups(), accounts: AccountStore.accounts() };
  }

  render() {
    const { groups, accounts } = this.state;

    return h(
      'div',
      { className: 'container-account-groups' },
      h('p', { className: 'account-groups-intro' }, t('intro')),
      groups.length === 0 ? h('p', { className: 'account-groups-empty' }, t('noGroups')) : null,
      groups.map((group, index) => h(GroupEditor, { key: group.id, group, accounts, index })),
      h(
        'button',
        {
          className: 'btn btn-emphasis account-groups-add',
          onClick: () => Groups.createGroup(t('newGroupName')),
        },
        t('newGroup')
      )
    );
  }
}

PreferencesAccountGroups.displayName = 'PreferencesAccountGroups';

module.exports = PreferencesAccountGroups;
