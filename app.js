// ========================================================
// TURBOSPOTTER - LÓGICA PRINCIPAL Y NAVEGACIÓN
// ========================================================

// ========================================================
// CAPA DE PERSISTENCIA (LOCALSTORAGE ENGINE)
// ========================================================
const STORAGE_KEYS = {
  AUTOS: 'carspotter_autos_v1',
  MOTOS: 'carspotter_motos_v1',
  USUARIO: 'carspotter_usuario_v1',
  AMIGOS: 'carspotter_amigos_v1',
  SOLICITUDES: 'carspotter_solicitudes_v1',
  BORDES_DESBLOQUEADOS: 'carspotter_bordes_v1',
  BORDE_EQUIPADO: 'carspotter_borde_equipado_v1',
  TEMAS_DESBLOQUEADOS: 'carspotter_temas_v1',
  TEMA_EQUIPADO: 'carspotter_tema_equipado_v1',
  MISIONES_RECLAMADAS: 'carspotter_misiones_reclamadas_v1',
  FEED_LIKES: 'carspotter_feed_likes_v1',
  FEED_COMENTARIOS: 'carspotter_feed_comentarios_v1',
  FEED_USUARIO: 'carspotter_feed_usuario_v1',
  AUTH_USUARIOS: 'carspotter_auth_usuarios_v1',
  AUTH_SESION: 'carspotter_auth_sesion_v1'
};

const StorageManager = {
  get(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (err) {
      console.warn(`Error leyendo ${key} de localStorage:`, err);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Error guardando ${key} en localStorage:`, err);
    }
  },
  resetAll() {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    } catch (err) {
      console.warn("Error restableciendo localStorage:", err);
    }
  }
};

// 1. Datos iniciales de Autos (con persistencia)
const autosPorDefecto = [
  {
    id: 1,
    nombre: "Porsche 911 GT3 RS",
    marca: "Porsche",
    rareza: "epico",
    tipo: "Auto",
    potencia: "525 CV",
    imagen: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    nombre: "Ferrari SF90 Stradale",
    marca: "Ferrari",
    rareza: "legendario",
    tipo: "Híbrido",
    potencia: "1000 CV",
    imagen: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    nombre: "BMW M4 Competition",
    marca: "BMW",
    rareza: "raro",
    tipo: "Auto",
    potencia: "510 CV",
    imagen: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
  }
];

let autos = StorageManager.get(STORAGE_KEYS.AUTOS, autosPorDefecto);

// 2. Datos iniciales de Motos (con persistencia)
const motosPorDefecto = [
  {
    id: 101,
    nombre: "Ducati Panigale V4 R",
    marca: "Ducati",
    rareza: "legendario",
    tipo: "Superbike",
    potencia: "218 CV",
    imagen: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 102,
    nombre: "Yamaha YZF-R1",
    marca: "Yamaha",
    rareza: "epico",
    tipo: "Superbike",
    potencia: "200 CV",
    imagen: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 103,
    nombre: "Kawasaki Ninja H2",
    marca: "Kawasaki",
    rareza: "legendario",
    tipo: "Sobrealimentada",
    potencia: "231 CV",
    imagen: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80"
  }
];

let motos = StorageManager.get(STORAGE_KEYS.MOTOS, motosPorDefecto);

// 3. Datos del Feed Comunitario (Base + persistencia de spots del usuario)
const feedSpotsBase = [
  {
    id: 'spot_1',
    spotter: "Carlos_R",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    vehiculo: "Lamborghini Huracán STO",
    ubicacion: "Av. Libertador • Hace 12m",
    rareza: "legendario",
    precio: "$330,000",
    likes: 42,
    imagen: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
    comentarios: [
      { autor: "Mateo_V8", texto: "¡Una locura de nave! El sonido del V10 es inigualable.", tiempo: "Hace 8m" },
      { autor: "Carlos_R", texto: "Gracias crack, un placer acelerarlo en la avenida 🏎️", tiempo: "Hace 7m" },
      { autor: "SofiaSpeed", texto: "¡Qué fotaza! Buen spot 👏", tiempo: "Hace 5m" }
    ]
  },
  {
    id: 'spot_2',
    spotter: "SofiaSpeed",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    vehiculo: "Honda Civic Type R",
    ubicacion: "Circuito Norte • Hace 45m",
    rareza: "comun",
    precio: "$44,000",
    likes: 19,
    imagen: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80",
    comentarios: [
      { autor: "AlexTrack", texto: "Ese alerón trasero es agresivísimo, buen avistamiento.", tiempo: "Hace 20m" },
      { autor: "SofiaSpeed", texto: "Totalmente, en pista dobla sobre rieles 🔥", tiempo: "Hace 15m" }
    ]
  },
  {
    id: 'spot_3',
    spotter: "AlexTrack",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    vehiculo: "BMW M3 Touring",
    ubicacion: "Gasolinera Shell • Hace 2h",
    rareza: "raro",
    precio: "$115,000",
    likes: 27,
    imagen: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    comentarios: [
      { autor: "Carlos_R", texto: "La familiar más rápida del planeta 🔥", tiempo: "Hace 1h" }
    ]
  }
];

let feedSpotsUsuario = StorageManager.get(STORAGE_KEYS.FEED_USUARIO, []);
let feedSpots = [...feedSpotsUsuario, ...feedSpotsBase];

// 4. Datos del Ranking / Leaderboard (Modos: Amigos, Global, Regional - Top 1 al 10 con fotos)
const rankingsPorModo = {
  amigos: [
    { rank: 1, nombre: "Lucas Rider", score: "8,450 pts", spots: 51, medalla: "🥇", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" },
    { rank: 2, nombre: "Julio (Tú)", score: "6,950 pts", spots: 18, medalla: "🥈", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
    { rank: 3, nombre: "Mateo Spotter", score: "5,820 pts", spots: 36, medalla: "🥉", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80" },
    { rank: 4, nombre: "Sofía Track", score: "4,610 pts", spots: 27 },
    { rank: 5, nombre: "Andrés_V8", score: "3,190 pts", spots: 19 },
    { rank: 6, nombre: "DiegoMoto", score: "2,440 pts", spots: 14 },
    { rank: 7, nombre: "Valentina_Apex", score: "2,180 pts", spots: 12 },
    { rank: 8, nombre: "MaxiTurbo", score: "1,950 pts", spots: 11 },
    { rank: 9, nombre: "CamilaSpeed", score: "1,620 pts", spots: 9 },
    { rank: 10, nombre: "Rodrigo_GT", score: "1,340 pts", spots: 8 }
  ],
  global: [
    { rank: 1, nombre: "EnzoSpotter", score: "14,850 pts", spots: 89, medalla: "🥇", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
    { rank: 2, nombre: "Lucia_Apex", score: "12,420 pts", spots: 74, medalla: "🥈", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
    { rank: 3, nombre: "TurboNico", score: "11,100 pts", spots: 65, medalla: "🥉", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
    { rank: 4, nombre: "Carlos_R", score: "9,640 pts", spots: 54 },
    { rank: 5, nombre: "Lucas Rider", score: "8,450 pts", spots: 51 },
    { rank: 6, nombre: "SofiaSpeed", score: "8,310 pts", spots: 42 },
    { rank: 7, nombre: "Julio (Tú)", score: "6,950 pts", spots: 18 },
    { rank: 8, nombre: "Kimi_Racer", score: "6,520 pts", spots: 39 },
    { rank: 9, nombre: "Hans_Nurburg", score: "5,980 pts", spots: 35 },
    { rank: 10, nombre: "Mateo Spotter", score: "5,820 pts", spots: 36 }
  ],
  regional: [
    { rank: 1, nombre: "Carlos_R", score: "9,640 pts", spots: 54, medalla: "🥇", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" },
    { rank: 2, nombre: "Julio (Tú)", score: "6,950 pts", spots: 18, medalla: "🥈", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
    { rank: 3, nombre: "Seba_Cordoba", score: "6,410 pts", spots: 38, medalla: "🥉", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80" },
    { rank: 4, nombre: "Martin_GT", score: "5,900 pts", spots: 31 },
    { rank: 5, nombre: "Paula_RS", score: "4,220 pts", spots: 24 },
    { rank: 6, nombre: "Franco_V6", score: "3,780 pts", spots: 21 },
    { rank: 7, nombre: "Nico_Rosario", score: "3,410 pts", spots: 19 },
    { rank: 8, nombre: "Lautaro_Track", score: "2,890 pts", spots: 16 },
    { rank: 9, nombre: "DiegoMoto", score: "2,440 pts", spots: 14 },
    { rank: 10, nombre: "Esteban_M3", score: "1,870 pts", spots: 10 }
  ]
};

let rankingModoActual = 'amigos';

// Filtro de rareza para autos
let filtroRarezaAuto = 'all';

// 0. SISTEMA DE RANGOS DEL SPOTTER (Medallas Personalizadas por Cantidad de Spots Cazados)
const DEFINICION_RANGOS = [
  { 
    id: 'novato', 
    nombre: 'Novato', 
    lp: 25, 
    badgeColor: 'tier-novato', 
    autosMin: 1, 
    titulo: 'Observador Callejero', 
    colorPrincipal: '#94a3b8', 
    colorGema: '#cbd5e1', 
    colorSecundario: '#475569',
    estiloAlas: 'basic',      // alas sencillas de 1 pluma
    formaGema: 'circle',      // núcleo circular metálico
    bordeEstilo: 'clean',     // bisel pulcro sin cuernos
    efectoEspecial: 'none'
  },
  { 
    id: 'bronce', 
    nombre: 'Bronce', 
    lp: 45, 
    badgeColor: 'tier-bronce', 
    autosMin: 5, 
    titulo: 'Cazador Principiante', 
    colorPrincipal: '#d97706', 
    colorGema: '#fbbf24', 
    colorSecundario: '#78350f',
    estiloAlas: 'feather2',    // alas de 2 hojas de bronce
    formaGema: 'rhombus',     // rombo biselado
    bordeEstilo: 'rivets',    // remaches de ingeniería
    efectoEspecial: 'sparks'
  },
  { 
    id: 'plata', 
    nombre: 'Plata', 
    lp: 83, 
    badgeColor: 'tier-plata', 
    autosMin: 15, 
    titulo: 'Spotter Urbano', 
    colorPrincipal: '#f1f5f9', 
    colorGema: '#60a5fa', 
    colorSecundario: '#64748b',
    estiloAlas: 'wing3',      // alas afiladas triples con cinta cobalto
    formaGema: 'diamond_facet', // diamante facetado
    bordeEstilo: 'winged_crest',
    efectoEspecial: 'ice_glow'
  },
  { 
    id: 'oro', 
    nombre: 'Oro', 
    lp: 62, 
    badgeColor: 'tier-oro', 
    autosMin: 35, 
    titulo: 'Ojo de Lince', 
    colorPrincipal: '#f59e0b', 
    colorGema: '#fef08a', 
    colorSecundario: '#b45309',
    estiloAlas: 'eagle',      // alas de águila dorada imponentes
    formaGema: 'star_burst',  // estrella central tallada
    bordeEstilo: 'crown_spikes', // corona con 3 picos superiores
    efectoEspecial: 'golden_rays'
  },
  { 
    id: 'platino', 
    nombre: 'Platino', 
    lp: 78, 
    badgeColor: 'tier-platino', 
    autosMin: 65, 
    titulo: 'Cazador Élite', 
    colorPrincipal: '#38bdf8', 
    colorGema: '#93c5fd', 
    colorSecundario: '#0369a1',
    estiloAlas: 'energy_blades', // cuchillas aerodinámicas de energía
    formaGema: 'hex_crystal',    // cristal hexagonal
    bordeEstilo: 'aero_spoiler', // detalles estilo alerón GT
    efectoEspecial: 'cyan_plasma'
  },
  { 
    id: 'diamante', 
    nombre: 'Diamante', 
    lp: 91, 
    badgeColor: 'tier-diamante', 
    autosMin: 110, 
    titulo: 'Master Spotter', 
    colorPrincipal: '#60a5fa', 
    colorGema: '#ffffff', 
    colorSecundario: '#1e40af',
    estiloAlas: 'crystal_wings', // alas de cristal multicapa
    formaGema: 'octahedron',     // octaedro resplandeciente
    bordeEstilo: 'double_frame', // marco doble de titanio
    efectoEspecial: 'aurora'
  },
  { 
    id: 'maestro', 
    nombre: 'Maestro', 
    lp: 95, 
    badgeColor: 'tier-maestro', 
    autosMin: 175, 
    titulo: 'Leyenda del Asfalto', 
    colorPrincipal: '#c084fc', 
    colorGema: '#f472b6', 
    colorSecundario: '#581c87',
    estiloAlas: 'dragon_horns',  // astas / alas draconianas de energía púrpura
    formaGema: 'void_gem',       // gema dimensional profunda
    bordeEstilo: 'coronet',      // corona mística
    efectoEspecial: 'cosmic_burst'
  },
  { 
    id: 'hypercar', 
    nombre: 'Hypercar Legend', 
    lp: 99, 
    badgeColor: 'tier-hypercar', 
    autosMin: 250, 
    titulo: 'Rey del Paddock', 
    colorPrincipal: '#ff2a5f', 
    colorGema: '#fbbf24', 
    colorSecundario: '#881337',
    estiloAlas: 'valkyrie_apex', // alas divinas de titanio con rayos dorados
    formaGema: 'hyper_core',     // reactor de fibra de carbono & oro
    bordeEstilo: 'apex_crown',   // corona de laureles y crestas de hiperauto
    efectoEspecial: 'lightning_apex' // rayos celestiales como en la cima de la referencia
  }
];

// 0. Perfil del Usuario y Recompensas (con persistencia)
const usuarioPorDefecto = {
  nombre: "Julio Alonzo",
  username: "juliospotter",
  bio: "Amante del automovilismo deportivo, cazando superautos y motos exóticas en la ciudad. 🏁🏎️",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  nivel: 83,
  xp: 72,       // Porcentaje hacia el siguiente nivel (0-100)
  monedas: 741
};

let usuario = StorageManager.get(STORAGE_KEYS.USUARIO, usuarioPorDefecto);
// Asegurar campos si proviene de versión previa sin ellos
if (!usuario.nombre) usuario.nombre = usuarioPorDefecto.nombre;
if (!usuario.username) usuario.username = usuarioPorDefecto.username;
if (!usuario.bio) usuario.bio = usuarioPorDefecto.bio;
if (!usuario.avatar) usuario.avatar = usuarioPorDefecto.avatar;

// Elementos del HUD de Usuario y Rangos
const userAvatarEl = document.getElementById('user-avatar');
const profileUserAvatarEl = document.getElementById('profile-user-avatar');
const profileUserNameEl = document.getElementById('profile-user-name');
const profileUserBioEl = document.getElementById('profile-user-bio');
const btnHeaderProfile = document.getElementById('btn-header-profile');
const btnProfileCardAvatar = document.getElementById('btn-profile-card-avatar');
const btnOpenEditProfile = document.getElementById('btn-open-edit-profile');

const userLevelEl = document.getElementById('user-level');
const xpBarEl = document.getElementById('xp-bar');
const userCoinsEl = document.getElementById('user-coins');
const profileLevelVal = document.getElementById('profile-level-val');
const profileCarsTotal = document.getElementById('profile-cars-total');
const profileRankCrown = document.getElementById('profile-rank-crown');
const userTierPill = document.getElementById('user-tier-pill');
const userRankTitle = document.getElementById('user-rank-title');
const nextRankName = document.getElementById('next-rank-name');
const rankProgressPercent = document.getElementById('rank-progress-percent');
const rankProgressFill = document.getElementById('rank-progress-fill');
const rankReqHint = document.getElementById('rank-req-hint');
const rankHeroDisplay = document.getElementById('rank-hero-display');
const modalRanks = document.getElementById('modal-ranks');

// Elementos de la Barra Superior: Rango y Engranaje de Ajustes
const headerRankBadge = document.getElementById('header-rank-badge');
const headerRankIcon = document.getElementById('header-rank-icon');
const headerRankText = document.getElementById('header-rank-text');
const btnHeaderSettings = document.getElementById('btn-header-settings');
const modalSettings = document.getElementById('modal-settings');
// Sistema de XP progresivo por nivel: cada nivel requiere más XP para alcanzarse (curva más exigente)
function getXpRequeridaParaNivel(nivel) {
  // Nivel 1 = 120 XP base. Incremento de 45 XP por cada nivel
  return Math.round(120 + (nivel - 1) * 45);
}

function otorgarXpUsuario(xpGanada, monedasGanadas = 0) {
  usuario.monedas += monedasGanadas;
  usuario.xp += xpGanada;

  let nivelesSubidos = 0;
  let xpNecesaria = getXpRequeridaParaNivel(usuario.nivel);

  while (usuario.xp >= xpNecesaria) {
    usuario.xp -= xpNecesaria;
    usuario.nivel += 1;
    nivelesSubidos++;
    xpNecesaria = getXpRequeridaParaNivel(usuario.nivel);
  }

  StorageManager.set(STORAGE_KEYS.USUARIO, usuario);
  actualizarHUDUsuario();

  if (nivelesSubidos > 0) {
    setTimeout(() => {
      mostrarAnimacionSubidaNivel(usuario.nivel, monedasGanadas);
    }, 400);
  }

  return { nivelesSubidos, xpNecesaria };
}
function calcularRangoUsuario(nivel, totalAutos) {
  let rangoActual = DEFINICION_RANGOS[0];
  let siguienteRango = DEFINICION_RANGOS[1];

  for (let i = 0; i < DEFINICION_RANGOS.length; i++) {
    const r = DEFINICION_RANGOS[i];
    if (totalAutos >= r.autosMin) {
      rangoActual = r;
      siguienteRango = DEFINICION_RANGOS[i + 1] || null;
    }
  }

  // Progreso hacia el siguiente rango basado exclusivamente en spots cazados
  let progresoPorcentaje = 100;
  let hintTexto = "¡Has alcanzado el rango máximo!";

  if (siguienteRango) {
    const faltaAutos = Math.max(0, siguienteRango.autosMin - totalAutos);
    const baseAutos = siguienteRango.autosMin - rangoActual.autosMin;
    const progresoAutos = Math.min(1, Math.max(0, (totalAutos - rangoActual.autosMin) / (baseAutos || 1)));

    progresoPorcentaje = Math.round(progresoAutos * 100);
    hintTexto = `Faltan ${faltaAutos} spot${faltaAutos === 1 ? '' : 's'} para ${siguienteRango.nombre}`;
  }

  return { rangoActual, siguienteRango, progresoPorcentaje, hintTexto };
}

function actualizarHUDUsuario() {
  if (userLevelEl) userLevelEl.textContent = usuario.nivel;
  const xpMetaNivel = getXpRequeridaParaNivel(usuario.nivel);
  const porcentajeXp = Math.min(100, Math.max(0, Math.round((usuario.xp / xpMetaNivel) * 100)));
  if (xpBarEl) {
    xpBarEl.style.width = `${porcentajeXp}%`;
    xpBarEl.title = `Progreso de nivel: ${usuario.xp} / ${xpMetaNivel} XP (${porcentajeXp}%)`;
  }
  if (userCoinsEl) userCoinsEl.textContent = usuario.monedas.toLocaleString();
  if (profileLevelVal) profileLevelVal.textContent = usuario.nivel;

  // Actualizar Foto de Perfil en Header y Perfil
  if (userAvatarEl && usuario.avatar) userAvatarEl.src = usuario.avatar;
  if (profileUserAvatarEl && usuario.avatar) profileUserAvatarEl.src = usuario.avatar;
  
  // Actualizar Nombre y Bio
  if (profileUserNameEl && usuario.nombre) profileUserNameEl.textContent = usuario.nombre;
  if (profileUserBioEl && usuario.bio) profileUserBioEl.textContent = usuario.bio;

  const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[idiomaSeleccionado]) ? TRANSLATIONS[idiomaSeleccionado] : null;

  const totalAutos = (autos ? autos.length : 0) + (motos ? motos.length : 0);
  if (profileCarsTotal) {
    profileCarsTotal.textContent = `${totalAutos} ${dict ? dict.vehiclesHunted : 'vehículos cazados'}`;
  }

  const { rangoActual, siguienteRango, progresoPorcentaje, hintTexto } = calcularRangoUsuario(usuario.nivel, totalAutos);

  const nombreRangoActual = (dict && dict.rankNames && dict.rankNames[rangoActual.id]) ? dict.rankNames[rangoActual.id] : rangoActual.nombre;
  const tituloRangoActual = (dict && dict.rankTitles && dict.rankTitles[rangoActual.id]) ? dict.rankTitles[rangoActual.id] : rangoActual.titulo;
  const nombreSiguienteRango = siguienteRango ? ((dict && dict.rankNames && dict.rankNames[siguienteRango.id]) ? dict.rankNames[siguienteRango.id] : siguienteRango.nombre) : null;

  // Actualizar insignia de rango en la barra superior (Header) con Medalla SVG real
  if (headerRankIcon) {
    headerRankIcon.innerHTML = generarSvgMedalla(rangoActual, 'hdr');
  }
  if (headerRankText) {
    headerRankText.textContent = nombreRangoActual;
    headerRankText.style.color = rangoActual.colorPrincipal;
  }
  if (headerRankBadge) {
    headerRankBadge.style.borderColor = rangoActual.colorPrincipal;
    headerRankBadge.style.boxShadow = `0 4px 14px rgba(0, 0, 0, 0.4), 0 0 10px ${rangoActual.colorPrincipal}40`;
  }

  // Actualizar tarjeta de perfil con Medalla SVG
  if (profileRankCrown) {
    profileRankCrown.innerHTML = `<span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; overflow:hidden;">${generarSvgMedalla(rangoActual, 'crwn')}</span>`;
  }
  if (userTierPill) {
    userTierPill.innerHTML = `
      <span style="display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; overflow:hidden; margin-right:4px;">
        ${generarSvgMedalla(rangoActual, 'pill')}
      </span>
      <span>${nombreRangoActual}</span>
    `;
    userTierPill.className = `rank-tier-pill ${rangoActual.badgeColor}`;
    userTierPill.style.color = rangoActual.colorPrincipal;
    userTierPill.style.borderColor = rangoActual.colorPrincipal;
  }
  if (userRankTitle) {
    const handle = usuario.username ? `@${usuario.username}` : '@juliospotter';
    userRankTitle.textContent = `${handle} • ${tituloRangoActual}`;
  }

  if (nextRankName) {
    nextRankName.innerHTML = siguienteRango ? `
      <span style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; overflow:hidden; margin-right:4px; vertical-align:middle;">
        ${generarSvgMedalla(siguienteRango, 'nxt')}
      </span>
      ${nombreSiguienteRango}
    ` : (dict ? dict.maxRankReached : '¡Rango Máximo!');
  }
  if (rankProgressPercent) {
    rankProgressPercent.textContent = `${progresoPorcentaje}%`;
  }
  if (rankProgressFill) {
    rankProgressFill.style.width = `${progresoPorcentaje}%`;
  }
  if (rankReqHint) {
    rankReqHint.textContent = hintTexto;
  }

  // Guardar estado del usuario en almacenamiento local
  StorageManager.set(STORAGE_KEYS.USUARIO, usuario);

  // Detección automática de subida de rango
  const ultimoRangoGuardado = localStorage.getItem('turbospotter_ultimo_rango_id');
  if (ultimoRangoGuardado && ultimoRangoGuardado !== rangoActual.id) {
    const idxAnterior = DEFINICION_RANGOS.findIndex(r => r.id === ultimoRangoGuardado);
    const idxActual = DEFINICION_RANGOS.findIndex(r => r.id === rangoActual.id);
    if (idxActual > idxAnterior) {
      setTimeout(() => {
        mostrarAnimacionSubidaRango(rangoActual);
      }, 700);
    }
  }
  localStorage.setItem('turbospotter_ultimo_rango_id', rangoActual.id);

  renderizarModalRangos(rangoActual, totalAutos);
}

function generarSvgMedalla(rango, prefix = 'main') {
  const p = rango.colorPrincipal;
  const s = rango.colorSecundario;
  const g = rango.colorGema;
  const id = `${prefix}_${rango.id}`;

  // ==========================================
  // 1. GENERACIÓN DE ALAS ESPECÍFICAS SEGÚN RANGO
  // ==========================================
  let alasSvg = '';
  if (rango.estiloAlas === 'basic') {
    // Novato: Alitas minimalistas compactas
    alasSvg = `
      <path d="M68 95 C52 90, 36 94, 32 100 C42 102, 54 105, 66 112 Z" fill="url(#${id}_wings)" opacity="0.9"/>
      <path d="M132 95 C148 90, 164 94, 168 100 C158 102, 146 105, 134 112 Z" fill="url(#${id}_wings)" opacity="0.9"/>
    `;
  } else if (rango.estiloAlas === 'feather2') {
    // Bronce: 2 hojas/plumas curvas forjadas de bronce
    alasSvg = `
      <path d="M64 90 C46 82, 28 88, 22 96 C34 98, 48 100, 60 108 C46 112, 34 120, 32 128 C44 125, 58 122, 70 126 Z" fill="url(#${id}_wings)"/>
      <path d="M136 90 C154 82, 172 88, 178 96 C166 98, 152 100, 140 108 C154 112, 166 120, 168 128 C156 125, 142 122, 130 126 Z" fill="url(#${id}_wings)"/>
    `;
  } else if (rango.estiloAlas === 'wing3') {
    // Plata: 3 alas escalonadas afiladas (como en la referencia)
    alasSvg = `
      <path d="M58 84 C38 76, 20 82, 14 90 C26 92, 42 94, 54 102 C38 106, 24 114, 22 122 C34 120, 48 118, 60 125 C48 130, 40 138, 38 145 C52 142, 66 134, 76 124 Z" fill="url(#${id}_wings)"/>
      <path d="M142 84 C162 76, 180 82, 186 90 C174 92, 158 94, 146 102 C162 106, 176 114, 178 122 C166 120, 152 118, 140 125 C152 130, 160 138, 162 145 C148 142, 134 134, 124 124 Z" fill="url(#${id}_wings)"/>
    `;
  } else if (rango.estiloAlas === 'eagle') {
    // Oro: Alas majestuosas de águila extendidas con cresta
    alasSvg = `
      <path d="M54 78 C30 68, 12 76, 6 86 C22 88, 40 92, 52 102 C34 106, 18 116, 16 125 C30 123, 46 120, 58 128 C44 134, 34 144, 32 152 C48 148, 64 138, 74 126 Z" fill="url(#${id}_wings)"/>
      <path d="M146 78 C170 68, 188 76, 194 86 C178 88, 160 92, 148 102 C166 106, 182 116, 184 125 C170 123, 154 120, 142 128 C156 134, 166 144, 168 152 C152 148, 136 138, 126 126 Z" fill="url(#${id}_wings)"/>
      <!-- Puntas doradas superiores -->
      <polygon points="56,76 44,60 62,68" fill="${g}"/>
      <polygon points="144,76 156,60 138,68" fill="${g}"/>
    `;
  } else if (rango.estiloAlas === 'energy_blades') {
    // Platino: Cuchillas afiladas tipo alerón de hiperauto
    alasSvg = `
      <path d="M58 80 L16 84 L38 98 L10 106 L36 118 L18 128 L68 124 Z" fill="url(#${id}_wings)" filter="url(#${id}_glow)"/>
      <path d="M142 80 L184 84 L162 98 L190 106 L164 118 L182 128 L132 124 Z" fill="url(#${id}_wings)" filter="url(#${id}_glow)"/>
      <line x1="16" y1="84" x2="68" y2="124" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
      <line x1="184" y1="84" x2="132" y2="124" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
    `;
  } else if (rango.estiloAlas === 'crystal_wings') {
    // Diamante: Alas de cristal multifacetado resplandeciente
    alasSvg = `
      <path d="M54 75 L12 80 L36 96 L8 108 L38 122 L20 136 L70 128 Z" fill="url(#${id}_wings)"/>
      <path d="M146 75 L188 80 L164 96 L192 108 L162 122 L180 136 L130 128 Z" fill="url(#${id}_wings)"/>
      <!-- Brillos poligonales de cristal -->
      <polygon points="36,96 12,80 32,70" fill="#ffffff" opacity="0.7"/>
      <polygon points="164,96 188,80 168,70" fill="#ffffff" opacity="0.7"/>
      <polygon points="38,122 8,108 34,102" fill="${g}" opacity="0.6"/>
      <polygon points="162,122 192,108 166,102" fill="${g}" opacity="0.6"/>
    `;
  } else if (rango.estiloAlas === 'dragon_horns') {
    // Maestro (Titán): Astas oscuras afiladas hacia arriba como en la referencia (Titán rojo/púrpura)
    alasSvg = `
      <path d="M56 86 C40 60, 24 40, 16 32 C26 48, 38 68, 48 86 C32 72, 18 64, 8 62 C22 78, 36 94, 52 104 C34 96, 20 94, 12 96 C28 108, 46 120, 66 126 Z" fill="url(#${id}_wings)" filter="url(#${id}_glow)"/>
      <path d="M144 86 C160 60, 176 40, 184 32 C174 48, 162 68, 152 86 C168 72, 182 64, 192 62 C178 78, 164 94, 148 104 C166 96, 180 94, 188 96 C172 108, 154 120, 134 126 Z" fill="url(#${id}_wings)" filter="url(#${id}_glow)"/>
      <!-- Espinas de energía secundaria -->
      <path d="M48 86 L20 44 L36 78 Z" fill="${p}" opacity="0.8"/>
      <path d="M152 86 L180 44 L164 78 Z" fill="${p}" opacity="0.8"/>
    `;
  } else {
    // Hypercar Legend (Olimpiano / Apex): Alas divinas radiantes con relámpagos dorados
    alasSvg = `
      <!-- Relámpagos Celestiales Superiores (como en Olimpiano de la referencia) -->
      <polygon points="100,6 110,22 102,24 114,38 98,28 104,24" fill="#fde047" filter="drop-shadow(0 0 8px #facc15)"/>
      <polygon points="40,24 54,34 46,38 60,50 44,44 48,38" fill="#fde047" opacity="0.9"/>
      <polygon points="160,24 146,34 154,38 140,50 156,44 152,38" fill="#fde047" opacity="0.9"/>

      <!-- Alas Celestiales Escalonadas Dobles -->
      <path d="M54 70 C30 52, 10 56, 2 64 C18 68, 38 74, 50 86 C28 88, 10 96, 6 106 C24 106, 44 106, 58 116 C38 120, 22 130, 20 142 C38 140, 58 132, 72 122 Z" fill="url(#${id}_wings)" filter="url(#${id}_glow)"/>
      <path d="M146 70 C170 52, 190 56, 198 64 C182 68, 162 74, 150 86 C172 88, 190 96, 194 106 C176 106, 156 106, 142 116 C162 120, 178 130, 180 142 C162 140, 142 132, 128 122 Z" fill="url(#${id}_wings)" filter="url(#${id}_glow)"/>
    `;
  }

  // ==========================================
  // 2. PEDESTAL / CINTA ESCALONADA INFERIOR
  // ==========================================
  let cintaInferior = `
    <path d="M68 136 L100 158 L132 136 L126 168 L100 184 L74 168 Z" fill="url(#${id}_ribbon)" filter="url(#${id}_glow)"/>
    <path d="M78 148 L100 164 L122 148 L118 172 L100 182 L82 172 Z" fill="${s}" opacity="0.85"/>
  `;

  // ==========================================
  // 3. FORMA Y TALLADO DE LA GEMA CENTRAL
  // ==========================================
  let gemaCentralSvg = '';
  if (rango.formaGema === 'circle') {
    // Novato: Disco central metálico
    gemaCentralSvg = `
      <circle cx="100" cy="78" r="18" fill="url(#${id}_gem)" filter="drop-shadow(0 0 6px ${g})"/>
      <circle cx="100" cy="78" r="12" fill="${s}" opacity="0.6"/>
      <circle cx="96" cy="74" r="4" fill="#ffffff" opacity="0.9"/>
    `;
  } else if (rango.formaGema === 'rhombus') {
    // Bronce: Rombo biselado con textura de remaches
    gemaCentralSvg = `
      <polygon points="100,54 122,78 100,102 78,78" fill="url(#${id}_gem)" filter="drop-shadow(0 0 8px ${g})"/>
      <polygon points="100,60 116,78 100,96 84,78" fill="${s}" opacity="0.65"/>
      <polygon points="100,66 110,78 100,90 90,78" fill="#ffffff" opacity="0.9"/>
      <!-- Remaches en los 4 extremos -->
      <circle cx="100" cy="50" r="2" fill="${g}"/>
      <circle cx="126" cy="78" r="2" fill="${g}"/>
      <circle cx="100" cy="106" r="2" fill="${g}"/>
      <circle cx="74" cy="78" r="2" fill="${g}"/>
    `;
  } else if (rango.formaGema === 'diamond_facet') {
    // Plata: Gema tallada con facetas de diamante (como en la foto de referencia)
    gemaCentralSvg = `
      <polygon points="100,50 124,78 100,106 76,78" fill="url(#${id}_gem)" filter="drop-shadow(0 0 10px ${g})"/>
      <!-- Facetas de luz -->
      <polygon points="100,50 124,78 100,78" fill="#ffffff" opacity="0.85"/>
      <polygon points="100,50 76,78 100,78" fill="${g}" opacity="0.75"/>
      <polygon points="100,106 124,78 100,78" fill="${s}" opacity="0.9"/>
      <polygon points="100,106 76,78 100,78" fill="${p}" opacity="0.85"/>
      <!-- Núcleo interior brillante -->
      <polygon points="100,62 112,78 100,94 88,78" fill="#ffffff" opacity="0.95"/>
    `;
  } else if (rango.formaGema === 'star_burst') {
    // Oro: Estrella de 8 puntas brillante con bisel dorado
    gemaCentralSvg = `
      <polygon points="100,48 107,68 128,70 112,84 118,104 100,92 82,104 88,84 72,70 93,68" fill="url(#${id}_gem)" filter="drop-shadow(0 0 12px ${g})"/>
      <polygon points="100,56 105,72 120,74 108,84 112,98 100,88 88,98 92,84 80,74 95,72" fill="#ffffff" opacity="0.9"/>
      <circle cx="100" cy="78" r="6" fill="#ffffff"/>
    `;
  } else if (rango.formaGema === 'hex_crystal') {
    // Platino: Cristal hexagonal tallado en 3D
    gemaCentralSvg = `
      <polygon points="100,52 122,65 122,91 100,104 78,91 78,65" fill="url(#${id}_gem)" filter="drop-shadow(0 0 12px ${g})"/>
      <polygon points="100,52 122,65 100,78" fill="#ffffff" opacity="0.9"/>
      <polygon points="122,65 122,91 100,78" fill="${s}" opacity="0.8"/>
      <polygon points="122,91 100,104 100,78" fill="${p}" opacity="0.7"/>
      <polygon points="100,104 78,91 100,78" fill="${s}" opacity="0.9"/>
      <polygon points="78,91 78,65 100,78" fill="${g}" opacity="0.7"/>
      <polygon points="78,65 100,52 100,78" fill="#ffffff" opacity="0.6"/>
      <circle cx="100" cy="78" r="4" fill="#ffffff"/>
    `;
  } else if (rango.formaGema === 'octahedron') {
    // Diamante: Octaedro tallado ultrabrillante
    gemaCentralSvg = `
      <polygon points="100,48 126,76 100,106 74,76" fill="url(#${id}_gem)" filter="drop-shadow(0 0 16px ${g})"/>
      <polygon points="100,48 126,76 100,76" fill="#ffffff" opacity="0.95"/>
      <polygon points="100,48 74,76 100,76" fill="#93c5fd" opacity="0.9"/>
      <polygon points="100,106 126,76 100,76" fill="#3b82f6" opacity="0.85"/>
      <polygon points="100,106 74,76 100,76" fill="#1d4ed8" opacity="0.95"/>
      <!-- Destello especular central -->
      <polygon points="100,64 110,76 100,88 90,76" fill="#ffffff"/>
    `;
  } else if (rango.formaGema === 'void_gem') {
    // Maestro (Titán): Rubí/Amatista con facetas oscuras y núcleo resplandeciente
    gemaCentralSvg = `
      <polygon points="100,50 126,64 126,92 100,106 74,92 74,64" fill="url(#${id}_gem)" filter="drop-shadow(0 0 16px ${g})"/>
      <polygon points="100,56 120,68 120,88 100,100 80,88 80,68" fill="#2e1065" opacity="0.85"/>
      <!-- Ojo central cósmico -->
      <polygon points="100,60 114,78 100,96 86,78" fill="${g}"/>
      <polygon points="100,66 108,78 100,90 92,78" fill="#ffffff"/>
    `;
  } else {
    // Hypercar Legend (Apex): Reactor nuclear/joya celestial de oro y rubí
    gemaCentralSvg = `
      <polygon points="100,46 128,62 128,94 100,110 72,94 72,62" fill="url(#${id}_gem)" filter="drop-shadow(0 0 20px #ff3366)"/>
      <polygon points="100,52 122,66 122,90 100,104 78,90 78,66" fill="#450a0a" opacity="0.9"/>
      <!-- Diamante de Oro Central -->
      <polygon points="100,58 116,78 100,98 84,78" fill="#fbbf24" filter="drop-shadow(0 0 8px #f59e0b)"/>
      <polygon points="100,64 110,78 100,92 90,78" fill="#ffffff"/>
      <circle cx="100" cy="78" r="4" fill="#ffffff"/>
    `;
  }

  // ==========================================
  // 4. CORONA O DETALLES SUPERIORES DEL ESCUDO
  // ==========================================
  let coronaSuperior = '';
  if (rango.bordeEstilo === 'crown_spikes') {
    // 3 picos dorados de rey
    coronaSuperior = `
      <polygon points="84,24 88,10 94,22" fill="${g}"/>
      <polygon points="96,20 100,4 104,20" fill="#ffffff" filter="drop-shadow(0 0 4px ${g})"/>
      <polygon points="106,22 112,10 116,24" fill="${g}"/>
    `;
  } else if (rango.bordeEstilo === 'aero_spoiler') {
    // Alerón deportivo
    coronaSuperior = `
      <path d="M70 20 L100 14 L130 20 L126 24 L100 18 L74 24 Z" fill="${g}"/>
    `;
  } else if (rango.bordeEstilo === 'apex_crown') {
    // Corona de gloria y laureles
    coronaSuperior = `
      <polygon points="76,20 80,6 88,18" fill="#fbbf24"/>
      <polygon points="94,16 100,0 106,16" fill="#ffffff" filter="drop-shadow(0 0 8px #facc15)"/>
      <polygon points="112,18 120,6 124,20" fill="#fbbf24"/>
    `;
  }

  return `
    <svg class="medal-svg-artwork" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradientes dinámicos con prefijo único -->
        <linearGradient id="${id}_shield" x1="100" y1="20" x2="100" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="30%" stop-color="${p}"/>
          <stop offset="100%" stop-color="${s}"/>
        </linearGradient>

        <linearGradient id="${id}_shield_inner" x1="100" y1="30" x2="100" y2="135" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
          <stop offset="45%" stop-color="${p}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${s}" stop-opacity="0.85"/>
        </linearGradient>

        <linearGradient id="${id}_wings" x1="20" y1="60" x2="180" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="45%" stop-color="${p}"/>
          <stop offset="100%" stop-color="${s}"/>
        </linearGradient>

        <linearGradient id="${id}_ribbon" x1="100" y1="130" x2="100" y2="185" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${g}"/>
          <stop offset="100%" stop-color="${s}"/>
        </linearGradient>

        <linearGradient id="${id}_gem" x1="100" y1="50" x2="100" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="${g}"/>
          <stop offset="100%" stop-color="${p}"/>
        </linearGradient>

        <filter id="${id}_glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="${p}" flood-opacity="0.45"/>
        </filter>
      </defs>

      <!-- 1. Cinta Escalonada Inferior -->
      ${cintaInferior}

      <!-- 2. Alas Personalizadas Según Rango -->
      ${alasSvg}

      <!-- 3. Escudo Hexagonal Biselado Principal -->
      <polygon points="100,20 148,46 148,104 100,130 52,104 52,46" fill="url(#${id}_shield)" filter="url(#${id}_glow)"/>
      <polygon points="100,24 144,48 144,102 100,126 56,102 56,48" fill="#0f172a" opacity="0.9"/>
      <polygon points="100,30 138,52 138,98 100,120 62,98 62,52" fill="url(#${id}_shield_inner)"/>

      <!-- 4. Corona / Detalles Superiores del Escudo -->
      ${coronaSuperior}

      <!-- 5. Gema / Emblema Central Único -->
      ${gemaCentralSvg}

      <!-- Brillo Central Especular -->
      <circle cx="100" cy="38" r="1.5" fill="#ffffff" opacity="0.8"/>
    </svg>
  `;
}

function renderizarModalRangos(rangoActual, totalAutos) {
  if (!rankHeroDisplay) return;

  const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[idiomaSeleccionado]) ? TRANSLATIONS[idiomaSeleccionado] : null;

  const svgMedalla = generarSvgMedalla(rangoActual);
  const puntosLp = rangoActual.lp;
  const nombreRangoHero = (dict && dict.rankNames && dict.rankNames[rangoActual.id]) ? dict.rankNames[rangoActual.id] : rangoActual.nombre;
  const tituloRangoHero = (dict && dict.rankTitles && dict.rankTitles[rangoActual.id]) ? dict.rankTitles[rangoActual.id] : rangoActual.titulo;

  const txtPillHeader = document.querySelector('.rank-header-pill');
  if (txtPillHeader && dict && dict.rankHeaderPill) {
    txtPillHeader.textContent = dict.rankHeaderPill;
  }

  const txtLevel = dict ? dict.rankPilotLevel : "Nivel Piloto";
  const txtHunts = dict ? dict.rankConfirmedHunts : "Cazas Confirmadas";
  const txtPoints = dict ? dict.rankSpotterPoints : "Puntos Spotter";
  const txtViewAll = dict ? dict.rankViewAll : "Ver todos los rangos";
  const txtHideAll = dict ? dict.rankHideAll : "Ocultar otros rangos";
  const txtYourRank = dict ? dict.rankYourRankTag : "TU RANGO";

  rankHeroDisplay.innerHTML = `
    <!-- Escenario Iluminado de la Medalla -->
    <div class="medal-display-stage">
      <div class="medal-ambient-glow" style="background: ${rangoActual.colorPrincipal};"></div>
      ${svgMedalla}
    </div>

    <!-- Título y Puntuación Estilo Competitivo: ej. PLATA • 83 LP -->
    <h2 class="rank-hero-title" style="color: ${rangoActual.colorPrincipal};">
      ${nombreRangoHero}
    </h2>

    <div class="rank-hero-points">
      <strong>${puntosLp} LP</strong> • ${tituloRangoHero}
    </div>

    <!-- Métricas del Piloto que lo colocan en este Rango -->
    <div class="rank-hero-stats-row">
      <div class="rank-stat-mini">
        <span class="label">${txtLevel}</span>
        <span class="val">Lv.${usuario.nivel}</span>
      </div>
      <div class="rank-stat-mini">
        <span class="label">${txtHunts}</span>
        <span class="val">${totalAutos}</span>
      </div>
      <div class="rank-stat-mini">
        <span class="label">${txtPoints}</span>
        <span class="val">6,950</span>
      </div>
    </div>

    <!-- Opción para Ver Todos los Rangos -->
    <button class="btn-toggle-all-ranks" id="btn-toggle-all-ranks">
      <span>${txtViewAll}</span>
      <span class="arrow-icon">▼</span>
    </button>

    <!-- Cajón desplegable con la lista completa de rangos -->
    <div class="all-ranks-drawer" id="all-ranks-drawer">
      ${DEFINICION_RANGOS.map((r, idx) => {
        const indiceMiRango = DEFINICION_RANGOS.findIndex(item => item.id === rangoActual.id);
        const estaDesbloqueado = idx <= indiceMiRango;
        const esMiRango = r.id === rangoActual.id;
        const svgCard = generarSvgMedalla(r, `drw_${r.id}`);
        const rNombre = (dict && dict.rankNames && dict.rankNames[r.id]) ? dict.rankNames[r.id] : r.nombre;
        const rTitulo = (dict && dict.rankTitles && dict.rankTitles[r.id]) ? dict.rankTitles[r.id] : r.titulo;
        const rReq = `<strong>${r.autosMin}+</strong> autos cazados • <em>${rTitulo}</em>`;

        return `
          <div class="drawer-rank-card ${esMiRango ? 'current' : ''} ${!estaDesbloqueado ? 'locked' : ''}">
            <div class="drawer-rank-icon" title="${estaDesbloqueado ? rNombre : 'Rango Bloqueado'}">
              ${svgCard}
            </div>
            <div class="drawer-rank-details">
              <div class="drawer-rank-header">
                <h4 style="color: ${estaDesbloqueado ? r.colorPrincipal : '#64748b'};">${estaDesbloqueado ? rNombre : `${rNombre}`}</h4>
                ${esMiRango ? `<span class="drawer-current-tag">${txtYourRank}</span>` : ''}
                ${!estaDesbloqueado ? `<span class="drawer-locked-tag">🔒 Bloqueado</span>` : ''}
              </div>
              <div class="drawer-rank-req">
                ${rReq}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Listener para desplegar y colapsar todos los rangos
  const btnToggleRanks = document.getElementById('btn-toggle-all-ranks');
  const drawerRanks = document.getElementById('all-ranks-drawer');
  if (btnToggleRanks && drawerRanks) {
    btnToggleRanks.addEventListener('click', () => {
      const estaAbierto = drawerRanks.classList.toggle('open');
      btnToggleRanks.classList.toggle('active', estaAbierto);
      const spanTexto = btnToggleRanks.querySelector('span:first-child');
      if (spanTexto) {
        spanTexto.textContent = estaAbierto ? txtHideAll : txtViewAll;
      }
    });
  }
}

