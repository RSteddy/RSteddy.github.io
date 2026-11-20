// Table officielle des statistiques de base (Nv. 1) et paliers d'XP par Rang
const rankData = {
  SSS: { baseAtk: 115, baseHp: 120, xpNv2: 2600, xpNv3: 3300 },
  SS:  { baseAtk: 100, baseHp: 110, xpNv2: 2300, xpNv3: 2900 },
  S:   { baseAtk: 85,  baseHp: 100, xpNv2: 1700, xpNv3: 2300 },
  A:   { baseAtk: 70,  baseHp: 90,  xpNv2: 1100, xpNv3: 1700 },
  B:   { baseAtk: 55,  baseHp: 80,  xpNv2: 800,  xpNv3: 1100 },
  C:   { baseAtk: 40,  baseHp: 70,  xpNv2: 500,  xpNv3: 800  }
};

// Chances d'esquive sur 10 selon le rang du personnage
const dodgeChancesOutOf10 = {
  SSS: 6,
  SS:  5,
  S:   4,
  A:   3,
  B:   2,
  C:   1
};

function rollChanceOutOf10(chances) {
  const safeChances = Math.max(0, Math.min(10, chances ?? 0));
  if (safeChances === 0) return false;
  const roll = Math.floor(Math.random() * 10) + 1; // 1 à 10
  return roll <= safeChances;
}

function canDodgeAttack(rank) {
  return rollChanceOutOf10(dodgeChancesOutOf10[rank] ?? 0);
}

function canEnemyDodgeAttack(enemy) {
  return rollChanceOutOf10(enemy?.dodgeChanceOutOf10 ?? 0);
}

function calcStatsForRankLevel(rank, level) {
  const r = rankData[rank];
  return {
    hp: r.baseHp + (level - 1) * 10,
    atk: r.baseAtk + (level - 1) * 5
  };
}

// Tous les personnages liés aux images présentes dans ./asset/ (avec repli si fichier absent)
const characters = {
  // SSS (0.05%) - Uniquement Gojo et Sukuna
  gojo: {
    name: "Satoru Gojo",
    rank: "SSS",
    imgBase: "./asset/gojo",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 100, maxEnergy: 100,
    spellName: "Hollow Purple (Violet)",
    spellCost: 40, spellMult: 1.85
  },
  sukuna: {
    name: "Ryomen Sukuna",
    rank: "SSS",
    imgBase: "./asset/sukuna",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 80, maxEnergy: 80,
    spellName: "Entaille (Dismantle)",
    spellCost: 30, spellMult: 1.75
  },

  // SS (0.15%)
  yuta: {
    name: "Yuta Okkotsu",
    rank: "SS",
    imgBase: "./asset/yuta",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 95, maxEnergy: 95,
    spellName: "Amour Pur",
    spellCost: 35, spellMult: 1.75
  },
  kenjaku: {
    name: "Kenjaku",
    rank: "SS",
    imgBase: "./asset/kenjaku",
    cropPos: "50% 8%",
    owned: false,
    xp: 0,
    energy: 90, maxEnergy: 90,
    spellName: "Tourbillon de Fléaux",
    spellCost: 35, spellMult: 1.7
  },
  jogo: {
    name: "Jogo",
    rank: "SS",
    imgBase: "./asset/jogo",
    fallbackImgBase: "./asset/fleau_shibuya_3",
    cropPos: "50% 12%",
    owned: false,
    xp: 0,
    energy: 85, maxEnergy: 85,
    spellName: "Météore Volcanique",
    spellCost: 30, spellMult: 1.75
  },

  // S (0.9%)
  hanami: {
    name: "Hanami",
    rank: "S",
    imgBase: "./asset/hanami",
    fallbackImgBase: "./asset/fleau_shibuya_2",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 75, maxEnergy: 75,
    spellName: "Forêt Occulte : Racines",
    spellCost: 25, spellMult: 1.65
  },
  toji: {
    name: "Toji Fushiguro",
    rank: "S",
    imgBase: "./asset/toji",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 60, maxEnergy: 60,
    spellName: "Lame de l'Âme Scindée",
    spellCost: 20, spellMult: 1.7
  },
  kashimo: {
    name: "Hajime Kashimo",
    rank: "S",
    imgBase: "./asset/kashimo",
    cropPos: "50% 8%",
    owned: false,
    xp: 0,
    energy: 85, maxEnergy: 85,
    spellName: "Décharge Foudroyante",
    spellCost: 30, spellMult: 1.7
  },
  hakari: {
    name: "Kinji Hakari",
    rank: "S",
    imgBase: "./asset/hakari",
    cropPos: "50% 8%",
    owned: false,
    xp: 0,
    energy: 80, maxEnergy: 80,
    spellName: "Portes du Jackpot",
    spellCost: 25, spellMult: 1.65
  },
  mahito: {
    name: "Mahito",
    rank: "S",
    imgBase: "./asset/mahito",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 80, maxEnergy: 80,
    spellName: "Métamorphose de l'Âme",
    spellCost: 30, spellMult: 1.65
  },
  naoya: {
    name: "Naoya Zenin",
    rank: "S",
    imgBase: "./asset/naoya",
    cropPos: "50% 8%",
    owned: false,
    xp: 0,
    energy: 75, maxEnergy: 75,
    spellName: "Projection : Vitesse 24 FPS",
    spellCost: 25, spellMult: 1.65
  },

  // A (8%)
  yuji: {
    name: "Yuji Itadori",
    rank: "A",
    imgBase: "./asset/yuji",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 50, maxEnergy: 50,
    spellName: "Rayon Noir (Black Flash)",
    spellCost: 20, spellMult: 1.6
  },
  megumi: {
    name: "Megumi Fushiguro",
    rank: "A",
    imgBase: "./asset/megumi",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 65, maxEnergy: 65,
    spellName: "Jardin des Chimères",
    spellCost: 25, spellMult: 1.6
  },
  nanami: {
    name: "Kento Nanami",
    rank: "A",
    imgBase: "./asset/nanami",
    cropPos: "50% 8%",
    owned: false,
    xp: 0,
    energy: 60, maxEnergy: 60,
    spellName: "Ratio : Effondrement",
    spellCost: 25, spellMult: 1.65
  },
  todo: {
    name: "Aoi Todo",
    rank: "A",
    imgBase: "./asset/todo",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 60, maxEnergy: 60,
    spellName: "Boogie Woogie : Frappe",
    spellCost: 20, spellMult: 1.6
  },
  choso: {
    name: "Choso",
    rank: "A",
    imgBase: "./asset/choso",
    cropPos: "50% 8%",
    owned: false,
    xp: 0,
    energy: 70, maxEnergy: 70,
    spellName: "Convergence : Sang Perçant",
    spellCost: 25, spellMult: 1.65
  },

  // B (34%)
  nobara: {
    name: "Nobara Kugisaki",
    rank: "B",
    imgBase: "./asset/nobara",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 55, maxEnergy: 55,
    spellName: "Épingle à Cheveux",
    spellCost: 20, spellMult: 1.55
  },
  maki: {
    name: "Maki Zenin",
    rank: "B",
    imgBase: "./asset/maki",
    cropPos: "50% 8%",
    owned: false,
    xp: 0,
    energy: 50, maxEnergy: 50,
    spellName: "Frappe de la Lance",
    spellCost: 20, spellMult: 1.55
  },
  inumaki: {
    name: "Toge Inumaki",
    rank: "B",
    imgBase: "./asset/inumaki",
    cropPos: "50% 8%",
    owned: false,
    xp: 0,
    energy: 65, maxEnergy: 65,
    spellName: "Parole Occulte : Écrase-toi",
    spellCost: 25, spellMult: 1.6
  },
  panda: {
    name: "Panda",
    rank: "B",
    imgBase: "./asset/panda",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 55, maxEnergy: 55,
    spellName: "Mode Gorille",
    spellCost: 20, spellMult: 1.55
  },

  // C (56.9%)
  miwa: {
    name: "Kasumi Miwa",
    rank: "C",
    imgBase: "./asset/miwa",
    cropPos: "50% 8%",
    owned: false,
    xp: 0,
    energy: 40, maxEnergy: 40,
    spellName: "Nouveau Style : Frappe",
    spellCost: 15, spellMult: 1.45
  },
  mai: {
    name: "Mai Zenin",
    rank: "C",
    imgBase: "./asset/mai",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 40, maxEnergy: 40,
    spellName: "Tir de Précision",
    spellCost: 15, spellMult: 1.45
  },
  mechamaru: {
    name: "Mechamaru",
    rank: "C",
    imgBase: "./asset/mecchamaru",
    cropPos: "50% 15%",
    owned: false,
    xp: 0,
    energy: 50, maxEnergy: 50,
    spellName: "Canon Marionnette",
    spellCost: 15, spellMult: 1.5
  }
};

