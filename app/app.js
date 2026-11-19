/* GTA 6 Trophy Guide — renders app/data/trophies.json and keeps the checklist
   in localStorage. No network requests besides the local JSON file.
   Toggling a trophy updates only its card and the progress bar, so the page
   never jumps while you tick things off. */
(function () {
  'use strict';

  var STORAGE_KEY = 'gta6-trophy-guide-earned-v1';
  var listEl = document.getElementById('list');
  var emptyEl = document.getElementById('empty');
  var searchEl = document.getElementById('search');
  var resetBtn = document.getElementById('resetBtn');
  var progressText = document.getElementById('progressText');
  var platinumText = document.getElementById('platinumText');
  var progressBar = document.getElementById('progressBar');
  var shownCount = document.getElementById('shownCount');

  var trophies = [];
  var earned = loadEarned();

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

  function gradeClass(grade) { return String(grade || '').toLowerCase(); }

  function tag(text, cls) {
    var span = document.createElement('span');
    span.className = 'tag' + (cls ? ' ' + cls : '');
    span.textContent = text;
    return span;
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

  function render() {
    var query = searchEl.value.trim().toLowerCase();
    listEl.textContent = '';
    var shown = 0;

    trophies.forEach(function (t) {
      var isEarned = !!earned[t.id];
      if (query && t.name.toLowerCase().indexOf(query) === -1) return;
      shown += 1;

      var card = document.createElement('article');
      card.className = 'card' + (isEarned ? ' earned' : '');
      card.dataset.id = t.id;

      var box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = isEarned;
      box.setAttribute('aria-label', 'Earned: ' + t.name);
      box.addEventListener('change', function () {
        if (box.checked) { earned[t.id] = true; } else { delete earned[t.id]; }
        saveEarned();
        card.classList.toggle('earned', box.checked);
        updateProgress();
      });

      var body = document.createElement('div');

      var title = document.createElement('h3');
      var num = document.createElement('span');
      num.className = 'num';
      num.textContent = '#' + t.id;
      title.appendChild(num);
      title.appendChild(document.createTextNode(t.name));
      body.appendChild(title);

      var desc = document.createElement('p');
      desc.className = 'desc';
      desc.textContent = t.description;
      body.appendChild(desc);

      var guide = document.createElement('p');
      guide.className = 'guide';
      guide.textContent = t.guide;
      body.appendChild(guide);

      var meta = document.createElement('p');
      meta.className = 'meta';
      meta.appendChild(tag(t.grade, gradeClass(t.grade)));
      meta.appendChild(tag(t.kind, ''));
      if (t.hidden) meta.appendChild(tag('Hidden', 'hidden'));
      if (t.missable) meta.appendChild(tag('Missable', 'missable'));
      if (t.guide_unconfirmed) meta.appendChild(tag('Method unconfirmed', 'unconfirmed'));
      body.appendChild(meta);

      var src = document.createElement('p');
      src.className = 'src';
      src.textContent = 'Sources: Planet GTA 6 · Output Lag';
      body.appendChild(src);

      card.appendChild(box);
      card.appendChild(body);
      listEl.appendChild(card);
    });

    updateProgress();
    shownCount.textContent = shown + ' of ' + trophies.length + ' trophies';
    emptyEl.hidden = shown !== 0;
  }

  searchEl.addEventListener('input', render);

  resetBtn.addEventListener('click', function () {
    var anyEarned = Object.keys(earned).length > 0;
    if (!anyEarned) return;
    if (!window.confirm('Clear every ticked trophy? Your saved progress will be lost.')) return;
    earned = {};
    saveEarned();
    render();
  });

  fetch('data/trophies.json')
    .then(function (r) {
      if (!r.ok) throw new Error('trophies.json failed: ' + r.status);
      return r.json();
    })
    .then(function (data) {
      trophies = data.trophies || data;
      render();
    })
    .catch(function (err) {
      listEl.innerHTML = '<p class="loading">Could not load the trophy list. ' +
        'Open this guide from its own folder so data/trophies.json loads.</p>';
      if (window.console) console.error(err);
    });
})();