// Función para recompensar al cazar un auto
function agregarRecompensaSpot(rareza) {
  let monedasGanadas = 20;
  let xpGanada = 25;

  if (rareza === 'raro') {
    monedasGanadas = 45;
    xpGanada = 50;
  } else if (rareza === 'epico') {
    monedasGanadas = 100;
    xpGanada = 90;
  } else if (rareza === 'legendario') {
    monedasGanadas = 220;
    xpGanada = 180;
  }

  otorgarXpUsuario(xpGanada, monedasGanadas);
}

// Elementos del DOM
const gridGarageUnified = document.getElementById('garage-unified-grid');
const countCarsBadge = document.getElementById('count-cars-badge');
const countMotosBadge = document.getElementById('count-motos-badge');
const garageModeTitle = document.getElementById('garage-mode-title');
const segBtnCars = document.getElementById('seg-btn-cars');
const segBtnMotos = document.getElementById('seg-btn-motos');
const feedGrid = document.getElementById('feed-grid');
const rankingPodium = document.getElementById('ranking-podium');
const rankingList = document.getElementById('ranking-list');

// Estado del Garaje: 'cars' o 'motos'
let modoGarajeActual = 'cars';
// Modo de visualización: 'all' (cuadrícula normal) o 'brands' (Mis Carros agrupados por marca)
let vistaGarajeModo = 'all';
// Marcas plegadas por el usuario (recordar estado mientras navega)
let marcasPlegadas = {};
// Modelos específicos plegados por el usuario
let modelosPlegados = {};

const filterButtons = document.querySelectorAll('.filter-chip');
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.app-view');
const sectionDescription = document.getElementById('section-description');

const cameraModal = document.getElementById('camera-modal');
const btnNavCamera = document.getElementById('btn-nav-camera');
const btnShootPhoto = document.getElementById('btn-shoot-photo');
const btnCloseCamera = document.getElementById('btn-close-camera');
const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const cameraCapturedPreview = document.getElementById('camera-captured-preview');
const cameraStatusTag = document.getElementById('camera-status-tag');
const btnSwitchCamera = document.getElementById('btn-switch-camera');
const cameraFallback = document.getElementById('camera-fallback');
const cameraFileInput = document.getElementById('camera-file-input');
const cameraSpotForm = document.getElementById('camera-spot-form');
const cameraControlsDefault = document.getElementById('camera-controls-default');
const spotCustomName = document.getElementById('spot-custom-name');
const spotBrandInput = document.getElementById('spot-brand-input');
const spotPowerInput = document.getElementById('spot-power-input');
const spotPriceInput = document.getElementById('spot-price-input');
const spotDetectedRarity = document.getElementById('spot-detected-rarity');
const btnSaveSpot = document.getElementById('btn-save-spot');
const btnRetakePhoto = document.getElementById('btn-retake-photo');
const btnTypeToggles = document.querySelectorAll('.btn-type-toggle');

const aiScanningOverlay = document.getElementById('ai-scanning-overlay');
const aiScanStatusText = document.getElementById('ai-scan-status-text');

// Endpoint del Backend Seguro en la Nube (Render Cloud AI)
const CLOUD_API_URL = 'https://turbospotter.onrender.com/api/identify';
const LOCAL_API_URL = 'http://localhost:3001/api/identify';

// En localhost usa el servidor local; en dispositivos móviles (Android APK/Play Store) o Web usa la nube
const BACKEND_ENDPOINT = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? LOCAL_API_URL
  : CLOUD_API_URL;

// ========================================================
// NAVEGACIÓN ENTRE VISTAS (Feed, Garaje, Ranking, Perfil)
// ========================================================
const descriptions = {
  garage: "Tu garaje virtual: navega fácilmente entre tu colección de autos y motos.",
  feed: "Avistamientos en vivo compartidos por la comunidad de spotters.",
  friends: "Club de amigos spotters: conecta, comparte y compite en tiempo real.",
  ranking: "Tabla de clasificación global y trofeos de los mejores spotters.",
  profile: "Panel de control del piloto: garaje, tienda, misiones y estatus Pro."
};

function cambiarVista(target) {
  if (target === 'camera') {
    abrirCamara();
    return;
  }

  // Actualizar estado de los botones de la barra inferior
  navItems.forEach(item => {
    if (item.dataset.target === target) {
      item.classList.add('active');
    } else if (item.dataset.target !== 'camera') {
      item.classList.remove('active');
    }
  });

  // Mostrar la vista correspondiente
  views.forEach(v => {
    if (v.id === `view-${target}`) {
      v.classList.add('active');
    } else {
      v.classList.remove('active');
    }
  });

  if (sectionDescription && descriptions[target]) {
    sectionDescription.textContent = descriptions[target];
  }

  // Si entra a perfil, actualizar datos frescos
  if (target === 'profile') {
    actualizarHUDUsuario();
  }
}

navItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    cambiarVista(target);
  });
});

// Navegar a la vista de Perfil al hacer clic en el avatar/nivel de la barra superior
if (btnHeaderProfile) {
  btnHeaderProfile.style.cursor = 'pointer';
  btnHeaderProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    cambiarVista('profile');
  });
}

// ========================================================
// INTERACTIVIDAD DEL MENÚ DE PERFIL Y SUBMODALES
// ========================================================
const modalShop = document.getElementById('modal-shop');
const modalMissions = document.getElementById('modal-missions');
const modalPro = document.getElementById('modal-pro');
const btnUpgradePro = document.getElementById('btn-upgrade-pro');
const bannerGoPro = document.getElementById('banner-go-pro');
const btnSubscribePro = document.getElementById('btn-subscribe-pro');
const btnClaimM1 = document.getElementById('btn-claim-m1');

// Abrir modales o vistas según el icono tocado
document.querySelectorAll('.app-icon-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    if (action === 'open-pro') {
      if (modalPro) modalPro.showModal();
    } else if (action === 'open-shop') {
      if (modalShop) modalShop.showModal();
    } else if (action === 'open-inventory') {
      abrirInventario();
    } else if (action === 'go-garage') {
      cambiarVista('garage');
    } else if (action === 'open-missions') {
      if (modalMissions) modalMissions.showModal();
    } else if (action === 'open-medals') {
      if (modalRanks) {
        modalRanks.showModal();
      } else {
        alert("🎖️ Medallas del Cazador: Tienes 4 insignias desbloqueadas (Primer Spot, Ojo de Lince, Cazador Nocturno y Rey del Paddock).");
      }
    }
  });
});

// Abrir modal de rangos al hacer click en la píldora o caja de rango en perfil
if (userTierPill) {
  userTierPill.style.cursor = 'pointer';
  userTierPill.title = 'Toca para ver la tabla completa de rangos';
  userTierPill.addEventListener('click', () => {
    if (modalRanks) modalRanks.showModal();
  });
}

const rankProgressBox = document.getElementById('rank-progress-box');
if (rankProgressBox) {
  rankProgressBox.style.cursor = 'pointer';
  rankProgressBox.title = 'Toca para ver el escalafón de rangos';
  rankProgressBox.addEventListener('click', () => {
    if (modalRanks) modalRanks.showModal();
  });
}

// Botón de compra Pro simulado
if (btnSubscribePro) {
  btnSubscribePro.addEventListener('click', () => {
    usuario.isPro = true;
    usuario.monedas += 5000;
    usuario.xp = 100;
    usuario.nivel += 5;
    StorageManager.set(STORAGE_KEYS.USUARIO, usuario);
    actualizarHUDUsuario();
    if (modalPro) modalPro.close();
    alert("👑 ¡Bienvenido a TurboSpotter PRO! Ahora tienes spottings ilimitados, insignia dorada y +5,000 Nitrio de bienvenida.");
  });
}

