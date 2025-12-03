import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

// Generate a simple HTML from resume data. This is a pragmatic server-side renderer
// that approximates the frontend template. If you need pixel-perfect rendering
// use Puppeteer to open the frontend printable route instead.
const buildHtml = (data) => {
  const escape = (s) => (s ? String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "");

  const {
    fullName = "",
    role = "",
    email = "",
    phone = "",
    address = "",
    links = [],
    professionalSummary = "",
    skills = [],
    education = [],
    experience = [],
    projects = [],
  } = data;

  // Build left column (contact, skills, links)
  const contactLines = [email, phone, address].filter(Boolean).map((c) => `<div style="margin-bottom:6px;color:#475569;font-size:12px">${escape(c)}</div>`).join('');

  const linksHtml = (links || []).filter(Boolean).map((l) => `<div style="margin-bottom:6px"><a href="${escape(l)}" style="color:#2563eb;text-decoration:none">${escape(l)}</a></div>`).join('');

  const skillsHtml = (skills || []).filter(Boolean).map((s) => `<li style="display:inline-block;margin:4px 6px;padding:6px 10px;background:#f1f5f9;color:#0f172a;border-radius:999px;font-size:11px">${escape(s)}</li>`).join('');

  // Build experience entries
  const experienceHtml = (experience || []).map((ex) => {
    const bullets = (ex.description || '').split(/\n/).map((l) => l.trim()).filter(Boolean);
    const bulletsHtml = bullets.length ? `<ul style="margin:6px 0 0 16px;padding-left:16px;line-height:1.25;color:#334155">${bullets.map((b) => `<li style="margin-bottom:6px">${escape(b.replace(/^[-*•]\s*/, ''))}</li>`).join('')}</ul>` : '';
    return `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <div style="font-weight:700;color:#0f172a">${escape(ex.title || '')}</div>
          <div style="color:#475569;font-size:12px">${escape(ex.startDate || '')}${ex.endDate ? ' – ' + escape(ex.endDate) : ''}</div>
        </div>
        <div style="color:#475569;font-size:12px;margin-top:4px">${escape(ex.company || '')}</div>
        ${bulletsHtml}
      </div>`;
  }).join('');

  const educationHtml = (education || []).map((e) => `
    <div style="margin-bottom:10px">
      <div style="font-weight:700;color:#0f172a">${escape(e.degree || '')}</div>
      <div style="color:#475569;font-size:12px">${escape(e.institution || '')}${e.year ? ', ' + escape(e.year) : ''}</div>
    </div>`).join('');

  const projectsHtml = (projects || []).map((p) => `
    <div style="margin-bottom:10px">
      <div style="font-weight:700;color:#0f172a">${escape(p.name || '')}</div>
      ${p.description ? `<div style="color:#334155;margin-top:6px;white-space:pre-wrap">${escape(p.description)}</div>` : ''}
      ${p.link ? `<div style="margin-top:6px"><a href="${escape(p.link)}" style="color:#2563eb;text-decoration:none">${escape(p.link)}</a></div>` : ''}
    </div>`).join('');

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${escape(fullName || 'resume')}</title>
      <style>
        @page { size: A4; margin: 12mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#0f172a; background:white; margin:0 }
        .page { width:210mm; box-sizing:border-box; padding:12mm; }
        .card { display:flex; gap:20px; }
        .left { width:32%; background:#f8fafc; padding:16px; border-radius:6px; box-sizing:border-box }
        .right { width:68%; padding:4px 0 }
        .name { font-size:28px; font-weight:800; margin:0; color:#0f172a }
        .role { margin-top:6px; color:#2563eb; font-weight:600 }
        .section-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; margin-top:12px; margin-bottom:8px; color:#0f172a }
        .muted { color:#475569; font-size:12px }
        ul.skills { list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap }
        .divider { height:1px; background:#e6eef8; margin:10px 0; border-radius:2px }
        a { color:#2563eb }
      </style>
    </head>
    <body>
      <div class="page">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <h1 class="name">${escape(fullName || '')}</h1>
            <div class="role">${escape(role || '')}</div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="card">
          <aside class="left">
            <div class="section">
              <div class="section-title">Contact</div>
              <div class="muted">${contactLines}${linksHtml}</div>
            </div>

            ${ (skills && skills.length) ? `<div class="section"><div class="section-title">Skills</div><ul class="skills">${skillsHtml}</ul></div>` : '' }

          </aside>

          <main class="right">
            ${ professionalSummary ? `<div class="section"><div class="section-title">Professional Summary</div><div class="muted" style="white-space:pre-wrap">${escape(professionalSummary)}</div></div>` : '' }

            ${ experienceHtml ? `<div class="section"><div class="section-title">Experience</div>${experienceHtml}</div>` : '' }

            ${ educationHtml ? `<div class="section"><div class="section-title">Education</div>${educationHtml}</div>` : '' }

            ${ projectsHtml ? `<div class="section"><div class="section-title">Projects</div>${projectsHtml}</div>` : '' }
          </main>
        </div>
      </div>
    </body>
  </html>`;

  return html;
};

export const generatePdfFromData = async (req, res) => {
  try {
    const data = req.body || {};

    const html = buildHtml(data);

    // Generate PDF buffer (no disk writes)
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: '6mm', bottom: '6mm', left: '6mm', right: '6mm' },
    });

    await browser.close();

    const filename = `resume-${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed', err);
    return res.status(500).json({ success: false, message: 'PDF generation failed', error: err.message });
  }
};

// Stream a generated PDF to the client with headers that force download
export const downloadPdfFile = async (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename) return res.status(400).json({ success: false, message: 'Filename required' });

    const filePath = path.join(process.cwd(), 'public', 'downloads', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Use res.download which sets appropriate headers for Content-Disposition
    return res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) res.status(500).end();
      }
    });
  } catch (err) {
    console.error('Download error', err);
    return res.status(500).json({ success: false, message: 'Download failed', error: err.message });
  }
};

// Generate PDF and stream directly (no disk storage) — forces browser download
export const generatePdfStream = async (req, res) => {
  try {
    const data = req.body || {};

    const html = buildHtml(data);

    // launch puppeteer
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });
    // ensure print CSS media
    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: '6mm', bottom: '6mm', left: '6mm', right: '6mm' },
    });

    await browser.close();

    const filename = `resume-${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF stream generation failed', err);
    return res.status(500).json({ success: false, message: 'PDF generation failed', error: err.message });
  }
};
