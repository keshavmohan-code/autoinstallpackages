# Interactive Destination Selection Demo

When you run `npx @nykaa/sync-packages`, you'll see:

```
🚀 Nykaa Package Sync Tool

ℹ Validating source paths...
✓ Source paths validated successfully
ℹ Reading packages from fe-core...
ℹ Found 129 package(s)

? Select destination(s) to sync packages to: › - Space to select. Return to submit
Instructions:
    ↑/↓: Highlight option
    ←/→/[space]: Toggle selection
    [enter]: Complete answer

◯   1. nykaa_web_reloaded - Main Nykaa web application
◯   2. beauty_dweb_reloaded - Beauty desktop web application
```

## Usage Examples

### Select Single Destination
```
✓ Selected 1 destination(s)

📂 Syncing to nykaa_web_reloaded...
ℹ Preparing destination directory...
✓ Destination ready: ~/Documents/nykaa/nykaa_web_reloaded/node_modules/@nykaa
✓ nykaa_web_reloaded: Successfully synced 129 out of 129 package(s)

✨ Package sync completed!
✓ nykaa_web_reloaded: All 129 packages synced successfully
```

### Select Both Destinations
```
✓ Selected 2 destination(s)

📂 Syncing to nykaa_web_reloaded...
ℹ Preparing destination directory...
✓ Destination ready: ~/Documents/nykaa/nykaa_web_reloaded/node_modules/@nykaa
✓ nykaa_web_reloaded: Successfully synced 129 out of 129 package(s)

📂 Syncing to beauty_dweb_reloaded...
ℹ Preparing destination directory...
✓ Destination ready: ~/Documents/nykaa/beauty_dweb_reloaded/node_modules/@nykaa
✓ beauty_dweb_reloaded: Successfully synced 129 out of 129 package(s)

✨ Package sync completed!
✓ nykaa_web_reloaded: All 129 packages synced successfully
✓ beauty_dweb_reloaded: All 129 packages synced successfully
```

## Command-line Options

### Help
```bash
npx @nykaa/sync-packages --help
```

### Custom fe-core path
```bash
npx @nykaa/sync-packages /custom/path/to/fe-core
```

## Tips

- **First time**: `nykaa_web_reloaded` is selected by default
- **Multiple selection**: Use SPACE to toggle each option
- **Quick confirm**: Just press ENTER to use the default selection
- **Cancel**: Press Ctrl+C to exit without syncing