// ========================================================
// SISTEMA DE TIENDA DE ARTÍCULOS ESTILO 'LIFTOFF STORE'
// ========================================================
const catalogoBordes = [
  { 
    id: 'avatar-border-steel', 
    nombre: 'Sombra de Acero', 
    subtitulo: 'Borde de Perfil', 
    precio: 150, 
    clase: 'avatar-border-default', 
    nivel1: 33, 
    nivel2: 50,
    desc: 'Marco biselado de acero forjado con acabado mate automotriz.' 
  },
  { 
    id: 'avatar-border-sapphire', 
    nombre: 'Brillo de Zafiro', 
    subtitulo: 'Borde de Perfil', 
    precio: 250, 
    clase: 'avatar-border-neon-red', 
    nivel1: 33, 
    nivel2: 50,
    desc: 'Cristal facetado de zafiro cobalto con halo de energía azul.' 
  },
  { 
    id: 'avatar-border-gold', 
    nombre: 'Corona de Oro 24K', 
    subtitulo: 'Borde de Perfil', 
    precio: 400, 
    clase: 'avatar-border-gold', 
    nivel1: 33, 
    nivel2: 50,
    desc: 'Borde dorado reluciente reservado para spotters de prestigio.' 
  },
  { 
    id: 'avatar-border-cyber-purple', 
    nombre: 'Amatista Cyberpunk', 
    subtitulo: 'Borde de Perfil', 
    precio: 600, 
    clase: 'avatar-border-cyber-purple', 
    nivel1: 33, 
    nivel2: 50,
    desc: 'Resplandor místico violeta con destellos de plasma.' 
  },
  { 
    id: 'avatar-border-carbon-emerald', 
    nombre: 'Esmeralda Paddock', 
    subtitulo: 'Borde de Perfil', 
    precio: 750, 
    clase: 'avatar-border-carbon-emerald', 
    nivel1: 33, 
    nivel2: 50,
    desc: 'Fibra de carbono ultraligera con halo verde competición.' 
  },
  { 
    id: 'avatar-border-rgb-rainbow', 
    nombre: 'Chroma RGB Gaming', 
    subtitulo: 'Borde de Perfil', 
    precio: 1000, 
    clase: 'avatar-border-rgb-rainbow', 
    nivel1: 33, 
    nivel2: 50,
    desc: 'Espectro rotativo multicolor estilo setup gamer.' 
  }
];

// Temas Prismáticos (con degradados duales y split circles)
const catalogoTemasPrismaticos = [
  { 
    id: 'theme-horizonte', 
    nombre: 'Horizonte del Anochecer', 
    categoria: 'Temas Prismáticos', 
    precio: 500, 
    clase: 'theme-gold-paddock', 
    colorLeft: '#ea580c', 
    colorRight: '#7c3aed',
    desc: 'Degradado naranja atardecer y violeta de circuito nocturno.' 
  },
  { 
    id: 'theme-emulsion', 
    nombre: 'Emulsión de Asfalto', 
    categoria: 'Temas Prismáticos', 
    precio: 500, 
    clase: 'theme-electric-blue', 
    colorLeft: '#38bdf8', 
    colorRight: '#1e293b',
    desc: 'Contraste frío de cian brillante y asfalto mojado.' 
  },
  { 
    id: 'theme-neon', 
    nombre: 'Neón Cyberpunk', 
    categoria: 'Temas Prismáticos', 
    precio: 500, 
    clase: 'theme-amethyst-shadow', 
    colorLeft: '#f43f5e', 
    colorRight: '#8b5cf6',
    desc: 'Aura futurista de magenta eléctrico y púrpura oscuro.' 
  },
  { 
    id: 'theme-escala-carmesi', 
    nombre: 'Escala Carmesí', 
    categoria: 'Temas Prismáticos', 
    precio: 500, 
    clase: 'theme-cyber-pink', 
    colorLeft: '#ef4444', 
    colorRight: '#450a0a',
    desc: 'Fuego bermellón y rojo carmesí de hiperauto.' 
  }
];

// Temas de Color (Tonales de 125 gemas como en la referencia)
const catalogoTemasColor = [
  { 
    id: 'theme-cereza-oscura', 
    nombre: 'Cereza Oscura', 
    categoria: 'Temas de Color', 
    precio: 125, 
    clase: 'theme-cyber-pink', 
    colorLeft: '#dc2626', 
    colorRight: '#300a0a',
    desc: 'Tono vino y cereza profundo.' 
  },
  { 
    id: 'theme-lima-oscura', 
    nombre: 'Lima Oscura', 
    categoria: 'Temas de Color', 
    precio: 125, 
    clase: 'theme-emerald-racer', 
    colorLeft: '#10b981', 
    colorRight: '#062e1e',
    desc: 'Verde bosque y lima de pista británica.' 
  },
  { 
    id: 'theme-cereza-clara', 
    nombre: 'Cereza Clara', 
    categoria: 'Temas de Color', 
    precio: 125, 
    clase: 'theme-gold-paddock', 
    colorLeft: '#f87171', 
    colorRight: '#fef2f2',
    desc: 'Tonos suaves y brillantes rosados.' 
  },
  { 
    id: 'theme-lima-clara', 
    nombre: 'Lima Clara', 
    categoria: 'Temas de Color', 
    precio: 125, 
    clase: 'theme-electric-blue', 
    colorLeft: '#34d399', 
    colorRight: '#ecfdf5',
    desc: 'Menta fresca y cian translúcido.' 
  }
];

let bordesDesbloqueados = StorageManager.get(STORAGE_KEYS.BORDES_DESBLOQUEADOS, ['avatar-border-steel']);
let bordeEquipado = StorageManager.get(STORAGE_KEYS.BORDE_EQUIPADO, 'avatar-border-steel');

let temasDesbloqueados = StorageManager.get(STORAGE_KEYS.TEMAS_DESBLOQUEADOS, ['theme-horizonte']);
let temaEquipado = StorageManager.get(STORAGE_KEYS.TEMA_EQUIPADO, 'theme-horizonte');

// Aplicar customizaciones activas al DOM
function aplicarCustomizacionesActivas() {
  // Aplicar tema al body
  document.body.className = document.body.className
    .split(' ')
    .filter(c => !c.startsWith('theme-'))
    .join(' ')
    .trim();

  // Buscar clase del tema
  const temaEncontrado = [...catalogoTemasPrismaticos, ...catalogoTemasColor].find(t => t.id === temaEquipado);
  const claseTema = temaEncontrado ? temaEncontrado.clase : 'theme-cyber-pink';
  document.body.classList.add(claseTema);

  // Aplicar borde a los avatares principales (Header y Perfil)
  const avatarRingHeader = document.querySelector('.avatar-ring');
  const profileAvatarLg = document.querySelector('.profile-img-lg');

  const bordeEncontrado = catalogoBordes.find(b => b.id === bordeEquipado);
  const claseBorde = bordeEncontrado ? bordeEncontrado.clase : 'avatar-border-default';

  [avatarRingHeader, profileAvatarLg].forEach(el => {
    if (el) {
      catalogoBordes.forEach(b => el.classList.remove(b.clase));
      el.classList.add(claseBorde);
    }
  });

  // Actualizar gemas en la tienda
  const shopUserGemsVal = document.getElementById('shop-user-gems-val');
  if (shopUserGemsVal) {
    shopUserGemsVal.textContent = usuario.monedas.toLocaleString();
  }
}

// Configuración general de la tienda
function inicializarTiendaArticulos() {
  // Clic en la insignia de gemas en la barra superior abre la tienda de inmediato
  const currencyBadge = document.querySelector('.currency-badge');
  if (currencyBadge) {
    currencyBadge.style.cursor = 'pointer';
    currencyBadge.addEventListener('click', () => {
      abrirTienda();
    });
  }

  // Renderizar contenido
  renderizarTiendaBordes();
  renderizarTiendaTemas();
  aplicarCustomizacionesActivas();
}

function abrirTienda() {
  if (modalShop) {
    aplicarCustomizacionesActivas();
    renderizarTiendaBordes();
    renderizarTiendaTemas();
    modalShop.showModal();
  }
}

// ========================================================
// MODAL DE CONFIRMACIÓN DE COMPRA EN TIENDA
// ========================================================
const modalConfirmPurchase = document.getElementById('modal-confirm-purchase');
const confirmItemIconWrapper = document.getElementById('confirm-item-icon-wrapper');
const confirmItemIcon = document.getElementById('confirm-item-icon');
const confirmItemTitle = document.getElementById('confirm-item-title');
const confirmItemDesc = document.getElementById('confirm-item-desc');
const confirmItemPrice = document.getElementById('confirm-item-price');
const btnCancelPurchase = document.getElementById('btn-cancel-purchase');
const btnProceedPurchase = document.getElementById('btn-proceed-purchase');

let pendingPurchaseAction = null;

function solicitarConfirmacionCompra({ titulo, desc, precio, iconoHtml, onConfirmar }) {
  if (!modalConfirmPurchase) {
    if (confirm(`¿Deseas comprar "${titulo}" por ${precio} de Nitrio?`)) {
      onConfirmar();
    }
    return;
  }

  if (confirmItemTitle) confirmItemTitle.textContent = `¿Comprar "${titulo}"?`;
  if (confirmItemDesc) confirmItemDesc.textContent = desc || "Se descontará el Nitrio de tu balance y se equipará inmediatamente.";
  if (confirmItemPrice) confirmItemPrice.textContent = `${precio.toLocaleString()} 💎`;
  
  if (confirmItemIconWrapper && iconoHtml) {
    confirmItemIconWrapper.innerHTML = iconoHtml;
  }

  pendingPurchaseAction = onConfirmar;
  modalConfirmPurchase.showModal();
}

if (btnCancelPurchase) {
  btnCancelPurchase.addEventListener('click', () => {
    pendingPurchaseAction = null;
    if (modalConfirmPurchase) modalConfirmPurchase.close();
  });
}

if (btnProceedPurchase) {
  btnProceedPurchase.addEventListener('click', () => {
    if (typeof pendingPurchaseAction === 'function') {
      const action = pendingPurchaseAction;
      pendingPurchaseAction = null;
      if (modalConfirmPurchase) modalConfirmPurchase.close();
      action();
    }
  });
}

// 1. Renderizar Bordes de Perfil / Avatar (Estilo TurboSpotter Custom Garage)
function renderizarTiendaBordes() {
  const container = document.getElementById('shop-borders-container');
  if (!container) return;
  container.innerHTML = '';

  catalogoBordes.forEach(borde => {
    const esDesbloqueado = bordesDesbloqueados.includes(borde.id);
    const esEquipado = bordeEquipado === borde.id;

    const card = document.createElement('div');
    card.className = `shop-border-card ${esEquipado ? 'equipped-card' : ''}`;
    card.innerHTML = `
      <div class="shop-border-preview-wrap">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80" class="shop-char-img ${borde.clase}" alt="${borde.nombre}" />
      </div>

      <h4 class="shop-border-card-title">${borde.nombre}</h4>
      <span class="shop-border-card-sub">${borde.desc}</span>

      <!-- Botón de Precio o Equipar -->
      ${!esDesbloqueado ? `
        <button class="shop-action-btn" data-border-id="${borde.id}">
          <span>💎 ${borde.precio}</span>
        </button>
      ` : esEquipado ? `
        <button class="shop-action-btn equipped">✓ Equipado</button>
      ` : `
        <button class="shop-action-btn equip-btn" data-border-id="${borde.id}">Equipar</button>
      `}
    `;

    // Manejador compra o equipar
    const btnAction = card.querySelector('.shop-action-btn');
    if (btnAction) {
      btnAction.addEventListener('click', () => {
        if (!esDesbloqueado) {
          solicitarConfirmacionCompra({
            titulo: borde.nombre,
            desc: `Desbloquear marco cosmético "${borde.nombre}". Se añadirá a tu inventario de bordes de avatar.`,
            precio: borde.precio,
            iconoHtml: `<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" class="${borde.clase}" style="width: 44px; height: 44px; border-radius: 50%;" />`,
            onConfirmar: () => {
              if (usuario.monedas >= borde.precio) {
                usuario.monedas -= borde.precio;
                bordesDesbloqueados.push(borde.id);
                bordeEquipado = borde.id;
                StorageManager.set(STORAGE_KEYS.USUARIO, usuario);
                StorageManager.set(STORAGE_KEYS.BORDES_DESBLOQUEADOS, bordesDesbloqueados);
                StorageManager.set(STORAGE_KEYS.BORDE_EQUIPADO, bordeEquipado);
                actualizarHUDUsuario();
                aplicarCustomizacionesActivas();
                renderizarTiendaBordes();
                alert(`🎉 ¡Has adquirido y equipado el borde: "${borde.nombre}"!`);
              } else {
                alert(`❌ Saldo insuficiente: necesitas ${borde.precio} de Nitrio y tienes ${usuario.monedas} de Nitrio.`);
              }
            }
          });
        } else if (!esEquipado) {
          bordeEquipado = borde.id;
          StorageManager.set(STORAGE_KEYS.BORDE_EQUIPADO, bordeEquipado);
          aplicarCustomizacionesActivas();
          renderizarTiendaBordes();
        }
      });
    }

    container.appendChild(card);
  });
}

// 2 & 3. Renderizar Temas Prismáticos y Temas de Color
function renderizarTiendaTemas() {
  const containerPrismatic = document.getElementById('shop-prismatic-themes-container');
  const containerSolid = document.getElementById('shop-solid-themes-container');

  function renderGroup(list, container) {
    if (!container) return;
    container.innerHTML = '';

    list.forEach(tema => {
      const esDesbloqueado = temasDesbloqueados.includes(tema.id);
      const esEquipado = temaEquipado === tema.id;

      const chip = document.createElement('div');
      chip.className = `shop-theme-card ${esEquipado ? 'active-theme' : ''}`;
      chip.innerHTML = `
        <div class="shop-theme-left">
          <div class="shop-color-orb" style="background: linear-gradient(135deg, ${tema.colorLeft} 50%, ${tema.colorRight} 50%); border-color: ${tema.colorLeft};"></div>
          <div class="shop-theme-meta">
            <h4>${tema.nombre}</h4>
            <span style="color: ${tema.colorLeft};">${tema.desc}</span>
          </div>
        </div>
        <div class="shop-theme-status">
          ${esEquipado ? '✓ Activo' : esDesbloqueado ? 'Usar' : `💎 ${tema.precio}`}
        </div>
      `;

      chip.addEventListener('click', () => {
        if (!esDesbloqueado) {
          solicitarConfirmacionCompra({
            titulo: tema.nombre,
            desc: `Desbloquear tema visual "${tema.nombre}". Cambia los acentos y atmósfera de la interfaz.`,
            precio: tema.precio,
            iconoHtml: `<div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, ${tema.colorLeft} 50%, ${tema.colorRight} 50%); border: 3px solid #ffffff; box-shadow: 0 0 16px ${tema.colorLeft};"></div>`,
            onConfirmar: () => {
              if (usuario.monedas >= tema.precio) {
                usuario.monedas -= tema.precio;
                temasDesbloqueados.push(tema.id);
                temaEquipado = tema.id;
                StorageManager.set(STORAGE_KEYS.USUARIO, usuario);
                StorageManager.set(STORAGE_KEYS.TEMAS_DESBLOQUEADOS, temasDesbloqueados);
                StorageManager.set(STORAGE_KEYS.TEMA_EQUIPADO, temaEquipado);
                actualizarHUDUsuario();
                aplicarCustomizacionesActivas();
                renderizarTiendaTemas();
                alert(`🎨 ¡Tema "${tema.nombre}" desbloqueado y aplicado!`);
              } else {
                alert(`❌ Saldo insuficiente: necesitas ${tema.precio} de Nitrio y tienes ${usuario.monedas} de Nitrio.`);
              }
            }
          });
        } else {
          temaEquipado = tema.id;
          StorageManager.set(STORAGE_KEYS.TEMA_EQUIPADO, temaEquipado);
          aplicarCustomizacionesActivas();
          renderizarTiendaTemas();
        }
      });

      container.appendChild(chip);
    });
  }

  renderGroup(catalogoTemasPrismaticos, containerPrismatic);
  renderGroup(catalogoTemasColor, containerSolid);
}

// ========================================================
// SISTEMA DE INVENTARIO PERSONAL DE SPOTTER
// ========================================================
const modalInventory = document.getElementById('modal-inventory');
const invTotalUnlocked = document.getElementById('inv-total-unlocked');
const invCountBorders = document.getElementById('inv-count-borders');
const invCountThemes = document.getElementById('inv-count-themes');
const invGridBorders = document.getElementById('inv-grid-borders');
const invGridThemes = document.getElementById('inv-grid-themes');
const invSecBorders = document.getElementById('inv-sec-borders');
const invSecThemes = document.getElementById('inv-sec-themes');
const invEmptyState = document.getElementById('inv-empty-state');
const invTabs = document.querySelectorAll('.inv-tab-btn');
const invBtnToShop = document.getElementById('inv-btn-to-shop');

let inventarioFiltroActual = 'all'; // 'all', 'borders', 'themes'

function abrirInventario() {
  if (!modalInventory) return;
  renderizarInventario();
  modalInventory.showModal();
}

function renderizarInventario() {
  if (!invGridBorders || !invGridThemes) return;
  invGridBorders.innerHTML = '';
  invGridThemes.innerHTML = '';

  // 1. Filtrar artículos que el usuario posee
  const misBordes = catalogoBordes.filter(b => bordesDesbloqueados.includes(b.id));
  const todosTemasCatalogo = [...catalogoTemasPrismaticos, ...catalogoTemasColor];
  const misTemas = todosTemasCatalogo.filter(t => temasDesbloqueados.includes(t.id));

  const totalComprados = misBordes.length + misTemas.length;
  const totalPosibles = catalogoBordes.length + todosTemasCatalogo.length;

  if (invTotalUnlocked) invTotalUnlocked.textContent = `${totalComprados}/${totalPosibles}`;
  if (invCountBorders) invCountBorders.textContent = `${misBordes.length}`;
  if (invCountThemes) invCountThemes.textContent = `${misTemas.length}`;

  // Mostrar estado vacío si no tiene nada comprado
  if (totalComprados === 0) {
    if (invEmptyState) invEmptyState.style.display = 'flex';
    if (invSecBorders) invSecBorders.style.display = 'none';
    if (invSecThemes) invSecThemes.style.display = 'none';
    return;
  } else {
    if (invEmptyState) invEmptyState.style.display = 'none';
  }

  // Filtrado por pestaña
  if (invSecBorders) {
    invSecBorders.style.display = (inventarioFiltroActual === 'all' || inventarioFiltroActual === 'borders') && misBordes.length > 0 ? 'flex' : 'none';
  }
  if (invSecThemes) {
    invSecThemes.style.display = (inventarioFiltroActual === 'all' || inventarioFiltroActual === 'themes') && misTemas.length > 0 ? 'flex' : 'none';
  }

  // Renderizar Bordes Desbloqueados
  misBordes.forEach(borde => {
    const esEquipado = bordeEquipado === borde.id;
    const card = document.createElement('div');
    card.className = `inv-item-card ${esEquipado ? 'equipped' : ''}`;
    card.innerHTML = `
      <div class="inv-item-preview-wrap">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" class="inv-item-avatar-img ${borde.clase}" alt="${borde.nombre}" />
      </div>
      <h5 class="inv-item-name">${borde.nombre}</h5>
      <span class="inv-item-type">Borde de Avatar</span>
      <button class="inv-equip-btn ${esEquipado ? 'equipped' : ''}">
        ${esEquipado ? '✓ Equipado' : 'Equipar'}
      </button>
    `;

    const btnEquip = card.querySelector('.inv-equip-btn');
    btnEquip.addEventListener('click', () => {
      if (bordeEquipado !== borde.id) {
        bordeEquipado = borde.id;
        StorageManager.set(STORAGE_KEYS.BORDE_EQUIPADO, bordeEquipado);
        aplicarCustomizacionesActivas();
        renderizarInventario();
        renderizarTiendaBordes();
      }
    });

    invGridBorders.appendChild(card);
  });

  // Renderizar Temas Desbloqueados
  misTemas.forEach(tema => {
    const esEquipado = temaEquipado === tema.id;
    const card = document.createElement('div');
    card.className = `inv-item-card ${esEquipado ? 'equipped' : ''}`;
    card.innerHTML = `
      <div class="inv-item-preview-wrap">
        <div class="inv-theme-orb" style="background: linear-gradient(135deg, ${tema.colorLeft} 50%, ${tema.colorRight} 50%); border-color: ${tema.colorLeft};"></div>
      </div>
      <h5 class="inv-item-name">${tema.nombre}</h5>
      <span class="inv-item-type">${tema.categoria || 'Tema Visual'}</span>
      <button class="inv-equip-btn ${esEquipado ? 'equipped' : ''}">
        ${esEquipado ? '✓ Activo' : 'Activar'}
      </button>
    `;

    const btnEquip = card.querySelector('.inv-equip-btn');
    btnEquip.addEventListener('click', () => {
      if (temaEquipado !== tema.id) {
        temaEquipado = tema.id;
        StorageManager.set(STORAGE_KEYS.TEMA_EQUIPADO, temaEquipado);
        aplicarCustomizacionesActivas();
        renderizarInventario();
        renderizarTiendaTemas();
      }
    });

    invGridThemes.appendChild(card);
  });
}

// Event Listeners de Tabs de Inventario
invTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    invTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    inventarioFiltroActual = tab.dataset.invTab;
    renderizarInventario();
  });
});

// Botón ir a la tienda desde inventario
if (invBtnToShop) {
  invBtnToShop.addEventListener('click', () => {
    if (modalInventory) modalInventory.close();
    abrirTienda();
  });
}

// Comprar paquetes de gemas en la tienda
document.querySelectorAll('.btn-buy-shop').forEach(btn => {
  btn.addEventListener('click', () => {
    const gemas = parseInt(btn.dataset.gems, 10) || 500;
    usuario.monedas += gemas;
    StorageManager.set(STORAGE_KEYS.USUARIO, usuario);
    actualizarHUDUsuario();
    aplicarCustomizacionesActivas();
    alert(`💎 ¡Compra exitosa! Has recibido +${gemas.toLocaleString()} de Nitrio.`);
  });
});

// Reclamar misión diaria
if (btnClaimM1) {
  btnClaimM1.addEventListener('click', () => {
    usuario.monedas += 100;
    usuario.xp += 40;
    actualizarHUDUsuario();
    btnClaimM1.disabled = true;
    btnClaimM1.textContent = "✓ Reclamada";
    btnClaimM1.style.background = "#10b981";
    alert("🎉 ¡Misión completada! +100 Nitrio y +40 XP añadidos a tu cuenta.");
  });
}

// Cerrar submodales con la cruz o haciendo clic afuera
document.querySelectorAll('.btn-close-submodal').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.dataset.close;
    const modal = document.getElementById(modalId);
    if (modal) modal.close();
  });
});

// Abrir modal de rangos al tocar la insignia de la barra superior
if (headerRankBadge) {
  headerRankBadge.addEventListener('click', () => {
    if (modalRanks) modalRanks.showModal();
  });
}

// Abrir modal de ajustes al tocar el engranaje
if (btnHeaderSettings) {
  btnHeaderSettings.addEventListener('click', () => {
    if (modalSettings) modalSettings.showModal();
  });
}

// Event listeners para las filas del menú de Configuración
document.querySelectorAll('.settings-row-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const act = btn.dataset.action;
    if (act === 'set-profile') {
      if (modalSettings) modalSettings.close();
      cambiarVista('profile');
    } else if (act === 'set-subscription') {
      if (modalSettings) modalSettings.close();
      if (modalPro) modalPro.showModal();
    } else if (act === 'set-themes') {
      if (modalSettings) modalSettings.close();
      abrirModalTema();
    } else if (act === 'set-stats') {
      alert(`📊 Estadísticas de Spotter:\n• Nivel: ${usuario.nivel}\n• Autos en Garaje: ${autos ? autos.length : 0}\n• Motos en Garaje: ${motos ? motos.length : 0}\n• Nitrio Disponible: ${usuario.monedas.toLocaleString()} 💎`);
    } else if (act === 'set-units') {
      alert("⚙️ Unidades de Medida:\nConfigurado en Sistema Métrico (km/h para velocidad, HP/CV para potencia de motor).");
    } else if (act === 'set-language') {
      abrirModalIdioma();
    } else if (act === 'set-account') {
      alert("👤 Cuenta & Seguridad:\nSesión iniciada como Julio Alonzo (@julio_spotter). Tu cuenta está sincronizada con Google Play Games.");
    } else if (act === 'set-data') {
      alert(`💾 Almacenamiento:\n• Base de datos local activa.\n• ${autos.length} fotos de autos almacenadas.\n• ${motos.length} fotos de motos almacenadas.`);
    } else if (act === 'set-faq') {
      alert("❓ Preguntas Frecuentes:\n1. ¿Cómo gano Nitrio? Spotteando autos raros y completando misiones.\n2. ¿Cómo subo de rango? Acumulando LP y capturando vehículos legendarios.");
    } else if (act === 'set-news') {
      alert("🕒 Novedades v2.4.0:\n• Nuevo garaje de personalización de avatares.\n• Tienda de temas cósmicos y prismáticos.\n• Inventario clasificado para spotters.");
    }
  });
});

