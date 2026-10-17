const {
  Actions,
  AccountStore,
  CategoryStore,
  FocusedPerspectiveStore,
  ThreadCountsStore,
} = require('mailspring-exports');
const { t } = require('./strings');

const CONFIG_KEY = 'accountGroups.groups';
const COLLAPSED_KEY = 'accountGroups.sidebarCollapsed';

function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Groups as stored, with account ids that no longer exist (removed accounts) filtered out. */
function groups() {
  const stored = AppEnv.config.get(CONFIG_KEY);
  if (!Array.isArray(stored)) {
    return [];
  }
  const existing = AccountStore.accountIds();
  return stored.map((g) => ({
    id: g.id,
    name: g.name,
    accountIds: (g.accountIds || []).filter((id) => existing.includes(id)),
  }));
}

function save(next) {
  AppEnv.config.set(CONFIG_KEY, next);
}

function createGroup(name, accountIds = []) {
  const group = { id: newId(), name: name.trim(), accountIds };
  save([...groups(), group]);
  return group;
}

function updateGroup(id, changes) {
  save(groups().map((g) => (g.id === id ? Object.assign({}, g, changes) : g)));
}

function deleteGroup(id) {
  save(groups().filter((g) => g.id !== id));
}

function confirmAndDeleteGroup(group) {
  if (window.confirm(t('confirmDelete', group.name))) {
    deleteGroup(group.id);
  }
}

function setAccountInGroup(id, accountId, included) {
  const group = groups().find((g) => g.id === id);
  if (!group) {
    return;
  }
  const others = group.accountIds.filter((a) => a !== accountId);
  updateGroup(id, { accountIds: included ? [...others, accountId] : others });
}

function sameAccountSet(a, b) {
  return a.length === b.length && a.every((id) => b.includes(id));
}

function isShowing(accountIds) {
  return accountIds.length > 0 && sameAccountSet(FocusedPerspectiveStore.sidebarAccountIds(), accountIds);
}

/**
 * Shows the inbox of the given accounts. With more than one account the sidebar keeps
 * showing exactly this set while the user moves between mailboxes, which is what makes a
 * group behave like a smaller "All Accounts".
 */
function show(accountIds) {
  if (accountIds.length === 0) {
    return;
  }
  Actions.focusDefaultMailboxPerspectiveForAccounts(accountIds);
  if (!AppEnv.isVisible()) {
    AppEnv.show();
  }
}

function unreadInboxCount(accountIds) {
  return accountIds.reduce((sum, accountId) => {
    const inbox = CategoryStore.getInboxCategory(accountId);
    return inbox ? sum + ThreadCountsStore.unreadCountForCategoryId(inbox.id) : sum;
  }, 0);
}

function isSidebarCollapsed() {
  return AppEnv.config.get(COLLAPSED_KEY) === true;
}

function setSidebarCollapsed(collapsed) {
  AppEnv.config.set(COLLAPSED_KEY, collapsed);
}

/** Calls `callback` whenever anything a group's display depends on changes. */
function listen(callback) {
  const disposables = [
    AppEnv.config.onDidChange(CONFIG_KEY, callback),
    AppEnv.config.onDidChange(COLLAPSED_KEY, callback),
  ];
  const unlisteners = [
    AccountStore.listen(callback),
    FocusedPerspectiveStore.listen(callback),
    ThreadCountsStore.listen(callback),
    CategoryStore.listen(callback),
  ];
  return () => {
    disposables.forEach((d) => d.dispose());
    unlisteners.forEach((u) => u());
  };
}

module.exports = {
  CONFIG_KEY,
  groups,
  createGroup,
  updateGroup,
  deleteGroup,
  confirmAndDeleteGroup,
  setAccountInGroup,
  isShowing,
  show,
  unreadInboxCount,
  isSidebarCollapsed,
  setSidebarCollapsed,
  listen,
};
