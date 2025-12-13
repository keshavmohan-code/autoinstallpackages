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
  info: (msg) => console.log(`${colors.cyan}${colors.bright}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}${colors.bright}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}${colors.bright}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}${colors.bright}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}\n`),
  bigStep: (msg) => console.log(`\n${colors.cyan}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${msg}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`),
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
    
    try {
      // Read package.json to get the actual package name
      const packageJsonPath = path.join(sourcePath, 'package.json');
      let finalPackageName = packageName; // Default to folder name
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        
        // Extract package name from @nykaa/packagename format
        if (packageJson.name && packageJson.name.startsWith('@nykaa/')) {
          finalPackageName = packageJson.name.replace('@nykaa/', '');
        } else if (packageJson.name) {
          finalPackageName = packageJson.name;
        }
      }
      
      const destPath = path.join(packagesDestPath, finalPackageName);

      // Remove only the existing package that we're updating (not all packages)
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

    // Check if fe-core is a git repository
    const gitPath = path.join(feCorePath, '.git');
    if (fs.existsSync(gitPath)) {
      log.bigStep('📋 STEP 1: STAGING CHANGES IN FE-CORE');
      
      try {
        // Stage all changes in fe-core
        execSync('git add .', { cwd: feCorePath, stdio: 'pipe' });
        log.success('All changes staged successfully');
        
        // Show git status
        const gitStatus = execSync('git status --short', { cwd: feCorePath, encoding: 'utf-8' });
        if (gitStatus.trim()) {
          log.info('Staged changes:');
          console.log(gitStatus);
        } else {
          log.info('No changes to stage');
        }
      } catch (error) {
        log.warning(`Git staging skipped: ${error.message}`);
      }
    }

    // Build packages
    log.bigStep('🔨 STEP 2: BUILDING PACKAGES');
    
    try {
      // Check if package.json has a build script
      const packageJsonPath = path.join(feCorePath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        
        if (packageJson.scripts && packageJson.scripts.build) {
          // Check if yarn exists
          try {
            execSync('yarn --version', { stdio: 'pipe' });
          } catch {
            throw new Error('Yarn is not installed. Please install yarn first.');
          }
          
          // Run complete build sequence
          log.info('Running: yarn');
          execSync('yarn', { cwd: feCorePath, stdio: 'inherit' });
          
          log.info('Running: yarn clean:git');
          execSync('yarn clean:git', { cwd: feCorePath, stdio: 'inherit' });
          
          log.info('Running: yarn clean:lib');
          execSync('yarn clean:lib', { cwd: feCorePath, stdio: 'inherit' });
          
          log.info('Running: npm run bootstrap');
          execSync('npm run bootstrap', { cwd: feCorePath, stdio: 'inherit' });
          
          log.info('Running: npm run build');
          execSync('npm run build', { cwd: feCorePath, stdio: 'inherit' });
          
          log.success('Build completed successfully');
        } else {
          log.warning('No build script found in package.json, skipping build step');
        }
      } else {
        log.warning('No package.json found, skipping build step');
      }
    } catch (error) {
      log.error(`Build failed: ${error.message}`);
      
      // Ask user if they want to continue
      const continueResponse = await prompts({
        type: 'confirm',
        name: 'continue',
        message: 'Build failed. Do you want to continue with sync anyway?',
        initial: false
      });
      
      if (!continueResponse.continue) {
        log.warning('Sync cancelled by user');
        return;
      }
    }

    log.bigStep('📦 STEP 3: PREPARING TO SYNC PACKAGES');

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

    log.info(`Found ${packageDirs.length} package(s)`);

    log.bigStep('🎯 STEP 4: SELECT SYNC DESTINATION(S)');

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

    log.success(`Selected ${response.destinations.length} destination(s)`);
    log.bigStep('🚀 STEP 5: SYNCING PACKAGES');

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
    log.bigStep('✨ PACKAGE SYNC COMPLETED!');
    
    results.forEach(result => {
      if (result.failed === 0) {
        log.success(`${result.name}: All ${result.success} packages synced successfully`);
      } else {
        log.warning(`${result.name}: ${result.success} succeeded, ${result.failed} failed`);
      }
    });

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
