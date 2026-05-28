/**
 * CV page script.
 *
 * Two responsibilities:
 *
 * 1. Hydration — when served over http(s), the page fetches `data.json`
 *    (built by tools/build-cv.mjs from projects/shared-data/.../profile.json)
 *    and patches a handful of header fields (name, role, email, phone,
 *    social links) so the deployed CV always tracks the canonical profile.
 *    When the file is opened directly (file://) fetch is unavailable and
 *    the static HTML values just stay as-is.
 *
 * 2. PDF export — the docDefinition reads everything from the (already
 *    hydrated) DOM, so the PDF mirrors what the visitor sees on the page.
 */

/* ------------------------------------------------------------------------- */
/* Hydration                                                                 */
/* ------------------------------------------------------------------------- */

const HYDRATION_TARGETS = {
  title: (data) => {
    if (data.pageTitle) document.title = data.pageTitle;
  },
  name: (data) => {
    const el = document.querySelector('#resume-content .header h1');
    if (el && data.name) el.textContent = data.name;
  },
  role: (data) => {
    const el = document.querySelector('#resume-content .header .title');
    if (el && data.role) el.textContent = data.role;
  },
  phone: (data) => {
    const link = document.querySelector('#resume-content .contact-item a[href^="tel:"]');
    if (!link) return;
    if (data.phone) link.setAttribute('href', `tel:${data.phone}`);
    if (data.phoneDisplay) link.textContent = data.phoneDisplay;
  },
  email: (data) => {
    const link = document.querySelector('#resume-content .contact-item a[href^="mailto:"]');
    if (!link) return;
    if (data.email) {
      link.setAttribute('href', `mailto:${data.email}`);
      link.textContent = data.email;
    }
  },
  social: (data) => {
    const links = data.links || {};
    const linkedin = document.querySelector('#resume-content .social-links a[href*="linkedin.com"]');
    if (linkedin && links.linkedin) linkedin.setAttribute('href', links.linkedin);
    const github = document.querySelector('#resume-content .social-links a[href*="github.com"]');
    if (github && links.github) github.setAttribute('href', links.github);
  }
};

async function hydrateFromShared() {
  try {
    const res = await fetch('./data.json', { cache: 'no-cache' });
    if (!res.ok) return;
    const data = await res.json();
    for (const apply of Object.values(HYDRATION_TARGETS)) {
      try { apply(data); } catch (_) { /* keep static fallback for this field */ }
    }
  } catch (_) {
    /* file:// or offline — keep the static HTML values */
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hydrateFromShared);
} else {
  hydrateFromShared();
}

/* ------------------------------------------------------------------------- */
/* PDF export                                                                */
/* ------------------------------------------------------------------------- */

const cleanText = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

/** Strip a leading emoji / non-alphanumeric prefix from a contact-item label. */
const stripEmojiPrefix = (s) => s.replace(/^[^\w+]+/u, '').trim();