// ========================================================
// SISTEMA DE INTERNACIONALIZACIÓN (I18N) - 5 IDIOMAS
// ========================================================
const TRANSLATIONS = {
  es: {
    garageCars: "Autos",
    garageMotos: "Motos",
    filterAll: "Todos",
    filterCommon: "Común",
    filterRare: "Raro",
    filterEpic: "Épico",
    filterLegendary: "Legendario",
    navFeed: "Feed",
    navGarage: "Garaje",
    navCamera: "Cámara",
    navFriends: "Amigos",
    navRanking: "Ranking",
    navProfile: "Perfil",
    friendsMyFriends: "Mis Amigos",
    friendsRequests: "Solicitudes",
    friendsAddBtn: "+ Añadir",
    friendsPlaceholder: "Buscar amigos por @usuario o nombre...",
    rankFriends: "Amigos",
    rankGlobal: "Global",
    rankRegional: "Regional",
    menuPro: "Pro",
    menuShop: "Tienda",
    menuGarage: "Garaje",
    menuInventory: "Inventario",
    menuMissions: "Misiones",
    menuRanks: "Rangos",
    settingsTitle: "Configuración",
    settingsUser: "Usuario",
    setProfile: "Perfil de Spotter",
    setAccount: "Cuenta & Seguridad",
    setPro: "Gestionar Suscripción Pro",
    setStats: "Estadísticas de Garaje",
    setStorage: "Almacenamiento Local",
    settingsPrefs: "Preferencias",
    setUnits: "Unidades de Potencia & Vel.",
    setUnitsSub: "HP / CV • km/h",
    setThemes: "Temas & Apariencia",
    setThemesSub: "Personalizar colores",
    setLanguage: "Idiomas",
    setNotifs: "Notificaciones",
    setNotifsSub: "Alertas de avistamientos cercanos",
    setGallery: "Guardar fotos en Galería",
    setGallerySub: "Almacenar copias de tus capturas en el carrete",
    setMorePrefs: "Otras preferencias",
    settingsResources: "Recursos",
    setFaq: "Preguntas Frecuentes",
    setNews: "Novedades & Actualizaciones",
    setReset: "Restablecer datos de fábrica",
    btnEditProfile: "✏️ Editar Perfil",
    tagLevel: "Nivel",
    editProfileTitle: "Editar Perfil de Spotter",
    editChooseAvatar: "Elige un avatar o sube una foto",
    editFullNameLabel: "Nombre Completo",
    editUsernameLabel: "Nombre de Usuario (@handle)",
    editBioLabel: "Biografía (Bio)",
    btnSaveProfile: "💾 Guardar Cambios",
    profileSavedAlert: "✅ ¡Perfil actualizado correctamente!",
    langModalTitle: "Seleccionar Idioma",
    langModalDesc: "Elige tu idioma entre los 5 más hablados del mundo.",
    langApplyBtn: "Aplicar Idioma",
    confirmLangKicker: "CAMBIAR IDIOMA",
    confirmLangTitle: "¿Cambiar el idioma de TurboSpotter?",
    confirmLangDesc: (name) => `La interfaz y todos los textos se actualizarán a ${name}.`,
    btnCancel: "Cancelar",
    btnConfirmLang: "Sí, cambiar idioma",
    rankHeaderPill: "TU RANGO ACTUAL",
    rankYourRankTag: "TU RANGO",
    rankPilotLevel: "Nivel Piloto",
    rankConfirmedHunts: "Cazas Confirmadas",
    rankSpotterPoints: "Puntos Spotter",
    rankViewAll: "Ver todos los rangos",
    rankHideAll: "Ocultar otros rangos",
    rankReqText: (lvl, cars, title) => `Nivel <strong>${lvl}+</strong> • <strong>${cars}+</strong> autos cazados • <em>${title}</em>`,
    vehiclesHunted: "vehículos cazados",
    nextRankPrefix: "Siguiente Rango:",
    maxRankReached: "¡Has alcanzado el rango máximo!",
    needLevelsCars: (l, c, r) => `Faltan ${l} nivel${l === 1 ? '' : 'es'} y ${c} auto${c === 1 ? '' : 's'} para ${r}`,
    rankNames: {
      novato: "Novato",
      bronce: "Bronce",
      plata: "Plata",
      oro: "Oro",
      platino: "Platino",
      diamante: "Diamante",
      maestro: "Maestro",
      hypercar: "Hypercar Legend"
    },
    rankTitles: {
      novato: "Observador Callejero",
      bronce: "Cazador Principiante",
      plata: "Spotter Urbano",
      oro: "Ojo de Lince",
      platino: "Cazador Élite",
      diamante: "Master Spotter",
      maestro: "Leyenda del Asfalto",
      hypercar: "Rey del Paddock"
    },
    langSavedAlert: "🌐 Idioma configurado: Español (Latinoamérica)"
  },
  en: {
    garageCars: "Cars",
    garageMotos: "Bikes",
    filterAll: "All",
    filterCommon: "Common",
    filterRare: "Rare",
    filterEpic: "Epic",
    filterLegendary: "Legendary",
    navFeed: "Feed",
    navGarage: "Garage",
    navCamera: "Camera",
    navFriends: "Friends",
    navRanking: "Leaderboard",
    navProfile: "Profile",
    friendsMyFriends: "My Friends",
    friendsRequests: "Requests",
    friendsAddBtn: "+ Add",
    friendsPlaceholder: "Search friends by @handle or name...",
    rankFriends: "Friends",
    rankGlobal: "Global",
    rankRegional: "Regional",
    menuPro: "Pro",
    menuShop: "Shop",
    menuGarage: "Garage",
    menuInventory: "Inventory",
    menuMissions: "Missions",
    menuRanks: "Ranks",
    settingsTitle: "Settings",
    settingsUser: "User",
    setProfile: "Spotter Profile",
    setAccount: "Account & Security",
    setPro: "Manage Pro Subscription",
    setStats: "Garage Statistics",
    setStorage: "Local Storage",
    settingsPrefs: "Preferences",
    setUnits: "Power & Speed Units",
    setUnitsSub: "HP / CV • km/h",
    setThemes: "Themes & Appearance",
    setThemesSub: "Customize colors",
    setLanguage: "Languages",
    setReset: "Factory Reset Data",
    btnEditProfile: "✏️ Edit Profile",
    tagLevel: "Level",
    editProfileTitle: "Edit Spotter Profile",
    editChooseAvatar: "Choose an avatar or upload a photo",
    editFullNameLabel: "Full Name",
    editUsernameLabel: "Username (@handle)",
    editBioLabel: "Biography (Bio)",
    btnSaveProfile: "💾 Save Changes",
    profileSavedAlert: "✅ Profile updated successfully!",
    langModalTitle: "Select Language",
    langModalDesc: "Choose your language among the 5 most spoken in the world.",
    langApplyBtn: "Apply Language",
    confirmLangKicker: "CHANGE LANGUAGE",
    confirmLangTitle: "Switch TurboSpotter language?",
    confirmLangDesc: (name) => `The interface and menus will switch to ${name}.`,
    btnCancel: "Cancel",
    btnConfirmLang: "Yes, switch language",
    rankHeaderPill: "YOUR CURRENT RANK",
    rankYourRankTag: "YOUR RANK",
    rankPilotLevel: "Spotter Level",
    rankConfirmedHunts: "Confirmed Spots",
    rankSpotterPoints: "Spotter Points",
    rankViewAll: "View all ranks",
    rankHideAll: "Hide other ranks",
    rankReqText: (lvl, cars, title) => `Level <strong>${lvl}+</strong> • <strong>${cars}+</strong> cars spotted • <em>${title}</em>`,
    vehiclesHunted: "vehicles spotted",
    nextRankPrefix: "Next Rank:",
    maxRankReached: "Maximum rank achieved!",
    needLevelsCars: (l, c, r) => `${l} level${l === 1 ? '' : 's'} and ${c} car${c === 1 ? '' : 's'} to ${r}`,
    rankNames: {
      novato: "Rookie",
      bronce: "Bronze",
      plata: "Silver",
      oro: "Gold",
      platino: "Platinum",
      diamante: "Diamond",
      maestro: "Master",
      hypercar: "Hypercar Legend"
    },
    rankTitles: {
      novato: "Street Observer",
      bronce: "Novice Hunter",
      plata: "Urban Spotter",
      oro: "Eagle Eye",
      platino: "Elite Hunter",
      diamante: "Master Spotter",
      maestro: "Asphalt Legend",
      hypercar: "King of Paddock"
    },
    langSavedAlert: "🌐 Language set: English"
  },
  zh: {
    garageCars: "汽车",
    garageMotos: "摩托",
    filterAll: "全部",
    filterCommon: "普通",
    filterRare: "稀有",
    filterEpic: "史诗",
    filterLegendary: "传说",
    navFeed: "动态",
    navGarage: "车库",
    navCamera: "相机",
    navFriends: "好友",
    navRanking: "排行",
    navProfile: "我的",
    friendsMyFriends: "我的好友",
    friendsRequests: "申请",
    friendsAddBtn: "+ 添加",
    friendsPlaceholder: "按 @用户名或姓名搜索...",
    rankFriends: "好友",
    rankGlobal: "全球",
    rankRegional: "地区",
    menuPro: "Pro",
    menuShop: "商店",
    menuGarage: "车库",
    menuInventory: "背包",
    menuMissions: "任务",
    menuRanks: "段位",
    settingsTitle: "设置",
    settingsUser: "用户",
    setProfile: "搜车人档案",
    setAccount: "账户与安全",
    setPro: "管理 Pro 会员",
    setStats: "车库统计",
    setStorage: "本地存储",
    settingsPrefs: "偏好设置",
    setUnits: "功率与速度单位",
    setUnitsSub: "HP / CV • km/h",
    setThemes: "主题与外观",
    setThemesSub: "自定义色彩",
    setLanguage: "语言",
    setNotifs: "通知",
    setNotifsSub: "附近发现警报",
    setGallery: "保存至相册",
    setGallerySub: "在相册中备份捕获照片",
    setMorePrefs: "更多偏好",
    settingsResources: "资源",
    setFaq: "常见问题",
    setNews: "更新日志",
    setReset: "恢复出厂设置",
    btnEditProfile: "✏️ 编辑资料",
    tagLevel: "等级",
    editProfileTitle: "编辑搜车人资料",
    editChooseAvatar: "选择头像或上传照片",
    editFullNameLabel: "姓名",
    editUsernameLabel: "用户名 (@handle)",
    editBioLabel: "个人简介 (Bio)",
    btnSaveProfile: "💾 保存修改",
    profileSavedAlert: "✅ 个人资料已更新！",
    langModalTitle: "选择语言",
    langModalDesc: "在全球使用人数最多的 5 种语言中选择。",
    langApplyBtn: "应用语言",
    confirmLangKicker: "切换语言",
    confirmLangTitle: "确定要切换 TurboSpotter 语言吗？",
    confirmLangDesc: (name) => `界面和所有文本将切换为 ${name}。`,
    btnCancel: "取消",
    btnConfirmLang: "确认切换",
    rankHeaderPill: "你当前的段位",
    rankYourRankTag: "当前段位",
    rankPilotLevel: "车手等级",
    rankConfirmedHunts: "已确认捕获",
    rankSpotterPoints: "搜车积分",
    rankViewAll: "查看全部段位",
    rankHideAll: "收起其他段位",
    rankReqText: (lvl, cars, title) => `等级 <strong>${lvl}+</strong> • <strong>${cars}+</strong> 辆车 • <em>${title}</em>`,
    vehiclesHunted: "辆已捕获载具",
    nextRankPrefix: "下一段位:",
    maxRankReached: "已达到最高段位！",
    needLevelsCars: (l, c, r) => `距离 ${r} 还需 ${l} 级和 ${c} 辆车`,
    rankNames: {
      novato: "新手",
      bronce: "青铜",
      plata: "白银",
      oro: "黄金",
      platino: "铂金",
      diamante: "钻石",
      maestro: "大师",
      hypercar: "超跑传奇"
    },
    rankTitles: {
      novato: "街头观察员",
      bronce: "初级搜车手",
      plata: "城市搜寻者",
      oro: "鹰眼特工",
      platino: "精英搜寻官",
      diamante: "大师猎手",
      maestro: "柏油路传奇",
      hypercar: "围场之王"
    },
    langSavedAlert: "🌐 语言已设置: 中文 (Mandarín)"
  },
  hi: {
    garageCars: "कारें",
    garageMotos: "बाइक्स",
    filterAll: "सभी",
    filterCommon: "सामान्य",
    filterRare: "दुर्लभ",
    filterEpic: "उत्कृष्ट",
    filterLegendary: "पौराणिक",
    navFeed: "फ़ीड",
    navGarage: "गैरेज",
    navCamera: "कैमरा",
    navFriends: "मित्र",
    navRanking: "रैंकिंग",
    navProfile: "प्रोफ़ाइल",
    friendsMyFriends: "मेरे मित्र",
    friendsRequests: "अनुरोध",
    friendsAddBtn: "+ जोड़ें",
    friendsPlaceholder: "@यूज़रनेम या नाम से खोजें...",
    rankFriends: "मित्र",
    rankGlobal: "वैश्विक",
    rankRegional: "क्षेत्रीय",
    menuPro: "प्रो",
    menuShop: "दुकान",
    menuGarage: "गैरेज",
    menuInventory: "इन्वेंटरी",
    menuMissions: "मिशन",
    menuRanks: "रैंक",
    settingsTitle: "सेटिंग्स",
    settingsUser: "उपयोगकर्ता",
    setProfile: "स्पॉटर प्रोफ़ाइल",
    setAccount: "खाता और सुरक्षा",
    setPro: "प्रो सदस्यता प्रबंधित करें",
    setStats: "गैरेज आंकड़े",
    setStorage: "स्थानीय संग्रहण",
    settingsPrefs: "प्राथमिकताएं",
    setUnits: "पावर और स्पीड इकाइयाँ",
    setUnitsSub: "HP / CV • km/h",
    setThemes: "थीम और दिखावट",
    setThemesSub: "रंग अनुकूलित करें",
    setLanguage: "भाषाएं",
    setNotifs: "सूचनाएं",
    setNotifsSub: "निकटवर्ती स्पॉटिंग अलर्ट",
    setGallery: "गैलरी में सहेजें",
    setGallerySub: "कैमरा रोल में फ़ोटो सहेजें",
    setMorePrefs: "अन्य प्राथमिकताएं",
    settingsResources: "संसाधन",
    setFaq: "अक्सर पूछे जाने वाले प्रश्न",
    setNews: "समाचार और अपडेट",
    setReset: "फ़ैक्टरी डेटा रीसेट",
    btnEditProfile: "✏️ प्रोफ़ाइल संपादित करें",
    tagLevel: "स्तर",
    editProfileTitle: "स्पॉटर प्रोफ़ाइल संपादित करें",
    editChooseAvatar: "अवतार चुनें या फ़ोटो अपलोड करें",
    editFullNameLabel: "पूरा नाम",
    editUsernameLabel: "उपयोगकर्ता नाम (@handle)",
    editBioLabel: "जीवनी (Bio)",
    btnSaveProfile: "💾 परिवर्तन सहेजें",
    profileSavedAlert: "✅ प्रोफ़ाइल सफलतापूर्वक अपडेट हुई!",
    langModalTitle: "भाषा चुनें",
    langModalDesc: "दुनिया की 5 सबसे अधिक बोली जाने वाली भाषाओं में से चुनें।",
    langApplyBtn: "भाषा लागू करें",
    confirmLangKicker: "भाषा बदलें",
    confirmLangTitle: "क्या आप TurboSpotter की भाषा बदलना चाहते हैं?",
    confirmLangDesc: (name) => `इंटरफ़ेस ${name} में अपडेट हो जाएगा।`,
    btnCancel: "रद्द करें",
    btnConfirmLang: "हाँ, भाषा बदलें",
    rankHeaderPill: "आपका वर्तमान रैंक",
    rankYourRankTag: "आपका रैंक",
    rankPilotLevel: "पायलट स्तर",
    rankConfirmedHunts: "पुष्ट स्पॉट",
    rankSpotterPoints: "स्पॉटर अंक",
    rankViewAll: "सभी रैंक देखें",
    rankHideAll: "अन्य रैंक छिपाएं",
    rankReqText: (lvl, cars, title) => `स्तर <strong>${lvl}+</strong> • <strong>${cars}+</strong> कारें • <em>${title}</em>`,
    vehiclesHunted: "वाहन स्पॉट किए गए",
    nextRankPrefix: "अगला रैंक:",
    maxRankReached: "अधिकतम रैंक प्राप्त!",
    needLevelsCars: (l, c, r) => `${r} के लिए ${l} स्तर और ${c} कारों की आवश्यकता`,
    rankNames: {
      novato: "नौसिखिया",
      bronce: "कांस्य",
      plata: "रजत",
      oro: "स्वर्ण",
      platino: "प्लैटिनम",
      diamante: "हीरा",
      maestro: "मास्टर",
      hypercar: "हाइपरकार लीजेंड"
    },
    rankTitles: {
      novato: "सड़क पर्यवेक्षक",
      bronce: "प्रारंभिक शिकारी",
      plata: "शहरी स्पॉटर",
      oro: "चील की आंख",
      platino: "कुलीन शिकारी",
      diamante: "मास्टर स्पॉटर",
      maestro: "डामर लीजेंड",
      hypercar: "पैडॉक के राजा"
    },
    langSavedAlert: "🌐 भाषा सेट: हिन्दी (Hindi)"
  },
  fr: {
    garageCars: "Voitures",
    garageMotos: "Motos",
    filterAll: "Tous",
    filterCommon: "Commun",
    filterRare: "Rare",
    filterEpic: "Épique",
    filterLegendary: "Légendaire",
    navFeed: "Flux",
    navGarage: "Garage",
    navCamera: "Caméra",
    navFriends: "Amis",
    navRanking: "Classement",
    navProfile: "Profil",
    friendsMyFriends: "Mes Amis",
    friendsRequests: "Demandes",
    friendsAddBtn: "+ Ajouter",
    friendsPlaceholder: "Chercher par @pseudo ou nom...",
    rankFriends: "Amis",
    rankGlobal: "Mondial",
    rankRegional: "Régional",
    menuPro: "Pro",
    menuShop: "Boutique",
    menuGarage: "Garage",
    menuInventory: "Inventaire",
    menuMissions: "Missions",
    menuRanks: "Rangs",
    settingsTitle: "Paramètres",
    settingsUser: "Utilisateur",
    setProfile: "Profil de Spotter",
    setAccount: "Compte & Sécurité",
    setPro: "Gérer l'Abonnement Pro",
    setStats: "Statistiques du Garage",
    setStorage: "Stockage Local",
    settingsPrefs: "Préférences",
    setUnits: "Unités de Puissance & Vit.",
    setUnitsSub: "HP / CV • km/h",
    setThemes: "Thèmes & Apparence",
    setThemesSub: "Personnaliser les couleurs",
    setLanguage: "Langues",
    setNotifs: "Notifications",
    setNotifsSub: "Alertes de spots à proximité",
    setGallery: "Enregistrer dans la Galerie",
    setGallerySub: "Sauvegarder les photos dans la pellicule",
    setMorePrefs: "Autres préférences",
    settingsResources: "Ressources",
    setFaq: "Foire Aux Questions",
    setNews: "Nouveautés & Mises à jour",
    setReset: "Réinitialiser aux paramètres d'usine",
    langModalTitle: "Sélectionner la Langue",
    langModalDesc: "Choisissez parmi les 5 langues les plus parlées au monde.",
    langApplyBtn: "Appliquer la Langue",
    confirmLangKicker: "CHANGER DE LANGUE",
    confirmLangTitle: "Changer la langue de TurboSpotter ?",
    confirmLangDesc: (name) => `L'interface et tous les menus passeront en ${name}.`,
    btnCancel: "Annuler",
    btnConfirmLang: "Oui, changer de langue",
    rankHeaderPill: "VOTRE RANG ACTUEL",
    rankYourRankTag: "VOTRE RANG",
    rankPilotLevel: "Niveau Pilote",
    rankConfirmedHunts: "Chasses Confirmées",
    rankSpotterPoints: "Points Spotter",
    rankViewAll: "Voir tous les rangs",
    rankHideAll: "Masquer les autres rangs",
    rankReqText: (lvl, cars, title) => `Niveau <strong>${lvl}+</strong> • <strong>${cars}+</strong> voitures chassées • <em>${title}</em>`,
    vehiclesHunted: "véhicules repérés",
    nextRankPrefix: "Rang Suivant:",
    maxRankReached: "Rang maximal atteint !",
    needLevelsCars: (l, c, r) => `${l} niveau${l === 1 ? '' : 'x'} et ${c} voiture${c === 1 ? '' : 's'} pour ${r}`,
    rankNames: {
      novato: "Novice",
      bronce: "Bronze",
      plata: "Argent",
      oro: "Or",
      platino: "Platine",
      diamante: "Diamant",
      maestro: "Maître",
      hypercar: "Hypercar Legend"
    },
    rankTitles: {
      novato: "Observateur de Rue",
      bronce: "Chasseur Débutant",
      plata: "Spotter Urbain",
      oro: "Œil de Lynx",
      platino: "Chasseur d'Élite",
      diamante: "Maître Spotter",
      maestro: "Légende du Bitume",
      hypercar: "Roi du Paddock"
    },
    langSavedAlert: "🌐 Langue définie: Français"
  }
};

const modalLanguage = document.getElementById('modal-language');
const settingCurrentLangText = document.getElementById('setting-current-lang-text');
const btnSaveLanguage = document.getElementById('btn-save-language');
const langCards = document.querySelectorAll('.lang-option-card');

const NOMBRES_IDIOMAS = {
  'es': 'Español (Latinoamérica)',
  'en': 'English',
  'zh': '中文 (Mandarín)',
  'hi': 'हिन्दी (Hindi)',
  'fr': 'Français (Francés)'
};

let idiomaSeleccionado = localStorage.getItem('carspotter_lang') || 'es';

function aplicarTraducciones(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['es'];

  // 1. Elementos con atributo data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // 2. Input placeholder de amigos
  const searchInput = document.getElementById('friends-search-input');
  if (searchInput && dict.friendsPlaceholder) {
    searchInput.placeholder = dict.friendsPlaceholder;
  }

  // 3. Actualizar subtítulo en fila de Idiomas de Ajustes
  if (settingCurrentLangText && NOMBRES_IDIOMAS[lang]) {
    settingCurrentLangText.textContent = NOMBRES_IDIOMAS[lang];
  }

  // 4. Actualizar HUD y datos reactivos dependientes del idioma
  if (typeof actualizarHUDUsuario === 'function') {
    actualizarHUDUsuario();
  }

  // 5. Re-renderizar garaje para reflejar contadores y switch en nuevo idioma
  if (typeof renderizarGarajeUnificado === 'function') {
    renderizarGarajeUnificado();
  }
}

function actualizarVistaIdioma() {
  if (settingCurrentLangText && NOMBRES_IDIOMAS[idiomaSeleccionado]) {
    settingCurrentLangText.textContent = NOMBRES_IDIOMAS[idiomaSeleccionado];
  }

  langCards.forEach(card => {
    const lang = card.dataset.lang;
    const circle = card.querySelector('.lang-check-circle');
    if (lang === idiomaSeleccionado) {
      card.classList.add('selected');
      if (circle) circle.textContent = '✓';
    } else {
      card.classList.remove('selected');
      if (circle) circle.textContent = '';
    }
  });
}

function abrirModalIdioma() {
  if (!modalLanguage) return;
  actualizarVistaIdioma();
  modalLanguage.showModal();
}

// Modal de confirmación de cambio de idioma
const modalConfirmLanguage = document.getElementById('modal-confirm-language');
const confirmLangFlag = document.getElementById('confirm-lang-flag');
const confirmLangTitle = document.getElementById('confirm-lang-title');
const confirmLangDesc = document.getElementById('confirm-lang-desc');
const confirmLangTargetName = document.getElementById('confirm-lang-target-name');
const btnCancelLangConfirm = document.getElementById('btn-cancel-lang-confirm');
const btnProceedLangConfirm = document.getElementById('btn-proceed-lang-confirm');

const BANDERAS_IDIOMAS = {
  'es': '🇪🇸',
  'en': '🇺🇸',
  'zh': '🇨🇳',
  'hi': '🇮🇳',
  'fr': '🇫🇷'
};

let idiomaPendienteConfirmacion = null;

function solicitarConfirmacionIdioma(nuevoIdioma) {
  if (!modalConfirmLanguage) {
    ejecutarCambioIdioma(nuevoIdioma);
    return;
  }

  // Si selecciona el mismo idioma que ya tiene activo, solo cerramos el modal
  const idiomaActual = localStorage.getItem('carspotter_lang') || 'es';
  if (nuevoIdioma === idiomaActual) {
    if (modalLanguage) modalLanguage.close();
    return;
  }

  idiomaPendienteConfirmacion = nuevoIdioma;
  const nombreDestino = NOMBRES_IDIOMAS[nuevoIdioma] || nuevoIdioma;
  const bandera = BANDERAS_IDIOMAS[nuevoIdioma] || '🌐';

  // Usamos las traducciones del idioma destino para que el usuario previsualice el cambio
  const dictTarget = TRANSLATIONS[nuevoIdioma] || TRANSLATIONS['es'];

  if (confirmLangFlag) confirmLangFlag.textContent = bandera;
  if (confirmLangTitle) confirmLangTitle.textContent = dictTarget.confirmLangTitle || "¿Cambiar idioma?";
  if (confirmLangDesc) {
    if (typeof dictTarget.confirmLangDesc === 'function') {
      confirmLangDesc.innerHTML = dictTarget.confirmLangDesc(`<strong>${nombreDestino}</strong>`);
    } else {
      confirmLangDesc.innerHTML = `La interfaz se actualizará a <strong>${nombreDestino}</strong>.`;
    }
  }

  if (btnCancelLangConfirm) btnCancelLangConfirm.textContent = dictTarget.btnCancel || "Cancelar";
  if (btnProceedLangConfirm) btnProceedLangConfirm.textContent = dictTarget.btnConfirmLang || "Sí, cambiar idioma";

  modalConfirmLanguage.showModal();
}

function ejecutarCambioIdioma(nuevoIdioma) {
  idiomaSeleccionado = nuevoIdioma;
  localStorage.setItem('carspotter_lang', nuevoIdioma);
  actualizarVistaIdioma();
  aplicarTraducciones(nuevoIdioma);
  if (modalConfirmLanguage) modalConfirmLanguage.close();
  if (modalLanguage) modalLanguage.close();
  const dict = TRANSLATIONS[nuevoIdioma] || TRANSLATIONS['es'];
  alert(dict.langSavedAlert || `🌐 ${NOMBRES_IDIOMAS[nuevoIdioma]}`);
}

if (btnCancelLangConfirm) {
  btnCancelLangConfirm.addEventListener('click', () => {
    if (modalConfirmLanguage) modalConfirmLanguage.close();
    idiomaPendienteConfirmacion = null;
  });
}

if (btnProceedLangConfirm) {
  btnProceedLangConfirm.addEventListener('click', () => {
    if (idiomaPendienteConfirmacion) {
      ejecutarCambioIdioma(idiomaPendienteConfirmacion);
      idiomaPendienteConfirmacion = null;
    }
  });
}

langCards.forEach(card => {
  card.addEventListener('click', () => {
    idiomaSeleccionado = card.dataset.lang;
    actualizarVistaIdioma();
  });
});

if (btnSaveLanguage) {
  btnSaveLanguage.addEventListener('click', () => {
    solicitarConfirmacionIdioma(idiomaSeleccionado);
  });
}

// Inicializar idioma al cargar
actualizarVistaIdioma();
aplicarTraducciones(idiomaSeleccionado);

// Botón para restablecer datos de fábrica desde Ajustes
const btnResetData = document.getElementById('btn-reset-data');
if (btnResetData) {
  btnResetData.addEventListener('click', () => {
    const seguro = confirm("¿Deseas restablecer todos tus datos locales de TurboSpotter a los valores iniciales?");
    if (seguro) {
      StorageManager.resetAll();
      window.location.reload();
    }
  });
}

[modalShop, modalInventory, modalConfirmPurchase, modalConfirmLanguage, modalLanguage, modalMissions, modalPro, modalRanks, modalSettings].forEach(modal => {
  if (modal) {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        modal.close();
      }
    });
  }
});

// ========================================================
// RENDERIZADO DEL GARAJE UNIFICADO (AUTOS / MOTOS CON SWITCH)
// ========================================================

