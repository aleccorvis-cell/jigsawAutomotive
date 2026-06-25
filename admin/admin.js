/* =============================================
   Jigsaw Automotive Group — CMS Admin Logic
   ============================================= */

'use strict';

(function () {
  // Config state
  let currentConfig = null;

  // DOM Elements
  const tabButtons = document.querySelectorAll('.admin-nav__btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');
  const adminForm = document.getElementById('admin-form');
  const btnDownload = document.getElementById('btn-download');
  const btnPublish = document.getElementById('btn-publish');
  const tokenInput = document.getElementById('gh_token');
  const ownerInput = document.getElementById('gh_owner');
  const repoInput = document.getElementById('gh_repo');
  const branchInput = document.getElementById('gh_branch');
  const statusBox = document.getElementById('github-status-box');
  const statusTitle = document.getElementById('github-status-title');
  const statusMsg = document.getElementById('github-status-msg');

  /* ============================================
     1. TAB SWITCHING
     ============================================ */
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });

  /* ============================================
     2. CONFIG LOAD & PRE-FILL
     ============================================ */
  function loadConfig() {
    const localData = localStorage.getItem('jigsaw_config');
    
    if (localData) {
      try {
        currentConfig = JSON.parse(localData);
        fillFormFields(currentConfig);
        checkGitHubSyncVisibility();
      } catch (e) {
        console.error('Error parsing local config data', e);
        fetchConfigFromServer();
      }
    } else {
      fetchConfigFromServer();
    }
  }

  function fetchConfigFromServer() {
    fetch('../content/config.json')
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        currentConfig = data;
        fillFormFields(currentConfig);
        checkGitHubSyncVisibility();
      })
      .catch(err => {
        console.warn('Could not load config.json, initializing default state.', err);
        initializeDefaultConfig();
      });
  }

  function initializeDefaultConfig() {
    currentConfig = {
      company: {
        name: "Jigsaw Automotive Group",
        contactPerson: "Christof Chrappek",
        email: "cchrappek@gmail.com",
        phone: "+41 78 239 53 62",
        address: "Zürich, Schweiz",
        brandingNotice: "Webdesign ist von Starmindsdesign by Alec 💻"
      },
      modules: {
        hero: true,
        trust: true,
        "ueber-uns": true,
        leistungen: true,
        team: true,
        projekte: true,
        downloads: true,
        faq: true,
        cta: true
      },
      hero: {
        title: "Präzision in Bewegung. Erfolg im Detail.",
        subtitle: "Jigsaw Automotive Group — Ihr strategischer Partner für Management, Beratung und Transformation in der Automobilbranche.",
        ctaPrimary: "Erstberatung vereinbaren",
        ctaSecondary: "Unsere Leistungen"
      },
      ueberUns: {
        overline: "Über uns",
        title: "Präzision. Strategie. Ergebnis.",
        leadText: "Die Jigsaw Automotive Group steht für strategische Beratung und operative Exzellenz in der Automobilindustrie.",
        bodyText: "Unser Ansatz ist ganzheitlich: Wir analysieren, beraten und begleiten Unternehmen der Automobilbranche.",
        ctaText: "Unser Team kennenlernen"
      }
    };
    fillFormFields(currentConfig);
    checkGitHubSyncVisibility();
  }

  function fillFormFields(config) {
    if (!config) return;

    // Module Toggles
    if (config.modules) {
      for (const [moduleName, isEnabled] of Object.entries(config.modules)) {
        const checkbox = document.querySelector(`input[name="module_${moduleName}"]`);
        if (checkbox) checkbox.checked = isEnabled;
      }
    }

    // Firmendetails
    if (config.company) {
      setValue('company_name', config.company.name);
      setValue('company_contact', config.company.contactPerson);
      setValue('company_email', config.company.email);
      setValue('company_phone', config.company.phone);
      setValue('company_address', config.company.address);
      setValue('company_branding', config.company.brandingNotice);
    }

    // Hero-Bereich
    if (config.hero) {
      setValue('hero_title', config.hero.title);
      setValue('hero_subtitle', config.hero.subtitle);
    }

    // Über uns
    if (config.ueberUns) {
      setValue('about_overline', config.ueberUns.overline);
      setValue('about_title', config.ueberUns.title);
      setValue('about_lead', config.ueberUns.leadText);
      setValue('about_body', config.ueberUns.bodyText);
    }
  }

  function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  /* ============================================
     3. SAVE CONFIG (LOCAL & JSON DOWNLOAD)
     ============================================ */
  adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateConfigFromForm();
    
    // Save to localStorage
    localStorage.setItem('jigsaw_config', JSON.stringify(currentConfig, null, 2));
    
    alert('Änderungen lokal gespeichert! Die Hauptseite liest diese Änderungen nun lokal aus. Um sie permanent zu veröffentlichen, laden Sie die JSON-Datei herunter oder nutzen Sie den GitHub Sync.');
  });

  function updateConfigFromForm() {
    if (!currentConfig) return;

    // Module Toggles
    if (!currentConfig.modules) currentConfig.modules = {};
    const moduleCheckboxes = document.querySelectorAll('input[name^="module_"]');
    moduleCheckboxes.forEach(cb => {
      const name = cb.name.replace('module_', '');
      currentConfig.modules[name] = cb.checked;
    });

    // Firmendetails
    if (!currentConfig.company) currentConfig.company = {};
    currentConfig.company.name = document.getElementById('company_name').value;
    currentConfig.company.contactPerson = document.getElementById('company_contact').value;
    currentConfig.company.email = document.getElementById('company_email').value;
    currentConfig.company.phone = document.getElementById('company_phone').value;
    currentConfig.company.address = document.getElementById('company_address').value;
    currentConfig.company.brandingNotice = document.getElementById('company_branding').value;

    // Hero-Bereich
    if (!currentConfig.hero) currentConfig.hero = {};
    currentConfig.hero.title = document.getElementById('hero_title').value;
    currentConfig.hero.subtitle = document.getElementById('hero_subtitle').value;

    // Über uns
    if (!currentConfig.ueberUns) currentConfig.ueberUns = {};
    currentConfig.ueberUns.overline = document.getElementById('about_overline').value;
    currentConfig.ueberUns.title = document.getElementById('about_title').value;
    currentConfig.ueberUns.leadText = document.getElementById('about_lead').value;
    currentConfig.ueberUns.bodyText = document.getElementById('about_body').value;
  }

  btnDownload.addEventListener('click', () => {
    updateConfigFromForm();
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  /* ============================================
     4. GITHUB SYNC (GIT-BASED CMS PATTERN)
     ============================================ */
  // Load saved credentials
  tokenInput.value = localStorage.getItem('jag_gh_token') || '';
  ownerInput.value = localStorage.getItem('jag_gh_owner') || '';
  repoInput.value = localStorage.getItem('jag_gh_repo') || '';
  branchInput.value = localStorage.getItem('jag_gh_branch') || 'main';

  function saveGitHubCredentials() {
    localStorage.setItem('jag_gh_token', tokenInput.value);
    localStorage.setItem('jag_gh_owner', ownerInput.value);
    localStorage.setItem('jag_gh_repo', repoInput.value);
    localStorage.setItem('jag_gh_branch', branchInput.value);
  }

  function checkGitHubSyncVisibility() {
    const hasCreds = tokenInput.value.length > 0 && ownerInput.value.length > 0 && repoInput.value.length > 0;
    btnPublish.style.display = hasCreds ? 'block' : 'none';
  }

  [tokenInput, ownerInput, repoInput, branchInput].forEach(el => {
    el.addEventListener('input', () => {
      saveGitHubCredentials();
      checkGitHubSyncVisibility();
    });
  });

  btnPublish.addEventListener('click', async () => {
    updateConfigFromForm();
    
    const token = tokenInput.value.trim();
    const owner = ownerInput.value.trim();
    const repo = repoInput.value.trim();
    const branch = branchInput.value.trim() || 'main';
    const filePath = 'content/config.json';
    
    showStatus('pending', 'Verbindung mit GitHub wird hergestellt...', 'Lade Repository-Daten...');

    try {
      // 1. Fetch file if it exists to get SHA
      const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
      let fileSha = null;
      
      const res = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (res.status === 200) {
        const fileData = await res.json();
        fileSha = fileData.sha;
      } else if (res.status !== 404) {
        throw new Error(`Fehler beim Laden von config.json: ${res.statusText} (${res.status})`);
      }

      // 2. Base64 conversion supporting UTF-8 characters (German Umlauts)
      const configStr = JSON.stringify(currentConfig, null, 2);
      const utf8Bytes = new TextEncoder().encode(configStr);
      // Convert bytes to binary string
      let binStr = "";
      for (let i = 0; i < utf8Bytes.length; i++) {
        binStr += String.fromCharCode(utf8Bytes[i]);
      }
      const base64Content = btoa(binStr);

      // 3. Make PUT request to save configuration
      const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const payload = {
        message: 'Update content configuration via Jigsaw CMS Dashboard',
        content: base64Content,
        branch: branch
      };
      
      if (fileSha) {
        payload.sha = fileSha;
      }

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(payload)
      });

      if (putRes.ok) {
        showStatus('success', 'Erfolgreich veröffentlicht! 🚀', 'Die Inhaltskonfiguration wurde direkt in Ihr GitHub-Repository übertragen und wird in wenigen Minuten auf GitHub Pages sichtbar sein.');
        // Sync local storage state to match
        localStorage.setItem('jigsaw_config', configStr);
      } else {
        const errorData = await putRes.json();
        throw new Error(errorData.message || `Veröffentlichungsfehler: ${putRes.statusText}`);
      }

    } catch (err) {
      showStatus('error', 'Veröffentlichungsfehler ❌', err.message);
    }
  });

  function showStatus(type, title, message) {
    statusBox.className = `github-status ${type}`;
    statusBox.style.display = 'block';
    statusTitle.textContent = title;
    statusMsg.textContent = message;
  }

  // Init
  loadConfig();
})();