// Pseudo, connexion et diamants de départ (480 diamants offerts à l'arrivée)
let hasLoggedIn = false;
let userPseudo = "Exorciste";
let userDiamonds = 480;
let activeKey = null;

// 3 niveaux du Mode PvE : seul le Niveau 1 est disponible au départ
const pveLevels = [
  {
    id: "pve-1",
    mode: "pve",
    index: 0,
    name: "PvE - Niveau 1",
    enemyName: "Fœtus de Sukuna",
    imgBase: "./asset/foetus_sukuna",
    fallbackImgBase: "./asset/foetus_sukuna",
    cropPos: "50% 25%",
    ...calcStatsForRankLevel("B", 3),
    dodgeChanceOutOf10: 1,
    winXp: 20,
    winDiamonds: 5,
    desc: "Premier stade du Fœtus de Sukuna."
  },
  {
    id: "pve-2",
    mode: "pve",
    index: 1,
    name: "PvE - Niveau 2",
    enemyName: "Fœtus de Sukuna",
    imgBase: "./asset/foetus_sukuna",
    fallbackImgBase: "./asset/foetus_sukuna",
    cropPos: "50% 25%",
    ...calcStatsForRankLevel("A", 2),
    dodgeChanceOutOf10: 2,
    winXp: 50,
    winDiamonds: 10,
    desc: "L'énergie occulte du Fœtus de Sukuna s'intensifie."
  },
  {
    id: "pve-3",
    mode: "pve",
    index: 2,
    name: "PvE - Niveau 3",
    enemyName: "Fœtus de Sukuna",
    imgBase: "./asset/foetus_sukuna",
    fallbackImgBase: "./asset/foetus_sukuna",
    cropPos: "50% 25%",
    ...calcStatsForRankLevel("S", 1),
    dodgeChanceOutOf10: 3,
    winXp: 75,
    winDiamonds: 20,
    desc: "Le Fœtus de Sukuna déploie toute sa menace actuelle."
  }
];

// Mode Shibuya : 4 secteurs (seul le Secteur 1 est disponible au départ)
const shibuyaSectors = [
  {
    id: "shibuya-1",
    mode: "shibuya",
    index: 0,
    name: "Secteur 1 - Couloirs de Shibuya",
    enemyName: "Locust Plague",
    imgBase: "./asset/fleau_shibuya_1",
    fallbackImgBase: "./asset/foetus_sukuna",
    cropPos: "50% 20%",
    hp: 130,
    atk: 35,
    dodgeChanceOutOf10: 2,
    winXp: 30,
    winDiamonds: 15,
    desc: "Un fléau insectoïde vif et rusé embusqué dans Shibuya."
  },
  {
    id: "shibuya-2",
    mode: "shibuya",
    index: 1,
    name: "Secteur 2 - Rues Envahies",
    enemyName: "Hanami",
    imgBase: "./asset/fleau_shibuya_2",
    fallbackImgBase: "./asset/hanami",
    cropPos: "50% 15%",
    hp: 240,
    atk: 60,
    dodgeChanceOutOf10: 3,
    winXp: 65,
    winDiamonds: 35,
    desc: "Un fléau de grade spécial aux racines tenaces."
  },
  {
    id: "shibuya-3",
    mode: "shibuya",
    index: 2,
    name: "Secteur 3 - Carrefour en Flammes",
    enemyName: "Jogo",
    imgBase: "./asset/fleau_shibuya_3",
    fallbackImgBase: "./asset/jogo",
    cropPos: "50% 12%",
    hp: 380,
    atk: 90,
    dodgeChanceOutOf10: 4,
    winXp: 95,
    winDiamonds: 55,
    desc: "Un fléau volcanique de grade spécial à la puissance explosive."
  },
  {
    id: "shibuya-4",
    mode: "shibuya",
    index: 3,
    name: "Secteur 4 - Cœur de Shibuya",
    enemyName: "Sukuna",
    imgBase: "./asset/fleau_shibuya_4",
    fallbackImgBase: "./asset/sukuna",
    cropPos: "50% 15%",
    hp: 560,
    atk: 120,
    dodgeChanceOutOf10: 5,
    winXp: 130,
    winDiamonds: 120,
    desc: "Le Roi des Fléaux déchaîne sa terreur sur Shibuya."
  }
];