function crearCardVehiculo(v, tipoIcon) {
  const card = document.createElement('article');
  card.className = 'vehicle-card';
  card.innerHTML = `
    <div class="card-image-wrapper">
      <img class="card-img" src="${v.imagen}" alt="${v.nombre}" loading="lazy">
      <span class="rarity-tag rarity-${v.rareza}">${v.rareza}</span>
    </div>
    <div class="card-content">
      <span class="card-brand">${v.marca}</span>
      <h3 class="card-title">${v.nombre}</h3>
      <div class="card-specs">
        <span class="spec-item">${tipoIcon} ${v.tipo}</span>
        <span class="spec-item">⚡ ${v.potencia}</span>
        <span class="spec-item spec-price">💵 ${v.precio || (v.rareza === 'legendario' ? '$550,000' : (v.rareza === 'epico' ? '$140,000' : (v.rareza === 'raro' ? '$65,000' : '$28,000')))} aprox.</span>
      </div>
    </div>
  `;
  return card;
}

// Diccionario de Logotipos Oficiales de Marcas de Autos y Motos
const LOGOS_MARCAS = {
  "Audi": "https://www.car-logos.org/wp-content/uploads/2011/09/audi1.png",
  "BMW": "https://www.car-logos.org/wp-content/uploads/2011/09/bmw.png",
  "Dodge": "https://www.car-logos.org/wp-content/uploads/2011/09/dodge.png",
  "Ferrari": "https://www.car-logos.org/wp-content/uploads/2011/09/ferrari.png",
  "Ford": "https://www.car-logos.org/wp-content/uploads/2011/09/ford.png",
  "Porsche": "https://www.car-logos.org/wp-content/uploads/2011/09/porsche.png",
  "Honda": "https://www.car-logos.org/wp-content/uploads/2011/09/honda.png",
  "Toyota": "https://www.car-logos.org/wp-content/uploads/2011/09/toyota.png",
  "Mercedes-Benz": "https://www.car-logos.org/wp-content/uploads/2011/09/mercedes.png",
  "Mercedes-AMG": "https://www.car-logos.org/wp-content/uploads/2011/09/mercedes.png",
  "Lamborghini": "https://www.car-logos.org/wp-content/uploads/2011/09/lamborghini.png",
  "Nissan": "https://www.car-logos.org/wp-content/uploads/2011/09/nissan.png",
  "Chevrolet": "https://www.car-logos.org/wp-content/uploads/2011/09/chevrolet.png",
  "McLaren": "https://www.car-logos.org/wp-content/uploads/2011/09/mclaren.png",
  "Aston Martin": "https://www.car-logos.org/wp-content/uploads/2011/09/aston_martin.png",
  "Volkswagen": "https://www.car-logos.org/wp-content/uploads/2011/09/volkswagen.png",
  "Subaru": "https://www.car-logos.org/wp-content/uploads/2011/09/subaru.png",
  "Mazda": "https://www.car-logos.org/wp-content/uploads/2011/09/mazda.png",
  "Ducati": "https://logos-world.net/wp-content/uploads/2021/08/Ducati-Logo.png",
  "Yamaha": "https://logos-world.net/wp-content/uploads/2020/11/Yamaha-Logo.png",
  "Kawasaki": "https://logos-world.net/wp-content/uploads/2021/08/Kawasaki-Logo.png",
  "KTM": "https://logos-world.net/wp-content/uploads/2021/08/KTM-Logo.png",
  "Suzuki": "https://www.car-logos.org/wp-content/uploads/2011/09/suzuki.png"
};

// Generar elemento HTML del logo oficial con fallback elegante si falla la red
function obtenerHtmlLogoMarca(marca) {
  const logoUrl = LOGOS_MARCAS[marca];
  if (logoUrl) {
    return `<img src="${logoUrl}" alt="${marca}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='🏎️';">`;
  }
  return `<span>🏷️</span>`;
}

