/* ---------------- Petals ambient background ---------------- */
const canvas = document.getElementById('petal-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);

const petalColors = ['#e8a89a', '#f3d6d2', '#c79a3a', '#a8324a'];
let petals = Array.from({length: 26}, () => spawnPetal());
function spawnPetal(){
  return {
    x: Math.random()*W,
    y: Math.random()*-H,
    size: 6 + Math.random()*10,
    speed: 0.6 + Math.random()*1.2,
    drift: Math.random()*1.2 - 0.6,
    rot: Math.random()*Math.PI*2,
    rotSpeed: (Math.random()-0.5)*0.02,
    color: petalColors[Math.floor(Math.random()*petalColors.length)]
  };
}
function drawPetal(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.ellipse(0,0, p.size*0.6, p.size, Math.PI/4, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}
function tick(){
  ctx.clearRect(0,0,W,H);
  for(const p of petals){
    p.y += p.speed;
    p.x += p.drift;
    p.rot += p.rotSpeed;
    if(p.y > H + 20){ Object.assign(p, spawnPetal(), {y: -20}); }
    drawPetal(p);
  }
  requestAnimationFrame(tick);
}
tick();

/* ---------------- Screen navigation ---------------- */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ---------------- Login logic ---------------- */
const loginForm = document.getElementById('login-form');
const loginCard = document.getElementById('login-card');
const errorMsg = document.getElementById('error-msg');

function normalize(str){
  return str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
function normalizeDate(str){
  return str.replace(/[^0-9]/g,'');
}

const VALID_USER = 'padula';
const VALID_DATE = '22042026';

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = normalize(document.getElementById('username').value);
  const pass = normalizeDate(document.getElementById('password').value);

  if(user === VALID_USER){
    if(pass === VALID_DATE){
      renderLettersGrid();
      showScreen('screen-grid');
    } else {
      errorMsg.textContent = "Att tu connais pas notre date ???? T'es pas ma chérie, bouge !!!";
      loginCard.classList.remove('shake');
      void loginCard.offsetWidth;
      loginCard.classList.add('shake');
    }
  } else {
    errorMsg.textContent = "Mauvais prénom, tu n'es pas mon amoureuse toi. Sort de la !!!!";
    loginCard.classList.remove('shake');
    void loginCard.offsetWidth;
    loginCard.classList.add('shake');
  }
});

/* ---------------- Letters data ----------------
   Ajoute, modifie ou supprime des lettres ici.
   - "year" / "month" (1-12) / "day" définissent la date d'une lettre.
     Les lettres du même mois/année sont regroupées dans la même rangée,
     et le titre de la rangée est généré automatiquement ("Avril 2026").
   - Une seule lettre doit avoir "isMain: true" : c'est celle dont le
     bouton final ("Continuer") mène à la demande. Les autres renvoient
     simplement vers la grille des lettres ("Retour aux lettres").

   Comportement automatique selon la date réelle du jour :
   - Le mois EN COURS affiche des cases verrouillées "à venir" en plus
     des lettres déjà écrites, pour montrer qu'il en reste à découvrir.
   - Un mois déjà TERMINÉ (dans le passé) n'affiche plus aucune case
     "à venir" : seules les lettres réellement écrites apparaissent.
   - Un mois FUTUR reste complètement invisible et se révèle tout seul
     le jour venu (aucune manipulation nécessaire).
------------------------------------------------- */

const LETTERS = [
  {
    id: 'l1',
    year: 2026, month: 7, day: 30,
    greeting: 'Ma chère Padula,',
    body: `Padula,

Il y a des choses simples qu'on n'a jamais vraiment besoin d'expliquer, tant elles semblent évidentes. Et pourtant, j'ai envie de te les écrire aujourd'hui, noir sur blanc, une bonne fois pour toutes, pour qu'elles ne s'effacent jamais.

Depuis que tu es entrée dans ma vie, tout a pris une couleur différente. Les journées les plus ordinaires deviennent belles simplement parce que tu y es. Je pense à ton rire, à cette façon si unique que tu as d'être toi, sans artifice, et je me dis chaque jour à quel point j'ai de la chance de pouvoir vivre ça à tes côtés.

Je sais que l'amour n'a pas toujours été facile pour toi. Je sais que montrer tes émotions demande parfois un courage que peu de gens soupçonnent, et que certaines peurs restent silencieuses, même quand on essaie très fort de les dépasser. Je le vois, je le comprends, et jamais je ne t'en voudrai pour ça. Ce que je retiens, c'est qu'à travers les hauts, les bas, les doutes et les silences, nous avons toujours trouvé le chemin qui nous ramène l'un vers l'autre. Et pour moi, c'est ça, la plus belle des preuves.

Ce ne sont pas de simples mots écrits au hasard un soir d'inspiration. C'est ce que je ressens chaque matin en pensant à toi, et ce que je veux continuer à ressentir, avec toi, pour très longtemps encore.

Alors avant d'aller plus loin, il y a une question que je veux enfin te poser.`,
    signature: 'Ton Frantzy, pour toujours.',
    isMain: true
  },

  {
    id: 'l2',
    year: 2026, month: 8, day: 30,
    greeting: 'Ma cherieeeee,',
    body: `Alors comment vas-tu ? Tu m'as dis que tu étais un peu fatiguée, j'espere que tu te reposes bien et que tu iras bien mieux très rapidement. Hier on s'est revu apres presque 2 mois, tu m'avais tellementtttttttttttttt manqué, ehh d'ailleurs on peut enfin le dire, nous sommes en couple. Et je suis heureux, car je suis avec la personne que J'AIME 💓. En tout cas cette petite lettre est le début d'une longue série !!! 
    
    TU donnes vraiment un autre sens à ma vie, grâce à toi, je l'a vois autrement, pas une simple vie fade, mais plutôt une vie qui vaut la peine d'être vécu. Parfois je me dis que peu importe ce qu'on fait le résultat est le même. Mais avec toi, je n'ai pas cette pensée et au contraire je suis ravi de l'a vivre à tes cotés, les souvenirs passées avec toi sont les meilleurs et me poussens à accomplir tellement de choses. 
    
    Je te le dis peut-être pas souvent mais tu es une source de benediction pour moi. Je nous souhaites tout le bonehur du monde et je prie pour cela, Je veux sérieusement être à tes cotés pour l'éternités, Rien ne va m'arreter, nous aurons surement des hauts et des bas mais on les suremontera ensemble. Je ne te laisserai pas partir, j'ai trouvé la personne avec qui je souhaite passer ma vie, donc j'ai l'interdiction de la laisser partir. 

    Sache le vraiment, je ne partirais pas, tu peux te concentrer sur toi, tes projets tes ambitions, je serais toujours la, à t'encourager et te pousser vers le haut. Tu as une personne (#FRANTZY) follement amoureux de toi (TOUJOURS MOI MDRRRR), donc ne t'inquite pas pour notre relation, elle ne se terminera pas, et je ne partias PAS ! Fait ce que tu aimes, choisis ce que tu aimes, soi toi même #NATURE PEINTUREEEEEE, ne te laisse JAMAIS décourager, n'abandonnes JAMAIS. 
    
    Je crois en toi, je sais que tu réaliseras de très belles choses et j'ai hâte de les voir en étant proche de toi (#HÂTE D'ETRE TON FUTUR MARI 🤣🤣🤣🤣, BON HÂTE AUSSI QUE TU M'ETTOUFFES AVEC TES CUISSEESSSSSSSS MDRRRRRRR NON J'ME SENS VRAIMENT TROP DROLE, J'ESPERE QUE TU RIGOLES AUSSI HEIN PARCE QUE TU NE PEUX PAS ME LAISSER RIGOLER TOUT SEUL 🙄🙄🙄) !
    
    Bonn Madame OGE PADULA, j'espère que votre coma se passe bien, (Oui J'écris pendant que tu dors, ah non t'es réveillé tu m'as envoyé un message je viens de le voir #ECHEC #EXCUSEDUREMIS). Bon je vais m'arreter la pour aller te répondre. Ne l'oublies jamais tu es une personne formidable et parfaite, ne doutes jamais de toi, tu es une très belle personne et j'ai la chance de t'avoir trouvé. JE T'AIME PADULAAAAA 😘😘😘😘. (D'ailleurs désolé ma cherie pour les fautes, on dirait que j'suis un autiste aussi)
    
    `,
    signature: "Ton amoureux Frantzy",
    isMain: false
  },

];

/* ---------------- Letters grid ---------------- */
const lettersContainer = document.getElementById('letters-container');
let currentLetter = null;

function monthTitle(year, month){
  const d = new Date(year, month - 1, 1);
  const str = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderLettersGrid(){
  lettersContainer.innerHTML = '';

  const now = new Date();
  const currentValue = now.getFullYear() * 12 + (now.getMonth() + 1);

  // Regroupe les lettres par mois/année, dans l'ordre chronologique
  const groups = [];
  LETTERS.forEach(letter => {
    let group = groups.find(g => g.year === letter.year && g.month === letter.month);
    if(!group){ group = { id: letter.id, year: letter.year, month: letter.month, day: letter.day, letters: [] }; groups.push(group); }
    group.letters.push(letter);
  });
  groups.forEach(g => g.letters.sort((a, b) => (a.day || 0) - (b.day || 0)));
  groups.sort((a, b) => (a.year * 12 + a.month) - (b.year * 12 + b.month));

  let hasFuture = false;

  groups.forEach(group => {
    const groupValue = group.year * 12 + group.month;
    if(groupValue > currentValue){ hasFuture = true; return; } // mois pas encore arrivé : invisible

    const isCurrentMonth = groupValue === currentValue;

    const section = document.createElement('div');
    section.className = 'letter-group';

    const title = document.createElement('h2');
    title.className = 'grid-date-title';
    title.textContent = monthTitle(group.year, group.month);
    section.appendChild(title);

    const row = document.createElement('div');
    row.className = 'letter-row';
    
    // Le mois en cours affiche des cases "à venir" en plus des lettres
    // déjà écrites. Un mois terminé n'affiche que les lettres réelles.
    const slotsCount = isCurrentMonth ? Math.max(4, group.letters.length) : group.letters.length;
    for(let i = 0; i < slotsCount; i++){
      const letter = group.letters[i];
      const slot = document.createElement('button');
      slot.className = 'letter-slot' + (letter ? '' : ' locked');
      slot.innerHTML = letter
        ? `<span class="slot-label">${group.day}/${group.month}/${group.year}</span><span class="slot-icon">✉</span><span class="slot-label">Lettre ${group.id.substring(1)}</span>`
        : `<span class="slot-icon">🔒</span><span class="slot-label">À venir</span>`;
      if(letter){
        slot.addEventListener('click', () => openLetter(letter));
      } else {
        slot.disabled = true;
      }
      row.appendChild(slot);
    }

    section.appendChild(row);
    lettersContainer.appendChild(section);
  });

}

/* ---------------- Letter reading logic ---------------- */
const envelope = document.getElementById('envelope');
const tapHint = document.getElementById('tap-hint');
const envelopeWrap = document.querySelector('.envelope-wrap');
const letterPaper = document.getElementById('letter-paper');
const letterGreetingEl = document.getElementById('letter-greeting');
const letterTextEl = document.getElementById('letter-text');
const letterSignEl = document.getElementById('letter-sign');
const continueBtn = document.getElementById('continue-btn');
const backToGridBtn = document.querySelectorAll('.back-btn');

let hasOpened = false;

function openLetter(letter){
  currentLetter = letter;

  // Réinitialise l'écran lettre pour une lecture propre à chaque ouverture
  hasOpened = false;
  envelope.classList.remove('open');
  envelopeWrap.style.display = '';
  tapHint.style.opacity = '1';
  letterPaper.classList.remove('show');
  continueBtn.classList.remove('show');
  letterGreetingEl.textContent = letter.greeting;
  letterSignEl.textContent = letter.signature;
  letterTextEl.textContent = '';
  continueBtn.textContent = letter.isMain ? 'Continuer' : 'Retour aux lettres';

  showScreen('screen-letter');
}

envelope.addEventListener('click', () => {
  if(hasOpened || !currentLetter) return;
  hasOpened = true;
  envelope.classList.add('open');
  tapHint.style.opacity = '0';
  setTimeout(() => {
    envelopeWrap.style.display = 'none';
    letterPaper.classList.add('show');
    typeLetter(currentLetter.body);
  }, 900);
});

function typeLetter(text){
  let i = 0;
  letterTextEl.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '\u00A0';

  function step(){
    if(i <= text.length){
      letterTextEl.textContent = text.slice(0, i);
      letterTextEl.appendChild(cursor);
      i += 2;
      letterPaper.scrollTop = letterPaper.scrollHeight;
      setTimeout(step, 14);
    } else {
      cursor.remove();
      continueBtn.classList.add('show');
    }
  }
  step();
}

continueBtn.addEventListener('click', () => {
  if(currentLetter && currentLetter.isMain){
    showScreen('screen-proposal');
  } else {
    showScreen('screen-grid');
  }
});

backToGridBtn.forEach(backToGridBtn => {
  backToGridBtn.addEventListener('click', () => {
  showScreen('screen-grid');
  })
});

/* ---------------- Proposal logic (dodging No button) ---------------- */
const btnRow = document.getElementById('btn-row');
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const dodgeCaption = document.getElementById('dodge-caption');

const captions = [
  "Tu es sûre ?",
  "Vraiment vraiment sûre ?",
  "Réfléchis encore un peu...",
  "Caca Boudin, pourquoi tu dis non 🤔",
  "Ce bouton ne veut pas être cliqué, c'est un signe.",
  "Allez, dis oui plutôt !",
  "Non n'est pas une option ce soir.",
  "QuoiCoubeh accepte.",
  "Nan, Nann, Nannnnnn..."
];

let dodgeCount = 0;

function dodgeNo(){
  const rowRect = btnRow.getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();

  const margin = 20;
  const maxX = window.innerWidth - btnRect.width - margin;
  const maxY = window.innerHeight - btnRect.height - margin;
  const newX = Math.max(margin, Math.random()*maxX);
  const newY = Math.max(margin, Math.random()*maxY);

  if(!btnNo.classList.contains('moving')){
    btnNo.classList.add('moving');
  }
  btnNo.style.left = newX + 'px';
  btnNo.style.top = newY + 'px';

  dodgeCaption.textContent = captions[Math.min(dodgeCount, captions.length-1)];
  dodgeCount++;
}

btnNo.addEventListener('mouseenter', dodgeNo);
btnNo.addEventListener('click', (e) => { e.preventDefault(); dodgeNo(); });
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); dodgeNo(); }, {passive:false});

btnYes.addEventListener('click', () => {
  showScreen('screen-yes');
});