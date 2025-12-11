# Quick Reference

## For You (Maintainer)

### Commit and Push to Git
```bash
cd /Users/keshav.mohan/Documents/nykaa/autoinstallpackages
git add .
git commit -m "Add package sync tool"
git push
```

## For Your Team

### One Command to Sync Packages
```bash
npx github:username/autoinstallpackages
```

### With Custom fe-core Path
```bash
npx github:username/autoinstallpackages /path/to/fe-core
```

### See Help
```bash
npx github:username/autoinstallpackages --help
```

## What It Does

1. ✅ Shows interactive menu to select destination(s)
2. ✅ Copies all packages from `fe-core/packages/`
3. ✅ Removes `node_modules` from each package
4. ✅ Places them in selected destination(s) at `node_modules/@nykaa/`

## Destinations

- **nykaa_web_reloaded** - Main Nykaa web
- **beauty_dweb_reloaded** - Beauty desktop web

## Developer Workflow

```bash
# 1. Make changes in fe-core
cd ~/Documents/nykaa/fe-core
# ... edit files ...

# 2. Build packages
yarn run build

# 3. Sync to nykaa_web_reloaded  
npx github:username/autoinstallpackages

# 4. Test in nykaa_web_reloaded
cd ~/Documents/nykaa/nykaa_web_reloaded
yarn dev
```

## Default Paths

- **fe-core**: `~/Documents/nykaa/fe-core`
- **nykaa_web_reloaded**: `~/Documents/nykaa/nykaa_web_reloaded`