function renderizarGarajeUnificado() {
  if (!gridGarageUnified) return;
  gridGarageUnified.innerHTML = '';

  // Actualizar contadores en los botones del switch
  if (countCarsBadge) countCarsBadge.textContent = autos ? autos.length : 0;
  if (countMotosBadge) countMotosBadge.textContent = motos ? motos.length : 0;

  // Actualizar botones de modo de visualización
  const btnGarageAll = document.getElementById('btn-garage-all');
  const btnGarageByBrands = document.getElementById('btn-garage-by-brands');
  const txtBtnGarageBrands = document.getElementById('txt-btn-garage-brands');

  if (txtBtnGarageBrands) {
    txtBtnGarageBrands.textContent = modoGarajeActual === 'cars' ? 'Mis Carros' : 'Mis Motos';
  }

  if (btnGarageAll && btnGarageByBrands) {
    if (vistaGarajeModo === 'all') {
      btnGarageAll.classList.add('active');
      btnGarageByBrands.classList.remove('active');
    } else {
      btnGarageByBrands.classList.add('active');
      btnGarageAll.classList.remove('active');
    }
  }

  // Actualizar título y estilo del switch
  const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[idiomaSeleccionado]) ? TRANSLATIONS[idiomaSeleccionado] : null;
  const txtCars = dict ? dict.garageCars : "Autos";
  const txtMotos = dict ? dict.garageMotos : "Motos";

  const txtSegCarsEl = document.getElementById('txt-seg-cars');
  if (txtSegCarsEl) txtSegCarsEl.textContent = txtCars;
  const txtSegMotosEl = document.getElementById('txt-seg-motos');
  if (txtSegMotosEl) txtSegMotosEl.textContent = txtMotos;

  if (modoGarajeActual === 'cars') {
    if (garageModeTitle) garageModeTitle.textContent = `${txtCars}`;
    if (segBtnCars) { segBtnCars.classList.add('active'); segBtnCars.setAttribute('aria-selected', 'true'); }
    if (segBtnMotos) { segBtnMotos.classList.remove('active'); segBtnMotos.setAttribute('aria-selected', 'false'); }
  } else {
    if (garageModeTitle) garageModeTitle.textContent = `${txtMotos}`;
    if (segBtnMotos) { segBtnMotos.classList.add('active'); segBtnMotos.setAttribute('aria-selected', 'true'); }
    if (segBtnCars) { segBtnCars.classList.remove('active'); segBtnCars.setAttribute('aria-selected', 'false'); }
  }

  // Lista de vehículos según el switch
  const listaBase = modoGarajeActual === 'cars' ? autos : motos;

  // Aplicar filtro de rareza
  const filtrados = listaBase.filter(v => {
    if (filtroRarezaAuto === 'all') return true;
    return v.rareza === filtroRarezaAuto;
  });

  if (filtrados.length === 0) {
    gridGarageUnified.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">No tienes vehículos con esta rareza aún.</p>
        <small>¡Toca la cámara en la barra inferior para cazar nuevos!</small>
      </div>
    `;
    return;
  }

  const tipoIcon = modoGarajeActual === 'cars' ? '🏎️' : '🏍️';

  // ========================================================
  // MODO 1: MIS CARROS (AGRUPADOS Y ORDENADOS POR MARCA A-Z)
  // ========================================================
  if (vistaGarajeModo === 'brands') {
    // 1. Agrupar vehículos por marca
    const mapaMarcas = {};
    filtrados.forEach(v => {
      const marcaLimpia = (v.marca || 'Otras Marcas').trim();
      if (!mapaMarcas[marcaLimpia]) {
        mapaMarcas[marcaLimpia] = [];
      }
      mapaMarcas[marcaLimpia].push(v);
    });

    // 2. Ordenar marcas alfabéticamente (A-Z)
    const marcasOrdenadas = Object.keys(mapaMarcas).sort((a, b) => a.localeCompare(b));

    marcasOrdenadas.forEach(marca => {
      const seccionMarca = document.createElement('section');
      const estaPlegada = !!marcasPlegadas[marca];
      seccionMarca.className = `brand-group-section ${estaPlegada ? 'collapsed' : ''}`;

      const cantVehiculos = mapaMarcas[marca].length;

      // Encabezado interactivo minimalista: Solo el nombre de la marca, contador y flecha
      const headerMarca = document.createElement('div');
      headerMarca.className = 'brand-group-header';
      headerMarca.setAttribute('role', 'button');
      headerMarca.setAttribute('tabindex', '0');
      headerMarca.setAttribute('aria-expanded', !estaPlegada);
      headerMarca.title = "Toca para plegar o desplegar esta marca";
      headerMarca.innerHTML = `
        <h4 class="brand-group-title">
          <span>${marca}</span>
        </h4>
        <div class="brand-group-header-right">
          <span class="brand-group-count">${cantVehiculos} ${cantVehiculos === 1 ? 'modelo' : 'modelos'}</span>
          <span class="brand-group-chevron">▼</span>
        </div>
      `;

      // Alternar plegado al hacer clic o presionar Enter
      const togglePlegado = () => {
        const colapsada = seccionMarca.classList.toggle('collapsed');
        marcasPlegadas[marca] = colapsada;
        headerMarca.setAttribute('aria-expanded', !colapsada);
      };

      headerMarca.addEventListener('click', togglePlegado);
      headerMarca.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePlegado();
        }
      });

      seccionMarca.appendChild(headerMarca);

      // Grid con las sub-agrupaciones y tarjetas de modelos ordenados
      const gridMarca = document.createElement('div');
      gridMarca.className = 'brand-group-grid';
      
      // 1. Agrupar vehículos de esta marca por Modelo
      const mapaModelos = {};
      mapaMarcas[marca].forEach(v => {
        // Extraer el modelo eliminando el prefijo de la marca si está en el nombre (ej: "BMW M3 Competition" -> "M3 Competition")
        let modeloLimpio = v.nombre || 'Modelo Desconocido';
        const regexMarca = new RegExp(`^${marca}\\s+`, 'i');
        modeloLimpio = modeloLimpio.replace(regexMarca, '').trim();
        if (!modeloLimpio) modeloLimpio = v.nombre;

        if (!mapaModelos[modeloLimpio]) {
          mapaModelos[modeloLimpio] = [];
        }
        mapaModelos[modeloLimpio].push(v);
      });

      // 2. Ordenar modelos alfabéticamente (A-Z)
      const modelosOrdenados = Object.keys(mapaModelos).sort((a, b) => a.localeCompare(b));

      modelosOrdenados.forEach(modelo => {
        const claveModelo = `${marca}__${modelo}`;
        const estaModeloPlegado = !!modelosPlegados[claveModelo];

        const tarjetaModelo = document.createElement('div');
        tarjetaModelo.className = `model-group-card ${estaModeloPlegado ? 'collapsed' : ''}`;

        const cantidadEnModelo = mapaModelos[modelo].length;

        // Encabezado interactivo de clasificación del modelo
        const headerModelo = document.createElement('div');
        headerModelo.className = 'model-group-header';
        headerModelo.setAttribute('role', 'button');
        headerModelo.setAttribute('tabindex', '0');
        headerModelo.setAttribute('aria-expanded', !estaModeloPlegado);
        headerModelo.title = `Toca para plegar o desplegar ${modelo}`;
        headerModelo.innerHTML = `
          <h5 class="model-group-title">
            <span>🏁 ${modelo}</span>
          </h5>
          <div class="model-group-header-right">
            <span class="model-group-badge">${cantidadEnModelo} ${cantidadEnModelo === 1 ? 'unidad' : 'unidades'}</span>
            <span class="model-group-chevron">▼</span>
          </div>
        `;

        // Alternar plegado del modelo al hacer clic o presionar Enter
        const togglePlegadoModelo = (e) => {
          e.stopPropagation(); // Evitar colapsar la marca padre si se hace clic aquí
          const colapsado = tarjetaModelo.classList.toggle('collapsed');
          modelosPlegados[claveModelo] = colapsado;
          headerModelo.setAttribute('aria-expanded', !colapsado);
        };

        headerModelo.addEventListener('click', togglePlegadoModelo);
        headerModelo.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePlegadoModelo(e);
          }
        });

        tarjetaModelo.appendChild(headerModelo);

        // Cuadrícula de vehículos para este modelo
        const cardsGrid = document.createElement('div');
        cardsGrid.className = 'model-cards-grid';

        mapaModelos[modelo].forEach(v => {
          cardsGrid.appendChild(crearCardVehiculo(v, tipoIcon));
        });

        tarjetaModelo.appendChild(cardsGrid);
        gridMarca.appendChild(tarjetaModelo);
      });

      seccionMarca.appendChild(gridMarca);
      gridGarageUnified.appendChild(seccionMarca);
    });

    return;
  }

  // ========================================================
  // MODO 2: TODOS EN CUADRÍCULA ESTÁNDAR
  // ========================================================
  filtrados.forEach(v => {
    gridGarageUnified.appendChild(crearCardVehiculo(v, tipoIcon));
  });
}

// Botones para alternar entre "Todos" y "Mis Carros (Por Marcas)"
const btnGarageAllEl = document.getElementById('btn-garage-all');
const btnGarageByBrandsEl = document.getElementById('btn-garage-by-brands');

if (btnGarageAllEl) {
  btnGarageAllEl.addEventListener('click', () => {
    vistaGarajeModo = 'all';
    renderizarGarajeUnificado();
  });
}

if (btnGarageByBrandsEl) {
  btnGarageByBrandsEl.addEventListener('click', () => {
    vistaGarajeModo = 'brands';
    renderizarGarajeUnificado();
  });
}

// Event Listeners del Switch Segmentado (Autos vs Motos)
if (segBtnCars) {
  segBtnCars.addEventListener('click', () => {
    modoGarajeActual = 'cars';
    renderizarGarajeUnificado();
  });
}

if (segBtnMotos) {
  segBtnMotos.addEventListener('click', () => {
    modoGarajeActual = 'motos';
    renderizarGarajeUnificado();
  });
}

// Filtros de rareza
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroRarezaAuto = btn.dataset.filter;
    renderizarGarajeUnificado();
  });
});

// ========================================================
// RENDERIZADO DEL FEED
// ========================================================

// ========================================================
// SISTEMA INTERACTIVO DEL FEED (LIKES, COMENTARIOS, COMPARTIR)
// ========================================================
let feedLikesGuardados = StorageManager.get(STORAGE_KEYS.FEED_LIKES, {});
let comentariosGuardados = StorageManager.get(STORAGE_KEYS.FEED_COMENTARIOS, {});
let spotActivoComentarios = null;

const modalComments = document.getElementById('modal-comments');
const spotCommentSummary = document.getElementById('spot-comment-summary');
const commentsListContainer = document.getElementById('comments-list-container');
const inputNewComment = document.getElementById('input-new-comment');
const btnSendComment = document.getElementById('btn-send-comment');

function renderizarFeed() {
  if (!feedGrid) return;
  feedGrid.innerHTML = '';

  feedSpots.forEach(spot => {
    const likesExtra = feedLikesGuardados[spot.id] ? 1 : 0;
    const totalLikes = spot.likes + likesExtra;
    const isLiked = !!feedLikesGuardados[spot.id];

    // Obtener comentarios combinados (base + los añadidos por el usuario)
    const extraComments = comentariosGuardados[spot.id] || [];
    const totalComentarios = (spot.comentarios ? spot.comentarios.length : 0) + extraComments.length;
    const esMiSpot = (spot.spotter || '').includes('(Tú)') || (spot.spotter === usuario.nombre);
    const badgeMiSpotHtml = esMiSpot ? '<span class="spotter-badge-you">Tú</span>' : '';

    const card = document.createElement('article');
    card.className = 'feed-card';
    card.innerHTML = `
      <div class="feed-header">
        <img src="${spot.avatar}" alt="${spot.spotter}" class="spotter-avatar">
        <div class="spotter-info">
          <div class="spotter-name-row">
            <span class="spotter-name">${spot.spotter}</span>
            ${badgeMiSpotHtml}
          </div>
          <span class="spot-location">${spot.ubicacion}</span>
        </div>
      </div>
      <div class="card-image-wrapper">
        <img class="card-img" src="${spot.imagen}" alt="${spot.vehiculo}" loading="lazy">
        <span class="rarity-tag rarity-${spot.rareza}">${spot.rareza}</span>
      </div>
      <div class="feed-body">
        <div class="feed-body-header">
          <h3 class="card-title" style="margin: 0;">${spot.vehiculo}</h3>
          <span class="feed-price-tag">💵 ${spot.precio || (spot.rareza === 'legendario' ? '$550,000' : (spot.rareza === 'epico' ? '$140,000' : (spot.rareza === 'raro' ? '$65,000' : '$28,000')))} aprox.</span>
        </div>
      </div>
      <div class="feed-actions">
        <button class="feed-action-btn btn-feed-like ${isLiked ? 'liked' : ''}" data-spot-id="${spot.id}">
          <span class="like-heart">${isLiked ? '❤️' : '🤍'}</span>
          <span class="like-counter">${totalLikes}</span>
        </button>
        <button class="feed-action-btn btn-feed-comment" data-spot-id="${spot.id}">
          💬 <span>${totalComentarios}</span>
        </button>
        <button class="feed-action-btn btn-feed-share" data-spot-id="${spot.id}">
          🔗 <span>Compartir</span>
        </button>
      </div>
    `;

    // 1. Manejador de Like
    const btnLike = card.querySelector('.btn-feed-like');
    if (btnLike) {
      btnLike.addEventListener('click', () => {
        toggleLikeSpot(spot.id, btnLike);
      });
    }

    // 2. Manejador de Comentarios
    const btnComment = card.querySelector('.btn-feed-comment');
    if (btnComment) {
      btnComment.addEventListener('click', () => {
        abrirModalComentarios(spot);
      });
    }

    // 3. Manejador de Compartir
    const btnShare = card.querySelector('.btn-feed-share');
    if (btnShare) {
      btnShare.addEventListener('click', () => {
        compartirSpot(spot);
      });
    }

    feedGrid.appendChild(card);
  });
}

function toggleLikeSpot(spotId, btnLikeEl) {
  const isLiked = !!feedLikesGuardados[spotId];
  if (isLiked) {
    delete feedLikesGuardados[spotId];
  } else {
    feedLikesGuardados[spotId] = true;
  }
  StorageManager.set(STORAGE_KEYS.FEED_LIKES, feedLikesGuardados);
  renderizarFeed();
}

function compartirSpot(spot) {
  const shareText = `¡Mira este ${spot.vehiculo} cazado por ${spot.spotter} en TurboSpotter!`;
  if (navigator.share) {
    navigator.share({
      title: 'TurboSpotter',
      text: shareText,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(`${shareText} ${window.location.href}`).then(() => {
      alert("📋 ¡Enlace del avistamiento copiado al portapapeles!");
    }).catch(() => {
      alert(`🔗 Compartir: ${shareText}`);
    });
  }
}

function abrirModalComentarios(spot) {
  if (!modalComments) return;
  spotActivoComentarios = spot;

  // Miniatura y datos del spot
  if (spotCommentSummary) {
    spotCommentSummary.innerHTML = `
      <img src="${spot.imagen}" alt="${spot.vehiculo}" class="spot-thumb-mini">
      <div class="spot-summary-info">
        <strong>${spot.vehiculo}</strong>
        <small>Cazado por @${spot.spotter}</small>
      </div>
    `;
  }

  renderizarListaComentariosModal();
  if (inputNewComment) inputNewComment.value = '';
  modalComments.showModal();
}

function renderizarListaComentariosModal() {
  if (!commentsListContainer || !spotActivoComentarios) return;
  commentsListContainer.innerHTML = '';

  const baseComments = spotActivoComentarios.comentarios || [];
  const userComments = comentariosGuardados[spotActivoComentarios.id] || [];
  const todos = [...baseComments, ...userComments];

  if (todos.length === 0) {
    commentsListContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding: 20px 0;">Sé el primero en comentar este avistamiento.</p>';
    return;
  }

  // Identificar el autor original del spot (ej: Carlos_R, SofiaSpeed o usuario actual)
  const spotterOriginal = (spotActivoComentarios.spotter || '').toLowerCase().replace(/[^a-z0-9_]/g, '');

  todos.forEach(c => {
    const row = document.createElement('div');
    const autorLimpio = (c.autor || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    // Es el creador/spotter original del post
    const esCreador = autorLimpio && (
      autorLimpio === spotterOriginal ||
      spotterOriginal.includes(autorLimpio) ||
      autorLimpio.includes(spotterOriginal) ||
      (c.autor === 'Julio (Tú)' && spotActivoComentarios.spotter === 'Julio (Tú)')
    );

    row.className = `comment-row ${esCreador ? 'is-creator' : ''}`;
    const avatar = c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";

    row.innerHTML = `
      <img src="${avatar}" class="comment-avatar" alt="${c.autor}">
      <div class="comment-content">
        <div class="comment-author-row">
          <div class="comment-author-info">
            <span class="comment-author ${esCreador ? 'is-creator' : ''}">@${c.autor}</span>
          </div>
          <span class="comment-time">${c.tiempo || 'Ahora'}</span>
        </div>
        <p class="comment-text">${c.texto}</p>
      </div>
    `;
    commentsListContainer.appendChild(row);
  });

  commentsListContainer.scrollTop = commentsListContainer.scrollHeight;
}

if (btnSendComment) {
  btnSendComment.addEventListener('click', enviarComentario);
}
if (inputNewComment) {
  inputNewComment.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarComentario();
  });
}

function enviarComentario() {
  if (!spotActivoComentarios || !inputNewComment) return;
  const texto = inputNewComment.value.trim();
  if (!texto) return;

  if (!comentariosGuardados[spotActivoComentarios.id]) {
    comentariosGuardados[spotActivoComentarios.id] = [];
  }

  const handleUsuario = usuario.username ? usuario.username.replace(/^@/, '') : 'juliospotter';
  const nuevo = {
    autor: handleUsuario,
    avatar: usuario.avatar || usuarioPorDefecto.avatar,
    texto: texto,
    tiempo: 'Ahora'
  };

  comentariosGuardados[spotActivoComentarios.id].push(nuevo);
  StorageManager.set(STORAGE_KEYS.FEED_COMENTARIOS, comentariosGuardados);

  inputNewComment.value = '';
  renderizarListaComentariosModal();
  renderizarFeed();
}

// Cerrar modal al hacer clic en el backdrop
if (modalComments) {
  modalComments.addEventListener('click', (e) => {
    const rect = modalComments.getBoundingClientRect();
    const inDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!inDialog) {
      modalComments.close();
    }
  });
}


// ========================================================
// RENDERIZADO DEL RANKING
// ========================================================
function renderizarRanking() {
  const listaActual = rankingsPorModo[rankingModoActual] || rankingsPorModo.amigos;

  // Podio (Top 3) con fotos de perfil y medallas flotantes
  rankingPodium.innerHTML = '';
  if (listaActual.length >= 3) {
    const top3 = [listaActual[1], listaActual[0], listaActual[2]]; // orden visual: 2 (Plata), 1 (Oro), 3 (Bronce)
    top3.forEach(u => {
      const podiumDiv = document.createElement('div');
      podiumDiv.className = `podium-card rank-${u.rank}`;
      
      // Foto de perfil con soporte dinámico para el usuario actual
      const avatarSrc = u.nombre.includes('(Tú)') 
        ? (usuario.avatar || u.avatar) 
        : (u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80");

      podiumDiv.innerHTML = `
        <div class="podium-avatar-wrapper">
          <img src="${avatarSrc}" alt="${u.nombre}" class="podium-avatar">
          <span class="podium-badge-floating">${u.medalla || '🏅'}</span>
        </div>
        <div class="podium-name">${u.nombre}</div>
        <div class="podium-score">${u.score}</div>
        <small style="color: var(--text-muted);">${u.spots} spots</small>
      `;
      rankingPodium.appendChild(podiumDiv);
    });
  }

  // Lista inferior: Excluye el Top 3 y muestra únicamente los puestos del #4 al #10
  rankingList.innerHTML = '';
  const listaRestante = listaActual.filter(u => u.rank >= 4 && u.rank <= 10);

  if (listaRestante.length === 0) {
    rankingList.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">No hay más posiciones registradas.</div>';
    return;
  }

  listaRestante.forEach(u => {
    const row = document.createElement('div');
    row.className = 'ranking-row';
    const isMe = u.nombre.includes('(Tú)');
    if (isMe) {
      row.style.background = 'rgba(56, 189, 248, 0.12)';
      row.style.borderLeft = '3px solid #38bdf8';
    }
    row.innerHTML = `
      <span class="rank-num">#${u.rank}</span>
      <span class="rank-user-name" style="${isMe ? 'color: #38bdf8; font-weight: 700;' : ''}">${u.nombre}</span>
      <span class="rank-pts">${u.score}</span>
    `;
    rankingList.appendChild(row);
  });
}

// Event Listeners para el Switch del Ranking (Amigos, Global, Regional)
const rankingSegButtons = document.querySelectorAll('.ranking-seg-btn');
rankingSegButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    rankingSegButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    rankingModoActual = btn.dataset.rankMode;
    renderizarRanking();
  });
});

// ========================================================
// CÁMARA REAL & QUICKSPOT SCANNER ENGINE
// ========================================================
let mediaStream = null;
let currentFacingMode = 'environment'; // 'environment' (trasera) o 'user' (frontal)
let capturedImageDataUrl = null;
let selectedVehicleType = 'Auto';

// Pool de marcas y modelos aleatorios para auto-completar si el usuario no escribe
const poolAutosSugeridos = [
  { nombre: "Porsche 911 GT3 RS", marca: "Porsche", rareza: "legendario", tipo: "Auto", potencia: "525 CV", precio: "$241,300" },
  { nombre: "Ferrari SF90 Stradale", marca: "Ferrari", rareza: "legendario", tipo: "Híbrido", potencia: "1000 CV", precio: "$528,000" },
  { nombre: "BMW M3 Competition", marca: "BMW", rareza: "epico", tipo: "Sedán", potencia: "510 CV", precio: "$85,000" },
  { nombre: "Mercedes-AMG GT R", marca: "Mercedes-AMG", rareza: "epico", tipo: "Coupé", potencia: "585 CV", precio: "$165,000" },
  { nombre: "Toyota GR Supra", marca: "Toyota", rareza: "raro", tipo: "Deportivo", potencia: "340 CV", precio: "$56,000" },
  { nombre: "Nissan Skyline GT-R R34", marca: "Nissan", rareza: "legendario", tipo: "JDM", potencia: "330 CV", precio: "$140,000" },
  { nombre: "Ford Mustang Dark Horse", marca: "Ford", rareza: "raro", tipo: "Muscle", potencia: "500 CV", precio: "$60,000" },
  { nombre: "Audi RS6 Avant", marca: "Audi", rareza: "epico", tipo: "Wagon", potencia: "600 CV", precio: "$127,000" }
];

const poolMotosSugeridas = [
  { nombre: "Ducati Panigale V4 R", marca: "Ducati", rareza: "legendario", tipo: "Superbike", potencia: "218 CV", precio: "$45,000" },
  { nombre: "Yamaha YZF-R1", marca: "Yamaha", rareza: "epico", tipo: "Superbike", potencia: "200 CV", precio: "$18,300" },
  { nombre: "Kawasaki Ninja H2", marca: "Kawasaki", rareza: "legendario", tipo: "Supercharged", potencia: "231 CV", precio: "$32,500" },
  { nombre: "BMW S1000RR M-Package", marca: "BMW", rareza: "epico", tipo: "Superbike", potencia: "207 CV", precio: "$24,500" },
  { nombre: "KTM 1290 Super Duke R", marca: "KTM", rareza: "epico", tipo: "Hypernaked", potencia: "180 CV", precio: "$20,000" },
  { nombre: "Honda CBR1000RR-R Fireblade", marca: "Honda", rareza: "epico", tipo: "Superbike", potencia: "217 CV", precio: "$28,900" }
];

// Iniciar stream de cámara real con permisos de navegador
async function iniciarCamaraReal() {
  if (cameraFallback) cameraFallback.style.display = 'none';
  if (cameraVideo) cameraVideo.style.display = 'block';
  if (cameraCapturedPreview) cameraCapturedPreview.style.display = 'none';
  if (cameraSpotForm) cameraSpotForm.style.display = 'none';
  if (cameraControlsDefault) cameraControlsDefault.style.display = 'flex';
  if (cameraStatusTag) cameraStatusTag.textContent = '🔴 REC • CÁMARA VIVO';

  // Detener stream previo si existe
  detenerCamaraReal();

  // Validar soporte de getUserMedia
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    mostrarFallbackCamara("Tu navegador no soporta acceso directo a la cámara. Puedes subir una foto.");
    return;
  }

  const constraints = {
    video: {
      facingMode: currentFacingMode,
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  };

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (cameraVideo) {
      cameraVideo.srcObject = mediaStream;
      await cameraVideo.play();
    }
  } catch (error) {
    console.warn("No se pudo iniciar cámara real:", error);
    // Intentar sin restricción de facingMode si falló
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (cameraVideo) {
        cameraVideo.srcObject = mediaStream;
        await cameraVideo.play();
      }
    } catch (errFallback) {
      console.warn("Fallo total de cámara:", errFallback);
      mostrarFallbackCamara("Permiso de cámara no concedido o no disponible. Puedes subir una foto.");
    }
  }
}

// Detener stream de cámara para liberar hardware y batería
function detenerCamaraReal() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  if (cameraVideo) {
    cameraVideo.srcObject = null;
  }
}

// Mostrar fallback cuando la cámara no está accesible
function mostrarFallbackCamara(mensaje) {
  if (cameraVideo) cameraVideo.style.display = 'none';
  if (cameraFallback) {
    cameraFallback.style.display = 'flex';
    const msgEl = document.getElementById('camera-fallback-msg');
    if (msgEl && mensaje) msgEl.textContent = mensaje;
  }
  if (cameraStatusTag) cameraStatusTag.textContent = '⚠️ MODO GALERÍA';
}

function verificarLimiteSpotsDiarios() {
  // Los usuarios PRO tienen spots ilimitados
  if (usuario && usuario.isPro) return true;

  const hoy = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
  const ultimoDiaSpot = localStorage.getItem('turbospotter_ultimo_spot_fecha');

  if (ultimoDiaSpot === hoy) {
    // Ya gastó su 1 spot gratuito diario
    return false;
  }
  return true;
}

function abrirCamara() {
  if (!verificarLimiteSpotsDiarios()) {
    if (modalPro) {
      modalPro.showModal();
    }
    alert("⚠️ Límite diario alcanzado: La versión gratuita incluye 1 spot por día.\n\n¡Desbloquea TurboSpotter PRO para disfrutar de capturas y spottings ilimitados!");
    return;
  }

  cameraModal.showModal();
  iniciarCamaraReal();
}

function cerrarCamara() {
  detenerCamaraReal();
  if (cameraCapturedPreview) cameraCapturedPreview.style.display = 'none';
  if (cameraSpotForm) cameraSpotForm.style.display = 'none';
  if (cameraControlsDefault) cameraControlsDefault.style.display = 'flex';
  if (spotCustomName) spotCustomName.value = '';
  capturedImageDataUrl = null;
  cameraModal.close();
}

// Alternar entre cámara trasera y delantera
if (btnSwitchCamera) {
  btnSwitchCamera.addEventListener('click', (e) => {
    e.stopPropagation();
    currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    iniciarCamaraReal();
  });
}

btnNavCamera.addEventListener('click', abrirCamara);
btnCloseCamera.addEventListener('click', cerrarCamara);

// Capturar foto desde el video stream hacia el canvas
function capturarFotoDesdeVideo() {
  const viewfinder = document.getElementById('camera-viewfinder');
  
  // Efecto Flash
  if (viewfinder) {
    viewfinder.classList.add('flash-active');
    setTimeout(() => viewfinder.classList.remove('flash-active'), 350);
  }

  if (cameraVideo && cameraVideo.videoWidth > 0) {
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    const ctx = cameraCanvas.getContext('2d');
    
    // Si es cámara frontal, espejar horizontalmente para que se vea natural
    if (currentFacingMode === 'user') {
      ctx.translate(cameraCanvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
    capturedImageDataUrl = cameraCanvas.toDataURL('image/jpeg', 0.92);
  } else {
    // Si la cámara no estaba lista o era simulada, tomar una de alta calidad de prueba
    capturedImageDataUrl = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80";
  }

  detenerCamaraReal();
  mostrarFormularioPostCaptura(capturedImageDataUrl);
}

// Procesar foto subida desde archivo/galería
if (cameraFileInput) {
  cameraFileInput.addEventListener('change', (e) => {
    if (!verificarLimiteSpotsDiarios()) {
      e.target.value = '';
      cerrarCamara();
      if (modalPro) modalPro.showModal();
      alert("⚠️ Límite diario alcanzado: La versión gratuita incluye 1 spot por día.\n\n¡Desbloquea TurboSpotter PRO para disfrutar de capturas y spottings ilimitados!");
      return;
    }

    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        capturedImageDataUrl = event.target.result;
        detenerCamaraReal();
        mostrarFormularioPostCaptura(capturedImageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  });
}

// ========================================================
// GESTOR DE CONFIGURACIÓN IA (LOCALSTORAGE & BACKEND)


// ========================================================
// MOTOR DE IDENTIFICACIÓN CON IA (LLAMADA A TU BACKEND SEGURO)
// ========================================================
async function identificarVehiculoConIA(base64Image) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 seg timeout para fotos HD

    const resp = await fetch(BACKEND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (resp.ok) {
      const data = await resp.json();
      console.log("IA Backend Response:", data);
      return data;
    } else {
      console.warn("Respuesta no OK del backend:", resp.status);
    }
  } catch (err) {
    console.warn("Backend no disponible o error de red:", err.message);
  }

  return null;
}

// Mostrar vista previa y activar análisis con IA
async function mostrarFormularioPostCaptura(imgSrc) {
  if (cameraCapturedPreview) {
    cameraCapturedPreview.src = imgSrc;
    cameraCapturedPreview.style.display = 'block';
  }
  if (cameraFallback) cameraFallback.style.display = 'none';
  if (cameraControlsDefault) cameraControlsDefault.style.display = 'none';

  // Mostrar Overlay de Análisis Cyberpunk
  if (aiScanningOverlay) {
    aiScanningOverlay.style.display = 'flex';
    if (aiScanStatusText) {
      aiScanStatusText.textContent = "Escaneando vehículo con IA (Parrilla, silueta y detalles)...";
    }
  }

  // Ejecutar IA a través del backend
  let resultadoIA = null;
  try {
    resultadoIA = await identificarVehiculoConIA(imgSrc);
  } catch (err) {
    console.warn("Fallo el análisis de IA:", err);
  }

  // Ocultar Overlay de Análisis y mostrar Formulario
  if (aiScanningOverlay) aiScanningOverlay.style.display = 'none';
  if (cameraSpotForm) cameraSpotForm.style.display = 'flex';
  if (cameraStatusTag) cameraStatusTag.textContent = '📸 SPOT CAPTURADO';

  if (resultadoIA && resultadoIA.marca) {
    // ÉXITO: IDENTIFICADO POR LA IA REAL (Ej: Honda CR-V 2024)
    if (spotCustomName) spotCustomName.value = resultadoIA.nombreCompleto || `${resultadoIA.marca} ${resultadoIA.modelo}`;
    if (spotBrandInput) spotBrandInput.value = resultadoIA.marca || '';
    if (spotPowerInput) spotPowerInput.value = resultadoIA.potencia || '';
    if (spotPriceInput) spotPriceInput.value = resultadoIA.precio || '$35,000';
    
    // Asignar tipo detectado automáticamente por la IA (Auto o Moto)
    selectedVehicleType = resultadoIA.tipo === 'Moto' ? 'Moto' : 'Auto';

    // Asignar rareza detectada
    if (spotDetectedRarity) {
      const rareza = (resultadoIA.rareza || 'comun').toLowerCase();
      spotDetectedRarity.textContent = rareza.toUpperCase();
      spotDetectedRarity.className = `ai-rarity-pill rarity-${rareza}`;
      spotDetectedRarity.dataset.rarity = rareza;
    }
  } else {
    // Si el backend aún no tiene API Key en .env, asigna sugerido
    const pool = Math.random() > 0.3 ? poolAutosSugeridos : poolMotosSugeridas;
    const sugerido = pool[Math.floor(Math.random() * pool.length)];
    selectedVehicleType = pool === poolMotosSugeridas ? 'Moto' : 'Auto';
    if (spotCustomName) spotCustomName.value = sugerido.nombre;
    if (spotBrandInput) spotBrandInput.value = sugerido.marca;
    if (spotPowerInput) spotPowerInput.value = sugerido.potencia;
    if (spotPriceInput) spotPriceInput.value = sugerido.precio || '$35,000';
    if (spotDetectedRarity) {
      spotDetectedRarity.textContent = sugerido.rareza.toUpperCase();
      spotDetectedRarity.className = `ai-rarity-pill rarity-${sugerido.rareza}`;
      spotDetectedRarity.dataset.rarity = sugerido.rareza;
    }
  }
}

// Selector tipo Auto / Moto (eliminado el control manual, controlado 100% por IA)
if (btnTypeToggles && btnTypeToggles.length) {
  btnTypeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      btnTypeToggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedVehicleType = btn.dataset.type;
    });
  });
}

// Botón repetir foto
if (btnRetakePhoto) {
  btnRetakePhoto.addEventListener('click', () => {
    iniciarCamaraReal();
  });
}

// Botón guardar spot en colección
if (btnSaveSpot) {
  btnSaveSpot.addEventListener('click', () => {
    guardarNuevoSpot();
  });
}

// Elementos del Modal de Duplicados
const modalDuplicateSpot = document.getElementById('modal-duplicate-spot');
const duplicateCarNameEl = document.getElementById('duplicate-car-name');
const btnDuplicateCancel = document.getElementById('btn-duplicate-cancel');
const btnDuplicateConfirm = document.getElementById('btn-duplicate-confirm');

let spotPendienteDuplicado = null;

if (btnDuplicateCancel && modalDuplicateSpot) {
  btnDuplicateCancel.addEventListener('click', () => {
    spotPendienteDuplicado = null;
    modalDuplicateSpot.close();
  });
}

if (btnDuplicateConfirm && modalDuplicateSpot) {
  btnDuplicateConfirm.addEventListener('click', () => {
    if (spotPendienteDuplicado) {
      ejecutarGuardadoFinal(spotPendienteDuplicado, true); // true = esDuplicado (0 XP, 0 Nitrio)
      spotPendienteDuplicado = null;
    }
    modalDuplicateSpot.close();
  });
}

// Lógica de guardado final
function guardarNuevoSpot() {
  const nombreFinal = (spotCustomName && spotCustomName.value.trim()) || "Vehículo Desconocido";
  const marcaFinal = (spotBrandInput && spotBrandInput.value.trim()) || nombreFinal.split(' ')[0];
  const potenciaFinal = (spotPowerInput && spotPowerInput.value.trim()) || "180 CV";
  const precioFinal = (spotPriceInput && spotPriceInput.value.trim()) || "$35,000";
  const rarezaFinal = (spotDetectedRarity && spotDetectedRarity.dataset.rarity) || 'comun';

  const nuevoSpot = {
    id: Date.now(),
    nombre: nombreFinal,
    marca: marcaFinal,
    rareza: rarezaFinal,
    tipo: selectedVehicleType,
    potencia: potenciaFinal,
    precio: precioFinal,
    imagen: capturedImageDataUrl || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"
  };

  // 1. Comprobar si ya existe un vehículo con el mismo nombre o modelo en la colección del usuario (autos o motos)
  const coleccionActual = selectedVehicleType === 'Auto' ? autos : motos;
  
  // Normalizar nombres para comparación precisa (sin año o detalles menores, ej: 'Suzuki GSX-R1000')
  const limpiarParaComparar = (str) => {
    return str.toLowerCase()
      .replace(/\b(20\d\d|19\d\d)\b/g, '') // eliminar años como 2017, 2024
      .replace(/[^a-z0-9]/g, '')           // eliminar espacios y guiones
      .trim();
  };

  const nuevoLimpio = limpiarParaComparar(nombreFinal);

  const esDuplicado = coleccionActual.some(v => {
    const existenteLimpio = limpiarParaComparar(v.nombre || '');
    if (!existenteLimpio || !nuevoLimpio) return false;
    return existenteLimpio === nuevoLimpio || 
           existenteLimpio.includes(nuevoLimpio) || 
           nuevoLimpio.includes(existenteLimpio);
  });

  if (esDuplicado && modalDuplicateSpot) {
    // Cerrar cámara primero para que el diálogo de confirmación no quede bloqueado detrás
    cerrarCamara();

    spotPendienteDuplicado = nuevoSpot;
    if (duplicateCarNameEl) duplicateCarNameEl.textContent = nombreFinal;
    modalDuplicateSpot.showModal();
    return;
  }

  // Si no es duplicado, guardar normalmente otorgando recompensas
  ejecutarGuardadoFinal(nuevoSpot, false);
}

function ejecutarGuardadoFinal(nuevoSpot, esDuplicado = false) {
  if (selectedVehicleType === 'Auto') {
    autos.unshift(nuevoSpot);
    StorageManager.set(STORAGE_KEYS.AUTOS, autos);
    modoGarajeActual = 'cars';
  } else {
    motos.unshift(nuevoSpot);
    StorageManager.set(STORAGE_KEYS.MOTOS, motos);
    modoGarajeActual = 'motos';
  }

  // Publicar también en el feed comunitario con su precio y persistirlo
  const nuevoFeedSpot = {
    id: 'spot_' + nuevoSpot.id,
    spotter: usuario.nombre ? `${usuario.nombre} (Tú)` : "Julio (Tú)",
    avatar: usuario.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    vehiculo: nuevoSpot.nombre,
    ubicacion: "Tu Garaje • Hace un momento",
    rareza: nuevoSpot.rareza,
    precio: nuevoSpot.precio,
    likes: 1,
    imagen: nuevoSpot.imagen,
    comentarios: []
  };

  feedSpotsUsuario.unshift(nuevoFeedSpot);
  StorageManager.set(STORAGE_KEYS.FEED_USUARIO, feedSpotsUsuario);
  feedSpots = [...feedSpotsUsuario, ...feedSpotsBase];
  renderizarFeed();

  // Registrar fecha del spot para el límite diario de usuarios gratuitos
  const hoyStr = new Date().toISOString().slice(0, 10);
  localStorage.setItem('turbospotter_ultimo_spot_fecha', hoyStr);

  // Cerrar cámara y cambiar vista
  cerrarCamara();
  renderizarGarajeUnificado();
  cambiarVista('garage');

  if (esDuplicado) {
    // DUPLICADO: 0 XP y 0 Nitrio
    nuevoSpot.esDuplicado = true;
    mostrarAnimacionNuevoSpot(nuevoSpot);
  } else {
    // PRIMER SPOT: Recompensa completa de gamer HUD
    agregarRecompensaSpot(nuevoSpot.rareza);
    mostrarAnimacionNuevoSpot(nuevoSpot);
  }
}


// Disparador principal de foto
btnShootPhoto.addEventListener('click', capturarFotoDesdeVideo);

// Cerrar modal al hacer click fuera del contenedor
cameraModal.addEventListener('click', (e) => {
  const rect = cameraModal.getBoundingClientRect();
  const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
  if (!isInDialog) {
    cerrarCamara();
  }
});

// ========================================================
// SISTEMA DE AMIGOS, SOLICITUDES Y COMPARATIVA VERSUS (con persistencia)
// ========================================================
const amigosPorDefecto = [
  {
    id: 'f1',
    nombre: "Lucas Rider",
    handle: "@lucas_rider",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    nivel: 79,
    rangoId: 'platino',
    puntosLp: 78,
    online: true,
    reciente: "Spotteó: Ducati Panigale V4 • Hace 35m",
    autosTotal: 42,
    motosTotal: 29,
    puntosScore: "8,450 pts",
    autoTop: { nombre: "Porsche 911 GT3 RS", img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80", potencia: "525 CV" },
    motoTop: { nombre: "Ducati Panigale V4 R", img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", potencia: "218 CV" }
  },
  {
    id: 'f2',
    nombre: "Mateo Spotter",
    handle: "@mateospot",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    nivel: 64,
    rangoId: 'oro',
    puntosLp: 62,
    online: true,
    reciente: "Spotteó: BMW M4 Competition • Hace 12m",
    autosTotal: 34,
    motosTotal: 12,
    puntosScore: "5,820 pts",
    autoTop: { nombre: "Nissan Skyline GT-R", img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", potencia: "330 CV" },
    motoTop: { nombre: "Kawasaki Ninja H2", img: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80", potencia: "231 CV" }
  },
  {
    id: 'f3',
    nombre: "Sofía Track",
    handle: "@sofiatrack",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    nivel: 52,
    rangoId: 'oro',
    puntosLp: 62,
    online: false,
    reciente: "Spotteó: Nissan GT-R Nismo • Hace 2h",
    autosTotal: 25,
    motosTotal: 8,
    puntosScore: "4,610 pts",
    autoTop: { nombre: "Ferrari SF90 Stradale", img: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=80", potencia: "1000 CV" },
    motoTop: { nombre: "Yamaha YZF-R1", img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80", potencia: "200 CV" }
  }
];

let listaAmigos = StorageManager.get(STORAGE_KEYS.AMIGOS, amigosPorDefecto);

const solicitudesPorDefecto = [
  {
    id: 'req1',
    nombre: "Franco V8",
    handle: "@franco_v8",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    nivel: 38,
    rangoId: 'plata',
    mensaje: "¡Te vi cazando en el circuito! Agregame para comparar spots."
  },
  {
    id: 'req2',
    nombre: "Elena Apex",
    handle: "@elena_apex",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    nivel: 45,
    rangoId: 'oro',
    mensaje: "Tiene 30 autos y 14 motos en común en tu zona."
  }
];

let listaSolicitudes = StorageManager.get(STORAGE_KEYS.SOLICITUDES, solicitudesPorDefecto);

// Elementos DOM del Club de Amigos
const friendsTabMyFriends = document.getElementById('friends-tab-myfriends');
const friendsTabRequests = document.getElementById('friends-tab-requests');
const friendsPanelMyFriends = document.getElementById('friends-panel-myfriends');
const friendsPanelRequests = document.getElementById('friends-panel-requests');
const friendsListContainer = document.getElementById('friends-list');
const requestsListContainer = document.getElementById('requests-list');
const badgeMyFriendsCount = document.getElementById('badge-my-friends-count');
const badgeRequestsCount = document.getElementById('badge-requests-count');
const friendsSearchInput = document.getElementById('friends-search-input');
const btnAddFriend = document.getElementById('btn-add-friend');

// Elementos DOM del Modal de Comparación
const modalCompare = document.getElementById('modal-compare');
const compareModalBody = document.getElementById('compare-modal-body');
const btnCloseCompare = document.getElementById('btn-close-compare');

// Configurar Tabs Switch de Amigos / Solicitudes
function inicializarSwitchAmigos() {
  if (friendsTabMyFriends && friendsTabRequests) {
    friendsTabMyFriends.addEventListener('click', () => {
      friendsTabMyFriends.classList.add('active');
      friendsTabMyFriends.setAttribute('aria-selected', 'true');
      friendsTabRequests.classList.remove('active');
      friendsTabRequests.setAttribute('aria-selected', 'false');

      if (friendsPanelMyFriends) friendsPanelMyFriends.style.display = 'block';
      if (friendsPanelRequests) friendsPanelRequests.style.display = 'none';
    });

    friendsTabRequests.addEventListener('click', () => {
      friendsTabRequests.classList.add('active');
      friendsTabRequests.setAttribute('aria-selected', 'true');
      friendsTabMyFriends.classList.remove('active');
      friendsTabMyFriends.setAttribute('aria-selected', 'false');

      if (friendsPanelRequests) friendsPanelRequests.style.display = 'block';
      if (friendsPanelMyFriends) friendsPanelMyFriends.style.display = 'none';
    });
  }

  if (btnCloseCompare && modalCompare) {
    btnCloseCompare.addEventListener('click', () => {
      modalCompare.close();
    });
    modalCompare.addEventListener('click', (e) => {
      const rect = modalCompare.getBoundingClientRect();
      const inBox = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                     rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!inBox) modalCompare.close();
    });
  }

  if (friendsSearchInput) {
    friendsSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      renderizarListaAmigos(q);
    });
  }

  if (btnAddFriend) {
    btnAddFriend.addEventListener('click', () => {
      abrirModalAnadirAmigo();
    });
  }
}

// Renderizar la lista de amigos con botones de Comparar
function renderizarListaAmigos(filtro = '') {
  if (!friendsListContainer) return;
  friendsListContainer.innerHTML = '';

  const amigosFiltrados = listaAmigos.filter(f => 
    f.nombre.toLowerCase().includes(filtro) || f.handle.toLowerCase().includes(filtro)
  );

  if (badgeMyFriendsCount) {
    badgeMyFriendsCount.textContent = listaAmigos.length;
  }

  if (amigosFiltrados.length === 0) {
    friendsListContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <p>No se encontraron amigos con ese nombre o usuario.</p>
      </div>
    `;
    return;
  }

  amigosFiltrados.forEach(amigo => {
    const rangoAmigo = DEFINICION_RANGOS.find(r => r.id === amigo.rangoId) || DEFINICION_RANGOS[0];
    const card = document.createElement('div');
    card.className = `friend-card ${amigo.online ? 'online' : ''}`;
    card.innerHTML = `
      <div class="friend-avatar-wrap">
        <img src="${amigo.avatar}" alt="${amigo.nombre}" class="friend-avatar" />
        ${amigo.online ? '<span class="online-indicator" title="En línea"></span>' : ''}
      </div>

      <div class="friend-info">
        <div class="friend-header-row">
          <h4>${amigo.nombre}</h4>
          <span class="friend-level">Lv.${amigo.nivel}</span>
          <span class="friend-rank-inline" style="color: ${rangoAmigo.colorPrincipal}; border-color: ${rangoAmigo.colorPrincipal}50;">
            ${generarSvgMedalla(rangoAmigo, `frnd_${amigo.id}`)}
            <span>${rangoAmigo.nombre}</span>
          </span>
        </div>
        <p class="friend-recent" style="margin: 0; font-size: 0.76rem; color: var(--text-secondary);">${amigo.reciente}</p>
        <div class="friend-stats-inline">
          <span>🚗 Autos: <strong>${amigo.autosTotal}</strong></span>
          <span>🏍️ Motos: <strong>${amigo.motosTotal}</strong></span>
          <span>⭐ <strong>${amigo.puntosScore}</strong></span>
        </div>
      </div>

      <div class="friend-actions-group">
        <button class="btn-compare-friend" data-friend-id="${amigo.id}" title="Comparar rangos, autos y motos">
          <span>⚔️ Comparar</span>
        </button>
        <button class="btn-friend-action btn-wave-action">Saludar 👋</button>
      </div>
    `;

    // Botón comparar
    const btnCompare = card.querySelector('.btn-compare-friend');
    if (btnCompare) {
      btnCompare.addEventListener('click', () => {
        abrirComparativaAmigo(amigo);
      });
    }

    // Botón saludar
    const btnWave = card.querySelector('.btn-wave-action');
    if (btnWave) {
      btnWave.addEventListener('click', (e) => {
        e.target.textContent = '¡Saludado! ✨';
        e.target.style.color = '#38bdf8';
        setTimeout(() => {
          e.target.textContent = 'Saludar 👋';
          e.target.style.color = '';
        }, 2000);
      });
    }

    friendsListContainer.appendChild(card);
  });
}