let unlockedPveIndex = 0;
let unlockedShibuyaIndex = 0;

// Sauvegarde & chargement de la progression dans localStorage
const SAVE_STORAGE_KEY = "jjk_battles_save_v1";

function saveProgress() {
  try {
    const charProgress = {};
    Object.keys(characters).forEach(key => {
      charProgress[key] = {
        owned: Boolean(characters[key].owned),
        xp: Number(characters[key].xp) || 0
      };
    });

    const payload = {
      hasLoggedIn: Boolean(hasLoggedIn),
      userPseudo,
      userDiamonds: Number(userDiamonds) || 0,
      activeKey,
      unlockedPveIndex: Number(unlockedPveIndex) || 0,
      unlockedShibuyaIndex: Number(unlockedShibuyaIndex) || 0,
      characters: charProgress
    };

    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // Ignore si le stockage est indisponible
  }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return;

    if (typeof data.hasLoggedIn === "boolean") hasLoggedIn = data.hasLoggedIn;
    if (typeof data.userPseudo === "string" && data.userPseudo.trim()) {
      userPseudo = data.userPseudo.trim();
    }
    if (typeof data.userDiamonds === "number" && !Number.isNaN(data.userDiamonds)) {
      userDiamonds = Math.max(0, data.userDiamonds);
    }
    if (typeof data.unlockedPveIndex === "number" && !Number.isNaN(data.unlockedPveIndex)) {
      unlockedPveIndex = Math.max(0, Math.min(pveLevels.length - 1, data.unlockedPveIndex));
    }
    if (typeof data.unlockedShibuyaIndex === "number" && !Number.isNaN(data.unlockedShibuyaIndex)) {
      unlockedShibuyaIndex = Math.max(0, Math.min(shibuyaSectors.length - 1, data.unlockedShibuyaIndex));
    }

    if (data.characters && typeof data.characters === "object") {
      Object.keys(characters).forEach(key => {
        const savedChar = data.characters[key];
        if (savedChar && typeof savedChar === "object") {
          characters[key].owned = Boolean(savedChar.owned);
          characters[key].xp = typeof savedChar.xp === "number" && !Number.isNaN(savedChar.xp)
            ? Math.max(0, savedChar.xp)
            : 0;
        }
      });
    }

    if (typeof data.activeKey === "string" && characters[data.activeKey] && characters[data.activeKey].owned) {
      activeKey = data.activeKey;
    } else {
      const firstOwned = Object.keys(characters).find(k => characters[k].owned);
      activeKey = firstOwned || null;
    }
  } catch (e) {
    // Ignore si les données sauvegardées sont corrompues
  }
}

function resetAllProgress() {
  localStorage.removeItem(SAVE_STORAGE_KEY);

  hasLoggedIn = false;
  userPseudo = "Exorciste";
  userDiamonds = 480;
  activeKey = null;
  unlockedPveIndex = 0;
  unlockedShibuyaIndex = 0;

  Object.keys(characters).forEach(key => {
    characters[key].owned = false;
    characters[key].xp = 0;
  });

  const resultBox = document.getElementById('summon-result');
  if (resultBox) {
    resultBox.style.display = 'none';
    resultBox.classList.remove('reveal-anim');
  }

  if (pseudoInput) {
    pseudoInput.value = "";
  }

  openPseudoOverlay(false);
  updateTopBarUI();
  renderCollection();
  updateHomeUI();
  navigateTo('home');
}

function applyImageCrop(imgElement, cropPos = "50% 15%") {
  if (!imgElement) return;
  imgElement.style.setProperty("--img-pos", cropPos);
  imgElement.classList.add("crop-custom");
}

function setAvatarImage(
  imgElement,
  imgBase,
  errorElement = null,
  pathElement = null,
  cropPos = "50% 15%",
  fallbackImgBase = null
) {
  if (!imgElement) return;
  applyImageCrop(imgElement, cropPos);

  const extensions = [".png", ".jpg", ".jpeg", ".webp"];
  const basesToTry = [imgBase];
  if (fallbackImgBase && fallbackImgBase !== imgBase) {
    basesToTry.push(fallbackImgBase);
  }

  let baseIdx = 0;
  let extIdx = 0;

  if (errorElement) errorElement.style.display = "none";
  imgElement.style.display = "block";

  imgElement.onload = () => {
    if (errorElement) errorElement.style.display = "none";
  };

  imgElement.onerror = () => {
    extIdx += 1;
    if (extIdx < extensions.length) {
      imgElement.src = `${basesToTry[baseIdx]}${extensions[extIdx]}`;
      return;
    }

    baseIdx += 1;
    extIdx = 0;
    if (baseIdx < basesToTry.length) {
      imgElement.src = `${basesToTry[baseIdx]}${extensions[extIdx]}`;
      return;
    }

    if (errorElement) {
      errorElement.style.display = "flex";
      if (pathElement) {
        pathElement.textContent = `${imgBase}.png / .jpg / .webp`;
      }
    }
  };

  imgElement.src = `${basesToTry[baseIdx]}${extensions[extIdx]}`;
}

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

