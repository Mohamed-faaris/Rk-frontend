import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const distDir = path.resolve(currentDir, '../dist');
const indexFile = path.join(distDir, 'index.html');
const siteUrl = 'https://rkch.tech';

const servicesStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'RajKayal Creative Hub',
      url: siteUrl,
      logo: `${siteUrl}/rklogofinal.png`,
    },
    {
      '@type': 'CollectionPage',
      name: 'Design and Software Services Pricing',
      url: `${siteUrl}/services`,
      description: 'Pricing and package overview for branding, websites, UI/UX, social media creatives, video editing, and software services from RajKayal Creative Hub.',
    },
    {
      '@type': 'ItemList',
      itemListElement: [
        'ID Card Designs',
        'Logo Design',
        'Printing Designs',
        'Advertisement Designs',
        'Social Media Designs',
        'Video Editing',
        'Photoshop Services',
        'Branding Designs',
        'Website Design',
        'Website Development',
        'E-Commerce Development',
        'Web Maintenance',
        'Software Development',
        'Other Tech Services',
      ].map((name, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
      })),
    },
  ],
};

const servicesMarkup = `
    <div id="root">
      <a href="#main-content" style="position:absolute;left:12px;top:12px;background:#d4af37;color:#111;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:600;z-index:99;">Skip to main content</a>
      <header style="border-bottom:1px solid rgba(212,175,55,.2);padding:20px 24px;background:#080808;color:#f5f5f5;">
        <nav aria-label="Primary navigation" style="display:flex;flex-wrap:wrap;gap:16px;max-width:1100px;margin:0 auto;align-items:center;justify-content:space-between;">
          <strong>RajKayal Creative Hub</strong>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">
            <a href="/" style="color:#f8e6a2;">Home</a>
            <a href="/services-overview" style="color:#f8e6a2;">Services Overview</a>
            <a href="/branding-identity" style="color:#f8e6a2;">Branding</a>
            <a href="/web-development" style="color:#f8e6a2;">Web Development</a>
            <a href="/uiux-design" style="color:#f8e6a2;">UI/UX Design</a>
            <a href="/contact" style="color:#f8e6a2;">Contact</a>
          </div>
        </nav>
      </header>
      <main id="main-content" style="max-width:1100px;margin:0 auto;padding:48px 24px 64px;color:#f5f5f5;background:#080808;">
        <section>
          <p style="display:inline-block;border:1px solid rgba(212,175,55,.5);padding:6px 12px;border-radius:999px;color:#f6d77a;background:#1a1305;">RajKayal Creative Hub</p>
          <h1 style="font-size:clamp(2rem,5vw,4rem);line-height:1.1;color:#f8e6a2;margin:18px 0 12px;">Design and Software Service Price List 2026</h1>
          <p style="font-size:1.05rem;line-height:1.8;color:#d7d7d7;max-width:900px;">RajKayal Creative Hub supports small businesses, schools, colleges, startups, and local brands with practical design and software services. This pricing page gives you a clear starting point for the most common requests we receive, including logo design, print graphics, social creatives, website design, development, e-commerce work, maintenance, and custom software solutions.</p>
          <p style="font-size:1.05rem;line-height:1.8;color:#d7d7d7;max-width:900px;">The ranges shown here reflect typical project scopes. Straightforward tasks with ready-made content and fewer revision rounds stay near the lower end, while complex work involving more pages, strategy, motion, custom layouts, integrations, or recurring support moves upward. That makes this page useful both for early budgeting and for comparing which category best matches your requirement before you enquire.</p>
          <p style="font-size:1.05rem;line-height:1.8;color:#d7d7d7;max-width:900px;">We also build combined packages for clients who need more than one deliverable at once. A school might need ID cards, notice layouts, certificates, and a website refresh. A retail business may need branding, storefront graphics, a product catalog, and social media creatives. A startup may need UI design, a landing page, content support, and ongoing technical maintenance. If your requirement crosses categories, our team can turn this list into a custom quote.</p>
        </section>
        <section style="margin-top:36px;">
          <h2 style="font-size:1.8rem;color:#f6d77a;">Featured pricing categories</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin-top:20px;">
            <article style="border:1px solid rgba(212,175,55,.18);border-radius:18px;padding:18px;background:#111;">
              <h3 style="margin-top:0;color:#f8e6a2;">Logo and branding</h3>
              <p style="line-height:1.7;color:#d7d7d7;">Logo packages start from ₹800, while deeper brand identity packages can scale up based on applications, guidelines, and collateral.</p>
              <a href="/branding-identity" style="color:#f6d77a;">Explore branding services</a>
            </article>
            <article style="border:1px solid rgba(212,175,55,.18);border-radius:18px;padding:18px;background:#111;">
              <h3 style="margin-top:0;color:#f8e6a2;">Website design and development</h3>
              <p style="line-height:1.7;color:#d7d7d7;">Landing pages, business sites, blogs, and custom builds are priced by page count, functionality, content readiness, and deployment scope.</p>
              <a href="/web-development" style="color:#f6d77a;">Explore web development</a>
            </article>
            <article style="border:1px solid rgba(212,175,55,.18);border-radius:18px;padding:18px;background:#111;">
              <h3 style="margin-top:0;color:#f8e6a2;">UI/UX and digital assets</h3>
              <p style="line-height:1.7;color:#d7d7d7;">We cover interface design, social creatives, posters, flyers, motion edits, and Photoshop work for campaigns and product launches.</p>
              <a href="/uiux-design" style="color:#f6d77a;">Review UI/UX services</a>
            </article>
          </div>
        </section>
        <section style="margin-top:36px;">
          <h2 style="font-size:1.8rem;color:#f6d77a;">Need a custom package?</h2>
          <p style="font-size:1.02rem;line-height:1.8;color:#d7d7d7;max-width:900px;">If your project includes multiple deliverables, urgent timelines, or ongoing support, contact us for a bundled plan. We can package design, development, content preparation, deployment, and maintenance into one proposal built around your goals.</p>
          <p style="margin-top:18px;display:flex;flex-wrap:wrap;gap:16px;">
            <a href="/contact" style="background:#d4af37;color:#111;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700;">Get free consultation</a>
            <a href="/services" style="border:1px solid rgba(212,175,55,.45);color:#f6d77a;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:600;">View our services</a>
          </p>
        </section>
      </main>
      <footer style="border-top:1px solid rgba(212,175,55,.2);padding:24px;background:#050505;color:#d7d7d7;">
        <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;">
          <p style="margin:0;">RajKayal Creative Hub offers branding, websites, UI/UX, media design, and custom software services.</p>
          <a href="/contact" style="color:#f6d77a;">Contact RajKayal</a>
        </div>
      </footer>
    </div>`;