/** Pretty-display a URL for the PDF header (no scheme, no trailing slash). */
const displayUrl = (url) => (url || '').replace(/^https?:\/\//i, '').replace(/\/+$/, '');

function getName() {
    return cleanText(document.querySelector('#resume-content .header h1')).toUpperCase();
}

function getSubtitle() {
    return cleanText(document.querySelector('#resume-content .header .title'));
}

function getContactLine() {
    return Array.from(document.querySelectorAll('#resume-content .contact-info .contact-item'))
        .map((el) => stripEmojiPrefix(cleanText(el)))
        .filter(Boolean)
        .join(' | ');
}

function getSocialLine() {
    return Array.from(document.querySelectorAll('#resume-content .social-links .social-link'))
        .map((a) => {
            const label = stripEmojiPrefix(cleanText(a));
            const url = displayUrl(a.getAttribute('href') || '');
            return label && url ? `${label}: ${url}` : label || url;
        })
        .filter(Boolean)
        .join(' | ');
}

function buildExperienceContent() {
    const nodes = [];

    document.querySelectorAll('#resume-content .experience-item').forEach((item) => {
        const company = cleanText(item.querySelector('.company-name'));
        const location = cleanText(item.querySelector('.company-location'));
        const duration = cleanText(item.querySelector('.duration'));
        const overview = cleanText(item.querySelector('.project-overview'));
        const techStack = cleanText(item.querySelector('.tech-stack'));
        const responsibilities = Array.from(item.querySelectorAll('.responsibilities li'))
            .map((li) => cleanText(li))
            .filter(Boolean);

        nodes.push({
            columns: [
                { text: company, style: 'companyName', width: '*' },
                { text: duration, style: 'duration', width: 'auto' }
            ]
        });
        if (location) nodes.push({ text: location, style: 'location' });
        if (overview) nodes.push({ text: overview, style: 'paragraph', margin: [0, 5, 0, 5] });
        if (responsibilities.length) nodes.push({ ul: responsibilities, style: 'list', margin: [0, 0, 0, 5] });
        if (techStack) nodes.push({ text: techStack, style: 'techStack', margin: [0, 0, 0, 12] });
    });

    return nodes;
}

function exportToPDF() {
    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],

        content: [
            // Header — all fields derived from the page's HTML
            { text: getName(), style: 'header', alignment: 'center' },
            { text: getSubtitle(), style: 'subheader', alignment: 'center', margin: [0, 0, 0, 10] },
            { text: getContactLine(), alignment: 'center', fontSize: 10, color: '#555', margin: [0, 0, 0, 5] },
            { text: getSocialLine(), alignment: 'center', fontSize: 10, color: '#4d7c0f', margin: [0, 0, 0, 20] },

            // Professional Summary
            { text: 'PROFESSIONAL SUMMARY', style: 'sectionHeader' },
            {
                text: 'Experienced Full Stack Developer with 6+ years of professional experience in building web applications using .NET, Angular, Blazor, and JavaScript. Strong background in both frontend and backend development, with hands-on experience in enterprise-level systems, CMS platforms, and cloud tools. Proven ability to deliver scalable solutions across diverse domains, including transport, ERP, and finance.',
                style: 'paragraph',
                margin: [0, 0, 0, 15]
            },

            // Technical Skills
            { text: 'TECHNICAL SKILLS', style: 'sectionHeader' },
            {
                columns: [
                    {
                        width: '50%',
                        stack: [
                            { text: 'Backend:', style: 'skillTitle' },
                            { text: 'C#, .NET Core, ASP.NET MVC, Web API, Entity Framework, LINQ, MySQL, MSSQL', style: 'skillText' },
                            { text: 'Frontend:', style: 'skillTitle', margin: [0, 8, 0, 0] },
                            { text: 'Angular 2+, AngularJS, Blazor, JavaScript, TypeScript, jQuery, HTML5, CSS3, AJAX', style: 'skillText' }
                        ]
                    },
                    {
                        width: '50%',
                        stack: [
                            { text: 'CMS:', style: 'skillTitle' },
                            { text: 'Umbraco (Full development cycle, migration and customization)', style: 'skillText' },
                            { text: 'Cloud & DevOps:', style: 'skillTitle', margin: [0, 8, 0, 0] },
                            { text: 'Azure CI/CD, Azure DevOps, Azure Blob Storage, Azure Functions, Git, Swagger, Postman', style: 'skillText' }
                        ]
                    }
                ],
                margin: [0, 0, 0, 15]
            },

            // Professional Experience (generated from the page's HTML)
            { text: 'PROFESSIONAL EXPERIENCE', style: 'sectionHeader' },
            ...buildExperienceContent(),

            // Education
            { text: 'EDUCATION', style: 'sectionHeader' },
            { text: 'National Aviation University, Kyiv', style: 'companyName' },
            { text: "Bachelor's Degree in Management and Logistics (2002 – 2006)", style: 'paragraph', margin: [0, 0, 0, 15] },

            // Certifications
            { text: 'CERTIFICATIONS & TRAINING', style: 'sectionHeader' },
            {
                ul: [
                    'Mate Academy (Front-end development 2024)',
                    'Angular 7 Workshop Course – INFOPULSE UNIVER, Kyiv (2019)',
                    'JavaScript Course – BIONIC SCHOOL, Kyiv (2017)'
                ],
                style: 'list',
                margin: [0, 0, 0, 15]
            },

            // Languages
            { text: 'LANGUAGES', style: 'sectionHeader' },
            { text: 'English: B2 – Comfortable in interviews and professional communication', style: 'paragraph', margin: [0, 0, 0, 15] },

            // Additional Info
            { text: 'ADDITIONAL INFORMATION', style: 'sectionHeader' },
            {
                ul: [
                    "Available to start with 1 week's notice",
                    'Open to international projects and relocation/onsite work if needed'
                ],
                style: 'list'
            }
        ],

        styles: {
            header: { fontSize: 22, bold: true, color: '#333' },
            subheader: { fontSize: 12, color: '#4d7c0f' },
            sectionHeader: {
                fontSize: 12,
                bold: true,
                color: '#4d7c0f',
                margin: [0, 10, 0, 8],
                decoration: 'underline',
                decorationColor: '#4d7c0f'
            },
            companyName: { fontSize: 11, bold: true, color: '#333' },
            duration: { fontSize: 10, color: '#4d7c0f' },
            location: { fontSize: 9, color: '#666', margin: [0, 0, 0, 3] },
            paragraph: { fontSize: 10, color: '#555', lineHeight: 1.3 },
            skillTitle: { fontSize: 10, bold: true, color: '#4d7c0f' },
            skillText: { fontSize: 9, color: '#555' },
            techStack: { fontSize: 9, color: '#4d7c0f', italics: true },
            list: { fontSize: 10, color: '#555' }
        }
    };

    pdfMake.createPdf(docDefinition).download('Andrii_Boiko_Resume.pdf');
}