// Renderizar solicitudes pendientes
function renderizarListaSolicitudes() {
  if (!requestsListContainer) return;
  requestsListContainer.innerHTML = '';

  if (badgeRequestsCount) {
    badgeRequestsCount.textContent = listaSolicitudes.length;
    badgeRequestsCount.style.display = listaSolicitudes.length > 0 ? 'inline-flex' : 'none';
  }

  if (listaSolicitudes.length === 0) {
    requestsListContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); background: rgba(15, 23, 42, 0.5); border-radius: var(--radius-lg);">
        <p style="margin: 0; font-size: 0.9rem;">🎉 ¡No tienes solicitudes pendientes de amistad!</p>
      </div>
    `;
    return;
  }

  listaSolicitudes.forEach((req, idx) => {
    const rangoReq = DEFINICION_RANGOS.find(r => r.id === req.rangoId) || DEFINICION_RANGOS[0];
    const row = document.createElement('div');
    row.className = 'request-card';
    row.innerHTML = `
      <div class="request-card-info">
        <div class="friend-avatar-wrap">
          <img src="${req.avatar}" alt="${req.nombre}" class="friend-avatar" />
        </div>
        <div class="request-meta">
          <h4>${req.nombre} <span class="friend-level">Lv.${req.nivel}</span></h4>
          <p style="color: ${rangoReq.colorPrincipal}; font-weight: 600; margin-bottom: 2px;">Rango: ${rangoReq.nombre}</p>
          <p>${req.mensaje}</p>
        </div>
      </div>
      <div class="request-buttons">
        <button class="btn-accept-req" data-idx="${idx}">Aceptar</button>
        <button class="btn-reject-req" data-idx="${idx}">Rechazar</button>
      </div>
    `;

    // Manejador Aceptar
    row.querySelector('.btn-accept-req').addEventListener('click', () => {
      listaAmigos.unshift({
        id: 'f_' + Date.now(),
        nombre: req.nombre,
        handle: req.handle,
        avatar: req.avatar,
        nivel: req.nivel,
        rangoId: req.rangoId,
        puntosLp: 50,
        online: true,
        reciente: "¡Se unió como nuevo amigo!",
        autosTotal: 18,
        motosTotal: 6,
        puntosScore: "3,200 pts",
        autoTop: poolAutosSugeridos[0],
        motoTop: poolMotosSugeridas[0]
      });
      listaSolicitudes.splice(idx, 1);
      StorageManager.set(STORAGE_KEYS.AMIGOS, listaAmigos);
      StorageManager.set(STORAGE_KEYS.SOLICITUDES, listaSolicitudes);
      renderizarListaSolicitudes();
      renderizarListaAmigos();
    });

    // Manejador Rechazar
    row.querySelector('.btn-reject-req').addEventListener('click', () => {
      listaSolicitudes.splice(idx, 1);
      StorageManager.set(STORAGE_KEYS.SOLICITUDES, listaSolicitudes);
      renderizarListaSolicitudes();
    });

    requestsListContainer.appendChild(row);
  });
}

// Abrir Modal de Comparativa Versus de Rangos, Autos y Motos
function abrirComparativaAmigo(amigo) {
  if (!modalCompare || !compareModalBody) return;

  const totalAutosMios = autos ? autos.length : 0;
  const totalMotosMias = motos ? motos.length : 0;
  const { rangoActual: miRango } = calcularRangoUsuario(usuario.nivel, totalAutosMios + totalMotosMias);
  const rangoAmigo = DEFINICION_RANGOS.find(r => r.id === amigo.rangoId) || DEFINICION_RANGOS[0];

  // Cálculo de Quién lidera en Rango
  const indiceMiRango = DEFINICION_RANGOS.findIndex(r => r.id === miRango.id);
  const indiceRangoAmigo = DEFINICION_RANGOS.findIndex(r => r.id === rangoAmigo.id);

  let leadTexto = "¡Empate Técnico!";
  let leadClase = "lead-tie";

  if (indiceMiRango > indiceRangoAmigo) {
    leadTexto = "🏆 Tú lideras en Rango";
    leadClase = "lead-me";
  } else if (indiceMiRango < indiceRangoAmigo) {
    leadTexto = `🔥 ${amigo.nombre} lidera`;
    leadClase = "lead-friend";
  } else {
    if (usuario.nivel > amigo.nivel) {
      leadTexto = "🏆 Lideras por Nivel";
      leadClase = "lead-me";
    } else if (usuario.nivel < amigo.nivel) {
      leadTexto = `🔥 ${amigo.nombre} lidera por Nivel`;
      leadClase = "lead-friend";
    }
  }

  // Porcentajes de barras
  const maxNivel = Math.max(usuario.nivel, amigo.nivel) || 1;
  const pctNivelMe = Math.round((usuario.nivel / maxNivel) * 100);
  const pctNivelFriend = Math.round((amigo.nivel / maxNivel) * 100);

  const maxAutos = Math.max(totalAutosMios, amigo.autosTotal) || 1;
  const pctAutosMe = Math.round((totalAutosMios / maxAutos) * 100);
  const pctAutosFriend = Math.round((amigo.autosTotal / maxAutos) * 100);

  const maxMotos = Math.max(totalMotosMias, amigo.motosTotal) || 1;
  const pctMotosMe = Math.round((totalMotosMias / maxMotos) * 100);
  const pctMotosFriend = Math.round((amigo.motosTotal / maxMotos) * 100);

  // Mi vehículo estrella vs el de mi amigo
  const miAutoTop = autos[0] || { nombre: "Sin autos aún", imagen: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=400&q=80", potencia: "—" };
  const miMotoTop = motos[0] || { nombre: "Sin motos aún", imagen: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80", potencia: "—" };

  compareModalBody.innerHTML = `
    <!-- Banner de Cabecera Versus -->
    <div class="versus-header-banner">
      <div class="versus-player-col me">
        <div class="versus-avatar-frame">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" alt="Julio Alonzo" />
        </div>
        <span class="versus-player-name">Julio (Tú)</span>
        <span class="versus-player-tag">Lv.${usuario.nivel}</span>
      </div>

      <div class="versus-badge-icon">VS</div>

      <div class="versus-player-col friend">
        <div class="versus-avatar-frame">
          <img src="${amigo.avatar}" alt="${amigo.nombre}" />
        </div>
        <span class="versus-player-name">${amigo.nombre}</span>
        <span class="versus-player-tag">Lv.${amigo.nivel}</span>
      </div>
    </div>

    <!-- Comparativa de Medallas y Rangos -->
    <div class="compare-section-card">
      <div class="compare-section-title">
        <span>🎖️ Comparativa de Rangos y Medallas</span>
      </div>

      <div class="compare-rank-row">
        <!-- Mi Medalla -->
        <div class="compare-rank-side">
          <div class="compare-medal-container">
            ${generarSvgMedalla(miRango, 'cmp_me')}
          </div>
          <span class="compare-rank-name" style="color: ${miRango.colorPrincipal};">${miRango.nombre}</span>
          <span class="compare-rank-lp">${miRango.titulo}</span>
        </div>

        <!-- Indicador de Ventaja -->
        <div class="compare-rank-result">
          <span class="compare-lead-tag ${leadClase}">${leadTexto}</span>
        </div>

        <!-- Medalla de Amigo -->
        <div class="compare-rank-side">
          <div class="compare-medal-container">
            ${generarSvgMedalla(rangoAmigo, 'cmp_frnd')}
          </div>
          <span class="compare-rank-name" style="color: ${rangoAmigo.colorPrincipal};">${rangoAmigo.nombre}</span>
          <span class="compare-rank-lp">${rangoAmigo.titulo}</span>
        </div>
      </div>
    </div>

    <!-- Comparativa de Estadísticas de Garaje (Autos, Motos, Puntos) -->
    <div class="compare-section-card">
      <div class="compare-section-title">
        <span>📊 Garaje y Colección de Vehículos</span>
      </div>

      <div class="compare-stats-grid">
        <!-- Autos Spotteados -->
        <div class="compare-stat-item">
          <div class="stat-label-row">
            <span class="stat-val-me">🚗 Tú: ${totalAutosMios} Autos</span>
            <span>Cazas de Autos</span>
            <span class="stat-val-friend">${amigo.autosTotal} Autos</span>
          </div>
          <div class="stat-bar-duo">
            <div class="stat-bar-fill-me" style="width: ${pctAutosMe / 2}%;"></div>
            <div style="flex: 1;"></div>
            <div class="stat-bar-fill-friend" style="width: ${pctAutosFriend / 2}%;"></div>
          </div>
        </div>

        <!-- Motos Spotteadas -->
        <div class="compare-stat-item">
          <div class="stat-label-row">
            <span class="stat-val-me">🏍️ Tú: ${totalMotosMias} Motos</span>
            <span>Cazas de Motos</span>
            <span class="stat-val-friend">${amigo.motosTotal} Motos</span>
          </div>
          <div class="stat-bar-duo">
            <div class="stat-bar-fill-me" style="width: ${pctMotosMe / 2}%;"></div>
            <div style="flex: 1;"></div>
            <div class="stat-bar-fill-friend" style="width: ${pctMotosFriend / 2}%;"></div>
          </div>
        </div>

        <!-- Nivel Piloto -->
        <div class="compare-stat-item">
          <div class="stat-label-row">
            <span class="stat-val-me">⚡ Tú: Nivel ${usuario.nivel}</span>
            <span>Nivel de Spotter</span>
            <span class="stat-val-friend">Nivel ${amigo.nivel}</span>
          </div>
          <div class="stat-bar-duo">
            <div class="stat-bar-fill-me" style="width: ${pctNivelMe / 2}%;"></div>
            <div style="flex: 1;"></div>
            <div class="stat-bar-fill-friend" style="width: ${pctNivelFriend / 2}%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Duelo de Vehículos Insignia (Top Autos y Motos) -->
    <div class="compare-section-card">
      <div class="compare-section-title">
        <span>🔥 Duelo de Vehículos Insignia</span>
      </div>

      <div class="showcase-compare-grid">
        <!-- Mis Top -->
        <div class="showcase-column">
          <h5>Tu Garaje</h5>
          
          <div class="showcase-vehicle-mini">
            <img src="${miAutoTop.imagen}" alt="${miAutoTop.nombre}" />
            <div class="info">
              <div class="name">${miAutoTop.nombre}</div>
              <div class="sub">Auto Top • ${miAutoTop.potencia || 'Poder'}</div>
            </div>
          </div>

          <div class="showcase-vehicle-mini">
            <img src="${miMotoTop.imagen}" alt="${miMotoTop.nombre}" />
            <div class="info">
              <div class="name">${miMotoTop.nombre}</div>
              <div class="sub">Moto Top • ${miMotoTop.potencia || 'Poder'}</div>
            </div>
          </div>
        </div>

        <!-- Amigo Top -->
        <div class="showcase-column">
          <h5>Garaje de ${amigo.nombre.split(' ')[0]}</h5>
          
          <div class="showcase-vehicle-mini">
            <img src="${amigo.autoTop.img}" alt="${amigo.autoTop.nombre}" />
            <div class="info">
              <div class="name">${amigo.autoTop.nombre}</div>
              <div class="sub">Auto Top • ${amigo.autoTop.potencia}</div>
            </div>
          </div>

          <div class="showcase-vehicle-mini">
            <img src="${amigo.motoTop.img}" alt="${amigo.motoTop.nombre}" />
            <div class="info">
              <div class="name">${amigo.motoTop.nombre}</div>
              <div class="sub">Moto Top • ${amigo.motoTop.potencia}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  modalCompare.showModal();
}

// ========================================================
// INICIALIZACIÓN PRINCIPAL
// ========================================================
actualizarHUDUsuario();
renderizarGarajeUnificado();
renderizarFeed();
renderizarRanking();
inicializarSwitchAmigos();
renderizarListaAmigos();
renderizarListaSolicitudes();
inicializarTiendaArticulos();


// ========================================================
// GESTOR DE TEMAS & APARIENCIA (MODO CLARO / OSCURO)
// ========================================================
const modalTheme = document.getElementById('modal-theme');
const settingCurrentThemeText = document.getElementById('setting-current-theme-text');
const btnSaveTheme = document.getElementById('btn-save-theme');
const themeCards = document.querySelectorAll('.theme-option-card');
const checkThemeDark = document.getElementById('check-theme-dark');
const checkThemeLight = document.getElementById('check-theme-light');

let temaSeleccionadoTemp = localStorage.getItem('carspotter_theme') || 'dark';

function aplicarTema(tema) {
  if (tema === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (settingCurrentThemeText) settingCurrentThemeText.textContent = 'Modo Claro';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (settingCurrentThemeText) settingCurrentThemeText.textContent = 'Modo Oscuro';
  }
}

function actualizarVistaModalTema() {
  themeCards.forEach(card => {
    const t = card.dataset.theme;
    if (t === temaSeleccionadoTemp) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  if (checkThemeDark) checkThemeDark.textContent = (temaSeleccionadoTemp === 'dark') ? '✓' : '';
  if (checkThemeLight) checkThemeLight.textContent = (temaSeleccionadoTemp === 'light') ? '✓' : '';
}

function abrirModalTema() {
  if (!modalTheme) return;
  temaSeleccionadoTemp = localStorage.getItem('carspotter_theme') || 'dark';
  actualizarVistaModalTema();
  modalTheme.showModal();
}

themeCards.forEach(card => {
  card.addEventListener('click', () => {
    temaSeleccionadoTemp = card.dataset.theme;
    actualizarVistaModalTema();
  });
});

if (btnSaveTheme) {
  btnSaveTheme.addEventListener('click', () => {
    localStorage.setItem('carspotter_theme', temaSeleccionadoTemp);
    aplicarTema(temaSeleccionadoTemp);
    if (modalTheme) modalTheme.close();
  });
}

// Cerrar al hacer clic en el backdrop
if (modalTheme) {
  modalTheme.addEventListener('click', (e) => {
    const rect = modalTheme.getBoundingClientRect();
    const inDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!inDialog) {
      modalTheme.close();
    }
  });
}

// Inicializar tema guardado
const temaGuardado = localStorage.getItem('carspotter_theme') || 'dark';
aplicarTema(temaGuardado);


// ========================================================
// GESTOR DE EDICIÓN DE PERFIL (FOTO, NOMBRE, USUARIO, BIO)
// ========================================================
const modalEditProfile = document.getElementById('modal-edit-profile');
const editAvatarPreviewImg = document.getElementById('edit-avatar-preview-img');
const inputAvatarFile = document.getElementById('input-avatar-file');
const avatarPresetsGrid = document.getElementById('avatar-presets-grid');
const editInputUsername = document.getElementById('edit-input-username');
const editInputBio = document.getElementById('edit-input-bio');
const bioCharCount = document.getElementById('bio-char-count');
const btnCancelEditProfile = document.getElementById('btn-cancel-edit-profile');
const btnSaveEditProfile = document.getElementById('btn-save-edit-profile');

// Lista de avatares automovilísticos / urbanos predefinidos
const PRESET_AVATARES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=180&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=180&q=80"
];

let avatarTemporal = "";

function inicializarPresetsAvatares() {
  if (!avatarPresetsGrid) return;
  avatarPresetsGrid.innerHTML = '';
  PRESET_AVATARES.forEach(url => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'avatar-preset-btn';
    if (url === avatarTemporal) btn.classList.add('selected');
    btn.innerHTML = `<img src="${url}" alt="Avatar preset">`;
    btn.addEventListener('click', () => {
      avatarTemporal = url;
      if (editAvatarPreviewImg) editAvatarPreviewImg.src = url;
      document.querySelectorAll('.avatar-preset-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    avatarPresetsGrid.appendChild(btn);
  });
}

function abrirModalEdicionPerfil() {
  if (!modalEditProfile) return;
  avatarTemporal = usuario.avatar || usuarioPorDefecto.avatar;
  if (editAvatarPreviewImg) editAvatarPreviewImg.src = avatarTemporal;
  if (editInputUsername) editInputUsername.value = (usuario.username || "").replace(/^@/, '');
  if (editInputBio) {
    editInputBio.value = usuario.bio || "";
    if (bioCharCount) bioCharCount.textContent = `${editInputBio.value.length}/150`;
  }
  inicializarPresetsAvatares();
  modalEditProfile.showModal();
}

// Botones para abrir modal de editar perfil
if (btnOpenEditProfile) {
  btnOpenEditProfile.addEventListener('click', abrirModalEdicionPerfil);
}
if (btnProfileCardAvatar) {
  btnProfileCardAvatar.addEventListener('click', abrirModalEdicionPerfil);
}

// Contador en tiempo real de caracteres en Bio
if (editInputBio && bioCharCount) {
  editInputBio.addEventListener('input', () => {
    bioCharCount.textContent = `${editInputBio.value.length}/150`;
  });
}

// Subir foto local desde archivo del dispositivo
if (inputAvatarFile) {
  inputAvatarFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        avatarTemporal = evt.target.result;
        if (editAvatarPreviewImg) editAvatarPreviewImg.src = avatarTemporal;
        document.querySelectorAll('.avatar-preset-btn').forEach(b => b.classList.remove('selected'));
      };
      reader.readAsDataURL(file);
    }
  });
}

// Botón Cancelar
if (btnCancelEditProfile) {
  btnCancelEditProfile.addEventListener('click', () => {
    if (modalEditProfile) modalEditProfile.close();
  });
}

// Botón Guardar Cambios
if (btnSaveEditProfile) {
  btnSaveEditProfile.addEventListener('click', () => {
    const nuevoUsername = editInputUsername ? editInputUsername.value.trim().replace(/^@/, '') : "";
    const nuevaBio = editInputBio ? editInputBio.value.trim() : "";

    if (!nuevoUsername) {
      alert("Por favor ingresa un nombre de usuario (@handle).");
      return;
    }

    usuario.username = nuevoUsername;
    usuario.bio = nuevaBio;
    if (avatarTemporal) {
      usuario.avatar = avatarTemporal;
    }

    // Persistir cambios en localStorage
    StorageManager.set(STORAGE_KEYS.USUARIO, usuario);

    // Actualizar toda la interfaz
    actualizarHUDUsuario();

    if (modalEditProfile) modalEditProfile.close();
  });
}

// Cerrar al pulsar fuera del modal
if (modalEditProfile) {
  modalEditProfile.addEventListener('click', (e) => {
    const rect = modalEditProfile.getBoundingClientRect();
    const inDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!inDialog) {
      modalEditProfile.close();
    }
  });
}


// Botón Atrás de Configuración
const btnCloseSettingsBack = document.getElementById('btn-close-settings-back');
if (btnCloseSettingsBack) {
  btnCloseSettingsBack.addEventListener('click', () => {
    if (modalSettings) modalSettings.close();
  });
}


// ========================================================
// SISTEMA Y GESTOR DE MISIONES Y RECOMPENSAS
// ========================================================
const missionsListContainer = document.getElementById('missions-list-container');
const missionsCompletedCount = document.getElementById('missions-completed-count');
const missionsClaimableBadge = document.getElementById('missions-claimable-badge');
const badgeDotAlert = document.querySelector('.badge-dot-alert');

// Definición de las misiones oficiales de TurboSpotter
const DEFINICION_MISIONES = [
  {
    id: 'm_primer_spot',
    titulo: '📸 Primer Avistamiento',
    desc: 'Captura al menos 1 auto o moto en la calle con la cámara',
    objetivo: 1,
    recompensaMonedas: 100,
    recompensaXp: 150,
    evaluar: (autosList, motosList) => (autosList.length + motosList.length)
  },
  {
    id: 'm_aleman',
    titulo: '🔥 Caza un Alemán',
    desc: 'Spottea 3 vehículos de marcas alemanas (Porsche, BMW, Audi, Mercedes-Benz)',
    objetivo: 3,
    recompensaMonedas: 150,
    recompensaXp: 250,
    evaluar: (autosList, motosList) => {
      const todos = [...autosList, ...motosList];
      const marcasAlemanas = ['porsche', 'bmw', 'audi', 'mercedes', 'mercedes-benz', 'volkswagen'];
      return todos.filter(v => marcasAlemanas.some(m => (v.marca || '').toLowerCase().includes(m))).length;
    }
  },
  {
    id: 'm_espiritu_moto',
    titulo: '🏍️ Espíritu Motero',
    desc: 'Encuentra y agrega al menos 1 moto a tu garaje',
    objetivo: 1,
    recompensaMonedas: 80,
    recompensaXp: 200,
    evaluar: (autosList, motosList) => motosList.length
  },
  {
    id: 'm_cazador_epico',
    titulo: '💎 Cazador Exótico',
    desc: 'Spottea al menos 1 vehículo de rareza Épica o Legendaria',
    objetivo: 1,
    recompensaMonedas: 250,
    recompensaXp: 300,
    evaluar: (autosList, motosList) => {
      const todos = [...autosList, ...motosList];
      return todos.filter(v => v.rareza === 'epico' || v.rareza === 'legendario').length;
    }
  },
  {
    id: 'm_garaje_5',
    titulo: '🏆 Coleccionista en Alza',
    desc: 'Acumula un total de 5 vehículos en tu garaje',
    objetivo: 5,
    recompensaMonedas: 200,
    recompensaXp: 220,
    evaluar: (autosList, motosList) => (autosList.length + motosList.length)
  }
];

let misionesReclamadas = StorageManager.get(STORAGE_KEYS.MISIONES_RECLAMADAS, []);

function calcularEstadoMisiones() {
  const autosActuales = autos || [];
  const motosActuales = motos || [];
  let completadas = 0;
  let reclamables = 0;
  let gemasDisponibles = 0;

  const misionesCalculadas = DEFINICION_MISIONES.map(m => {
    const progresoActual = Math.min(m.objetivo, m.evaluar(autosActuales, motosActuales));
    const cumplida = progresoActual >= m.objetivo;
    const yaReclamada = misionesReclamadas.includes(m.id);

    if (cumplida) completadas++;
    if (cumplida && !yaReclamada) {
      reclamables++;
      gemasDisponibles += m.recompensaMonedas;
    }

    return {
      ...m,
      progresoActual,
      cumplida,
      yaReclamada
    };
  });

  return { misionesCalculadas, completadas, reclamables, gemasDisponibles };
}

function renderizarMisiones() {
  if (!missionsListContainer) return;
  missionsListContainer.innerHTML = '';

  const { misionesCalculadas, completadas, reclamables, gemasDisponibles } = calcularEstadoMisiones();

  if (missionsCompletedCount) {
    missionsCompletedCount.textContent = `${completadas}/${DEFINICION_MISIONES.length}`;
  }
  if (missionsClaimableBadge) {
    missionsClaimableBadge.textContent = `${gemasDisponibles} 💎`;
  }

  // Indicador de punto rojo de alerta en el botón de Misiones del menú
  if (badgeDotAlert) {
    badgeDotAlert.style.display = reclamables > 0 ? 'block' : 'none';
  }

  misionesCalculadas.forEach(m => {
    const item = document.createElement('div');
    const pct = Math.min(100, Math.round((m.progresoActual / m.objetivo) * 100));

    let estadoClase = '';
    if (m.yaReclamada) estadoClase = 'claimed';
    else if (m.cumplida) estadoClase = 'claimable';

    item.className = `mission-item ${estadoClase}`;

    let botonORecompensa = '';
    if (m.yaReclamada) {
      botonORecompensa = `<span class="mission-badge-claimed">✓ Reclamado</span>`;
    } else if (m.cumplida) {
      botonORecompensa = `<button class="btn-claim-mission" data-mission-id="${m.id}">Reclamar +${m.recompensaMonedas} 💎</button>`;
    } else {
      botonORecompensa = `<span class="mission-reward-tag">+${m.recompensaXp} XP • ${m.recompensaMonedas} 💎</span>`;
    }

    item.innerHTML = `
      <div class="mission-info">
        <h4>${m.titulo}</h4>
        <p>${m.desc} (Progreso: ${m.progresoActual}/${m.objetivo})</p>
        <div class="mission-progress-bar">
          <div class="fill" style="width: ${pct}%;"></div>
        </div>
      </div>
      ${botonORecompensa}
    `;

    // Conectar botón reclamar
    const btnClaim = item.querySelector('.btn-claim-mission');
    if (btnClaim) {
      btnClaim.addEventListener('click', () => {
        reclamarRecompensaMision(m);
      });
    }

    missionsListContainer.appendChild(item);
  });
}

function reclamarRecompensaMision(mision) {
  if (misionesReclamadas.includes(mision.id)) return;

  // 1. Guardar id en la lista de reclamadas
  misionesReclamadas.push(mision.id);
  StorageManager.set(STORAGE_KEYS.MISIONES_RECLAMADAS, misionesReclamadas);

  // 2. Añadir gemas y XP progresivo al usuario
  const { nivelesSubidos } = otorgarXpUsuario(mision.recompensaXp, mision.recompensaMonedas);

  // 3. Actualizar la interfaz de misiones
  renderizarMisiones();

  if (nivelesSubidos === 0) {
    alert(`🎁 ¡Recompensa reclamada con éxito!\n+${mision.recompensaMonedas} Nitrio 💎\n+${mision.recompensaXp} XP ⚡`);
  }
}


// ========================================================
// SISTEMA Y MODAL DE AÑADIR NUEVOS AMIGOS
// ========================================================
const modalAddFriend = document.getElementById('modal-add-friend');
const inputSearchNewFriend = document.getElementById('input-search-new-friend');
const suggestedSpottersList = document.getElementById('suggested-spotters-list');

// Base de spotters recomendados de la comunidad
const SPOTTERS_SUGERIDOS_GLOBAL = [
  {
    id: 'sug_1',
    nombre: "Marcos GT",
    handle: "marcos_gt",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    nivel: 54,
    rangoId: 'oro',
    spots: 41,
    especialidad: "Superdeportivos V10 / V12"
  },
  {
    id: 'sug_2',
    nombre: "Camila Turbo",
    handle: "camila_turbo",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    nivel: 47,
    rangoId: 'plata',
    spots: 33,
    especialidad: "JDM Clásicos y Drifting"
  },
  {
    id: 'sug_3',
    nombre: "Nico Panigale",
    handle: "nico_v4",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    nivel: 62,
    rangoId: 'platino',
    spots: 58,
    especialidad: "Superbikes & Paddock"
  },
  {
    id: 'sug_4',
    nombre: "Valen Carrera",
    handle: "valen_911",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    nivel: 39,
    rangoId: 'plata',
    spots: 26,
    especialidad: "Porsche GT3 RS y Trackdays"
  }
];

let solicitudesEnviadas = StorageManager.get('carspotter_solicitudes_enviadas_v1', {});

function abrirModalAnadirAmigo() {
  if (!modalAddFriend) return;
  if (inputSearchNewFriend) inputSearchNewFriend.value = '';
  renderizarSpottersSugeridos('');
  modalAddFriend.showModal();
}

function renderizarSpottersSugeridos(filtro = '') {
  if (!suggestedSpottersList) return;
  suggestedSpottersList.innerHTML = '';

  const q = filtro.toLowerCase().trim().replace(/^@/, '');

  // Filtrar spotters que no sean ya amigos míos
  const handlesAmigos = listaAmigos.map(a => (a.handle || '').toLowerCase().replace(/^@/, ''));

  let listaAMostrar = SPOTTERS_SUGERIDOS_GLOBAL.filter(s => {
    const yaEsAmigo = handlesAmigos.includes(s.handle.toLowerCase());
    if (yaEsAmigo) return false;
    if (!q) return true;
    return s.nombre.toLowerCase().includes(q) || s.handle.toLowerCase().includes(q) || s.especialidad.toLowerCase().includes(q);
  });

  if (listaAMostrar.length === 0) {
    suggestedSpottersList.innerHTML = `
      <div style="text-align: center; padding: 25px 10px; color: var(--text-muted); font-size: 0.88rem;">
        <p>No se encontraron spotters con ese usuario.</p>
        <button class="btn-send-friend-req" id="btn-force-invite" style="margin-top: 8px;">Enviar invitación a @${q}</button>
      </div>
    `;
    const btnForce = document.getElementById('btn-force-invite');
    if (btnForce && q) {
      btnForce.addEventListener('click', () => {
        alert(`✉️ ¡Invitación y solicitud de amistad enviada a @${q}!`);
        modalAddFriend.close();
      });
    }
    return;
  }

  listaAMostrar.forEach(spotter => {
    const yaEnviada = !!solicitudesEnviadas[spotter.id];
    const rangoInfo = DEFINICION_RANGOS.find(r => r.id === spotter.rangoId) || DEFINICION_RANGOS[0];

    const card = document.createElement('div');
    card.className = 'suggested-user-card';
    card.innerHTML = `
      <div class="suggested-user-left">
        <img src="${spotter.avatar}" alt="${spotter.nombre}" class="suggested-avatar" />
        <div class="suggested-meta">
          <strong>${spotter.nombre} <small style="color: ${rangoInfo.colorPrincipal}; font-weight:700;">Lv.${spotter.nivel}</small></strong>
          <small>@${spotter.handle} • ${spotter.especialidad}</small>
        </div>
      </div>
      <button class="btn-send-friend-req ${yaEnviada ? 'sent' : ''}" data-spotter-id="${spotter.id}">
        ${yaEnviada ? '✓ Enviada' : '+ Añadir'}
      </button>
    `;

    const btnReq = card.querySelector('.btn-send-friend-req');
    if (btnReq && !yaEnviada) {
      btnReq.addEventListener('click', () => {
        solicitudesEnviadas[spotter.id] = true;
        StorageManager.set('carspotter_solicitudes_enviadas_v1', solicitudesEnviadas);
        btnReq.classList.add('sent');
        btnReq.textContent = '✓ Enviada';
        alert(`🤝 ¡Solicitud de amistad enviada a ${spotter.nombre} (@${spotter.handle})!`);
      });
    }

    suggestedSpottersList.appendChild(card);
  });
}

