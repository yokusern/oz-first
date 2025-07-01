// game.js

const mapSize = 20;
let player = {
  x: 0,
  y: 0,
  hp: 100,
  maxHp: 100,
  level: 1,
  atk: 10,
  job: '剣士',
  icon: '🦊',
  items: [],
  skills: [],
};

const mapData = Array.from({ length: mapSize }, () =>
  Array.from({ length: mapSize }, () => ({ type: 'empty', icon: '' }))
);

const logEl = document.getElementById('log');
const skillsEl = document.getElementById('skills');

// 固定ポイント設置
function placeFixedPoints() {
  const fixedPoints = [
    { x: 3, y: 3, type: 'enemy', icon: '👾' },
    { x: 5, y: 10, type: 'shop', icon: '🏪' },
    { x: 10, y: 2, type: 'heal', icon: '💖' },
    { x: 15, y: 5, type: 'quest', icon: '📜' },
    { x: 19, y: 19, type: 'boss', icon: '👹' },
  ];
  fixedPoints.forEach(p => mapData[p.y][p.x] = { type: p.type, icon: p.icon });
}

// 描画
function drawMap() {
  const mapEl = document.getElementById('map');
  mapEl.innerHTML = '';
  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
      const cell = document.createElement('div');
      const data = mapData[y][x];
      cell.classList.add('cell');
      if (player.x === x && player.y === y) {
        cell.classList.add('player');
        cell.textContent = player.icon;
      } else if (data.icon) {
        cell.textContent = data.icon;
        cell.dataset.type = data.type;
      }
      mapEl.appendChild(cell);
    }
  }
}

function log(msg) {
  const time = new Date().toLocaleTimeString();
  logEl.innerHTML = `[${time}] ${msg}<br>` + logEl.innerHTML;
}

function movePlayer(dir) {
  const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
  const dy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (newX < 0 || newX >= mapSize || newY < 0 || newY >= mapSize) return;

  player.x = newX;
  player.y = newY;
  interact(mapData[newY][newX]);
  drawMap();
  updateStatus();
}

function interact(cell) {
  switch (cell.type) {
    case 'enemy':
      battle({ name: 'スライム', hp: 30, atk: 5, icon: cell.icon });
      break;
    case 'shop':
      log('🏪 ショップに到着！アイテムをもらった！');
      player.items.push('🍎回復のリンゴ');
      break;
    case 'heal':
      player.hp = player.maxHp;
      log('💖 全回復しました！');
      break;
    case 'quest':
      log('📜 クエスト達成！EXP + 20！');
      gainExp(20);
      break;
    case 'boss':
      battle({ name: '👹 魔王ゴブリン', hp: 100, atk: 15, icon: cell.icon });
      break;
  }
}

function battle(enemy) {
  log(`${enemy.icon} ${enemy.name}と戦闘開始！`);
  let round = 1;
  while (enemy.hp > 0 && player.hp > 0) {
    log(`ターン${round}：あなたの攻撃！`);
    enemy.hp -= player.atk;
    if (enemy.hp <= 0) break;
    log(`${enemy.name}の攻撃！`);
    player.hp -= enemy.atk;
    round++;
  }
  if (player.hp > 0) {
    log(`✅ 勝利！経験値 +10`);
    gainExp(10);
  } else {
    log(`💀 敗北...`);
    player.hp = Math.floor(player.maxHp / 2);
  }
}

function gainExp(exp) {
  player.level += 1;
  player.maxHp += 10;
  player.atk += 2;
  player.hp = player.maxHp;
  log(`🔺 レベルアップ！Lv.${player.level}`);
}

function updateStatus() {
  document.getElementById('player-hp').textContent = player.hp;
  document.getElementById('player-max-hp').textContent = player.maxHp;
  document.getElementById('player-level').textContent = player.level;
  document.getElementById('player-items').textContent = player.items.join(', ') || 'なし';
  document.getElementById('player-job').textContent = player.job;
}

// スキルセットアップ
function setupSkills() {
  player.skills = [
    { name: '🔥 ファイアボルト', effect: () => log('🔥 火球を放った！敵に15ダメージ！') },
    { name: '🛡️ 防御態勢', effect: () => log('🛡️ ダメージを軽減！') },
    { name: '💥 必殺斬り', effect: () => log('💥 一撃必殺を繰り出した！') },
  ];
  skillsEl.innerHTML = '';
  player.skills.forEach(skill => {
    const btn = document.createElement('button');
    btn.textContent = skill.name;
    btn.onclick = skill.effect;
    skillsEl.appendChild(btn);
  });
}

// 初期化
function startGame() {
  placeFixedPoints();
  drawMap();
  updateStatus();
  setupSkills();
  log('🦊 冒険が始まった！');
}

startGame();
