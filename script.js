// ==========================================
// CONFIGURATION & ETAT DU JEU
// ==========================================
const CONFIG = {
    canvasWidth: 480,
    canvasHeight: 800,
    fps: 60,
    playerSpeed: 7,
    baseFireRate: 12, // tirs par seconde
};

const GameState = {
    current: 'MENU', // MENU, MISSION_SELECT, EQUIPMENT, UPGRADES, STATS, SETTINGS, PLAYING, PAUSED, UPGRADE_CHOICE, GAME_OVER, VICTORY
    score: 0,
    currency: 0,
    exp: 0,
    level: 1,
    missionIndex: 0,
    waveIndex: 0,
    activeWeapon: 'pulse',
    settings: {
        volume: 0.8,
        gfx: 'high'
    },
    stats: {
        totalKills: 0,
        bossesDefeated: 0,
        missionsCompleted: 0,
        timePlayed: 0
    },
    permanentUpgrades: {
        dmg: 0,
        hp: 0,
        crit: 0,
        income: 0
    }
};

// ==========================================
// DONNÉES DES ARMES
// ==========================================
const WEAPONS = {
    pulse: { id: 'pulse', name: 'Fusil à Impulsions', dmg: 12, fireRate: 10, speed: 14, count: 1, spread: 0, unlocked: true, cost: 0, desc: 'Arme standard ORION. Précise et fiable.' },
    plasma: { id: 'plasma', name: 'Canon à Plasma', dmg: 28, fireRate: 5, speed: 9, count: 1, spread: 0, unlocked: false, cost: 150, desc: 'Projectiles lourds infligeant de gros dégâts par impact.' },
    dual: { id: 'dual', name: 'Double Canon', dmg: 10, fireRate: 14, speed: 15, count: 2, spread: 0.15, unlocked: false, cost: 300, desc: 'Tire deux faisceaux simultanés pour couvrir plus de terrain.' },
    railgun: { id: 'railgun', name: 'Railgun', dmg: 75, fireRate: 2, speed: 22, count: 1, spread: 0, unlocked: false, cost: 600, desc: 'Rayon perforant ultra-rapide à haute intensité énergétique.' },
    drones: { id: 'drones', name: 'Drones de Défense', dmg: 8, fireRate: 18, speed: 12, count: 3, spread: 0.35, unlocked: false, cost: 1000, desc: 'Essaim de micro-projectiles automatisés.' },
    orb: { id: 'orb', name: 'Orbe Électrique', dmg: 40, fireRate: 4, speed: 7, count: 1, spread: 0, unlocked: false, cost: 1500, desc: 'Orbe énergétique instable libérant des arcs électriques.' }
};

// ==========================================
// DONNÉES DES ENNEMIS (8 ARCHÉTYPES)
// ==========================================
const ENEMY_TYPES = {
    scout: { name: 'Éclaireur', hp: 20, speed: 3.2, size: 14, color: '#00f3ff', score: 15, exp: 10, type: 'scout' },
    brute: { name: 'Brute', hp: 90, speed: 1.2, size: 26, color: '#ff2a5f', score: 50, exp: 35, type: 'brute' },
    shooter: { name: 'Tireur', hp: 35, speed: 2.0, size: 18, color: '#f39c12', score: 40, exp: 25, type: 'shooter' },
    stalker: { name: 'Harceleur', hp: 25, speed: 3.8, size: 15, color: '#9b59b6', score: 45, exp: 30, type: 'stalker' },
    armored: { name: 'Blindé', hp: 150, speed: 0.9, size: 28, color: '#3498db', score: 80, exp: 50, type: 'armored' },
    parasite: { name: 'Parasite', hp: 10, speed: 4.5, size: 10, color: '#2ecc71', score: 10, exp: 5, type: 'parasite' },
    artificer: { name: 'Artificier', hp: 50, speed: 1.6, size: 20, color: '#e74c3c', score: 60, exp: 40, type: 'artificer' },
    elite: { name: 'Élite ORION Corrompu', hp: 300, speed: 1.8, size: 32, color: '#e67e22', score: 200, exp: 150, type: 'elite' }
};

