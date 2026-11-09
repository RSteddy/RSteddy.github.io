const characters = {
  yuji: {
    name: "Yuji Itadori",
    rank: "Rang B+",
    img: "yuji.png",
    hp: 120, maxHp: 120,
    energy: 50, maxEnergy: 50,
    atk: 14,
    spellName: "Rayon Noir (Black Flash)",
    spellCost: 20, spellDmg: 35
  },
  gojo: {
    name: "Satoru Gojo",
    rank: "Rang S+",
    img: "gojo.png",
    hp: 100, maxHp: 100,
    energy: 100, maxEnergy: 100,
    atk: 10,
    spellName: "Hollow Purple (Violet)",
    spellCost: 40, spellDmg: 55
  },
  sukuna: {
    name: "Ryomen Sukuna",
    rank: "Rang S+",
    img: "ryomen_sukuna.png",
    hp: 150, maxHp: 150,
    energy: 70, maxEnergy: 70,
    atk: 18,
    spellName: "Dissection (Cleave)",
    spellCost: 30, spellDmg: 45
  },
  sukuna_meguna: {
    name: "Sukuna (Megumi)",
    rank: "Rang S+",
    img: "sukuna(meguna).png",
    hp: 160, maxHp: 160,
    energy: 80, maxEnergy: 80,
    atk: 19,
    spellName: "Autel Démoniaque",
    spellCost: 35, spellDmg: 50
  },
  sukuna_yujina: {
    name: "Sukuna (Yuji)",
    rank: "Rang S+",
    img: "sukuna(yujina).png",
    hp: 140, maxHp: 140,
    energy: 65, maxEnergy: 65,
    atk: 17,
    spellName: "Entaille (Dismantle)",
    spellCost: 25, spellDmg: 40
  }
};

let activeKey = "yuji";
let activePlayer = { ...characters[activeKey] };
let enemyHp = 150;
const enemyMaxHp = 150;

const pages = {
  home: document.getElementById('page-home'),
  battle: document.getElementById('page-battle'),
  collection: document.getElementById('page-collection')
};

const navItems = {
  home: document.getElementById('nav-home'),
  collection: document.getElementById('nav-collection')
};

function navigateTo(targetPage) {
  Object.keys(pages).forEach(key => {
    if (pages[key]) pages[key].classList.remove('active');
  });
  Object.keys(navItems).forEach(key => {
    if (navItems[key]) navItems[key].classList.remove('active');
  });

  if (pages[targetPage]) pages[targetPage].classList.add('active');
  if (navItems[targetPage]) navItems[targetPage].classList.add('active');
}

if (navItems.home) navItems.home.addEventListener('click', () => navigateTo('home'));
if (navItems.collection) navItems.collection.addEventListener('click', () => navigateTo('collection'));

const btnFight = document.getElementById('btn-start-fight');
if (btnFight) {
  btnFight.addEventListener('click', () => {
    resetBattle();
    navigateTo('battle');
  });
}

function renderCollection() {
  const container = document.getElementById('collection-container');
  if (!container) return;
  container.innerHTML = '';

  Object.keys(characters).forEach(key => {
    const char = characters[key];
    const isEquipped = key === activeKey;
    
    const card = document.createElement('div');
    card.className = `col-card ${isEquipped ? 'active-char' : ''}`;
    card.innerHTML = `
      ${isEquipped ? '<div class="badge-equipped">INCARNÉ</div>' : ''}
      <div class="col-avatar">
        <img src="${char.img}" alt="${char.name}">
      </div>
      <div class="col-name">${char.name}</div>
      <div class="col-rank">${char.rank}</div>
    `;

    card.addEventListener('click', () => {
      equipCharacter(key);
    });

    container.appendChild(card);
  });
}

function equipCharacter(key) {
  activeKey = key;
  activePlayer = { ...characters[key] };

  const hName = document.getElementById('home-name');
  const hImg = document.getElementById('home-img');
  const hRank = document.getElementById('home-rank');
  const hHp = document.getElementById('home-hp');
  const hAtk = document.getElementById('home-atk');

  if (hName) hName.textContent = activePlayer.name;
  if (hImg) hImg.src = activePlayer.img;
  if (hRank) hRank.textContent = activePlayer.rank;
  if (hHp) hHp.textContent = activePlayer.hp;
  if (hAtk) hAtk.textContent = activePlayer.atk;

  renderCollection();
  navigateTo('home');
}

