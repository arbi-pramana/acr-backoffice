import {readFile, writeFile} from 'fs/promises';
import {execSync} from 'child_process';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(__dirname, '../package.json');
const versionFilePath = resolve(__dirname, '../public/version.json');

// --- Get bump type from CLI args ---
const arg = process.argv.find(a => ['--major', '--minor', '--patch'].includes(a)) || '--patch';

// --- Read and bump version ---
const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
let [major, minor, patch] = pkg.version.split('.').map(Number);

switch (arg) {
    case '--major':
        major += 1;
        minor = 0;
        patch = 0;
        break;
    case '--minor':
        minor += 1;
        patch = 0;
        break;
    case '--patch':
    default:
        patch += 1;
}

pkg.version = `${major}.${minor}.${patch}`;
await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
console.info(`⚠️ The version shown below is not generated in CI/CD. Check package.json for the current version used in builds.`);
console.info(`📦 Bumped version to: ${pkg.version} (${arg})`);

// --- Git metadata ---
const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const buildDate = new Date().toISOString();

// --- Write version.json ---
const versionInfo = {
    version: pkg.version,
    commitHash,
    branch,
    buildDate
};

await writeFile(versionFilePath, JSON.stringify(versionInfo, null, 2));
console.info('✅ Generated public/version.json:', versionInfo);
