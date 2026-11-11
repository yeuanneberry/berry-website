import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// One brief project composition in Berry's frame. Only the work's type mood
// and accent colors vary; no screenshots, logos or nested preview cards.
const mono = { family: 'JetBrains Mono', path: '../apps/web/public/fonts/JetBrainsMono-Regular.ttf' };
const sans = { family: 'Liberation Sans Bold', path: './fonts/LiberationSans-Bold.ttf' };
const serif = { family: 'Liberation Serif', path: './fonts/LiberationSerif-Regular.ttf' };
const themes = {
  masqify: { ink: '#e2eaff', accent: '#7195ed', font: mono, size: 112, brief: 'A temporary-email web application.' },
  tapin: { ink: '#a0c8ac', accent: '#75b48d', font: sans, size: 138, brief: 'An NFC-based attendance application.' },
  yappers: { ink: '#e8debf', accent: '#68b9c1', font: sans, size: 138, brief: 'A website for a design studio.' },
  softlysang: { ink: '#e5d4b6', accent: '#b7a381', font: serif, size: 128, brief: 'A personal home for slow living, films and homemaking.' },
  lkt: { ink: '#b0c79e', accent: '#8eab7e', font: sans, size: 148, brief: 'A company website for documentation, finance and IT.' },
};
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
async function renderText(value, color, font, size, width = 1056, markup = false) {
  return sharp({ text: {
    text: '<span foreground="' + color + '">' + (markup ? value : escape(value)) + '</span>',
    font: font.family + ' ' + size, fontfile: fileURLToPath(new URL(font.path, import.meta.url)),
    width, rgba: true, wrap: 'word',
  } }).png().toBuffer();
}

export async function projectSocialCard(page) {
  const theme = themes[page.theme];
  if (!theme) throw new Error('Missing project social-card theme: ' + page.id);
  const title = page.theme === 'yappers'
    ? '<span foreground="#69bbc6">y</span><span foreground="#efa466">a</span><span foreground="#dfc175">p</span><span foreground="#a6c5b0">p</span><span foreground="#e78e96">e</span><span foreground="#69bbc6">r</span><span foreground="#a6c5b0">s</span>'
    : page.headline;
  const headline = await renderText(title, theme.ink, theme.font, theme.size, 1056, page.theme === 'yappers');
  if ((await sharp(headline).metadata()).height > 150) throw new Error('Project title no longer fits one line: ' + page.id);
  const brand = await renderText('YEUANNE BERRY / PROJECT', '#eee8d9', mono, 18);
  const brief = await renderText(theme.brief, '#b8bbae', mono, 24);
  const credit = await renderText(page.subtitle, '#eee8d9', mono, 21);
  const frame = Buffer.from('<svg width="1200" height="630"><rect x="32" y="32" width="1136" height="566" fill="none" stroke="#363d3b"/><path d="M72 165H124" stroke="' + theme.accent + '" stroke-width="3"/><path d="M72 476H1128" stroke="#8e977b"/></svg>');
  return sharp({ create: { width: 1200, height: 630, channels: 4, background: '#191c1c' } })
    .composite([
      { input: frame }, { input: brand, left: 72, top: 72 },
      { input: headline, left: 72, top: 206 }, { input: brief, left: 76, top: 365 },
      { input: credit, left: 72, top: 520 },
    ]).png({ compressionLevel: 9 }).toBuffer();
}