function updateTopBarUI() {
  const pseudoEl = document.getElementById('user-pseudo');
  const diamondDisplay = document.getElementById('user-diamonds');
  if (pseudoEl) pseudoEl.textContent = userPseudo;
  if (diamondDisplay) diamondDisplay.textContent = userDiamonds;
}

let activeBattleStats = { hp: 80, maxHp: 80, energy: 50, maxEnergy: 50, atk: 55 };
let currentEnemy = null;
let enemyHp = 100;
let enemyMaxHp = 100;
let battleFinished = false;
let isPlayerTurn = true;
let enemyTurnTimeoutId = null;
let physicalAttackCount = 0;
const REQUIRED_PHYS_FOR_ULT = 3;

const pages = {
  home: document.getElementById('page-home'),
  pveMenu: document.getElementById('page-pve-menu'),
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

function showWelcomeMessage(pseudo) {
  const banner = document.getElementById('welcome-banner');
  const textEl = document.getElementById('welcome-text');
  if (!banner || !textEl) return;

  textEl.innerHTML = `🎉 Bienvenue <strong>${pseudo}</strong> ! Tu commences sans personnage, voici <strong class="diamond-highlight">480 💎</strong> pour invoquer ton premier exorciste !`;
  banner.style.display = 'flex';
}

// FENÊTRE MODALE D'INFORMATION / CONFIRMATION
const infoModalOverlay = document.getElementById('info-modal-overlay');
const infoModalBadge = document.getElementById('info-modal-badge');
const infoModalTitle = document.getElementById('info-modal-title');
const infoModalDesc = document.getElementById('info-modal-desc');
const btnInfoPrimary = document.getElementById('btn-info-primary');
const btnInfoSecondary = document.getElementById('btn-info-secondary');

let onInfoPrimaryClick = null;

function closeInfoModal() {
  if (infoModalOverlay) infoModalOverlay.classList.remove('active');
  onInfoPrimaryClick = null;
}

function openInfoModal({
  badge = "INFO",
  badgeType = "info",
  title = "Information",
  message = "",
  primaryText = "OK",
  primaryClass = "btn-modal-continue",
  secondaryText = "Fermer",
  showSecondary = true,
  onPrimary = null
}) {
  if (!infoModalOverlay) return;

  if (infoModalBadge) {
    infoModalBadge.textContent = badge;
    infoModalBadge.className = `battle-modal-status ${badgeType}`;
  }
  if (infoModalTitle) infoModalTitle.textContent = title;
  if (infoModalDesc) infoModalDesc.innerHTML = message;

  if (btnInfoPrimary) {
    btnInfoPrimary.textContent = primaryText;
    btnInfoPrimary.className = `action-btn ${primaryClass}`;
  }

  if (btnInfoSecondary) {
    btnInfoSecondary.textContent = secondaryText;
    btnInfoSecondary.style.display = showSecondary ? "block" : "none";
  }

  onInfoPrimaryClick = onPrimary;
  infoModalOverlay.classList.add('active');
}

if (btnInfoPrimary) {
  btnInfoPrimary.addEventListener('click', () => {
    const callback = onInfoPrimaryClick;
    closeInfoModal();
    if (typeof callback === "function") {
      callback();
    }
  });
}

if (btnInfoSecondary) {
  btnInfoSecondary.addEventListener('click', closeInfoModal);
}

// ÉCRAN PSEUDO (initial ou modification via bouton ✏️)
const setupOverlay = document.getElementById('setup-overlay');
const pseudoInput = document.getElementById('pseudo-input');
const btnConfirmPseudo = document.getElementById('btn-confirm-pseudo');
const btnCancelPseudo = document.getElementById('btn-cancel-pseudo');
const btnEditPseudo = document.getElementById('btn-edit-pseudo');

let isEditingExistingPseudo = false;

function openPseudoOverlay(editingExisting = true) {
  isEditingExistingPseudo = editingExisting;
  const titleEl = document.querySelector('.setup-title');
  const descEl = document.querySelector('.setup-desc');

  if (titleEl) {
    titleEl.textContent = editingExisting ? "Modifier ton pseudo" : "Choisis ton pseudo";
  }
  if (descEl) {
    descEl.textContent = editingExisting
      ? "Choisis le nouveau nom de ton exorciste."
      : "Entre le nom de ton exorciste pour démarrer l'aventure.";
  }
  if (pseudoInput) {
    pseudoInput.value = editingExisting ? userPseudo : "";
  }
  if (btnCancelPseudo) {
    btnCancelPseudo.style.display = editingExisting ? "block" : "none";
  }
  if (setupOverlay) {
    setupOverlay.classList.add('active');
  }
  if (pseudoInput) {
    setTimeout(() => pseudoInput.focus(), 50);
  }
}

function confirmPseudo() {
  const raw = pseudoInput ? pseudoInput.value.trim() : "";
  userPseudo = raw || "Exorciste";
  hasLoggedIn = true;
  updateTopBarUI();
  saveProgress();
  if (setupOverlay) setupOverlay.classList.remove('active');

  if (!isEditingExistingPseudo) {
    showWelcomeMessage(userPseudo);
  }
}

if (btnEditPseudo) {
  btnEditPseudo.addEventListener('click', () => openPseudoOverlay(true));
}

if (btnCancelPseudo) {
  btnCancelPseudo.addEventListener('click', () => {
    if (setupOverlay) setupOverlay.classList.remove('active');
  });
}

if (btnConfirmPseudo) {
  btnConfirmPseudo.addEventListener('click', confirmPseudo);
}

if (pseudoInput) {
  pseudoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      confirmPseudo();
    }
  });
}

// BOUTON RÉINITIALISER LA SAUVEGARDE (icône poubelle en haut)
const btnResetSave = document.getElementById('btn-reset-save');
if (btnResetSave) {
  btnResetSave.addEventListener('click', () => {
    openInfoModal({
      badge: "ATTENTION",
      badgeType: "warning",
      title: "Réinitialiser la sauvegarde ?",
      message:
        "Toute ta progression sera effacée (personnages, XP, niveaux débloqués, diamants et pseudo). Tu repartiras à zéro avec <strong>480 💎</strong>.",
      primaryText: "🗑️ Oui, réinitialiser",
      primaryClass: "btn-modal-home",
      secondaryText: "Annuler",
      onPrimary: resetAllProgress
    });
  });
}

