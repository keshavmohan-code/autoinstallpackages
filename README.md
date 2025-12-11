# Nykaa Package Sync Tool

An NPX tool to sync packages from `fe-core` to `nykaa_web_reloaded` and `beauty_dweb_reloaded` for local development.

## What it does

This tool automates the process of syncing local packages from `fe-core` to your chosen destination(s):

1. ✅ Shows interactive menu to select destination(s)
2. ✅ Copies all packages from `fe-core/packages`
3. ✅ Removes `node_modules` from each package
4. ✅ Places them in selected destination(s) at `node_modules/@nykaa`

## Available Destinations

- **nykaa_web_reloaded** - Main Nykaa web application
- **beauty_dweb_reloaded** - Beauty desktop web application

You can select one or both destinations during the interactive prompt.

## Prerequisites

- Node.js installed
- Both repositories cloned locally:
  - `fe-core` 
  - `nykaa_web_reloaded`

## Usage

### Quick Start (Default Paths)

If your repos are in `~/Documents/nykaa/`:

```bash
npx @nykaa/sync-packages
```

You'll see an interactive menu:
```
? Select destination(s) to sync packages to: (Press <space> to select, <enter> to submit)
❯ ◉ 1. nykaa_web_reloaded
  ◯ 2. beauty_dweb_reloaded
```

**Use:**
- Arrow keys to navigate
- SPACE to select/deselect
- ENTER to confirm

### Custom fe-core Path

```bash
npx @nykaa/sync-packages /path/to/fe-core
```

## Typical Workflow

1. Make changes in `fe-core/packages/your-package`
2. Build the package: `yarn run build` (in fe-core)
3. Run the sync tool: `npx @nykaa/sync-packages`
4. Select destination(s) from the interactive menu
5. Test changes in selected destination(s)

## Help

```bash
npx @nykaa/sync-packages --help
```

## Installation (Optional)

For frequent use, you can install globally:

```bash
npm install -g @nykaa/sync-packages
```

Then run directly:

```bash
sync-nykaa-packages
```

## Development

### Local Testing

Before publishing, test locally:

```bash
# In this repo
npm install
npm test

# Or test with npm link
npm link
sync-nykaa-packages
npm unlink -g @nykaa/sync-packages
```

## Publishing

1. Update version in `package.json`
2. Commit and push to git
3. Publish to npm (if using private registry):

```bash
npm publish
```

Or configure for GitHub Packages or Artifactory based on your org setup.

## Configuration

Default paths:
- **fe-core**: `~/Documents/nykaa/fe-core`
- **nykaa_web_reloaded**: `~/Documents/nykaa/nykaa_web_reloaded`
- **beauty_dweb_reloaded**: `~/Documents/nykaa/beauty_dweb_reloaded`

The fe-core path can be overridden by passing an argument to the command.
Destinations are selected interactively when you run the tool.

## Troubleshooting

**Error: Repository not found**
- Verify the paths to both repositories
- Use absolute paths if relative paths don't work

**Permission errors**
- Ensure you have write permissions to `nykaa_web_reloaded/node_modules/@nykaa`
- Try running with appropriate permissions

**Packages not syncing**
- Make sure you've run `yarn run build` in fe-core first
- Check that packages exist in `fe-core/packages/`

## License

ISC