// ==========================================
// DONNÉES DES BOSS
// ==========================================
const BOSS_TYPES = [
    { name: 'GARDIEN NEXUS-1', hp: 1200, speed: 1.5, size: 45, color: '#ff2a5f', mission: 0 },
    { name: 'COLOSSE DES PROFONDEURS', hp: 2200, speed: 1.2, size: 52, color: '#9b59b6', mission: 1 },
    { name: 'NÉMISIS PRIME', hp: 3500, speed: 1.8, size: 55, color: '#e74c3c', mission: 2 },
    { name: 'SPECIMEN ALPHA-0', hp: 5000, speed: 2.0, size: 60, color: '#f39c12', mission: 3 },
    { name: 'LE SEIGNEUR DES FAILLES', hp: 7500, speed: 2.2, size: 65, color: '#00f3ff', mission: 4 }
];

// ==========================================
// DONNÉES DES MISSIONS (5 MISSIONS)
// ==========================================
const MISSIONS = [
    { id: 0, name: 'Mission 1 — Avant-poste Helios', env: 'industriel', waves: 4, desc: 'Défense de la plateforme industrielle contre des éclaireurs égarés.' },
    { id: 1, name: 'Mission 2 — Les tunnels d’Aster', env: 'souterrain', waves: 5, desc: 'Incursion dans les conduits miniers profonds infestés de parasites.' },
    { id: 2, name: 'Mission 3 — Station Némésis', env: 'spatial', waves: 6, desc: 'Reprise de la station orbitale face à des unités blindées.' },
    { id: 3, name: 'Mission 4 — Le laboratoire oublié', env: 'labo', waves: 7, desc: 'Zone de quarantaine corrompue par des entités expérimentales.' },
    { id: 4, name: 'Mission 5 — La faille originelle', env: 'faille', waves: 8, desc: 'Affrontement final au cœur de la source dimensionnelle.' }
];

// ==========================================
// DONNÉES DES AMÉLIORATIONS ROGUELITE
// ==========================================
const UPGRADE_POOL = [
    { id: 'dmg', name: 'Surcharge Énergétique', desc: '+25% de dégâts pour toutes les armes.', rarity: 'common', apply: p => p.dmgMultiplier += 0.25 },
    { id: 'rate', name: 'Cadence Accélérée', desc: '+20% de vitesse de tir.', rarity: 'common', apply: p => p.fireRateMultiplier += 0.20 },
    { id: 'proj', name: 'Faisceau Prismatique', desc: '+1 projectile par salve.', rarity: 'epic', apply: p => p.extraProjectiles += 1 },
    { id: 'hp', name: 'Nanorepurgation', desc: 'Restaure 50% de santé et augmente max HP.', rarity: 'rare', apply: p => { p.hp = Math.min(p.maxHp, p.hp + p.maxHp * 0.5); } },
    { id: 'speed', name: 'Propulsion Quantique', desc: '+20% de vitesse de déplacement.', rarity: 'common', apply: p => p.speed *= 1.2 },
    { id: 'crit', name: 'Calibrage Critique', desc: '+15% de chances de coups critiques (x2 dégâts).', rarity: 'rare', apply: p => p.critChance += 0.15 },
    { id: 'shield', name: 'Bouclier Réactif', desc: 'Génère un bouclier absorbant une attaque.', rarity: 'legendary', apply: p => p.shield = true }
];

// ==========================================
// AUDIO SYNTHÉTISEUR (WEB AUDIO API)
// ==========================================
class SoundSystem {
    constructor() {
        this.ctx = null;
    }
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    playTone(freq, type, duration, vol = 0.1) {
        if (!this.ctx || GameState.settings.volume <= 0) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(vol * GameState.settings.volume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
    }
    shoot() { this.playTone(520, 'square', 0.08, 0.05); }
    hit() { this.playTone(180, 'sawtooth', 0.05, 0.08); }
    explosion() { this.playTone(90, 'sawtooth', 0.3, 0.15); }
    upgrade() { this.playTone(660, 'sine', 0.2, 0.1); }
    bossAlert() { this.playTone(120, 'square', 0.8, 0.2); }
}
const audio = new SoundSystem();

// ==========================================
// GESTIONNAIRE DE SAUVEGARDE (LOCALSTORAGE)
// ==========================================
const SaveManager = {
    saveKey: 'ECHOES_LAST_STAND_SAVE_V1',
    save() {
        const data = {
            currency: GameState.currency,
            unlockedWeapons: Object.keys(WEAPONS).filter(k => WEAPONS[k].unlocked),
            permanentUpgrades: GameState.permanentUpgrades,
            stats: GameState.stats,
            unlockedMissions: GameState.missionIndex
        };
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(data));
        } catch(e) {}
    },
    load() {
        try {
            const raw = localStorage.getItem(this.saveKey);
            if (raw) {
                const data = JSON.parse(raw);
                GameState.currency = data.currency || 0;
                GameState.permanentUpgrades = data.permanentUpgrades || { dmg: 0, hp: 0, crit: 0, income: 0 };
                GameState.stats = data.stats || GameState.stats;
                if (data.unlockedWeapons) {
                    data.unlockedWeapons.forEach(id => { if (WEAPONS[id]) WEAPONS[id].unlocked = true; });
                }
            }
        } catch(e) {
            this.reset();
        }
    },
    reset() {
        localStorage.removeItem(this.saveKey);
        location.reload();
    }
};