if (inputSearchNewFriend) {
  inputSearchNewFriend.addEventListener('input', (e) => {
    renderizarSpottersSugeridos(e.target.value);
  });
}

if (modalAddFriend) {
  modalAddFriend.addEventListener('click', (e) => {
    const rect = modalAddFriend.getBoundingClientRect();
    const inBox = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                   rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!inBox) modalAddFriend.close();
  });
}

// ========================================================
// SISTEMA Y ANIMACIÓN CINEMÁTICA DE SUBIDA DE NIVEL
// ========================================================
const levelUpOverlay = document.getElementById('level-up-overlay');
const levelUpDisplayNum = document.getElementById('level-up-display-num');
const levelUpRewardCoins = document.getElementById('level-up-reward-coins');
const btnClaimLevelUp = document.getElementById('btn-claim-level-up');

function dispararConfetiLevelUp() {
  // Efecto de partículas de celebración dinámicas
  const colores = ['#38bdf8', '#0284c7', '#f59e0b', '#10b981', '#ec4899', '#ffffff'];
  const totalParticulas = 35;
  
  for (let i = 0; i < totalParticulas; i++) {
    const particula = document.createElement('div');
    const color = colores[Math.floor(Math.random() * colores.length)];
    const size = Math.random() * 8 + 6;
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const destX = startX + (Math.random() - 0.5) * (window.innerWidth * 0.85);
    const destY = startY + (Math.random() - 0.5) * (window.innerHeight * 0.7);
    const rotation = Math.random() * 720 - 360;

    particula.style.position = 'fixed';
    particula.style.left = `${startX}px`;
    particula.style.top = `${startY}px`;
    particula.style.width = `${size}px`;
    particula.style.height = `${size * (Math.random() > 0.5 ? 1 : 1.6)}px`;
    particula.style.backgroundColor = color;
    particula.style.borderRadius = Math.random() > 0.4 ? '2px' : '50%';
    particula.style.pointerEvents = 'none';
    particula.style.zIndex = '10005';
    particula.style.transform = 'translate(-50%, -50%) scale(0)';
    particula.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
    particula.style.opacity = '1';

    document.body.appendChild(particula);

    // Animación hacia afuera
    requestAnimationFrame(() => {
      particula.style.transform = `translate(${destX - startX}px, ${destY - startY}px) rotate(${rotation}deg) scale(1)`;
      particula.style.opacity = '0';
    });

    // Limpieza
    setTimeout(() => {
      particula.remove();
    }, 1200);
  }
}

// ========================================================
// SISTEMA DE AUDIO PROCEDURAL CON WEB AUDIO API
// (Sonidos realistas de motor V8/V10, aceleración y fanfarrias)
// ========================================================

// Sonido potente de subida de nivel (Aceleración de motor + acorde triunfal arcade)
function reproducirSonidoSubidaNivel() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;

    // 1. Rugido de aceleración del motor (Oscilador dual con distorsión y pitch sweep ascendente)
    const oscEngine = audioCtx.createOscillator();
    const oscSub = audioCtx.createOscillator();
    const gainEngine = audioCtx.createGain();
    const filterEngine = audioCtx.createBiquadFilter();

    oscEngine.type = 'sawtooth';
    oscSub.type = 'triangle';

    // Sweep de revoluciones (RPM): de 80Hz (ralentí) hasta 380Hz (aceleración pura)
    oscEngine.frequency.setValueAtTime(85, t);
    oscEngine.frequency.exponentialRampToValueAtTime(380, t + 0.45);
    oscEngine.frequency.exponentialRampToValueAtTime(260, t + 0.85);

    oscSub.frequency.setValueAtTime(42, t);
    oscSub.frequency.exponentialRampToValueAtTime(190, t + 0.45);
    oscSub.frequency.exponentialRampToValueAtTime(130, t + 0.85);

    filterEngine.type = 'lowpass';
    filterEngine.frequency.setValueAtTime(450, t);
    filterEngine.frequency.exponentialRampToValueAtTime(2800, t + 0.45);
    filterEngine.frequency.exponentialRampToValueAtTime(800, t + 0.85);

    gainEngine.gain.setValueAtTime(0.01, t);
    gainEngine.gain.linearRampToValueAtTime(0.25, t + 0.15);
    gainEngine.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    oscEngine.connect(filterEngine);
    oscSub.connect(filterEngine);
    filterEngine.connect(gainEngine);
    gainEngine.connect(audioCtx.destination);

    oscEngine.start(t);
    oscSub.start(t);
    oscEngine.stop(t + 0.95);
    oscSub.stop(t + 0.95);

    // 2. Chime triunfal brillante y futurista de videojuego (C5 - E5 - G5 - C6)
    const arpegio = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    arpegio.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const tNota = t + 0.25 + idx * 0.09;
      gain.gain.setValueAtTime(0.12, tNota);
      gain.gain.exponentialRampToValueAtTime(0.001, tNota + 0.55);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(tNota);
      osc.stop(tNota + 0.6);
    });
  } catch (err) {
    console.warn("Audio Context no disponible:", err);
  }
}

// Sonido ÉPICO para vehículo Legendario: Rugido salvaje de Supercar + Pop de escape turbo
function reproducirSonidoVehiculoLegendario() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;

    // 1. Rugido profundo de Supercar V10/V12 (sawtooth modulado)
    const oscV12 = audioCtx.createOscillator();
    const oscV12Harm = audioCtx.createOscillator();
    const gainEngine = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    oscV12.type = 'sawtooth';
    oscV12Harm.type = 'sawtooth';

    // Aceleración salvaje
    oscV12.frequency.setValueAtTime(110, t);
    oscV12.frequency.exponentialRampToValueAtTime(520, t + 0.55);
    oscV12.frequency.exponentialRampToValueAtTime(320, t + 1.2);

    oscV12Harm.frequency.setValueAtTime(220, t);
    oscV12Harm.frequency.exponentialRampToValueAtTime(1040, t + 0.55);
    oscV12Harm.frequency.exponentialRampToValueAtTime(640, t + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, t);
    filter.frequency.exponentialRampToValueAtTime(4500, t + 0.55);
    filter.frequency.exponentialRampToValueAtTime(1200, t + 1.2);

    gainEngine.gain.setValueAtTime(0.01, t);
    gainEngine.gain.linearRampToValueAtTime(0.3, t + 0.18);
    gainEngine.gain.exponentialRampToValueAtTime(0.001, t + 1.25);

    oscV12.connect(filter);
    oscV12Harm.connect(filter);
    filter.connect(gainEngine);
    gainEngine.connect(audioCtx.destination);

    oscV12.start(t);
    oscV12Harm.start(t);
    oscV12.stop(t + 1.3);
    oscV12Harm.stop(t + 1.3);

    // 2. Petardeo / Pop de escape turbo en el pico de aceleración (t + 0.55)
    setTimeout(() => {
      try {
        const tPop = audioCtx.currentTime;
        const popBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.08, audioCtx.sampleRate);
        const data = popBuf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.2));
        const noise = audioCtx.createBufferSource();
        noise.buffer = popBuf;
        const popGain = audioCtx.createGain();
        popGain.gain.setValueAtTime(0.28, tPop);
        popGain.gain.exponentialRampToValueAtTime(0.001, tPop + 0.08);
        noise.connect(popGain);
        popGain.connect(audioCtx.destination);
        noise.start(tPop);
      } catch(e) {}
    }, 550);

    // 3. Acorde legendario orquestal resplandeciente (Sintetizador dorado)
    const notasGold = [440, 554.37, 659.25, 880, 1108.73]; // La Mayor brillante
    notasGold.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const tNota = t + 0.35 + idx * 0.08;
      gain.gain.setValueAtTime(0.14, tNota);
      gain.gain.exponentialRampToValueAtTime(0.001, tNota + 0.85);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(tNota);
      osc.stop(tNota + 0.9);
    });
  } catch (err) {
    console.warn("Audio legendario error:", err);
  }
}

function mostrarAnimacionSubidaNivel(nuevoNivel, monedasExtra = 100) {
  if (levelUpDisplayNum) levelUpDisplayNum.textContent = nuevoNivel;
  if (levelUpRewardCoins) levelUpRewardCoins.textContent = `+${monedasExtra} Nitrio`;

  // Animación de resplandor en la píldora de nivel superior (HUD)
  const headerBadge = document.getElementById('btn-header-profile');
  if (headerBadge) {
    headerBadge.classList.add('hud-level-glow');
    setTimeout(() => headerBadge.classList.remove('hud-level-glow'), 1300);
  }

  // Reproducir sonido enriquecido de aceleración y subida de nivel
  reproducirSonidoSubidaNivel();

  // Desplegar overlay
  if (levelUpOverlay) {
    levelUpOverlay.classList.add('active');
    levelUpOverlay.setAttribute('aria-hidden', 'false');
  }

  // Lanzar explosión de confeti
  dispararConfetiLevelUp();
}

function cerrarAnimacionSubidaNivel() {
  if (levelUpOverlay) {
    levelUpOverlay.classList.remove('active');
    levelUpOverlay.setAttribute('aria-hidden', 'true');
  }
}

if (btnClaimLevelUp) {
  btnClaimLevelUp.addEventListener('click', cerrarAnimacionSubidaNivel);
}

if (levelUpOverlay) {
  levelUpOverlay.addEventListener('click', (e) => {
    if (e.target === levelUpOverlay) {
      cerrarAnimacionSubidaNivel();
    }
  });
}

// Permitir probar y activar la animación desde cualquier parte (consola o UI)
window.mostrarAnimacionSubidaNivel = mostrarAnimacionSubidaNivel;
window.reproducirSonidoSubidaNivel = reproducirSonidoSubidaNivel;
window.reproducirSonidoVehiculoLegendario = reproducirSonidoVehiculoLegendario;

// Conectar botón interactivo de prueba en la píldora de Nivel del Perfil
const btnTestLevelUp = document.getElementById('btn-test-level-up');
if (btnTestLevelUp) {
  btnTestLevelUp.addEventListener('click', () => {
    usuario.nivel += 1;
    usuario.xp = 15;
    StorageManager.set(STORAGE_KEYS.USUARIO, usuario);
    actualizarHUDUsuario();
    mostrarAnimacionSubidaNivel(usuario.nivel, 100);
  });
}

// ========================================================
// SISTEMA Y ANIMACIÓN CINEMÁTICA DE SUBIDA DE RANGO (RANK UP)
// ========================================================
const rankUpOverlay = document.getElementById('rank-up-overlay');
const rankUpMedalSvgBox = document.getElementById('rank-up-medal-svg-box');
const rankUpNameDisplay = document.getElementById('rank-up-name-display');
const rankUpTitleDisplay = document.getElementById('rank-up-title-display');
const btnClaimRankUp = document.getElementById('btn-claim-rank-up');

function dispararConfetiDoradoRankUp() {
  const colores = ['#f59e0b', '#fbbf24', '#d97706', '#fef08a', '#ffffff', '#e0f2fe'];
  const totalParticulas = 50;
  
  for (let i = 0; i < totalParticulas; i++) {
    const particula = document.createElement('div');
    const color = colores[Math.floor(Math.random() * colores.length)];
    const size = Math.random() * 10 + 6;
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const destX = startX + (Math.random() - 0.5) * (window.innerWidth * 0.9);
    const destY = startY + (Math.random() - 0.5) * (window.innerHeight * 0.8);
    const rotation = Math.random() * 900 - 450;

    particula.style.position = 'fixed';
    particula.style.left = `${startX}px`;
    particula.style.top = `${startY}px`;
    particula.style.width = `${size}px`;
    particula.style.height = `${size * (Math.random() > 0.4 ? 1.4 : 1)}px`;
    particula.style.backgroundColor = color;
    particula.style.borderRadius = Math.random() > 0.3 ? '2px' : '50%';
    particula.style.pointerEvents = 'none';
    particula.style.zIndex = '10015';
    particula.style.transform = 'translate(-50%, -50%) scale(0)';
    particula.style.transition = 'all 1.2s cubic-bezier(0.2, 0.9, 0.3, 1)';
    particula.style.opacity = '1';
    particula.style.boxShadow = `0 0 10px ${color}80`;

    document.body.appendChild(particula);

    requestAnimationFrame(() => {
      particula.style.transform = `translate(${destX - startX}px, ${destY - startY}px) rotate(${rotation}deg) scale(1)`;
      particula.style.opacity = '0';
    });

    setTimeout(() => particula.remove(), 1400);
  }
}

function mostrarAnimacionSubidaRango(rango) {
  if (!rango) {
    const totalAutos = (autos ? autos.length : 0) + (motos ? motos.length : 0);
    const res = calcularRangoUsuario(usuario.nivel, totalAutos);
    rango = res.rangoActual;
  }

  if (rankUpNameDisplay) {
    rankUpNameDisplay.textContent = rango.nombre;
    rankUpNameDisplay.style.color = rango.colorPrincipal;
  }
  if (rankUpTitleDisplay) {
    rankUpTitleDisplay.textContent = rango.titulo;
  }
  if (rankUpMedalSvgBox) {
    rankUpMedalSvgBox.innerHTML = generarSvgMedalla(rango, 'rank_up_hero');
  }

  // Resplandor dorado en la barra superior (HUD)
  const headerRank = document.getElementById('header-rank-badge');
  if (headerRank) {
    headerRank.classList.add('hud-level-glow');
    setTimeout(() => headerRank.classList.remove('hud-level-glow'), 1400);
  }

  // Sonido orquestal de trompetas / victoria con Web Audio API
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // Fanfarria majestuosa: C4, G4, C5, E5, G5
    const fanfarria = [261.63, 392.00, 523.25, 659.25, 783.99];
    fanfarria.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      const t = audioCtx.currentTime + idx * 0.12;
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.65);
    });
  } catch (err) {
    // Audio opcional
  }

  if (rankUpOverlay) {
    rankUpOverlay.classList.add('active');
    rankUpOverlay.setAttribute('aria-hidden', 'false');
  }

  dispararConfetiDoradoRankUp();
}

function cerrarAnimacionSubidaRango() {
  if (rankUpOverlay) {
    rankUpOverlay.classList.remove('active');
    rankUpOverlay.setAttribute('aria-hidden', 'true');
  }
}

if (btnClaimRankUp) {
  btnClaimRankUp.addEventListener('click', cerrarAnimacionSubidaRango);
}

if (rankUpOverlay) {
  rankUpOverlay.addEventListener('click', (e) => {
    if (e.target === rankUpOverlay) {
      cerrarAnimacionSubidaRango();
    }
  });
}

// Permitir probar y activar la animación de rango desde consola o botón
window.mostrarAnimacionSubidaRango = mostrarAnimacionSubidaRango;

// Conectar prueba interactiva rápida tocando el título de Rango en el perfil
if (userTierPill) {
  userTierPill.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const totalAutos = (autos ? autos.length : 0) + (motos ? motos.length : 0);
    const res = calcularRangoUsuario(usuario.nivel, totalAutos);
    mostrarAnimacionSubidaRango(res.rangoActual);
  });
}

// ========================================================
// SISTEMA Y ANIMACIÓN CINEMÁTICA DE NUEVO SPOT CAPTURADO
// ========================================================
const cameraShutterFlash = document.getElementById('camera-shutter-flash');
const newSpotOverlay = document.getElementById('new-spot-overlay');
const newSpotPreviewImg = document.getElementById('new-spot-preview-img');
const newSpotRarityBadge = document.getElementById('new-spot-rarity-badge');
const newSpotCarName = document.getElementById('new-spot-car-name');
const newSpotCarBrand = document.getElementById('new-spot-car-brand');
const newSpotRewardXp = document.getElementById('new-spot-reward-xp');
const newSpotRewardCoins = document.getElementById('new-spot-reward-coins');
const btnConfirmNewSpot = document.getElementById('btn-confirm-new-spot');

function mostrarAnimacionNuevoSpot(spot) {
  if (!spot) {
    spot = {
      nombre: "Porsche 911 GT3 RS",
      marca: "Porsche",
      potencia: "525 CV",
      rareza: "epico",
      imagen: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"
    };
  }

  // 1. Flash blanco instantáneo de obturador de cámara
  if (cameraShutterFlash) {
    cameraShutterFlash.classList.add('flash');
    setTimeout(() => {
      cameraShutterFlash.classList.remove('flash');
    }, 120);
  }

  // 2. Sonido de disparo de obturador fotográfico mecánico
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // Ruido blanco rápido / click mecánico
    const bufferSize = audioCtx.sampleRate * 0.08;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  } catch (err) {
    // Audio opcional
  }

  // Si el vehículo cazado es LEGENDARIO, reproducir rugido V10/V12 con petardeo turbo
  if (spot.rareza === 'legendario') {
    setTimeout(() => {
      reproducirSonidoVehiculoLegendario();
    }, 140);
  }

  // 3. Configurar tarjeta del spot
  if (newSpotPreviewImg) newSpotPreviewImg.src = spot.imagen;
  if (newSpotCarName) newSpotCarName.textContent = spot.nombre;
  const precioTexto = spot.precio ? ` • 💵 ${spot.precio} aprox.` : '';
  if (newSpotCarBrand) newSpotCarBrand.textContent = `${spot.marca} • ${spot.potencia}${precioTexto}`;
  
  const rarezaColores = {
    comun: { texto: 'Común', bg: 'rgba(148, 163, 184, 0.25)', color: '#cbd5e1', xp: '+25 XP', coins: '+20 Nitrio' },
    raro: { texto: 'Raro', bg: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8', xp: '+50 XP', coins: '+45 Nitrio' },
    epico: { texto: 'Épico', bg: 'rgba(192, 132, 252, 0.25)', color: '#c084fc', xp: '+90 XP', coins: '+100 Nitrio' },
    legendario: { texto: 'Legendario', bg: 'rgba(251, 191, 36, 0.25)', color: '#fbbf24', xp: '+180 XP', coins: '+220 Nitrio' }
  };

  const config = rarezaColores[spot.rareza] || rarezaColores.comun;
  if (newSpotRarityBadge) {
    newSpotRarityBadge.textContent = config.texto;
    newSpotRarityBadge.style.background = config.bg;
    newSpotRarityBadge.style.color = config.color;
  }
  if (spot.esDuplicado) {
    if (newSpotRewardXp) {
      newSpotRewardXp.textContent = '+0 XP (Duplicado)';
      newSpotRewardXp.style.color = '#ef4444';
    }
    if (newSpotRewardCoins) {
      newSpotRewardCoins.textContent = '+0 Nitrio';
      newSpotRewardCoins.style.color = '#ef4444';
    }
  } else {
    if (newSpotRewardXp) {
      newSpotRewardXp.textContent = config.xp;
      newSpotRewardXp.style.color = '';
    }
    if (newSpotRewardCoins) {
      newSpotRewardCoins.textContent = config.coins;
      newSpotRewardCoins.style.color = '';
    }
  }

  // 4. Desplegar modal animado tras el flash
  setTimeout(() => {
    if (newSpotOverlay) {
      newSpotOverlay.classList.add('active');
      newSpotOverlay.setAttribute('aria-hidden', 'false');
    }
  }, 160);
}

function cerrarAnimacionNuevoSpot() {
  if (newSpotOverlay) {
    newSpotOverlay.classList.remove('active');
    newSpotOverlay.setAttribute('aria-hidden', 'true');
  }
}

if (btnConfirmNewSpot) {
  btnConfirmNewSpot.addEventListener('click', cerrarAnimacionNuevoSpot);
}

if (newSpotOverlay) {
  newSpotOverlay.addEventListener('click', (e) => {
    if (e.target === newSpotOverlay) {
      cerrarAnimacionNuevoSpot();
    }
  });
}

// Exportar globalmente
window.mostrarAnimacionNuevoSpot = mostrarAnimacionNuevoSpot;

// Conectar prueba interactiva rápida tocando el contador de autos en el perfil
const profileCarsTotalTag = document.getElementById('profile-cars-total');
if (profileCarsTotalTag) {
  profileCarsTotalTag.style.cursor = 'pointer';
  profileCarsTotalTag.title = 'Toca para probar la animación de Nuevo Spot';
  profileCarsTotalTag.addEventListener('click', () => {
    mostrarAnimacionNuevoSpot();
  });
}

// Inicializar estado de misiones al final de la carga
if (typeof renderizarMisiones === 'function') {
  renderizarMisiones();
}

// ========================================================
// SISTEMA DE INTRODUCCIÓN (SPLASH ANIMADO) Y AUTENTICACIÓN
// ========================================================
const appSplashScreen = document.getElementById('app-splash-screen');
const appAuthScreen = document.getElementById('app-auth-screen');
const authTabRegister = document.getElementById('auth-tab-register');
const authTabLogin = document.getElementById('auth-tab-login');
const formAuthRegister = document.getElementById('form-auth-register');
const formAuthLogin = document.getElementById('form-auth-login');
const authHeaderTagline = document.getElementById('auth-header-tagline');
const authRegisterError = document.getElementById('auth-register-error');
const authLoginError = document.getElementById('auth-login-error');
const btnLogout = document.getElementById('btn-logout');

// Alternar visibilidad de contraseñas con el botón de ojo
document.querySelectorAll('.auth-btn-toggle-pwd').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁️';
    }
  });
});

// Switch entre pestañas: Crear Cuenta vs Iniciar Sesión
if (authTabRegister && authTabLogin) {
  authTabRegister.addEventListener('click', () => {
    authTabRegister.classList.add('active');
    authTabLogin.classList.remove('active');
    formAuthRegister.style.display = 'flex';
    formAuthLogin.style.display = 'none';
    if (authHeaderTagline) authHeaderTagline.textContent = 'Comienza tu viaje como cazador de superautos';
    if (authRegisterError) authRegisterError.style.display = 'none';
  });

  authTabLogin.addEventListener('click', () => {
    authTabLogin.classList.add('active');
    authTabRegister.classList.remove('active');
    formAuthLogin.style.display = 'flex';
    formAuthRegister.style.display = 'none';
    if (authHeaderTagline) authHeaderTagline.textContent = '¡Bienvenido de vuelta, spotter!';
    if (authLoginError) authLoginError.style.display = 'none';
  });
}

// Registro de nueva cuenta
if (formAuthRegister) {
  formAuthRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    if (!email || !password) {
      mostrarErrorAuth(authRegisterError, "Por favor, completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      mostrarErrorAuth(authRegisterError, "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== passwordConfirm) {
      mostrarErrorAuth(authRegisterError, "Las contraseñas no coinciden. Por favor verifícalas.");
      return;
    }

    // Obtener base de cuentas guardadas
    const cuentas = StorageManager.get(STORAGE_KEYS.AUTH_USUARIOS, {});
    if (cuentas[email]) {
      mostrarErrorAuth(authRegisterError, "Ya existe una cuenta con este correo. Prueba iniciar sesión.");
      return;
    }

    // Guardar nueva cuenta
    const nombreUsuario = email.split('@')[0].replace(/[^a-z0-9_]/g, '');
    cuentas[email] = {
      email: email,
      password: password, // Almacenado localmente para demo
      nombre: nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1),
      username: nombreUsuario,
      creadoEn: Date.now()
    };
    StorageManager.set(STORAGE_KEYS.AUTH_USUARIOS, cuentas);

    // Iniciar sesión activa
    iniciarSesionUsuario(cuentas[email]);
  });
}

// Inicio de sesión
if (formAuthLogin) {
  formAuthLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const cuentas = StorageManager.get(STORAGE_KEYS.AUTH_USUARIOS, {});
    const usuarioEncontrado = cuentas[email];

    if (!usuarioEncontrado) {
      mostrarErrorAuth(authLoginError, "No encontramos una cuenta con este correo. Crea una nueva cuenta.");
      return;
    }

    if (usuarioEncontrado.password !== password) {
      mostrarErrorAuth(authLoginError, "Contraseña incorrecta. Inténtalo de nuevo.");
      return;
    }

    iniciarSesionUsuario(usuarioEncontrado);
  });
}

function mostrarErrorAuth(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function iniciarSesionUsuario(datosCuenta) {
  // Guardar sesión activa persistente
  StorageManager.set(STORAGE_KEYS.AUTH_SESION, {
    email: datosCuenta.email,
    nombre: datosCuenta.nombre,
    username: datosCuenta.username,
    logueadoEn: Date.now()
  });

  // Si el perfil aún tiene datos por defecto o no coincide el nombre, vincular
  if (datosCuenta.nombre && usuario) {
    usuario.nombre = datosCuenta.nombre;
    usuario.username = datosCuenta.username;
    StorageManager.set(STORAGE_KEYS.USUARIO, usuario);
    actualizarHUDUsuario();
  }

  // Ocultar pantalla de auth con transición suave
  if (appAuthScreen) {
    appAuthScreen.style.opacity = '0';
    appAuthScreen.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
      appAuthScreen.style.display = 'none';
      appAuthScreen.setAttribute('aria-hidden', 'true');
    }, 400);
  }

  // Reproducir sonido sutil de bienvenida si audioCtx está disponible
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch(e) {}
}

// Botón de Cerrar Sesión en Menú de Configuración
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión? Tendrás que ingresar tus datos nuevamente.")) {
      // Eliminar sesión activa
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESION);

      // Cerrar modal de ajustes si está abierto
      if (modalSettings && typeof modalSettings.close === 'function') {
        modalSettings.close();
      }

      // Mostrar pantalla de Login inmediatamente
      if (appAuthScreen) {
        appAuthScreen.style.opacity = '1';
        appAuthScreen.style.display = 'flex';
        appAuthScreen.setAttribute('aria-hidden', 'false');
        if (authTabLogin) authTabLogin.click();
      }
    }
  });
}

// Flujo de arranque al cargar la página: Splash + Verificación de Sesión
function verificarEstadoSesionYArrancar() {
  const sesionActiva = StorageManager.get(STORAGE_KEYS.AUTH_SESION, null);

  // Reproducir splash screen durante 1.4 segundos con animación fluida
  setTimeout(() => {
    if (appSplashScreen) {
      appSplashScreen.classList.add('fade-out');
      setTimeout(() => {
        appSplashScreen.style.display = 'none';
      }, 600);
    }

    if (!sesionActiva) {
      // NO hay sesión iniciada: mostrar pantalla de bienvenida / login / registro
      if (appAuthScreen) {
        appAuthScreen.style.opacity = '1';
        appAuthScreen.style.display = 'flex';
        appAuthScreen.setAttribute('aria-hidden', 'false');
      }
    } else {
      // SÍ hay sesión iniciada: el usuario entra directo a la app sin interrupciones
      console.log("Sesión activa encontrada para:", sesionActiva.email);
    }
  }, 1400);
}

// Ejecutar arranque de la app
verificarEstadoSesionYArrancar();