const replaceTagContent = (html, pattern, replacement) => {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html;
};

const createServicesHtml = (baseHtml) => {
  let html = baseHtml;

  html = replaceTagContent(html, /<title>.*?<\/title>/s, '<title>Design &amp; Software Services Pricing | RajKayal</title>');
  html = replaceTagContent(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${siteUrl}/services" />`);
  html = replaceTagContent(html, /<meta name="description"[^>]*>/, '<meta name="description" content="Browse RajKayal Creative Hub pricing for logos, branding, website design, web development, UI/UX, social media creatives, video editing, and custom software services." />');
  html = replaceTagContent(html, /<meta property="og:title"[^>]*>/, '<meta property="og:title" content="Design &amp; Software Services Pricing | RajKayal" />');
  html = replaceTagContent(html, /<meta property="og:description"[^>]*>/, '<meta property="og:description" content="Pricing and package overview for branding, websites, UI/UX, social media creatives, video editing, and software services from RajKayal Creative Hub." />');
  html = replaceTagContent(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${siteUrl}/services" />`);
  html = replaceTagContent(html, /<meta name="twitter:title"[^>]*>/, '<meta name="twitter:title" content="Design &amp; Software Services Pricing | RajKayal" />');
  html = replaceTagContent(html, /<meta name="twitter:description"[^>]*>/, '<meta name="twitter:description" content="Browse RajKayal Creative Hub pricing for logos, branding, websites, UI/UX, media design, and software services." />');
  html = html.replace('</head>', `\n    <script type="application/ld+json">${JSON.stringify(servicesStructuredData)}</script>\n  </head>`);
  html = html.replace('<div id="root"></div>', servicesMarkup);

  return html;
};

const baseHtml = await readFile(indexFile, 'utf8');
const servicesDir = path.join(distDir, 'services');

await mkdir(servicesDir, { recursive: true });
await writeFile(path.join(servicesDir, 'index.html'), createServicesHtml(baseHtml), 'utf8');

console.log('Generated prerendered SEO page for /services');