// ==========================================
// MOTEUR DU JEU & ENTITÉS
// ==========================================
let canvas, ctx;
let player = {};
let enemies = [];
let projectiles = [];
let particles = [];
let boss = null;
let waveTimer = 0;
let enemiesToSpawn = 0;
let spawnInterval = 60;
let spawnCounter = 0;
let isBossWave = false;
let touchX = null;
let keys = {};

function initGameEngine() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Contrôles Clavier
    window.addEventListener('keydown', e => { keys[e.code] = true; if (e.code === 'Escape') togglePause(); });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    // Contrôles Tactiles / Souris
    canvas.addEventListener('pointerdown', handlePointer);
    canvas.addEventListener('pointermove', handlePointer);
    canvas.addEventListener('pointerup', () => { touchX = null; });

    // Boutons UI
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            audio.init();
            const action = e.currentTarget.getAttribute('data-action');
            handleAction(action);
        });
    });

    // Sauvegarde & Paramètres UI
    SaveManager.load();
    document.getElementById('volume-slider').addEventListener('input', e => {
        GameState.settings.volume = e.target.value / 100;
        document.getElementById('vol-val').innerText = e.target.value + '%';
    });
    document.getElementById('gfx-select').addEventListener('change', e => {
        GameState.settings.gfx = e.target.value;
    });

    requestAnimationFrame(mainLoop);
}

function resizeCanvas() {
    canvas.width = CONFIG.canvasWidth;
    canvas.height = CONFIG.canvasHeight;
}

function handlePointer(e) {
    if (GameState.current !== 'PLAYING') return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    touchX = (e.clientX - rect.left) * scaleX;
}

