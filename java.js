// Table officielle des statistiques de base (Nv. 1) et paliers d'XP par Rang
const rankData = {
  SS: { baseAtk: 100, baseHp: 110, xpNv2: 2300, xpNv3: 2900 },
  S:  { baseAtk: 85,  baseHp: 100, xpNv2: 1700, xpNv3: 2300 },
  A:  { baseAtk: 70,  baseHp: 90,  xpNv2: 1100, xpNv3: 1700 },
  B:  { baseAtk: 55,  baseHp: 80,  xpNv2: 800,  xpNv3: 1100 },
  C:  { baseAtk: 40,  baseHp: 70,  xpNv2: 500,  xpNv3: 800  }
};

// Les personnages disponibles répartis par rang
const characters = {
  gojo: {
    name: "Satoru Gojo",
    rank: "SS",
    img: "asset/gojo.png",
    xp: 0,
    energy: 100, maxEnergy: 100,
    spellName: "Hollow Purple (Violet)",
    spellCost: 40, spellMult: 1.8
  },
  sukuna: {
    name: "Ryomen Sukuna",
    rank: "SS",
    img: "asset/sukuna.png",
    xp: 0,
    energy: 70, maxEnergy: 70,
    spellName: "Entaille (Dismantle)",
    spellCost: 30, spellMult: 1.7
  },
  yuji: {
    name: "Yuji Itadori",
    rank: "B",
    img: "asset/yuji.png",
    xp: 0,
    energy: 50, maxEnergy: 50,
    spellName: "Rayon Noir (Black Flash)",
    spellCost: 20, spellMult: 1.6
  }
};

// Monnaie du joueur (Diamants bleus)
let userDiamonds = 1250;

// 1. Mode Farm PvE : Ennemis stables pour farmer tranquillement
const farmEnemies = [
  {
    name: "Fléau de Base (Entraînement)",
    enemyName: "Fléau Mineur",
    img: "asset/yuji.png",
    hp: 100,
    atk: 20,
    desc: "Un fléau stable pour enchaîner les combats."
  }
];

// 2. Mode Shibuya : Difficulté croissante
const shibuyaSectors = [
  {
    name: "Secteur 1 - Entrée du Métro",
    enemyName: "Esprit Vengeur (Grade 4)",
    img: "asset/yuji.png",
    hp: 120,
    atk: 25,
    desc: "Premier niveau de Shibuya."
  },
  {
    name: "Secteur 2 - Quai de la Ligne",
    enemyName: "Fléau Féroce (Grade 3)",
    img: "asset/sukuna.png",
    hp: 220,
    atk: 45,
    desc: "La difficulté monte d'un cran."
  },
  {
    name: "Secteur 3 - Centre de Shibuya",
    enemyName: "Fléau de Grade Spécial",
    img: "asset/gojo.png",
    hp: 400,
    atk: 75,
    desc: "Un affrontement redoutable."
  }
];

function getCharacterStats(char) {
  const r = rankData[char.rank];
  let level = 1;
  let nextXp = r.xpNv2;

  if (char.xp >= r.xpNv3) {
    level = 3;
    nextXp = "MAX";
  } else if (char.xp >= r.xpNv2) {
    level = 2;
    nextXp = r.xpNv3;
  }

  const currentAtk = r.baseAtk + (level - 1) * 5;
  const currentMaxHp = r.baseHp + (level - 1) * 10;

  return { level, atk: currentAtk, maxHp: currentMaxHp, nextXp };
}

let activeKey = "yuji";
let activeBattleStats = { hp: 80, maxHp: 80, energy: 50, maxEnergy: 50, atk: 55 };
let currentEnemy = null;
let enemyHp = 100;
let enemyMaxHp = 100;
let battleFinished = false;

const pages = {
  home: document.getElementById('page-home'),
  farmMenu: document.getElementById('page-farm-menu'),
  shibuyaMenu: document.getElementById('page-shibuya-menu'),
  battle: document.getElementById('page-battle'),
  collection: document.getElementById('page-collection'),
  invocation: document.getElementById('page-invocation')
};

const navItems = {
  home: document.getElementById('nav-home'),
  collection: document.getElementById('nav-collection'),
  invocation: document.getElementById('nav-invocation')
};

