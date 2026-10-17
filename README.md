# Account Groups for Mailspring

A plugin for [Mailspring](https://getmailspring.com), the open-source desktop mail client for Windows, macOS and Linux.

Group your mail accounts, for example "Work" and "Personal", and view a group's mailboxes combined: a smaller version of Mailspring's "All Accounts".

Out of the box, Mailspring shows your mailboxes either for one account or for all accounts at once. This plugin adds a level in between.

## Features

- **A Groups section at the top of the sidebar.** It lists *All Accounts* followed by your groups, each with its unread inbox count. Clicking a group limits the sidebar to that group's accounts, combined (Inbox, Unread, Starred, Sent, …). The group stays active while you move between mailboxes.
- **Create a group** with the **+** next to the "Groups" heading. The Account Groups preferences open, where you pick its accounts.
- **Rename or delete a group** by right-clicking it in the sidebar.
- **Preferences › Account Groups** to create, rename and delete groups and to tick the accounts that belong to each one. An account can be in more than one group.
- **Keyboard shortcuts:** Alt+1 to Alt+9 open the first nine groups. Mailspring's own Ctrl/Cmd+1 (all accounts) and Ctrl/Cmd+2… (single accounts) keep working as before.
- **English and Dutch** interface text, following the language set in Preferences › General.

## Installation

### From a release

1. Download the source code (zip) of the [latest release](https://github.com/leksts/mailspring-account-groups/releases/latest) and unzip it.
2. In Mailspring, choose **Developer › Install a Plugin…** and select the unzipped folder.

Mailspring copies the plugin into its `packages` folder and activates it right away.

### With git

Clone the repository into Mailspring's `packages` folder (create the folder if it doesn't exist):

| Platform | Packages folder |
|----------|-----------------|
| Windows  | `%APPDATA%\Mailspring\packages\` |
| macOS    | `~/Library/Application Support/Mailspring/packages/` |
| Linux    | `~/.config/Mailspring/packages/` |

```bash
git clone https://github.com/leksts/mailspring-account-groups.git account-groups
```

Then quit Mailspring completely (including the tray or menu bar icon) and start it again. To update later, run `git pull` in that folder and restart Mailspring.

### Uninstall

Delete the `account-groups` folder from the packages folder and restart Mailspring. Your groups stay in `config.json` under `accountGroups` until you remove them there.

## Usage

1. Click the **+** next to **Groups** at the top of the sidebar, type a name and press Enter.
2. In the Account Groups preferences, tick the accounts that belong to the group.
3. Click the group in the sidebar, or press **Alt+1**, to see only those accounts' mailboxes. Click **All Accounts** to go back.

The Groups section only appears when you have two or more accounts.

## Known limitations

Mailspring's built-in sidebar has no extension points for these, so the plugin works around them:

- While a group is active, the combined sidebar section is still titled **"All Accounts"**. That title is fixed inside Mailspring.
- The account switcher menu (the arrow at the top right of the sidebar) doesn't list groups. Use the Groups section or Alt+1…9.

## Compatibility

Tested with Mailspring 1.26.0 on Windows. The plugin only uses Mailspring's public plugin APIs (`mailspring-exports` and `mailspring-component-kit`), so it should work the same on macOS and Linux.

## Development

The plugin is plain JavaScript (CommonJS, `React.createElement`) with no build step, because packaged Mailspring builds don't compile TypeScript or JSX for third-party plugins.

| Path | Contents |
|------|----------|
| `lib/main.js` | Registers the sidebar section, the preferences tab and the shortcut commands |
| `lib/groups.js` | Reads and writes groups in the config, and switches the sidebar to a group |
| `lib/group-sidebar.js` | The Groups section in the sidebar |
| `lib/preferences-account-groups.js` | The Account Groups preferences tab |
| `lib/strings.js` | English and Dutch interface text |
| `keymaps/`, `styles/` | Shortcuts and LESS styles, loaded by Mailspring automatically |

To try a change, edit the files in your packages folder (or clone there) and choose **Developer › Reload**.

## Acknowledgements

This plugin is built on [Mailspring](https://github.com/Foundry376/Mailspring) by Foundry 376 and its contributors, and relies on its plugin system and sync engine. Mailspring is licensed under the [GPL-3.0](https://github.com/Foundry376/Mailspring/blob/master/LICENSE.md).

Account Groups is an independent project. It is not affiliated with or endorsed by Foundry 376. "Mailspring" is used only to say which application the plugin works with.

## License

[MIT](LICENSE) © Leks ter Schuur