const btnCloseWelcome = document.getElementById('btn-close-welcome');
if (btnCloseWelcome) {
  btnCloseWelcome.addEventListener('click', () => {
    const banner = document.getElementById('welcome-banner');
    if (banner) banner.style.display = 'none';
  });
}

// Fenêtre de fin de combat (Combattre à nouveau / Continuer / Menu principal)
const battleEndModal = document.getElementById('battle-end-modal');
const btnModalReplay = document.getElementById('btn-modal-replay');
const btnModalContinue = document.getElementById('btn-modal-continue');
const btnModalHome = document.getElementById('btn-modal-home');

let nextMissionAfterBattle = null;

function getNextMission(mission) {
  if (!mission) return null;
  if (mission.mode === "pve") {
    const nextLevel = pveLevels[mission.index + 1];
    if (nextLevel && nextLevel.index <= unlockedPveIndex) {
      return nextLevel;
    }
  }
  if (mission.mode === "shibuya") {
    const nextSector = shibuyaSectors[mission.index + 1];
    if (nextSector && nextSector.index <= unlockedShibuyaIndex) {
      return nextSector;
    }
  }
  return null;
}

function closeBattleModal() {
  if (battleEndModal) battleEndModal.classList.remove('active');
}

function openBattleModal(isVictory, xpGained, diamondsGained, leveledUpTo, nextMission) {
  if (!battleEndModal) return;

  nextMissionAfterBattle = nextMission || null;

  const statusEl = document.getElementById('battle-modal-status');
  const titleEl = document.getElementById('battle-modal-title');
  const rewardsEl = document.getElementById('battle-modal-rewards');
  const levelupEl = document.getElementById('battle-modal-levelup');

  if (statusEl) {
    statusEl.textContent = isVictory ? "VICTOIRE" : "DÉFAITE";
    statusEl.className = `battle-modal-status ${!isVictory ? "defeat" : ""}`;
  }
  if (titleEl) {
    titleEl.textContent = isVictory ? "Combat remporté !" : "Tu as été vaincu...";
  }
  if (rewardsEl) {
    rewardsEl.textContent = `+${xpGained} XP • +${diamondsGained} 💎`;
  }
  if (levelupEl) {
    const messages = [];
    if (leveledUpTo) messages.push(`🎉 Niveau ${leveledUpTo} atteint !`);
    if (isVictory && nextMissionAfterBattle) {
      messages.push(`🔓 ${nextMissionAfterBattle.name} débloqué !`);
    }
    levelupEl.textContent = messages.join(" • ");
  }

  if (btnModalContinue) {
    btnModalContinue.textContent = nextMissionAfterBattle
      ? "➡️ Continuer (Niveau suivant)"
      : "➡️ Continuer";
  }

  battleEndModal.classList.add('active');
}

if (btnModalReplay) {
  btnModalReplay.addEventListener('click', () => {
    closeBattleModal();
    if (currentEnemy) {
      startBattle(currentEnemy);
    } else {
      navigateTo('home');
    }
  });
}

if (btnModalContinue) {
  btnModalContinue.addEventListener('click', () => {
    closeBattleModal();
    if (nextMissionAfterBattle) {
      startBattle(nextMissionAfterBattle);
    } else if (currentEnemy) {
      startBattle(currentEnemy);
    } else {
      navigateTo('home');
    }
  });
}

if (btnModalHome) {
  btnModalHome.addEventListener('click', () => {
    closeBattleModal();
    navigateTo('home');
  });
}

// Navigation bas
if (navItems.home) navItems.home.addEventListener('click', () => navigateTo('home'));
if (navItems.collection) navItems.collection.addEventListener('click', () => navigateTo('collection'));
if (navItems.invocation) navItems.invocation.addEventListener('click', () => navigateTo('invocation'));

const btnGoSummonEmpty = document.getElementById('btn-go-summon-empty');
if (btnGoSummonEmpty) {
  btnGoSummonEmpty.addEventListener('click', () => navigateTo('invocation'));
}

function canEnterBattle() {
  if (!activeKey || !characters[activeKey] || !characters[activeKey].owned) {
    openInfoModal({
      badge: "GUIDE",
      badgeType: "info",
      title: "Il te faut un exorciste !",
      message:
        "Tu n'as encore aucun personnage. Va dans l'onglet <strong>Invocation</strong> avec tes <strong class=\"diamond-highlight\">480 💎</strong> pour invoquer ton premier personnage avant de lancer un combat.",
      primaryText: "✨ Aller à l'Invocation",
      primaryClass: "btn-modal-replay",
      secondaryText: "Rester ici",
      onPrimary: () => navigateTo('invocation')
    });
    return false;
  }
  return true;
}

// Mode PvE : ouvre le menu des 3 niveaux
document.getElementById('btn-goto-pve').addEventListener('click', () => {
  if (!canEnterBattle()) return;
  renderPveMissions();
  navigateTo('pveMenu');
});

// Mode Shibuya
document.getElementById('btn-goto-shibuya').addEventListener('click', () => {
  if (!canEnterBattle()) return;
  renderShibuyaMissions();
  navigateTo('shibuyaMenu');
});

document.getElementById('btn-back-home-pve').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-back-home-shibuya').addEventListener('click', () => navigateTo('home'));

// Cartes de missions épurées (sans afficher les stats avant le combat)
function renderPveMissions() {
  const container = document.getElementById('pve-missions-container');
  container.innerHTML = '';
  pveLevels.forEach(level => {
    const isUnlocked = level.index <= unlockedPveIndex;
    container.appendChild(createMissionCard(level, isUnlocked, "le niveau précédent"));
  });
}

