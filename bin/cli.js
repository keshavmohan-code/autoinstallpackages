#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const prompts = require('prompts');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.bright}${msg}${colors.reset}`),
};

// Default paths - can be overridden via command line args or config file
const DEFAULT_FE_CORE_PATH = path.join(process.env.HOME, 'Documents/nykaa/fe-core');

// Available destination options
const DESTINATION_OPTIONS = [
  {
    title: 'nykaa_web_reloaded',
    value: path.join(process.env.HOME, 'Documents/nykaa/nykaa_web_reloaded'),
    description: 'Main Nykaa web application'
  },
  {
    title: 'beauty_dweb_reloaded',
    value: path.join(process.env.HOME, 'Documents/nykaa/beauty_dweb_reloaded'),
    description: 'Beauty desktop web application'
  }
];

async function syncPackagesToDestination(packagesSourcePath, packageDirs, destRepoPath, destName) {
  log.step(`\n📂 Syncing to ${destName}...`);
  
  const packagesDestPath = path.join(destRepoPath, 'node_modules', '@nykaa');

  // Validate destination path
  if (!fs.existsSync(destRepoPath)) {
    log.error(`Repository not found at: ${destRepoPath}`);
    return { success: 0, failed: packageDirs.length, failedPackages: packageDirs };
  }

  // Ensure destination @nykaa directory exists
  log.info('Preparing destination directory...');
  await fs.ensureDir(packagesDestPath);
  log.success(`Destination ready: ${packagesDestPath}`);

  let successCount = 0;
  let failedPackages = [];

  // Process each package
  for (const packageName of packageDirs) {
    const sourcePath = path.join(packagesSourcePath, packageName);
    const destPath = path.join(packagesDestPath, packageName);

    try {
      // Remove existing package in destination if it exists
      if (fs.existsSync(destPath)) {
        await fs.remove(destPath);
      }

      // Copy package to destination with filter to exclude node_modules
      await fs.copy(sourcePath, destPath, {
        filter: (src) => {
          // Exclude node_modules directories
          return !src.includes('/node_modules') && !src.includes('\\node_modules');
        }
      });
      successCount++;

    } catch (error) {
      log.error(`Failed to sync ${packageName}: ${error.message}`);
      failedPackages.push(packageName);
    }
  }

  log.success(`${destName}: Successfully synced ${successCount} out of ${packageDirs.length} package(s)`);
  
  if (failedPackages.length > 0) {
    log.warning(`${destName} - Failed packages: ${failedPackages.join(', ')}`);
  }

  return { success: successCount, failed: failedPackages.length, failedPackages };
}

async function main() {
  try {
    // ASCII Art Logo
    console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ${colors.bright}███╗   ██╗██╗   ██╗██╗  ██╗ █████╗  █████╗${colors.cyan}              ║
║   ${colors.bright}████╗  ██║╚██╗ ██╔╝██║ ██╔╝██╔══██╗██╔══██╗${colors.cyan}             ║
║   ${colors.bright}██╔██╗ ██║ ╚████╔╝ █████╔╝ ███████║███████║${colors.cyan}             ║
║   ${colors.bright}██║╚██╗██║  ╚██╔╝  ██╔═██╗ ██╔══██║██╔══██║${colors.cyan}             ║
║   ${colors.bright}██║ ╚████║   ██║   ██║  ██╗██║  ██║██║  ██║${colors.cyan}             ║
║   ${colors.bright}╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝${colors.cyan}             ║
║                                                           ║
║          ${colors.green}📦 Package Sync Tool${colors.cyan}                           ║
║          ${colors.yellow}Sync fe-core packages to destinations${colors.cyan}         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}
`);

    // Parse command line arguments
    const feCorePath = process.argv[2] || DEFAULT_FE_CORE_PATH;
    const packagesSourcePath = path.join(feCorePath, 'packages');

    // Validate source paths
    log.info('Validating source paths...');
    
    if (!fs.existsSync(feCorePath)) {
      throw new Error(`fe-core repository not found at: ${feCorePath}`);
    }
    
    if (!fs.existsSync(packagesSourcePath)) {
      throw new Error(`packages folder not found at: ${packagesSourcePath}`);
    }

    log.success('Source paths validated successfully');

    // Get all package directories
    log.info('Reading packages from fe-core...');
    const packageDirs = fs.readdirSync(packagesSourcePath)
      .filter(item => {
        const fullPath = path.join(packagesSourcePath, item);
        return fs.statSync(fullPath).isDirectory() && !item.startsWith('.');
      });

    if (packageDirs.length === 0) {
      log.warning('No packages found to sync');
      return;
    }

    log.info(`Found ${packageDirs.length} package(s)\n`);

    // Show interactive prompt for destination selection
    const response = await prompts({
      type: 'multiselect',
      name: 'destinations',
      message: 'Select destination(s) to sync packages to:',
      choices: DESTINATION_OPTIONS.map((opt, index) => ({
        title: `${index + 1}. ${opt.title}`,
        description: opt.description,
        value: opt.value,
        selected: index === 0 // Select first option by default
      })),
      hint: '- Space to select. Return to submit',
      instructions: false,
      min: 1
    });

    // Handle user cancellation
    if (!response.destinations || response.destinations.length === 0) {
      log.warning('\nNo destination selected. Exiting...');
      return;
    }

    log.step(`\n✓ Selected ${response.destinations.length} destination(s)\n`);

    // Sync to each selected destination
    const results = [];
    for (const destPath of response.destinations) {
      const destOption = DESTINATION_OPTIONS.find(opt => opt.value === destPath);
      const result = await syncPackagesToDestination(
        packagesSourcePath,
        packageDirs,
        destPath,
        destOption.title
      );
      results.push({ name: destOption.title, ...result });
    }

    // Final summary
    log.step('\n✨ Package sync completed!\n');
    
    results.forEach(result => {
      if (result.failed === 0) {
        log.success(`${result.name}: All ${result.success} packages synced successfully`);
      } else {
        log.warning(`${result.name}: ${result.success} succeeded, ${result.failed} failed`);
      }
    });

    log.warning('\nRemember to run yarn install in the destination repo(s) if needed.\n');

  } catch (error) {
    log.error(`\nError: ${error.message}\n`);
    process.exit(1);
  }
}

// Show usage information
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: npx @nykaa/sync-packages [fe-core-path]

Description:
  Syncs packages from fe-core to selected destination(s) by:
  1. Showing interactive menu to select destination(s)
  2. Copying all packages from fe-core/packages
  3. Removing node_modules from each package
  4. Placing them in destination/node_modules/@nykaa

Available Destinations:
  - nykaa_web_reloaded (Main Nykaa web application)
  - beauty_dweb_reloaded (Beauty desktop web application)

Arguments:
  fe-core-path              Path to fe-core repository (default: ~/Documents/nykaa/fe-core)

Examples:
  npx @nykaa/sync-packages
  npx @nykaa/sync-packages /path/to/fe-core

Interactive Mode:
  - Use arrow keys to navigate
  - Use SPACE to select/deselect destinations
  - Press ENTER to confirm and start syncing
  - You can select one or multiple destinations

  `);
  process.exit(0);
}

main();
