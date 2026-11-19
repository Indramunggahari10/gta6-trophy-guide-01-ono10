/* GTA 6 Trophy Guide — renders app/data/trophies.json and keeps the checklist
   in localStorage. Kind filters, a spoiler setting for story trophies, JSON
   export/import of the checklist, and a data-driven platinum roadmap.
   No network requests besides the local JSON file. Toggling a trophy updates
   only its card and the progress bar, so the page never jumps. */
(function () {
  'use strict';

  var STORAGE_KEY = 'gta6-trophy-guide-earned-v1';
  var SPOILER_KEY = 'gta6-trophy-guide-spoilers-v1';
  var listEl = document.getElementById('list');
  var emptyEl = document.getElementById('empty');
  var searchEl = document.getElementById('search');
  var resetBtn = document.getElementById('resetBtn');
  var exportBtn = document.getElementById('exportBtn');
  var importBtn = document.getElementById('importBtn');
  var importFile = document.getElementById('importFile');
  var importStatus = document.getElementById('importStatus');
  var filterBar = document.getElementById('filterBar');
  var spoilerToggle = document.getElementById('spoilerToggle');
  var progressText = document.getElementById('progressText');
  var platinumText = document.getElementById('platinumText');
  var progressBar = document.getElementById('progressBar');
  var shownCount = document.getElementById('shownCount');
  var roadmapList = document.getElementById('roadmapList');

  var trophies = [];
  var earned = loadEarned();
  var activeFilter = 'all';
  var hideSpoilers = loadSpoilerPref();

  var FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'story', label: 'Story' },
    { key: 'collectible', label: 'Collectibles' },
    { key: 'combat', label: 'Combat' },
    { key: 'driving', label: 'Driving' },
    { key: 'misc', label: 'Misc' },
    { key: 'missable', label: 'Missable' },
    { key: 'online', label: 'Online' }
  ];

  function loadEarned() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveEarned() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(earned)); } catch (e) { /* storage full or blocked */ }
  }

  function loadSpoilerPref() {
    try {
      var raw = localStorage.getItem(SPOILER_KEY);
      if (raw === null) return true; /* spoilers hidden by default */
      return raw === '1';
    } catch (e) {
      return true;
    }
  }

  function saveSpoilerPref() {
    try { localStorage.setItem(SPOILER_KEY, hideSpoilers ? '1' : '0'); } catch (e) { /* storage blocked */ }
  }

  function gradeClass(grade) { return String(grade || '').toLowerCase(); }

  function kindLabel(kind) {
    var labels = { story: 'Story', collectible: 'Collectible', combat: 'Combat', driving: 'Driving', misc: 'Misc' };
    return labels[kind] || kind;
  }

  function tag(text, cls) {
    var span = document.createElement('span');
    span.className = 'tag' + (cls ? ' ' + cls : '');
    span.textContent = text;
    return span;
  }

  function trophyMatchesFilter(t) {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'missable') return !!t.missable;
    if (activeFilter === 'online') return t.kind === 'online';
    return t.kind === activeFilter;
  }

  function filterCount(key) {
    if (key === 'all') return trophies.length;
    if (key === 'missable') return trophies.filter(function (t) { return !!t.missable; }).length;
    if (key === 'online') return 0; /* the game has no online trophies */
    return trophies.filter(function (t) { return t.kind === key; }).length;
  }

  function renderFilters() {
    filterBar.textContent = '';
    FILTERS.forEach(function (f) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter' + (activeFilter === f.key ? ' active' : '');
      btn.setAttribute('aria-pressed', activeFilter === f.key ? 'true' : 'false');
      btn.textContent = f.label + ' (' + filterCount(f.key) + ')';
      btn.addEventListener('click', function () {
        activeFilter = f.key;
        renderFilters();
        render();
      });
      filterBar.appendChild(btn);
    });
  }

  function updateProgress() {
    var earnedCount = 0;
    var nonPlatEarned = 0;
    var nonPlatTotal = 0;
    trophies.forEach(function (t) {
      if (t.grade !== 'Platinum') nonPlatTotal += 1;
      if (earned[t.id]) {
        earnedCount += 1;
        if (t.grade !== 'Platinum') nonPlatEarned += 1;
      }
    });
    progressText.textContent = earnedCount + ' / ' + trophies.length + ' earned';
    platinumText.textContent = 'Platinum: ' + nonPlatEarned + ' / ' + nonPlatTotal;
    progressBar.style.width = trophies.length ? (earnedCount / trophies.length * 100) + '%' : '0%';
  }

  function isSpoilerHidden(t) {
    return hideSpoilers && t.kind === 'story' && !earned[t.id];
  }

  function render() {
    var query = searchEl.value.trim().toLowerCase();
    listEl.textContent = '';
    var shown = 0;

    trophies.forEach(function (t) {
      var isEarned = !!earned[t.id];
      if (!trophyMatchesFilter(t)) return;
      if (query && t.name.toLowerCase().indexOf(query) === -1 &&
          t.description.toLowerCase().indexOf(query) === -1) return;
      shown += 1;

      var card = document.createElement('article');
      card.className = 'card' + (isEarned ? ' earned' : '');
      card.id = 'trophy-' + t.id;
      card.dataset.id = t.id;

      var box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = isEarned;
      box.setAttribute('aria-label', 'Earned: ' + t.name);
      box.addEventListener('change', function () {
        if (box.checked) { earned[t.id] = true; } else { delete earned[t.id]; }
        saveEarned();
        render();
      });

      var body = document.createElement('div');
      var hidden = isSpoilerHidden(t);

      var title = document.createElement('h3');
      var num = document.createElement('span');
      num.className = 'num';
      num.textContent = '#' + t.id;
      title.appendChild(num);
      title.appendChild(document.createTextNode(hidden ? 'Story trophy — hidden until earned' : t.name));
      body.appendChild(title);

      var desc = document.createElement('p');
      desc.className = 'desc';
      desc.textContent = hidden
        ? 'This story trophy stays hidden while spoilers are on. Earn it in the game, or turn off “Hide story spoilers” above to see it now.'
        : t.description;
      body.appendChild(desc);

      if (!hidden) {
        var guide = document.createElement('p');
        guide.className = 'guide';
        guide.textContent = t.guide;
        body.appendChild(guide);
      }

      var meta = document.createElement('p');
      meta.className = 'meta';
      meta.appendChild(tag(t.grade, gradeClass(t.grade)));
      meta.appendChild(tag(kindLabel(t.kind), ''));
      if (t.hidden) meta.appendChild(tag('Hidden', 'hidden'));
      if (t.missable) meta.appendChild(tag('Missable', 'missable'));
      if (t.guide_unconfirmed) meta.appendChild(tag('Method unconfirmed', 'unconfirmed'));
      body.appendChild(meta);

      if (!hidden) {
        var src = document.createElement('p');
        src.className = 'src';
        src.textContent = 'Sources: Planet GTA 6 · Output Lag';
        body.appendChild(src);
      }

      card.appendChild(box);
      card.appendChild(body);
      listEl.appendChild(card);
    });

    updateProgress();
    shownCount.textContent = shown + ' of ' + trophies.length + ' trophies';
    if (activeFilter === 'online') {
      emptyEl.textContent = 'No online trophies — all 55 trophies are single-player and unlock offline.';
    } else {
      emptyEl.textContent = 'No trophies match that search or filter.';
    }
    emptyEl.hidden = shown !== 0;
  }

  /* Roadmap stages, built from the trophy data itself: story first, then
     collectibles, then combat and driving, then the open-world cleanup, then
     100% completion, and the platinum last. The order is this guide's
     suggestion, not an official Rockstar order. */
  var ROADMAP = [
    { title: '1 · Play the story', note: 'Chapters 1–4, the final mission, and the six side-story finales. Keep a manual save at the start of every chapter. Do Lucia’s balcony meditation in Chapter 1 and Race Against Yago the moment it appears in Chapter 3.', pick: function (t) { return t.kind === 'story'; } },
    { title: '2 · Collectibles', note: 'Meditation spots, card sets, WAiNK scans, vehicles to discover, garages to buy, and exploring all of Leonida.', pick: function (t) { return t.kind === 'collectible'; } },
    { title: '3 · Combat and driving', note: 'Shooting ranges, drone races, stunts, Combat Focus, the VCIA jet and the tank.', pick: function (t) { return t.kind === 'combat' || t.kind === 'driving'; } },
    { title: '4 · World and money cleanup', note: 'Robberies, partner jobs, stranger strands, challenges and spending — everything that stays open after the credits.', pick: function (t) { return t.kind === 'misc' && t.id !== 1 && t.id !== 14; } },
    { title: '5 · 100% completion', note: 'The in-game 100% checklist (Progress, then Stats) only appears after the story, but work done earlier still counts.', pick: function (t) { return t.id === 14; } },
    { title: '6 · Platinum', note: 'Earn the other 54 trophies and this one unlocks on its own.', pick: function (t) { return t.id === 1; } }
  ];

  function renderRoadmap() {
    roadmapList.textContent = '';
    ROADMAP.forEach(function (stage) {
      var items = trophies.filter(stage.pick);
      if (!items.length) return;
      var li = document.createElement('li');
      li.className = 'stage';

      var head = document.createElement('div');
      head.className = 'stage-head';
      var h3 = document.createElement('h3');
      h3.textContent = stage.title;
      head.appendChild(h3);
      var count = document.createElement('span');
      var done = items.filter(function (t) { return earned[t.id]; }).length;
      count.className = 'stage-count';
      count.textContent = done + ' / ' + items.length + ' earned';
      head.appendChild(count);
      li.appendChild(head);

      var note = document.createElement('p');
      note.className = 'stage-note';
      note.textContent = stage.note;
      li.appendChild(note);

      var names = document.createElement('ul');
      names.className = 'stage-trophies';
      items.forEach(function (t) {
        var item = document.createElement('li');
        item.className = earned[t.id] ? 'done' : '';
        var link = document.createElement('a');
        link.href = '#trophy-' + t.id;
        link.textContent = (earned[t.id] ? '✓ ' : '') + (isSpoilerHidden(t) ? 'Story trophy #' + t.id : t.name);
        item.appendChild(link);
        if (t.missable) item.appendChild(tag('Missable', 'missable'));
        names.appendChild(item);
      });
      li.appendChild(names);
      roadmapList.appendChild(li);
    });
  }

  function showStatus(message) {
    importStatus.textContent = message;
    importStatus.hidden = false;
  }

  function exportChecklist() {
    var ids = Object.keys(earned).map(Number).filter(function (id) {
      return trophies.some(function (t) { return t.id === id; });
    }).sort(function (a, b) { return a - b; });
    var data = {
      app: 'gta6-trophy-guide',
      version: 1,
      exportedAt: new Date().toISOString(),
      earned: ids
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'gta6-trophy-checklist.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showStatus('Exported ' + ids.length + ' earned ' + (ids.length === 1 ? 'trophy' : 'trophies') + ' to gta6-trophy-checklist.json.');
  }

  function importChecklist(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var restored = 0;
      var ignored = 0;
      try {
        var parsed = JSON.parse(reader.result);
        var list = parsed && Array.isArray(parsed.earned) ? parsed.earned : null;
        if (!list) throw new Error('no earned list');
        var known = {};
        trophies.forEach(function (t) { known[t.id] = true; });
        var next = {};
        list.forEach(function (id) {
          if (known[id]) { next[id] = true; restored += 1; }
          else { ignored += 1; }
        });
        earned = next;
        saveEarned();
        render();
        renderRoadmap();
        showStatus('Imported: restored ' + restored + ' earned ' + (restored === 1 ? 'trophy' : 'trophies') +
          (ignored ? ' (' + ignored + ' unknown ' + (ignored === 1 ? 'id' : 'ids') + ' ignored).' : '.'));
      } catch (e) {
        showStatus('That file could not be imported: it is not a checklist export (expected JSON with an "earned" list of trophy ids). Nothing was changed.');
      }
    };
    reader.onerror = function () {
      showStatus('That file could not be read. Nothing was changed.');
    };
    reader.readAsText(file);
  }

  searchEl.addEventListener('input', render);

  resetBtn.addEventListener('click', function () {
    if (Object.keys(earned).length === 0) return;
    if (!window.confirm('Clear every ticked trophy? Your saved progress will be lost.')) return;
    earned = {};
    saveEarned();
    render();
    renderRoadmap();
  });

  exportBtn.addEventListener('click', exportChecklist);
  importBtn.addEventListener('click', function () { importFile.click(); });
  importFile.addEventListener('change', function () {
    if (importFile.files && importFile.files[0]) importChecklist(importFile.files[0]);
    importFile.value = '';
  });

  spoilerToggle.checked = hideSpoilers;
  spoilerToggle.addEventListener('change', function () {
    hideSpoilers = spoilerToggle.checked;
    saveSpoilerPref();
    render();
    renderRoadmap();
  });

  fetch('data/trophies.json')
    .then(function (r) {
      if (!r.ok) throw new Error('trophies.json failed: ' + r.status);
      return r.json();
    })
    .then(function (data) {
      trophies = data.trophies || data;
      renderFilters();
      render();
      renderRoadmap();
    })
    .catch(function (err) {
      listEl.innerHTML = '<p class="loading">Could not load the trophy list. ' +
        'Open this guide from its own folder so data/trophies.json loads.</p>';
      if (window.console) console.error(err);
    });
})();