function renderShibuyaMissions() {
  const container = document.getElementById('shibuya-missions-container');
  container.innerHTML = '';
  shibuyaSectors.forEach(sector => {
    const isUnlocked = sector.index <= unlockedShibuyaIndex;
    container.appendChild(createMissionCard(sector, isUnlocked, "le secteur précédent"));
  });
}

function createMissionCard(missionData, isUnlocked, prevLabel) {
  const card = document.createElement('div');
  card.className = `mission-card ${!isUnlocked ? 'locked-mission' : ''}`;

  const statusText = isUnlocked ? missionData.desc : `🔒 Termine ${prevLabel} pour débloquer.`;
  const btnLabel = isUnlocked ? "Affronter" : "🔒 Verrouillé";

  card.innerHTML = `
    <div>
      <strong style="font-size:0.85em; color:#f8fafc;">${missionData.name}</strong>
      <p style="font-size:0.7em; color:#94a3b8; margin: 4px 0 0 0;">${statusText}</p>
    </div>
    <button type="button" class="mission-btn ${!isUnlocked ? 'locked' : ''}">${btnLabel}</button>
  `;

  card.addEventListener('click', () => {
    if (!isUnlocked) {
      openInfoModal({
        badge: "VERROUILLÉ",
        badgeType: "info",
        title: "Étape verrouillée",
        message: `Termine d'abord <strong>${prevLabel}</strong> pour débloquer <strong>${missionData.name}</strong>.`,
        primaryText: "Compris",
        primaryClass: "btn-modal-replay",
        showSecondary: false
      });
      return;
    }
    startBattle(missionData);
  });

  return card;
}

// Fonction de tirage au sort basée sur des taux resserrés (total = 100%)
function rollSummon() {
  const rand = Math.random() * 100;
  let cumulative = 0;

  const dropRates = {
    SSS: 0.05,
    SS:  0.15,
    S:   0.9,
    A:   8.0,
    B:   34.0,
    C:   56.9
  };

  let selectedRank = "C";
  for (const rank in dropRates) {
    cumulative += dropRates[rank];
    if (rand <= cumulative) {
      selectedRank = rank;
      break;
    }
  }

  const availableKeys = Object.keys(characters).filter(k => characters[k].rank === selectedRank);

  if (availableKeys.length > 0) {
    const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
    return { key: randomKey, char: characters[randomKey] };
  }

  const fallbackKeys = Object.keys(characters);
  const fallbackKey = fallbackKeys[Math.floor(Math.random() * fallbackKeys.length)];
  return { key: fallbackKey, char: characters[fallbackKey] };
}

// Logique d'invocation avec les taux de drop, animation et diamants bleus
const btnSummon = document.getElementById('btn-summon');
if (btnSummon) {
  btnSummon.addEventListener('click', () => {
    const cost = 150;
    if (userDiamonds < cost) {
      openInfoModal({
        badge: "DIAMANTS INSUFFISANTS",
        badgeType: "warning",
        title: "Plus assez de diamants bleus !",
        message: `Une invocation coûte <strong>${cost} 💎</strong> et il te reste <strong class="diamond-highlight">${userDiamonds} 💎</strong>. Lance des combats en <strong>Mode PvE</strong> ou à <strong>Shibuya</strong> pour récupérer d'autres diamants bleus !`,
        primaryText: "🏠 Aller à l'Accueil",
        primaryClass: "btn-modal-replay",
        secondaryText: "Rester ici",
        onPrimary: () => navigateTo('home')
      });
      return;
    }

    userDiamonds -= cost;
    updateTopBarUI();

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

      const { key: wonKey, char: wonChar } = rollSummon();
      const wasNew = !wonChar.owned;
      wonChar.owned = true;
      wonChar.xp += 100;

      if (!activeKey) {
        activeKey = wonKey;
      }

      saveProgress();

      const rewardImg = document.getElementById('summon-reward-img');
      const rewardName = document.getElementById('summon-reward-name');

      setAvatarImage(rewardImg, wonChar.imgBase, null, null, wonChar.cropPos, wonChar.fallbackImgBase);
      const statusTag = wasNew ? "NOUVEAU !" : "DOUBLON";
      rewardName.innerHTML = `🎉 ${statusTag} <span style="color:#eab308;">${wonChar.name} (Rang ${wonChar.rank})</span> ! (+100 XP bonus)`;

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
    const isEquipped = key === activeKey && char.owned;

    const card = document.createElement('div');
    card.className = `col-card ${isEquipped ? 'active-char' : ''} ${!char.owned ? 'locked-char' : ''}`;
    card.innerHTML = `
      ${isEquipped ? '<div class="badge-equipped">INCARNÉ</div>' : (!char.owned ? '<div class="badge-locked">VERROUILLÉ</div>' : '')}
      <div class="col-avatar">
        <img id="col-img-${key}" alt="${char.name}">
      </div>
      <div class="col-name">${char.name}</div>
      <div class="col-rank">Rang ${char.rank}</div>
      <div class="col-lvl">${char.owned ? `Nv. ${stats.level} (${char.xp} XP)` : 'Non obtenu'}</div>
    `;

    card.addEventListener('click', () => {
      if (!char.owned) {
        openInfoModal({
          badge: "NON OBTENU",
          badgeType: "info",
          title: `${char.name} est verrouillé`,
          message:
            "Tu n'as pas encore obtenu ce personnage. Tente ta chance dans l'onglet <strong>Invocation</strong> pour le débloquer !",
          primaryText: "✨ Aller à l'Invocation",
          primaryClass: "btn-modal-replay",
          secondaryText: "Fermer",
          onPrimary: () => navigateTo('invocation')
        });
        return;
      }
      equipCharacter(key);
    });
    container.appendChild(card);

    setAvatarImage(
      document.getElementById(`col-img-${key}`),
      char.imgBase,
      null,
      null,
      char.cropPos,
      char.fallbackImgBase
    );
  });
}

