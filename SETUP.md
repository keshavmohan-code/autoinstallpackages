# Setup Instructions for Team

## Quick Setup

1. **Commit this repo to Git:**
   ```bash
   cd /Users/keshav.mohan/Documents/nykaa/autoinstallpackages
   git add .
   git commit -m "Add package sync tool"
   git push
   ```

2. **Team members can then use it directly with npx:**
   ```bash
   npx github:username/autoinstallpackages
   ```

   Or if published to npm:
   ```bash
   npx @nykaa/sync-packages
   ```

## Publish to NPM (Optional)

If you want to publish to your company's private npm registry:

1. **Login to npm:**
   ```bash
   npm login --registry=https://your-registry.com
   ```

2. **Publish:**
   ```bash
   npm publish
   ```

3. **Team uses:**
   ```bash
   npx @nykaa/sync-packages
   ```

## Publish to GitHub Packages

1. **Update package.json to include repository field:**
   ```json
   {
     "name": "@nykaa/sync-packages",
     "repository": "github:username/autoinstallpackages"
   }
   ```

2. **Create .npmrc in project root:**
   ```
   @nykaa:registry=https://npm.pkg.github.com
   ```

3. **Publish:**
   ```bash
   npm publish
   ```

4. **Team uses:**
   ```bash
   npx @nykaa/sync-packages
   ```

## Running Directly from Git (Easiest for Private Repos)

Your team can run directly from the git repo without publishing:

```bash
npx github:username/autoinstallpackages
```

Or add to their package.json scripts:

```json
{
  "scripts": {
    "sync-packages": "npx github:username/autoinstallpackages"
  }
}
```

Then run:
```bash
npm run sync-packages
```

## Custom Paths

If team members have different directory structures:

```bash
npx @nykaa/sync-packages /path/to/fe-core /path/to/nykaa_web_reloaded
```

## Typical Developer Workflow

1. Developer makes changes in `fe-core/packages/some-package`
2. Build the package: `cd fe-core && yarn run build`
3. Sync to nykaa_web_reloaded: `npx @nykaa/sync-packages`
4. Test in nykaa_web_reloaded
5. Once satisfied, commit changes in fe-core

## Files in this Repo

- `bin/cli.js` - Main script that does the syncing
- `package.json` - NPM package configuration
- `README.md` - User documentation
- `.gitignore` - Ignores node_modules and logs
- `sync-packages.config.example.js` - Example config file