function navigateTo(targetPage) {
  Object.keys(pages).forEach(key => {
    if (pages[key]) pages[key].classList.remove('active');
  });
  Object.keys(navItems).forEach(key => {
    if (navItems[key]) navItems[key].classList.remove('active');
  });

  if (pages[targetPage]) pages[targetPage].classList.add('active');
  if (navItems[targetPage]) {
    navItems[targetPage].classList.add('active');
  }
}

// Navigation bas
if (navItems.home) navItems.home.addEventListener('click', () => navigateTo('home'));
if (navItems.collection) navItems.collection.addEventListener('click', () => navigateTo('collection'));
if (navItems.invocation) navItems.invocation.addEventListener('click', () => navigateTo('invocation'));

// Clics depuis l'accueil vers les modes
document.getElementById('btn-goto-farm').addEventListener('click', () => {
  renderFarmMissions();
  navigateTo('farmMenu');
});

document.getElementById('btn-goto-shibuya').addEventListener('click', () => {
  renderShibuyaMissions();
  navigateTo('shibuyaMenu');
});

document.getElementById('btn-back-home-farm').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-back-home-shibuya').addEventListener('click', () => navigateTo('home'));

// Cartes de missions épurées (sans afficher les stats avant le combat)
function renderFarmMissions() {
  const container = document.getElementById('farm-missions-container');
  container.innerHTML = '';
  farmEnemies.forEach(enemy => {
    container.appendChild(createCleanMissionCard(enemy, startBattle));
  });
}

function renderShibuyaMissions() {
  const container = document.getElementById('shibuya-missions-container');
  container.innerHTML = '';
  shibuyaSectors.forEach(sector => {
    container.appendChild(createCleanMissionCard(sector, startBattle));
  });
}

function createCleanMissionCard(missionData, onClickCallback) {
  const card = document.createElement('div');
  card.className = "mission-card";
  card.innerHTML = `
    <div>
      <strong style="font-size:0.85em; color:#f8fafc;">${missionData.name}</strong>
      <p style="font-size:0.7em; color:#94a3b8; margin: 4px 0 0 0;">${missionData.desc}</p>
    </div>
    <button style="background:#8b5cf6; color:white; border:none; padding:8px 12px; border-radius:6px; font-weight:bold; cursor:pointer;">Affronter</button>
  `;
  card.addEventListener('click', () => onClickCallback(missionData));
  return card;
}

// Fonction de tirage au sort basée sur tes taux de drop précis
function rollSummon() {
  const rand = Math.random() * 100; // Nombre entre 0 et 100
  let cumulative = 0;
  
  // Taux : SS: 0.5%, S: 5.5%, A: 18%, B: 36%, C: 40%[cite: 2]
  const dropRates = { SS: 0.5, S: 5.5, A: 18, B: 36, C: 40 };

  let selectedRank = "B"; // Fallback par défaut
  for (let rank in dropRates) {
    cumulative += dropRates[rank];
    if (rand <= cumulative) {
      selectedRank = rank;
      break;
    }
  }

  // Filtrer les personnages correspondants au rang tiré
  const availableChars = Object.keys(characters).filter(k => characters[k].rank === selectedRank);

  if (availableChars.length > 0) {
    const randomKey = availableChars[Math.floor(Math.random() * availableChars.length)];
    return characters[randomKey];
  } else {
    // Si aucun perso de ce rang n'est encore créé, on prend Yuji par défaut
    return characters['yuji'];
  }
}

// Logique d'invocation avec les taux de drop, animation et diamants bleus
const btnSummon = document.getElementById('btn-summon');
if (btnSummon) {
  btnSummon.addEventListener('click', () => {
    const cost = 150;
    if (userDiamonds < cost) {
      alert("⚠️ Pas assez de diamants bleus !");
      return;
    }

    userDiamonds -= cost;
    const diamondDisplay = document.getElementById('user-diamonds');
    if (diamondDisplay) diamondDisplay.textContent = userDiamonds;

    const resultBox = document.getElementById('summon-result');
    resultBox.style.display = 'none';
    resultBox.classList.remove('reveal-anim');

    const summonCard = document.getElementById('summon-portal-card');
    summonCard.classList.add('summoning');
    btnSummon.disabled = true;
    btnSummon.textContent = "✨ Incantation en cours...";

    setTimeout(() => {
      summonCard.classList.remove('summoning');
      btnSummon.disabled = false;
      btnSummon.textContent = "✨ Invoquer (1x)";

      // Tirage avec les taux de drop exacts
      const wonChar = rollSummon();
      wonChar.xp += 100; // Bonus d'XP pour le personnage obtenu

      const rewardImg = document.getElementById('summon-reward-img');
      const rewardName = document.getElementById('summon-reward-name');
      
      rewardImg.src = wonChar.img;
      rewardName.innerHTML = `🎉 Vous avez obtenu <span style="color:#eab308;">${wonChar.name} (Rang ${wonChar.rank})</span> ! (+100 XP bonus)`;
      
      resultBox.style.display = 'block';
      resultBox.classList.add('reveal-anim');

      updateHomeUI();
      renderCollection();
    }, 800);
  });
}