// ==========================================
// GESTION DES ACTIONS UI
// ==========================================
function handleAction(action) {
    switch(action) {
        case 'start-mission-select':
            showScreen('mission-select-screen');
            buildMissionList();
            break;
        case 'open-equipment':
            showScreen('equipment-screen');
            buildWeaponList();
            break;
        case 'open-upgrades':
            showScreen('upgrades-screen');
            buildPermUpgradeList();
            break;
        case 'open-stats':
            showScreen('stats-screen');
            buildStatsContent();
            break;
        case 'open-settings':
            showScreen('settings-screen');
            break;
        case 'back-to-menu':
            showScreen('main-menu');
            break;
        case 'resume-game':
            togglePause();
            break;
        case 'restart-game':
            startMission(GameState.missionIndex);
            break;
        case 'quit-to-menu':
            GameState.current = 'MENU';
            showScreen('main-menu');
            break;
        case 'next-mission':
            if (GameState.missionIndex < MISSIONS.length - 1) {
                startMission(GameState.missionIndex + 1);
            } else {
                showScreen('main-menu');
            }
            break;
        case 'reset-data':
            if (confirm('Voulez-vous vraiment réinitialiser toute la progression ?')) {
                SaveManager.reset();
            }
            break;
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(screenId);
    if (target) target.classList.remove('hidden');
}

// ==========================================
// CONSTRUCTEURS DE LISTES UI
// ==========================================
function buildMissionList() {
    const list = document.getElementById('mission-list');
    list.innerHTML = '';
    MISSIONS.forEach((m, idx) => {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.innerHTML = `<div class="card-title">${m.name}</div><div class="card-desc">${m.desc}</div>`;
        card.onclick = () => { startMission(idx); };
        list.appendChild(card);
    });
}

function buildWeaponList() {
    const list = document.getElementById('weapon-list');
    list.innerHTML = '';
    Object.values(WEAPONS).forEach(w => {
        const card = document.createElement('div');
        card.className = `card-item ${GameState.activeWeapon === w.id ? 'selected' : ''}`;
        let status = w.unlocked ? (GameState.activeWeapon === w.id ? 'ÉQUIPÉ' : 'ÉQUIPER') : `DÉBLOQUER (${w.cost} ₳)`;
        card.innerHTML = `<div class="card-title">${w.name} - [${status}]</div><div class="card-desc">${w.desc}</div>`;
        card.onclick = () => {
            if (w.unlocked) {
                GameState.activeWeapon = w.id;
                buildWeaponList();
            } else if (GameState.currency >= w.cost) {
                GameState.currency -= w.cost;
                w.unlocked = true;
                GameState.activeWeapon = w.id;
                SaveManager.save();
                buildWeaponList();
            }
        };
        list.appendChild(card);
    });
}

function buildPermUpgradeList() {
    const list = document.getElementById('perm-upgrade-list');
    document.getElementById('perm-currency').innerText = GameState.currency;
    list.innerHTML = '';
    const upgrades = [
        { id: 'dmg', name: 'Amplificateur de Puissance (+10% Dégâts)', cost: 100 },
        { id: 'hp', name: 'Châssis Renforcé (+25 Max HP)', cost: 100 },
        { id: 'crit', name: 'Module Critique (+5% Critique)', cost: 150 },
        { id: 'income', name: 'Extracteur de Crédits (+20% Récolte)', cost: 200 }
    ];
    upgrades.forEach(u => {
        const lvl = GameState.permanentUpgrades[u.id];
        const cost = u.cost * (lvl + 1);
        const card = document.createElement('div');
        card.className = 'card-item';
        card.innerHTML = `<div class="card-title">${u.name} (Niv. ${lvl})</div><div class="card-desc">Coût : ${cost} ₳</div>`;
        card.onclick = () => {
            if (GameState.currency >= cost) {
                GameState.currency -= cost;
                GameState.permanentUpgrades[u.id]++;
                SaveManager.save();
                buildPermUpgradeList();
            }
        };
        list.appendChild(card);
    });
}

function buildStatsContent() {
    const content = document.getElementById('stats-content');
    content.innerHTML = `
        Éliminations Totales : ${GameState.stats.totalKills}<br>
        Boss Vaincus : ${GameState.stats.bossesDefeated}<br>
        Missions Terminées : ${GameState.stats.missionsCompleted}<br>
        Crédits Actuels : ${GameState.currency} ₳
    `;
}

// ==========================================
// LANCEMENT ET GESTION DES MISSIONS
// ==========================================
function startMission(missionIdx) {
    audio.init();
    GameState.missionIndex = missionIdx;
    GameState.waveIndex = 0;
    GameState.score = 0;
    GameState.exp = 0;
    GameState.level = 1;

    const hpBonus = GameState.permanentUpgrades.hp * 25;
    player = {
        x: CONFIG.canvasWidth / 2,
        y: CONFIG.canvasHeight - 80,
        size: 20,
        maxHp: 100 + hpBonus,
        hp: 100 + hpBonus,
        speed: CONFIG.playerSpeed,
        dmgMultiplier: 1 + (GameState.permanentUpgrades.dmg * 0.1),
        fireRateMultiplier: 1,
        extraProjectiles: 0,
        critChance: 0.1 + (GameState.permanentUpgrades.crit * 0.05),
        shield: false,
        shootCooldown: 0
    };

    enemies = [];
    projectiles = [];
    particles = [];
    boss = null;

    GameState.current = 'PLAYING';
    showScreen('hud');
    startNextWave();
}

function startNextWave() {
    const mission = MISSIONS[GameState.missionIndex];
    if (GameState.waveIndex >= mission.waves) {
        triggerBossSpawn();
        return;
    }
    GameState.waveIndex++;
    document.getElementById('hud-mission-name').innerText = mission.name.split('—')[1].trim();
    document.getElementById('hud-wave-counter').innerText = `VAGUE ${GameState.waveIndex} / ${mission.waves}`;
    document.getElementById('boss-hud').classList.add('hidden');

    isBossWave = false;
    enemiesToSpawn = 5 + GameState.waveIndex * 4;
    spawnInterval = Math.max(20, 60 - GameState.waveIndex * 5);
    spawnCounter = 0;
}

function triggerBossSpawn() {
    isBossWave = true;
    document.getElementById('hud-wave-counter').innerText = `VAGUE FINALE`;
    document.getElementById('boss-hud').classList.remove('hidden');
    audio.bossAlert();

    const bossData = BOSS_TYPES[GameState.missionIndex] || BOSS_TYPES[0];
    boss = {
        name: bossData.name,
        x: CONFIG.canvasWidth / 2,
        y: 100,
        size: bossData.size,
        maxHp: bossData.hp,
        hp: bossData.hp,
        speed: bossData.speed,
        color: bossData.color,
        attackTimer: 0,
        phase: 1
    };
}

// ==========================================
// BOUCLE PRINCIPALE DU JEU
// ==========================================
let lastTime = performance.now();
function mainLoop(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    if (GameState.current === 'PLAYING') {
        updateGame(dt);
        renderGame();
    }
    requestAnimationFrame(mainLoop);
}

function updateGame(dt) {
    // Mouvement du joueur
    if (touchX !== null) {
        const dx = touchX - player.x;
        player.x += Math.sign(dx) * Math.min(Math.abs(dx), player.speed * 1.5);
    }
    if (keys['ArrowLeft'] || keys['KeyA']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed;
    player.x = Math.max(player.size, Math.min(CONFIG.canvasWidth - player.size, player.x));

    // Tir Automatique
    const weapon = WEAPONS[GameState.activeWeapon];
    player.shootCooldown -= dt;
    if (player.shootCooldown <= 0) {
        player.shootCooldown = 1 / (weapon.fireRate * player.fireRateMultiplier);
        fireWeapon(weapon);
    }

    // Apparition des ennemis
    if (!isBossWave && enemiesToSpawn > 0) {
        spawnCounter++;
        if (spawnCounter >= spawnInterval) {
            spawnCounter = 0;
            spawnRandomEnemy();
            enemiesToSpawn--;
        }
    } else if (!isBossWave && enemiesToSpawn <= 0 && enemies.length === 0) {
        triggerUpgradeChoice();
    }

    // Mise à jour des projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0 || p.y > CONFIG.canvasHeight || p.x < 0 || p.x > CONFIG.canvasWidth) {
            projectiles.splice(i, 1);
            continue;
        }

        // Collisions Projectiles -> Ennemis
        if (p.fromPlayer) {
            if (boss) {
                const dist = Math.hypot(p.x - boss.x, p.y - boss.y);
                if (dist < p.size + boss.size) {
                    applyBossDamage(p.dmg);
                    projectiles.splice(i, 1);
                    continue;
                }
            }
            let hitEnemy = false;
            for (let j = enemies.length - 1; j >= 0; j--) {
                let e = enemies[j];
                const dist = Math.hypot(p.x - e.x, p.y - e.y);
                if (dist < p.size + e.size) {
                    e.hp -= p.dmg;
                    hitEnemy = true;
                    createParticles(e.x, e.y, e.color, 4);
                    audio.hit();
                    if (e.hp <= 0) {
                        eliminateEnemy(j);
                    }
                    break;
                }
            }
            if (hitEnemy) {
                projectiles.splice(i, 1);
                continue;
            }
        }
    }

    // Mise à jour des ennemis
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        e.y += e.speed;

        // Comportements spécifiques
        if (e.type === 'stalker') {
            e.x += Math.sin(e.y * 0.05) * 2;
        }

        // Collision Ennemi -> Joueur
        const dist = Math.hypot(e.x - player.x, e.y - player.y);
        if (dist < e.size + player.size) {
            if (player.shield) {
                player.shield = false;
            } else {
                player.hp -= 20;
                audio.hit();
            }
            enemies.splice(i, 1);
            createParticles(player.x, player.y, '#ff2a5f', 10);
            if (player.hp <= 0) {
                triggerGameOver();
            }
            continue;
        }

        if (e.y > CONFIG.canvasHeight + 50) {
            enemies.splice(i, 1);
        }
    }

    // Mise à jour du Boss
    if (boss) {
        boss.y = Math.min(120, boss.y + 1);
        boss.attackTimer += dt;
        if (boss.attackTimer > 2.5) {
            boss.attackTimer = 0;
            bossAttackPattern();
        }
        if (boss.hp <= 0) {
            triggerVictory();
        }
    }

    // Mise à jour des particules
    for (let i = particles.length - 1; i >= 0; i--) {
        let pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.02;
        if (pt.alpha <= 0) particles.splice(i, 1);
    }

    // Mise à jour HUD
    document.getElementById('player-hp-bar').style.width = Math.max(0, (player.hp / player.maxHp) * 100) + '%';
    document.getElementById('hud-currency').innerText = GameState.currency;
    document.getElementById('hud-exp').innerText = GameState.exp;
    document.getElementById('hud-weapon').innerText = WEAPONS[GameState.activeWeapon].name.toUpperCase();
}

