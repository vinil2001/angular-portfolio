/**
 * Builds the static CV into `dist/cv/`.
 *
 * Pipeline:
 *   1. Read the canonical profile from `projects/shared-data/.../profile.json`.
 *   2. Copy `cv/index.html`, `cv/styles.css`, `cv/script.js` to `dist/cv/`.
 *   3. Emit `dist/cv/data.json` containing the subset of profile fields the
 *      CV hydrates at runtime (name, role, email, phone, social links).
 *
 * The HTML keeps real values as a no-JS / file:// fallback; when the page is
 * served over http(s) the bundled script.js fetches data.json and patches the
 * DOM so the deployed CV always tracks `profile.json`.
 */
import { readFile, writeFile, copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CV_SRC = join(ROOT, 'cv');
const DIST = join(ROOT, 'dist', 'cv');
const PROFILE_JSON = join(ROOT, 'projects', 'shared-data', 'src', 'lib', 'data', 'profile.json');

async function main() {
  const profile = JSON.parse(await readFile(PROFILE_JSON, 'utf8'));

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  for (const file of ['index.html', 'styles.css', 'script.js']) {
    await copyFile(join(CV_SRC, file), join(DIST, file));
  }

  const data = {
    name: profile.name,
    role: profile.role,
    pageTitle: profile.pageTitle,
    email: profile.email,
    phone: profile.phone,
    phoneDisplay: profile.phoneDisplay,
    links: {
      linkedin: profile.links?.linkedin ?? '',
      github: profile.links?.github ?? ''
    }
  };
  await writeFile(join(DIST, 'data.json'), JSON.stringify(data, null, 2) + '\n', 'utf8');

  console.log(`✓ CV built → ${relative(ROOT, DIST)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
