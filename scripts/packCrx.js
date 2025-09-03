const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const buildDir = path.join(__dirname, '../build');
const distDir = path.join(__dirname, '../dist');
const keyFile = path.join(__dirname, '../key.pem');

async function packCrx() {
  try {
    console.log('Creating CRX package...');
    
    await fs.ensureDir(distDir);
    
    const hasKey = await fs.pathExists(keyFile);
    
    const chromiumBrowsers = [
      'google-chrome',
      'chromium-browser',
      'chromium',
      'google-chrome-stable'
    ];
    
    let chromeCommand = null;
    for (const browser of chromiumBrowsers) {
      try {
        await execAsync(`which ${browser}`);
        chromeCommand = browser;
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!chromeCommand) {
      console.error('Chrome/Chromium not found. Please install Chrome or Chromium.');
      console.log('On Ubuntu/Debian: sudo apt-get install chromium-browser');
      console.log('On macOS: brew install --cask google-chrome');
      process.exit(1);
    }
    
    const packCommand = hasKey
      ? `${chromeCommand} --pack-extension=${buildDir} --pack-extension-key=${keyFile}`
      : `${chromeCommand} --pack-extension=${buildDir}`;
    
    console.log(`Using ${chromeCommand} to pack extension...`);
    if (!hasKey) {
      console.log('No key file found. A new key will be generated.');
    }
    
    const { stdout, stderr } = await execAsync(packCommand);
    
    if (stderr && !stderr.includes('Created new extension')) {
      console.error('Error:', stderr);
    }
    
    const crxFile = path.join(path.dirname(buildDir), 'build.crx');
    const pemFile = path.join(path.dirname(buildDir), 'build.pem');
    
    if (await fs.pathExists(crxFile)) {
      await fs.move(crxFile, path.join(distDir, 'sync-my-cookie.crx'), { overwrite: true });
      console.log('✓ Created sync-my-cookie.crx in dist/');
    }
    
    if (!hasKey && await fs.pathExists(pemFile)) {
      await fs.move(pemFile, keyFile);
      console.log('✓ Generated new key file: key.pem');
      console.log('⚠️  Keep this key file safe! You need it to update the extension.');
    }
    
    console.log('✓ CRX package created successfully!');
    
  } catch (error) {
    console.error('Failed to create CRX package:', error.message);
    process.exit(1);
  }
}

packCrx();