function updateHomeUI() {
  const noCharBox = document.getElementById('no-char-home');
  const heroBox = document.getElementById('hero-card-container');

  if (!activeKey || !characters[activeKey] || !characters[activeKey].owned) {
    if (noCharBox) noCharBox.style.display = 'block';
    if (heroBox) heroBox.style.display = 'none';
    return;
  }

  if (noCharBox) noCharBox.style.display = 'none';
  if (heroBox) heroBox.style.display = 'flex';

  const char = characters[activeKey];
  const stats = getCharacterStats(char);

  document.getElementById('home-name').textContent = char.name;
  setAvatarImage(
    document.getElementById('home-img'),
    char.imgBase,
    document.getElementById('home-img-error'),
    document.getElementById('home-img-path'),
    char.cropPos,
    char.fallbackImgBase
  );
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
  if (!characters[key] || !characters[key].owned) return;
  activeKey = key;
  saveProgress();
  updateHomeUI();
  renderCollection();
  navigateTo('home');
}

function updateUltimateButtonUI() {
  const countEl = document.getElementById('phys-atk-count');
  const sortBtn = document.getElementById('btn-atk-sort');
  const char = activeKey ? characters[activeKey] : null;
  const spellLabel = char ? char.spellName : "Sort Spécial";

  if (countEl) {
    countEl.textContent = Math.min(physicalAttackCount, REQUIRED_PHYS_FOR_ULT);
  }

  if (!sortBtn) return;
  if (physicalAttackCount < REQUIRED_PHYS_FOR_ULT) {
    sortBtn.textContent = `⚡ ${spellLabel} (${physicalAttackCount}/${REQUIRED_PHYS_FOR_ULT} phys.)`;
    sortBtn.classList.add('btn-spell-locked');
  } else {
    sortBtn.textContent = `⚡ ${spellLabel} (PRÊT)`;
    sortBtn.classList.remove('btn-spell-locked');
  }
}

function setBattleActionsDisabled(disabled) {
  const physBtn = document.getElementById('btn-atk-physique');
  const sortBtn = document.getElementById('btn-atk-sort');
  if (physBtn) physBtn.disabled = disabled;
  if (sortBtn) sortBtn.disabled = disabled;
}

function clearEnemyTurnTimeout() {
  if (enemyTurnTimeoutId !== null) {
    clearTimeout(enemyTurnTimeoutId);
    enemyTurnTimeoutId = null;
  }
}

function syncBattleControlsUI() {
  updateUltimateButtonUI();
  const locked = battleFinished || enemyHp <= 0 || !isPlayerTurn;
  setBattleActionsDisabled(locked);
}

function startBattle(mission) {
  if (!canEnterBattle()) return;

  clearEnemyTurnTimeout();
  closeBattleModal();
  currentEnemy = mission;
  enemyHp = mission.hp;
  enemyMaxHp = mission.hp;
  battleFinished = false;
  isPlayerTurn = true;
  physicalAttackCount = 0;

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
  setAvatarImage(
    document.getElementById('enemy-avatar'),
    mission.imgBase,
    null,
    null,
    mission.cropPos,
    mission.fallbackImgBase
  );
  document.getElementById('enemy-hp').textContent = enemyHp;
  document.getElementById('enemy-max-hp').textContent = enemyMaxHp;

  document.getElementById('battle-player-name').textContent = `${char.name} (Nv.${stats.level})`;
  setAvatarImage(
    document.getElementById('battle-player-img'),
    char.imgBase,
    null,
    null,
    char.cropPos,
    char.fallbackImgBase
  );
  document.getElementById('battle-player-hp').textContent = activeBattleStats.hp;
  document.getElementById('battle-player-energy').textContent = activeBattleStats.energy;

  syncBattleControlsUI();

  document.getElementById('enemy-hp-bar').style.width = '100%';
  document.getElementById('player-hp-bar').style.width = '100%';
  document.getElementById('player-energy-bar').style.width = '100%';
  document.getElementById('btn-end-battle').style.display = 'none';

  const logs = document.getElementById('logs');
  const dodgeRate = dodgeChancesOutOf10[char.rank] ?? 0;
  const enemyDodgeRate = currentEnemy.dodgeChanceOutOf10 ?? 0;
  logs.innerHTML = `<p style="color:#8b5cf6;">🚀 Affrontement contre ${mission.enemyName} ! (Esquive : Toi ${dodgeRate}/10 • Ennemi ${enemyDodgeRate}/10)</p>`;

  navigateTo('battle');
}

function addLog(msg) {
  const logs = document.getElementById('logs');
  logs.innerHTML += `<p style="margin: 4px 0;">${msg}</p>`;
  logs.scrollTop = logs.scrollHeight;
}

// Récompenses de fin de combat + déblocage progressif PvE / Shibuya + sauvegarde + fenêtre à 3 choix
function endBattle(isVictory) {
  if (battleFinished) return;
  battleFinished = true;
  isPlayerTurn = false;
  clearEnemyTurnTimeout();
  syncBattleControlsUI();

  const char = characters[activeKey];
  const oldStats = getCharacterStats(char);

  const xpGained = isVictory ? (currentEnemy?.winXp ?? 20) : 8;
  const diamondsGained = isVictory ? (currentEnemy?.winDiamonds ?? 5) : 1;

  char.xp += xpGained;
  userDiamonds += diamondsGained;
  updateTopBarUI();

  if (isVictory && currentEnemy?.mode === "pve") {
    const nextIdx = currentEnemy.index + 1;
    if (nextIdx < pveLevels.length && nextIdx > unlockedPveIndex) {
      unlockedPveIndex = nextIdx;
      renderPveMissions();
    }
  }

  if (isVictory && currentEnemy?.mode === "shibuya") {
    const nextIdx = currentEnemy.index + 1;
    if (nextIdx < shibuyaSectors.length && nextIdx > unlockedShibuyaIndex) {
      unlockedShibuyaIndex = nextIdx;
      renderShibuyaMissions();
    }
  }

  saveProgress();

  const newStats = getCharacterStats(char);
  const leveledUpTo = newStats.level > oldStats.level ? newStats.level : null;
  const nextMission = getNextMission(currentEnemy);

  if (isVictory) {
    addLog(`🏆 <strong style="color:#22c55e">Victoire ! +${xpGained} XP et +${diamondsGained} 💎 gagnés !</strong>`);
  } else {
    addLog(`💀 <strong style="color:#ef4444">Défaite... +${xpGained} XP et +${diamondsGained} 💎 de consolation.</strong>`);
  }

  if (leveledUpTo) {
    addLog(`🎉 <strong style="color:#eab308">LEVEL UP ! ${char.name} passe Nv. ${leveledUpTo} (+5 ATK, +10 PV) !</strong>`);
  }

  updateHomeUI();
  renderCollection();

  openBattleModal(isVictory, xpGained, diamondsGained, leveledUpTo, nextMission);
}