function fireWeapon(weapon) {
    audio.shoot();
    const totalProj = weapon.count + player.extraProjectiles;
    for (let i = 0; i < totalProj; i++) {
        let angle = -Math.PI / 2;
        if (totalProj > 1) {
            const spreadOffset = (i / (totalProj - 1) - 0.5) * weapon.spread * 2;
            angle += spreadOffset;
        }
        const isCrit = Math.random() < player.critChance;
        const dmg = weapon.dmg * player.dmgMultiplier * (isCrit ? 2 : 1);

        projectiles.push({
            x: player.x,
            y: player.y - player.size,
            vx: Math.cos(angle) * weapon.speed,
            vy: Math.sin(angle) * weapon.speed,
            dmg: dmg,
            size: 4,
            fromPlayer: true,
            color: isCrit ? '#f39c12' : '#00f3ff'
        });
    }
}

function spawnRandomEnemy() {
    const types = Object.keys(ENEMY_TYPES);
    const chosenKey = types[Math.floor(Math.random() * Math.min(types.length, GameState.waveIndex + 2))];
    const data = ENEMY_TYPES[chosenKey];

    enemies.push({
        x: Math.random() * (CONFIG.canvasWidth - 60) + 30,
        y: -30,
        hp: data.hp + (GameState.waveIndex * 5),
        maxHp: data.hp + (GameState.waveIndex * 5),
        speed: data.speed + (GameState.waveIndex * 0.1),
        size: data.size,
        color: data.color,
        score: data.score,
        exp: data.exp,
        type: data.type
    });
}