function renderCollection() {
  const container = document.getElementById('collection-container');
  if (!container) return;
  container.innerHTML = '';

  Object.keys(characters).forEach(key => {
    const char = characters[key];
    const stats = getCharacterStats(char);
    const isEquipped = key === activeKey;
    
    const card = document.createElement('div');
    card.className = `col-card ${isEquipped ? 'active-char' : ''}`;
    card.innerHTML = `
      ${isEquipped ? '<div class="badge-equipped">INCARNÉ</div>' : ''}
      <div class="col-avatar">
        <img src="${char.img}" alt="${char.name}">
      </div>
      <div class="col-name">${char.name}</div>
      <div class="col-rank">Rang ${char.rank}</div>
      <div class="col-lvl">Nv. ${stats.level} (${char.xp} XP)</div>
    `;

    card.addEventListener('click', () => equipCharacter(key));
    container.appendChild(card);
  });
}

function updateHomeUI() {
  const char = characters[activeKey];
  const stats = getCharacterStats(char);

  document.getElementById('home-name').textContent = char.name;
  document.getElementById('home-img').src = char.img;
  document.getElementById('home-rank').textContent = `Rang ${char.rank}`;
  document.getElementById('home-lvl').textContent = `Nv. ${stats.level}`;
  document.getElementById('home-hp').textContent = stats.maxHp;
  document.getElementById('home-atk').textContent = stats.atk;

  const xpText = document.getElementById('home-xp-text');
  const xpBar = document.getElementById('home-xp-bar');

  if (stats.nextXp === "MAX") {
    xpText.textContent = `${char.xp} XP (NIVEAU MAX)`;
    xpBar.style.width = "100%";
  } else {
    xpText.textContent = `${char.xp} / ${stats.nextXp} XP`;
    const percent = Math.min(100, (char.xp / stats.nextXp) * 100);
    xpBar.style.width = `${percent}%`;
  }
}

function equipCharacter(key) {
  activeKey = key;
  updateHomeUI();
  renderCollection();
  navigateTo('home');
}

function startBattle(mission) {
  currentEnemy = mission;
  enemyHp = mission.hp;
  enemyMaxHp = mission.hp;
  battleFinished = false;

  const char = characters[activeKey];
  const stats = getCharacterStats(char);

  activeBattleStats = {
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    energy: char.maxEnergy,
    maxEnergy: char.maxEnergy,
    atk: stats.atk
  };

  document.getElementById('battle-title').textContent = `Combat : ${mission.name}`;
  document.getElementById('enemy-name').textContent = mission.enemyName;
  document.getElementById('enemy-avatar').src = mission.img;
  document.getElementById('enemy-hp').textContent = enemyHp;
  document.getElementById('enemy-max-hp').textContent = enemyMaxHp;

  document.getElementById('battle-player-name').textContent = `${char.name} (Nv.${stats.level})`;
  document.getElementById('battle-player-img').src = char.img;
  document.getElementById('battle-player-hp').textContent = activeBattleStats.hp;
  document.getElementById('battle-player-energy').textContent = activeBattleStats.energy;
  document.getElementById('btn-atk-sort').textContent = `⚡ ${char.spellName}`;

  document.getElementById('enemy-hp-bar').style.width = '100%';
  document.getElementById('player-hp-bar').style.width = '100%';
  document.getElementById('player-energy-bar').style.width = '100%';
  document.getElementById('btn-end-battle').style.display = 'none';

  const logs = document.getElementById('logs');
  logs.innerHTML = `<p style="color:#8b5cf6;">🚀 Affrontement contre ${mission.enemyName} !</p>`;

  navigateTo('battle');
}