function enemyTurn() {
  enemyTurnTimeoutId = null;
  if (enemyHp <= 0 || battleFinished) {
    syncBattleControlsUI();
    return;
  }

  const char = characters[activeKey];
  if (char && canDodgeAttack(char.rank)) {
    const chances = dodgeChancesOutOf10[char.rank];
    addLog(`💨 <strong style="color:#38bdf8">${char.name}</strong> (Rang ${char.rank}) esquive l'attaque de <strong>${currentEnemy.enemyName}</strong> ! (${chances}/10)`);
    isPlayerTurn = true;
    syncBattleControlsUI();
    return;
  }

  let enemyDmg = Math.floor(Math.random() * 5) + currentEnemy.atk - 5;
  enemyDmg = Math.max(5, enemyDmg);
  activeBattleStats.hp = Math.max(0, activeBattleStats.hp - enemyDmg);

  document.getElementById('battle-player-hp').textContent = activeBattleStats.hp;
  document.getElementById('player-hp-bar').style.width = (activeBattleStats.hp / activeBattleStats.maxHp * 100) + '%';

  addLog(`💢 <strong>${currentEnemy.enemyName}</strong> riposte et inflige <span style="color:#ef4444">${enemyDmg}</span> dégâts !`);

  if (activeBattleStats.hp === 0) {
    addLog(`❌ <strong style="color:#ef4444">Vous avez été vaincu...</strong>`);
    endBattle(false);
    return;
  }

  isPlayerTurn = true;
  syncBattleControlsUI();
}

// Attaque Physique
document.getElementById('btn-atk-physique').addEventListener('click', () => {
  if (enemyHp <= 0 || battleFinished || !isPlayerTurn) return;

  isPlayerTurn = false;
  clearEnemyTurnTimeout();

  const char = characters[activeKey];
  physicalAttackCount += 1;
  syncBattleControlsUI();

  if (canEnemyDodgeAttack(currentEnemy)) {
    const enemyChances = currentEnemy.dodgeChanceOutOf10 ?? 0;
    addLog(`💨 <strong style="color:#f59e0b">${currentEnemy.enemyName}</strong> esquive l'attaque de <strong>${char.name}</strong> ! (${enemyChances}/10) • (${physicalAttackCount}/3 physiques)`);
    enemyTurnTimeoutId = setTimeout(enemyTurn, 600);
    return;
  }

  let dmg = activeBattleStats.atk + Math.floor(Math.random() * 8);
  enemyHp = Math.max(0, enemyHp - dmg);

  document.getElementById('enemy-hp').textContent = enemyHp;
  document.getElementById('enemy-hp-bar').style.width = (enemyHp / enemyMaxHp * 100) + '%';

  addLog(`👊 <strong>${char.name}</strong> inflige <span style="color:#ef4444">${dmg}</span> dégâts ! (${physicalAttackCount}/3 physiques)`);

  if (enemyHp === 0) {
    endBattle(true);
  } else {
    enemyTurnTimeoutId = setTimeout(enemyTurn, 600);
  }
});

// Sort Spécial / Ultime (disponible uniquement après 3 attaques physiques)
document.getElementById('btn-atk-sort').addEventListener('click', () => {
  if (enemyHp <= 0 || battleFinished || !isPlayerTurn) return;

  if (physicalAttackCount < REQUIRED_PHYS_FOR_ULT) {
    const remaining = REQUIRED_PHYS_FOR_ULT - physicalAttackCount;
    addLog(`🔒 Ultime verrouillé : lance encore <strong>${remaining}</strong> attaque(s) physique(s) (${physicalAttackCount}/${REQUIRED_PHYS_FOR_ULT}).`);
    return;
  }

  const char = characters[activeKey];

  if (activeBattleStats.energy < char.spellCost) {
    addLog("⚠️ Pas assez d'Énergie Occulte !");
    return;
  }

  isPlayerTurn = false;
  clearEnemyTurnTimeout();
  activeBattleStats.energy -= char.spellCost;
  document.getElementById('battle-player-energy').textContent = activeBattleStats.energy;
  document.getElementById('player-energy-bar').style.width = (activeBattleStats.energy / activeBattleStats.maxEnergy * 100) + '%';
  syncBattleControlsUI();

  if (canEnemyDodgeAttack(currentEnemy)) {
    const enemyChances = currentEnemy.dodgeChanceOutOf10 ?? 0;
    addLog(`💨 <strong style="color:#f59e0b">${currentEnemy.enemyName}</strong> esquive <strong>${char.spellName}</strong> ! (${enemyChances}/10)`);
    enemyTurnTimeoutId = setTimeout(enemyTurn, 600);
    return;
  }

  let dmg = Math.floor(activeBattleStats.atk * char.spellMult) + Math.floor(Math.random() * 10);
  enemyHp = Math.max(0, enemyHp - dmg);

  document.getElementById('enemy-hp').textContent = enemyHp;
  document.getElementById('enemy-hp-bar').style.width = (enemyHp / enemyMaxHp * 100) + '%';

  addLog(`⚡ <strong>${char.spellName} !</strong> <span style="color:#ef4444">${dmg}</span> dégâts !`);

  if (enemyHp === 0) {
    endBattle(true);
  } else {
    enemyTurnTimeoutId = setTimeout(enemyTurn, 600);
  }
});

// Initialisation
loadProgress();
if (hasLoggedIn && setupOverlay) {
  setupOverlay.classList.remove('active');
} else {
  openPseudoOverlay(false);
}
updateTopBarUI();
renderCollection();
updateHomeUI();