function eliminateEnemy(index) {
    const e = enemies[index];
    GameState.score += e.score;
    GameState.exp += e.exp;
    const incomeBonus = 1 + (GameState.permanentUpgrades.income * 0.2);
    GameState.currency += Math.floor((e.score / 5) * incomeBonus);
    GameState.stats.totalKills++;

    createParticles(e.x, e.y, e.color, 12);
    audio.explosion();
    enemies.splice(index, 1);
}

function applyBossDamage(dmg) {
    boss.hp -= dmg;
    audio.hit();
    document.getElementById('boss-hp-bar').style.width = Math.max(0, (boss.hp / boss.maxHp) * 100) + '%';
    if (boss.hp <= 0) {
        triggerVictory();
    }
}

function bossAttackPattern() {
    audio.shoot();
    for (let i = -2; i <= 2; i++) {
        projectiles.push({
            x: boss.x,
            y: boss.y + boss.size,
            vx: i * 1.5,
            vy: 4,
            dmg: 25,
            size: 6,
            fromPlayer: false,
            color: '#ff2a5f'
        });
    }
}

function createParticles(x, y, color, count) {
    if (GameState.settings.gfx === 'low' && count > 5) count = 3;
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            alpha: 1
        });
    }
}

// ==========================================
// RENDU VISUEL SUR CANVAS 2D
// ==========================================
function renderGame() {
    ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);

    // Grille de fond futuriste
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < CONFIG.canvasWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CONFIG.canvasHeight);
        ctx.stroke();
    }
    for (let y = 0; y < CONFIG.canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CONFIG.canvasWidth, y);
        ctx.stroke();
    }

    // Rendu Particules
    particles.forEach(pt => {
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
        ctx.restore();
    });

    // Rendu Projectiles
    projectiles.forEach(p => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    // Rendu Joueur (Unité ORION)
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.fillStyle = '#00f3ff';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00f3ff';
    ctx.beginPath();
    ctx.moveTo(0, -player.size);
    ctx.lineTo(player.size, player.size);
    ctx.lineTo(0, player.size * 0.5);
    ctx.lineTo(-player.size, player.size);
    ctx.closePath();
    ctx.fill();
    if (player.shield) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, player.size + 8, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();

    // Rendu Ennemis
    enemies.forEach(e => {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.fillStyle = e.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = e.color;
        ctx.beginPath();
        ctx.arc(0, 0, e.size, 0, Math.PI * 2);
        ctx.fill();
        // Barre de vie ennemi
        if (e.hp < e.maxHp) {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(-15, -e.size - 8, 30, 4);
            ctx.fillStyle = '#ff2a5f';
            ctx.fillRect(-15, -e.size - 8, 30 * (e.hp / e.maxHp), 4);
        }
        ctx.restore();
    });

    // Rendu Boss
    if (boss) {
        ctx.save();
        ctx.translate(boss.x, boss.y);
        ctx.fillStyle = boss.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = boss.color;
        ctx.beginPath();
        ctx.moveTo(0, -boss.size);
        ctx.lineTo(boss.size, boss.size);
        ctx.lineTo(-boss.size, boss.size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// ==========================================
// GESTION DES ÉCRANS DE FIN & AMÉLIORATIONS
// ==========================================
function triggerUpgradeChoice() {
    GameState.current = 'UPGRADE_CHOICE';
    audio.upgrade();
    const container = document.getElementById('upgrade-cards-container');
    container.innerHTML = '';

    // Sélectionner 3 améliorations aléatoires
    const shuffled = [...UPGRADE_POOL].sort(() => 0.5 - Math.random());
    const choices = shuffled.slice(0, 3);

    choices.forEach(upg => {
        const card = document.createElement('div');
        card.className = `upgrade-card rarity-${upg.rarity}`;
        card.innerHTML = `<div class="card-title">${upg.name}</div><div class="card-desc">${upg.desc}</div>`;
        card.onclick = () => {
            upg.apply(player);
            document.getElementById('upgrade-choice-screen').classList.add('hidden');
            GameState.current = 'PLAYING';
            startNextWave();
        };
        container.appendChild(card);
    });

    document.getElementById('upgrade-choice-screen').classList.remove('hidden');
}

function togglePause() {
    if (GameState.current === 'PLAYING') {
        GameState.current = 'PAUSED';
        document.getElementById('pause-screen').classList.remove('hidden');
    } else if (GameState.current === 'PAUSED') {
        GameState.current = 'PLAYING';
        document.getElementById('pause-screen').classList.add('hidden');
    }
}

function triggerGameOver() {
    GameState.current = 'GAME_OVER';
    audio.explosion();
    document.getElementById('endgame-title').innerText = 'MISSION ÉCHOUÉE';
    document.getElementById('endgame-next-btn').classList.add('hidden');
    document.getElementById('endgame-stats').innerHTML = `
        Score Final : ${GameState.score}<br>
        Ennemis Vaincus : ${GameState.stats.totalKills}<br>
        Crédits Gagnés : ${GameState.currency} ₳
    `;
    SaveManager.save();
    showScreen('endgame-screen');
}

function triggerVictory() {
    GameState.current = 'VICTORY';
    audio.upgrade();
    GameState.stats.missionsCompleted++;
    if (isBossWave && boss) {
        GameState.stats.bossesDefeated++;
    }
    document.getElementById('endgame-title').innerText = 'MISSION ACCOMPLIE';
    const nextBtn = document.getElementById('endgame-next-btn');
    if (GameState.missionIndex < MISSIONS.length - 1) {
        nextBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.add('hidden');
    }

    document.getElementById('endgame-stats').innerHTML = `
        Mission Terminée avec Succès !<br>
        Score : ${GameState.score}<br>
        Crédits Récoltés : ${GameState.currency} ₳
    `;
    SaveManager.save();
    showScreen('endgame-screen');
}

// Lancement automatique au chargement
window.addEventListener('load', initGameEngine);