function addLog(msg) {
  const logs = document.getElementById('logs');
  logs.innerHTML += `<p style="margin: 4px 0;">${msg}</p>`;
  logs.scrollTop = logs.scrollHeight;
}

// Gain d'XP : 20 XP si victoire, 5 XP si défaite
function endBattle(isVictory) {
  if (battleFinished) return;
  battleFinished = true;

  const char = characters[activeKey];
  const oldStats = getCharacterStats(char);
  
  const xpGained = isVictory ? 20 : 5;
  char.xp += xpGained;

  const newStats = getCharacterStats(char);

  if (isVictory) {
    addLog(`🏆 <strong style="color:#22c55e">Victoire ! +${xpGained} XP gagnés !</strong>`);
  } else {
    addLog(`💀 <strong style="color:#ef4444">Défaite... +${xpGained} XP de consolation.</strong>`);
  }

  if (newStats.level > oldStats.level) {
    addLog(`🎉 <strong style="color:#eab308">LEVEL UP ! ${char.name} passe Nv. ${newStats.level} (+5 ATK, +10 PV) !</strong>`);
  }

  updateHomeUI();
  renderCollection();

  const endBtn = document.getElementById('btn-end-battle');
  endBtn.style.display = 'block';
  endBtn.onclick = () => navigateTo('home');
}

function enemyTurn() {
  if (enemyHp <= 0 || battleFinished) return;

  let enemyDmg = Math.floor(Math.random() * 5) + currentEnemy.atk - 5;
  enemyDmg = Math.max(5, enemyDmg);
  activeBattleStats.hp = Math.max(0, activeBattleStats.hp - enemyDmg);

  document.getElementById('battle-player-hp').textContent = activeBattleStats.hp;
  document.getElementById('player-hp-bar').style.width = (activeBattleStats.hp / activeBattleStats.maxHp * 100) + '%';

  addLog(`💢 <strong>${currentEnemy.enemyName}</strong> riposte et inflige <span style="color:#ef4444">${enemyDmg}</span> dégâts !`);

  if (activeBattleStats.hp === 0) {
    addLog(`❌ <strong style="color:#ef4444">Vous avez été vaincu...</strong>`);
    endBattle(false);
  }
}

// Attaque Physique
document.getElementById('btn-atk-physique').addEventListener('click', () => {
  if (enemyHp <= 0 || battleFinished) return;

  const char = characters[activeKey];
  let dmg = activeBattleStats.atk + Math.floor(Math.random() * 8);
  enemyHp = Math.max(0, enemyHp - dmg);

  document.getElementById('enemy-hp').textContent = enemyHp;
  document.getElementById('enemy-hp-bar').style.width = (enemyHp / enemyMaxHp * 100) + '%';

  addLog(`👊 <strong>${char.name}</strong> inflige <span style="color:#ef4444">${dmg}</span> dégâts !`);
  
  if (enemyHp === 0) {
    endBattle(true);
  } else {
    setTimeout(enemyTurn, 600);
  }
});

// Sort Spécial
document.getElementById('btn-atk-sort').addEventListener('click', () => {
  if (enemyHp <= 0 || battleFinished) return;

  const char = characters[activeKey];

  if (activeBattleStats.energy < char.spellCost) {
    addLog("⚠️ Pas assez d'Énergie Occulte !");
    return;
  }

  activeBattleStats.energy -= char.spellCost;
  document.getElementById('battle-player-energy').textContent = activeBattleStats.energy;
  document.getElementById('player-energy-bar').style.width = (activeBattleStats.energy / activeBattleStats.maxEnergy * 100) + '%';

  let dmg = Math.floor(activeBattleStats.atk * char.spellMult) + Math.floor(Math.random() * 10);
  enemyHp = Math.max(0, enemyHp - dmg);

  document.getElementById('enemy-hp').textContent = enemyHp;
  document.getElementById('enemy-hp-bar').style.width = (enemyHp / enemyMaxHp * 100) + '%';

  addLog(`⚡ <strong>${char.spellName} !</strong> <span style="color:#ef4444">${dmg}</span> dégâts !`);

  if (enemyHp === 0) {
    endBattle(true);
  } else {
    setTimeout(enemyTurn, 600);
  }
});

// Initialisation
renderCollection();
equipCharacter('yuji');