function resetBattle() {
  enemyHp = 150;
  activePlayer.hp = activePlayer.maxHp;
  activePlayer.energy = activePlayer.maxEnergy;

  const bName = document.getElementById('battle-player-name');
  const bImg = document.getElementById('battle-player-img');
  const bHp = document.getElementById('battle-player-hp');
  const bEnergy = document.getElementById('battle-player-energy');
  const bSort = document.getElementById('btn-atk-sort');
  const eHp = document.getElementById('enemy-hp');

  if (bName) bName.textContent = activePlayer.name;
  if (bImg) bImg.src = activePlayer.img;
  if (bHp) bHp.textContent = activePlayer.hp;
  if (bEnergy) bEnergy.textContent = activePlayer.energy;
  if (bSort) bSort.textContent = `⚡ ${activePlayer.spellName}`;
  if (eHp) eHp.textContent = enemyHp;

  const eBar = document.getElementById('enemy-hp-bar');
  const pBar = document.getElementById('player-hp-bar');
  const pEBar = document.getElementById('player-energy-bar');

  if (eBar) eBar.style.width = '100%';
  if (pBar) pBar.style.width = '100%';
  if (pEBar) pEBar.style.width = '100%';

  const logs = document.getElementById('logs');
  if (logs) logs.innerHTML = `<p style="color:#8b5cf6;">🚀 Le combat commence !</p>`;
}

function addLog(msg) {
  const logs = document.getElementById('logs');
  if (logs) {
    logs.innerHTML += `<p>${msg}</p>`;
    logs.scrollTop = logs.scrollHeight;
  }
}

const btnAtkPhys = document.getElementById('btn-atk-physique');
if (btnAtkPhys) {
  btnAtkPhys.addEventListener('click', () => {
    if (enemyHp <= 0 || activePlayer.hp <= 0) return;

    let dmg = activePlayer.atk + Math.floor(Math.random() * 5);
    enemyHp = Math.max(0, enemyHp - dmg);

    const eHp = document.getElementById('enemy-hp');
    const eBar = document.getElementById('enemy-hp-bar');
    if (eHp) eHp.textContent = enemyHp;
    if (eBar) eBar.style.width = (enemyHp / enemyMaxHp * 100) + '%';

    addLog(`👊 <strong>${activePlayer.name}</strong> inflige <span style="color:#ef4444">${dmg}</span> dégâts !`);
    
    if (enemyHp === 0) {
      addLog(`🏆 <strong style="color:#22c55e">Victoire ! Le fléau est vaincu !</strong>`);
    }
  });
}

const btnAtkSort = document.getElementById('btn-atk-sort');
if (btnAtkSort) {
  btnAtkSort.addEventListener('click', () => {
    if (enemyHp <= 0 || activePlayer.hp <= 0) return;

    if (activePlayer.energy < activePlayer.spellCost) {
      addLog("⚠️ Pas assez d'Énergie Occulte !");
      return;
    }

    activePlayer.energy -= activePlayer.spellCost;
    const bEnergy = document.getElementById('battle-player-energy');
    const pEBar = document.getElementById('player-energy-bar');

    if (bEnergy) bEnergy.textContent = activePlayer.energy;
    if (pEBar) pEBar.style.width = (activePlayer.energy / activePlayer.maxEnergy * 100) + '%';

    let dmg = activePlayer.spellDmg + Math.floor(Math.random() * 8);
    enemyHp = Math.max(0, enemyHp - dmg);

    const eHp = document.getElementById('enemy-hp');
    const eBar = document.getElementById('enemy-hp-bar');
    if (eHp) eHp.textContent = enemyHp;
    if (eBar) eBar.style.width = (enemyHp / enemyMaxHp * 100) + '%';

    addLog(`⚡ <strong>${activePlayer.spellName} !</strong> <span style="color:#ef4444">${dmg}</span> dégâts !`);

    if (enemyHp === 0) {
      addLog(`🏆 <strong style="color:#22c55e">Victoire ! Le fléau est vaincu !</strong>`);
    }
  });
}

// Lancement au démarrage
renderCollection();
equipCharacter('yuji');
