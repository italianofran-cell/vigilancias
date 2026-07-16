import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Lock,
  User,
  Copy,
  Check,
  LogOut,
  Shield,
  ChevronLeft,
  Layers,
  Clock,
  Pencil,
  Save,
  X,
  RotateCcw,
  ClipboardList,
  Shuffle,
  Waves,
} from "lucide-react";

// --- Paleta "policial": azul noche de patrulla, papel de atestado, dorado de placa. ---
const COLORS = {
  night: "#0A1626",        // fondo general (turno de noche)
  nightDeep: "#060D18",    // fondo más oscuro (paneles, barra superior)
  nightSoft: "#132540",    // detalles sobre fondo oscuro
  paper: "#F3F0E6",        // superficie de las tarjetas (papel de atestado)
  paperDim: "#E7E1D0",     // superficie secundaria
  ink: "#141A22",          // texto principal sobre papel
  inkSoft: "#4B5563",      // texto secundario
  border: "#B7924B",       // borde dorado (placa)
  badge: "#C7A542",        // dorado de insignia — acentos y botones principales
  siren: "#A3222A",        // rojo sirena — alertas
  sirenBlue: "#1D4E89",    // azul sirena — confirmaciones
};

// --- Usuario de acceso. ---
const USERS = {
  t3: { password: "T3", name: "T3" },
};

const VERSIONS = ["V10", "V20", "V30", "V40"];

const INDIA_DELTA_TIMES = ["23:45", "00:30", "01:00", "01:30"];

// Fichas estáticas (de ejemplo) para unidades sin formulario propio todavía,
// como cuando se escribe un nombre en "Otra unidad".
const SNIPPETS_BY_VERSION = {};

// --- Contenido real de V10: informes con vigilancias que hay que rellenar. ---
function formatTimes(times) {
  const valid = times.filter((t) => t);
  if (valid.length === 0) return "___";
  if (valid.length === 1) return `${valid[0]} horas`;
  return `${valid.slice(0, -1).join(", ")} y ${valid[valid.length - 1]} horas`;
}

const COUNT_WORDS = { 1: "una", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco" };
function countWord(n) {
  return COUNT_WORDS[n] || String(n);
}

const REPORTS_BY_VERSION = {
  V10: [
    {
      id: "informe1",
      number: 1,
      tag: "INFORME 1",
      title: "Escultura Antonio Campillo y Dama de Murcia",
      timesCount: 4,
      templates: [
        (times) =>
          `La unidad actuante realiza servicio de prevención de Seguridad Ciudadana en la Escultura Antonio Campillo y Dama de Murcia, efectuando ${countWord(times.length)} vigilancias preventivas para evitar incidencias y reforzar la seguridad de la zona. Se realizan actuaciones a las ${formatTimes(
            times
          )}, sin observar incidencias de interés.`,
        (times) =>
          `Con la finalidad de reforzar la seguridad ciudadana y prevenir posibles incidencias, se practica un servicio de patrulla preventiva en la Escultura Antonio Campillo y Dama de Murcia, desarrollando ${countWord(times.length)} actuaciones de vigilancia a las ${formatTimes(
            times
          )}, sin registrarse incidencia alguna.`,
        (times) =>
          `En el marco del dispositivo de Seguridad Ciudadana, la patrulla efectúa ${countWord(times.length)} controles preventivos en el entorno de la Escultura Antonio Campillo y Dama de Murcia con el objeto de salvaguardar la zona, llevándose a cabo dichas rondas a las ${formatTimes(
            times
          )}, sin apreciarse anomalía alguna.`,
      ],
    },
    {
      id: "informe2",
      number: 2,
      tag: "INFORME 2",
      title: "Yacimiento San Esteban",
      timesCount: 4,
      templates: [
        (times) =>
          `La unidad actuante realiza servicio preventivo en el entorno del Yacimiento de San Esteban, efectuando ${countWord(times.length)} vigilancias preventivas en la zona para prevenir actos incívicos y garantizar la seguridad del recinto. Se realizan a las ${formatTimes(
            times
          )}, sin novedades.`,
        (times) =>
          `Con el propósito de evitar actos incívicos y velar por la seguridad del recinto, se establece un servicio de vigilancia en las inmediaciones del Yacimiento de San Esteban, practicando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin nada que reseñar.`,
        (times) =>
          `En cumplimiento del dispositivo preventivo asignado, la patrulla efectúa ${countWord(times.length)} controles en el entorno del Yacimiento de San Esteban, orientados a impedir conductas incívicas y proteger el recinto, registrándose dichas actuaciones a las ${formatTimes(
            times
          )}, sin resultar necesaria intervención alguna.`,
      ],
    },
    {
      id: "informe3",
      number: 3,
      tag: "INFORME 3",
      title: "Plaza Los Patos (Vistabella)",
      timesCount: 3,
      templates: [
        (times) =>
          `La unidad actuante realiza vigilancia preventiva en Plaza Los Patos por la presencia de personas que pernoctan en soportales y abandonan enseres, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin incidencias reseñables.`,
        (times) =>
          `Debido a la presencia de personas que pernoctan bajo los soportales de Plaza Los Patos y al abandono de enseres en la vía pública, se practica un servicio de patrulla preventiva, desarrollando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin que se aprecie anomalía alguna.`,
        (times) =>
          `Motivado por la ocupación de los soportales de Plaza Los Patos para pernoctar y el consiguiente abandono de enseres, la patrulla efectúa ${countWord(times.length)} controles preventivos en la zona a las ${formatTimes(
            times
          )}, sin nada digno de mención.`,
      ],
    },
  ],
  V20: [
    {
      id: "informe1",
      number: 1,
      tag: "INFORME 1",
      title: "Plaza Cardenal Belluga y soportales de la Catedral",
      timesCount: 3,
      templates: [
        (times) =>
          `La unidad actuante realiza servicio preventivo en Plaza Cardenal Belluga y soportales de la Catedral para informar a las personas que pernoctan sobre los recursos municipales disponibles, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin novedades.`,
        (times) =>
          `Con el fin de dar a conocer a las personas que pernoctan en la zona los recursos municipales existentes, se establece un servicio preventivo en Plaza Cardenal Belluga y soportales de la Catedral, practicando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin nada que reseñar.`,
        (times) =>
          `En el marco de la atención a personas sin techo, la patrulla informa sobre los recursos municipales disponibles a quienes pernoctan en Plaza Cardenal Belluga y los soportales de la Catedral, efectuando ${countWord(times.length)} controles a las ${formatTimes(
            times
          )}, sin resultar necesaria intervención alguna.`,
      ],
    },
    {
      id: "informe2",
      number: 2,
      tag: "INFORME 2",
      title: "Calle Palomarico e inmediaciones",
      timesCount: 3,
      templates: [
        (times) =>
          `La unidad actuante realiza vigilancia preventiva en Calle Palomarico e inmediaciones por la presencia de grupos de personas causando molestias, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin incidencias.`,
        (times) =>
          `Ante las molestias generadas por grupos de personas congregados en Calle Palomarico y su entorno, se practica un servicio de patrulla preventiva, desarrollando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin que se registre incidencia alguna.`,
        (times) =>
          `Motivado por las quejas vecinales derivadas de la concentración de grupos en Calle Palomarico e inmediaciones, la patrulla efectúa ${countWord(times.length)} controles preventivos en la zona a las ${formatTimes(
            times
          )}, sin nada reseñable.`,
      ],
    },
    {
      id: "informe3",
      number: 3,
      tag: "INFORME 3",
      title: "Parque Infantil de Tráfico, Río Mula y Jardín de las Palmeras",
      timesCount: 3,
      templates: [
        (times) =>
          `La unidad actuante realiza servicio preventivo para evitar actos vandálicos en el Parque Infantil de Tráfico, Río Mula y Jardín de las Palmeras, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin novedades.`,
        (times) =>
          `Con el objeto de impedir actos vandálicos, se establece un dispositivo preventivo en el Parque Infantil de Tráfico, Río Mula y Jardín de las Palmeras, practicando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin nada que destacar.`,
        (times) =>
          `En prevención de posibles daños vandálicos, la patrulla efectúa ${countWord(times.length)} controles en el Parque Infantil de Tráfico, Río Mula y Jardín de las Palmeras, registrándose dichas rondas a las ${formatTimes(
            times
          )}, sin resultar necesaria intervención alguna.`,
      ],
    },
  ],
  V30: [
    {
      id: "informe1",
      number: 1,
      tag: "INFORME 1",
      title: "Jardín Calle Verónicas y Plaza Santa Isabel",
      timesCount: 2,
      templates: [
        (times) =>
          `La unidad actuante realiza servicio preventivo en el Jardín de Calle Verónicas y Plaza Santa Isabel por la presencia de personas que pernoctan y generan suciedad, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin novedades.`,
        (times) =>
          `Debido a la acumulación de suciedad y a la presencia de personas que pernoctan en el Jardín de Calle Verónicas y Plaza Santa Isabel, se practica un servicio de patrulla preventiva, desarrollando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin nada que reseñar.`,
        (times) =>
          `Motivado por la insalubridad y el uso del Jardín de Calle Verónicas y Plaza Santa Isabel como lugar de pernocta, la patrulla efectúa ${countWord(times.length)} controles preventivos a las ${formatTimes(
            times
          )}, sin resultar necesaria intervención alguna.`,
      ],
    },
    {
      id: "informe2",
      number: 2,
      tag: "INFORME 2",
      title: "Calle Éricas e inmediaciones",
      timesCount: 3,
      templates: [
        (times) =>
          `La unidad actuante realiza vigilancia preventiva en Calle Éricas e inmediaciones por molestias vecinales, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin incidencias.`,
        (times) =>
          `Ante las quejas de los vecinos de Calle Éricas y su entorno, se establece un servicio de patrulla preventiva, practicando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin que se registre incidencia alguna.`,
        (times) =>
          `Motivado por las molestias ocasionadas en Calle Éricas e inmediaciones, la patrulla efectúa ${countWord(times.length)} controles preventivos en la zona a las ${formatTimes(
            times
          )}, sin nada digno de mención.`,
      ],
    },
    {
      id: "informe3",
      number: 3,
      tag: "INFORME 3",
      title: "Huerto Gambín",
      timesCount: 4,
      templates: [
        (times) =>
          `La unidad actuante realiza servicio preventivo en Huerto Gambín para prevenir molestias, ruidos y posibles actividades relacionadas con el trapicheo de drogas, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin novedades.`,
        (times) =>
          `Con el fin de atajar molestias, ruidos y un posible tráfico de estupefacientes, se establece un dispositivo preventivo en Huerto Gambín, desarrollando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin nada que reseñar.`,
        (times) =>
          `En prevención de posibles actividades de menudeo de drogas, así como de ruidos y molestias, la patrulla efectúa ${countWord(times.length)} controles en Huerto Gambín, registrándose dichas rondas a las ${formatTimes(
            times
          )}, sin resultar necesaria intervención alguna.`,
      ],
    },
    {
      id: "informe4",
      number: 4,
      tag: "INFORME 4",
      title: "Paseo Fluvial Murcia Río",
      timesCount: 3,
      templates: [
        (times) =>
          `La unidad actuante realiza vigilancia preventiva en el Paseo Fluvial Murcia Río para prevenir actos vandálicos, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin incidencias.`,
        (times) =>
          `Con el objeto de impedir daños vandálicos, se practica un servicio de patrulla preventiva en el Paseo Fluvial Murcia Río, desarrollando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin que se registre incidencia alguna.`,
        (times) =>
          `En prevención de posibles actos de vandalismo, la patrulla efectúa ${countWord(times.length)} controles en el Paseo Fluvial Murcia Río a las ${formatTimes(
            times
          )}, sin nada reseñable.`,
      ],
    },
    {
      id: "informe5",
      number: 5,
      tag: "INFORME 5",
      title: "Parking Disuasorio Malecón",
      timesCount: 4,
      templates: [
        (times) =>
          `La unidad actuante realiza vigilancia preventiva en el Parking Disuasorio Malecón para prevenir robos en el interior de vehículos, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin novedades.`,
        (times) =>
          `Con la finalidad de evitar sustracciones en el interior de los vehículos estacionados, se establece un servicio de patrulla preventiva en el Parking Disuasorio Malecón, practicando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin nada que reseñar.`,
        (times) =>
          `En prevención de posibles robos en vehículos, la patrulla efectúa ${countWord(times.length)} controles en el Parking Disuasorio Malecón, registrándose dichas rondas a las ${formatTimes(
            times
          )}, sin resultar necesaria intervención alguna.`,
      ],
    },
  ],
  V40: [
    {
      id: "informe1",
      number: 1,
      tag: "INFORME 1",
      title: "Calle Jumilla y Museo de la Ciencia",
      timesCount: 2,
      templates: [
        (times) =>
          `La unidad actuante realiza servicio preventivo en Calle Jumilla y Museo de la Ciencia, efectuando ${countWord(times.length)} vigilancias para reforzar la seguridad de la zona. Se realizan a las ${formatTimes(
            times
          )}, sin incidencias.`,
        (times) =>
          `Con el objeto de reforzar la seguridad del entorno, se practica un servicio de patrulla preventiva en Calle Jumilla y Museo de la Ciencia, desarrollando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin que se registre incidencia alguna.`,
        (times) =>
          `En prevención y refuerzo de la seguridad ciudadana, la patrulla efectúa ${countWord(times.length)} controles en Calle Jumilla y Museo de la Ciencia a las ${formatTimes(
            times
          )}, sin nada reseñable.`,
      ],
    },
    {
      id: "informe2",
      number: 2,
      tag: "INFORME 2",
      title: "Calle Calderas del Gas",
      timesCount: 3,
      templates: [
        (times) =>
          `La unidad actuante realiza vigilancia preventiva en Calle Calderas del Gas para evitar ocupaciones, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin novedades.`,
        (times) =>
          `Con la finalidad de impedir la ocupación ilegal de inmuebles, se establece un dispositivo preventivo en Calle Calderas del Gas, practicando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin nada que reseñar.`,
        (times) =>
          `En prevención de posibles ocupaciones, la patrulla efectúa ${countWord(times.length)} controles en Calle Calderas del Gas, registrándose dichas rondas a las ${formatTimes(
            times
          )}, sin resultar necesaria intervención alguna.`,
      ],
    },
    {
      id: "informe3",
      number: 3,
      tag: "INFORME 3",
      title: "Edificio frente al ALIAS",
      timesCount: 3,
      templates: [
        (times) =>
          `La unidad actuante realiza visitas preventivas al edificio situado frente al ALIAS, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin incidencias.`,
        (times) =>
          `Con el fin de supervisar el inmueble, se practican visitas de control en el edificio situado frente al ALIAS, desarrollando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin que se registre incidencia alguna.`,
        (times) =>
          `En cumplimiento del seguimiento asignado, la patrulla efectúa ${countWord(times.length)} visitas de control al edificio frente al ALIAS a las ${formatTimes(
            times
          )}, sin nada reseñable.`,
      ],
    },
    {
      id: "informe4",
      number: 4,
      tag: "INFORME 4",
      title: "Plaza Formalidad",
      timesCount: 2,
      templates: [
        (times) =>
          `La unidad actuante realiza vigilancia preventiva en Plaza Formalidad por la presencia de personas que pernoctan y abandonan suciedad, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin novedades.`,
        (times) =>
          `Debido a la presencia de personas que pernoctan y a la suciedad generada en Plaza Formalidad, se practica un servicio de patrulla preventiva, desarrollando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin nada que reseñar.`,
        (times) =>
          `Motivado por la insalubridad y la pernocta de personas en Plaza Formalidad, la patrulla efectúa ${countWord(times.length)} controles preventivos en la zona a las ${formatTimes(
            times
          )}, sin resultar necesaria intervención alguna.`,
      ],
    },
    {
      id: "informe5",
      number: 5,
      tag: "INFORME 5",
      title: "Parking Disuasorio Bajada de la Autovía – La Molinera",
      timesCount: 3,
      templates: [
        (times) =>
          `La unidad actuante realiza servicio preventivo en el Parking Disuasorio Bajada de la Autovía-La Molinera para prevenir robos en vehículos, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
            times
          )}, sin incidencias.`,
        (times) =>
          `Con la finalidad de evitar sustracciones en vehículos, se establece un servicio de patrulla preventiva en el Parking Disuasorio Bajada de la Autovía-La Molinera, practicando ${countWord(times.length)} actuaciones a las ${formatTimes(
            times
          )}, sin que se registre incidencia alguna.`,
        (times) =>
          `En prevención de posibles robos en vehículos, la patrulla efectúa ${countWord(times.length)} controles en el Parking Disuasorio Bajada de la Autovía-La Molinera a las ${formatTimes(
            times
          )}, sin nada reseñable.`,
      ],
    },
  ],
};

// --- Informe opcional "Piscina Murcia Parque", que se puede añadir a ---
// --- cualquiera de las 4 unidades tras elegirla. ---
const POOL_REPORT_ID = "piscina";

function createPoolReport(number) {
  return {
    id: POOL_REPORT_ID,
    number,
    tag: `INFORME ${number}`,
    title: "Piscina Murcia Parque",
    timesCount: 3,
    templates: [
      (times) =>
        `La unidad actuante realiza vigilancias periódicas en la Piscina Murcia Parque, efectuando ${countWord(times.length)} vigilancias a las ${formatTimes(
          times
        )}, no detectándose intrusiones no autorizadas, accesos forzados ni personas en el interior del recinto bañándose.`,
      (times) =>
        `Con el fin de prevenir accesos no autorizados y posibles intrusiones en las instalaciones, se practican vigilancias periódicas en la Piscina Murcia Parque, desarrollando ${countWord(times.length)} actuaciones a las ${formatTimes(
          times
        )}, sin apreciarse acceso forzado alguno ni presencia de personas bañándose en el interior.`,
      (times) =>
        `En cumplimiento del servicio preventivo asignado, la patrulla efectúa ${countWord(times.length)} controles periódicos en la Piscina Murcia Parque al objeto de descartar intrusiones no autorizadas, accesos forzados o la presencia de bañistas en el recinto, registrándose dichas rondas a las ${formatTimes(
          times
        )}, sin resultar detectada anomalía alguna.`,
    ],
  };
}

// Elige, para cada informe de cada unidad, una variante de redacción al azar
// distinta de la usada la vez anterior (si se le pasa el mapa anterior), para
// que el cambio se note siempre al iniciar sesión y nunca se repita seguido.
function pickRandomVariantMap(previousMap) {
  const map = {};
  const pick = (key, total) => {
    const prevIndex = previousMap ? previousMap[key] : undefined;
    let candidates = Array.from({ length: total }, (_, i) => i);
    if (prevIndex !== undefined && total > 1) {
      candidates = candidates.filter((i) => i !== prevIndex);
    }
    map[key] = candidates[Math.floor(Math.random() * candidates.length)];
  };

  Object.entries(REPORTS_BY_VERSION).forEach(([version, reports]) => {
    reports.forEach((report) => {
      pick(`${version}-${report.id}`, report.templates.length);
    });
    // El informe opcional de la piscina puede añadirse a cualquier unidad.
    pick(`${version}-${POOL_REPORT_ID}`, createPoolReport(0).templates.length);
  });

  return map;
}

// El número de vigilancias de cada informe es 2 o 3, sorteado de nuevo cada
// vez que se inicia sesión (independiente de la redacción elegida).
function pickRandomTimesCountMap() {
  const map = {};
  const pickCount = (key) => {
    map[key] = Math.random() < 0.5 ? 2 : 3;
  };
  Object.entries(REPORTS_BY_VERSION).forEach(([version, reports]) => {
    reports.forEach((report) => {
      pickCount(`${version}-${report.id}`);
    });
    pickCount(`${version}-${POOL_REPORT_ID}`);
  });
  return map;
}

// Devuelve una copia de los informes con el número de vigilancias de esta
// sesión ya aplicado (en vez del valor fijo original).
function withSessionTimesCounts(reports, version, timesCountMap) {
  return reports.map((report) => ({
    ...report,
    timesCount: timesCountMap ? timesCountMap[`${version}-${report.id}`] ?? report.timesCount : report.timesCount,
  }));
}

function getReportText(report, times, variantMap, version) {
  const key = `${version}-${report.id}`;
  const index = variantMap ? variantMap[key] ?? 0 : 0;
  const templateFn = report.templates[index] || report.templates[0];
  return templateFn(times);
}

function sortTimesChronologically(times) {
  return [...times].sort((a, b) => labelToOffset(a) - labelToOffset(b));
}

function buildCombinedText(reports, times, variantMap, version) {
  return reports
    .map((report, idx) => {
      const header = `Vigilancia - ${report.title}`;
      const body = getReportText(report, sortTimesChronologically(times[idx]), variantMap, version);
      return `${header}\n${body}`;
    })
    .join("\n\n");
}

// --- Reglas del horario de vigilancias: 22:00 a 06:00, cada selección ---
// --- bloquea los 20 minutos siguientes (no se solapan). ---
const RANGE_START_MIN = 22 * 60; // 22:00 en minutos desde medianoche
const SLOT_STEP = 5; // granularidad del selector, en minutos
const RANGE_SPAN = 8 * 60; // de 22:00 a 06:00 = 480 minutos
const BLOCK_GAP = 20; // minutos bloqueados entre vigilancias de informes distintos
const SAME_REPORT_GAP = 60; // minutos mínimos entre vigilancias del mismo informe
const INDIA_DELTA_DURATION = 45; // minutos que dura el India Delta (sin vigilancias)

function absToLabel(absMinutes) {
  const m = ((absMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60)
    .toString()
    .padStart(2, "0");
  const mm = (m % 60).toString().padStart(2, "0");
  return `${h}:${mm}`;
}

function labelToOffset(label) {
  const [h, m] = label.split(":").map(Number);
  const abs = h * 60 + m;
  return abs >= RANGE_START_MIN ? abs - RANGE_START_MIN : abs + (1440 - RANGE_START_MIN);
}

function offsetToLabel(offset) {
  return absToLabel(RANGE_START_MIN + offset);
}

const ALL_SLOTS = (() => {
  const slots = [];
  for (let off = 0; off <= RANGE_SPAN; off += SLOT_STEP) {
    slots.push({ offset: off, label: offsetToLabel(off) });
  }
  return slots;
})();


// El portapapeles moderno (navigator.clipboard) puede estar bloqueado por
// permisos en algunos contextos (por ejemplo, el enlace publicado del
// artifact). Esta función intenta la vía moderna y, si falla, recurre a un
// <textarea> oculto + document.execCommand('copy') como alternativa.
async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // seguimos con el método alternativo
    }
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function useGoogleFonts() {
  useEffect(() => {
    const id = "catalogo-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// Franja tipo "tartán" de cuadros blancos y negros, el motivo de gorra y
// vehículo policial — es el elemento distintivo de esta interfaz.
function CheckerBand({ height = 7 }) {
  return (
    <div
      style={{
        height,
        width: "100%",
        backgroundImage:
          "repeating-linear-gradient(45deg, #0A1626 0, #0A1626 9px, #F3F0E6 9px, #F3F0E6 18px)",
      }}
    />
  );
}

function PaperBackground({ children }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10"
      style={{
        backgroundColor: COLORS.night,
        backgroundImage: `radial-gradient(${COLORS.nightSoft} 0.7px, transparent 0.7px)`,
        backgroundSize: "16px 16px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function TopBar({ userLabel, right }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div
        className="text-xs tracking-widest"
        style={{ color: COLORS.badge, fontFamily: "'JetBrains Mono', monospace" }}
      >
        SESIÓN: {userLabel.toUpperCase()}
      </div>
      {right}
    </div>
  );
}

function LogoutButton({ onLogout }) {
  return (
    <button
      onClick={onLogout}
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5"
      style={{ border: `1.5px solid ${COLORS.badge}`, color: COLORS.badge, backgroundColor: "transparent" }}
    >
      <LogOut size={13} /> SALIR
    </button>
  );
}

function CardTab({ icon, label }) {
  return (
    <div
      className="absolute -top-6 left-6 px-4 py-1.5 text-xs tracking-widest flex items-center gap-1.5"
      style={{
        backgroundColor: COLORS.nightDeep,
        color: COLORS.badge,
        fontFamily: "'Oswald', sans-serif",
        letterSpacing: "0.12em",
        border: `1px solid ${COLORS.badge}`,
      }}
    >
      {icon} {label}
    </div>
  );
}

// Contenedor de tarjeta con la franja tartán en la parte superior — se usa
// en las pantallas principales del flujo.
function OfficialCard({ children, className = "" }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundColor: COLORS.paper,
        border: `1.5px solid ${COLORS.border}`,
        boxShadow: "6px 6px 0 rgba(6,13,24,0.45)",
      }}
    >
      <CheckerBand />
      <div className="px-8 pt-10 pb-8">{children}</div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const pwRef = useRef(null);

  const submit = () => {
    const u = USERS[username.trim().toLowerCase()];
    if (u && u.password === password) {
      setError("");
      onLogin(username.trim().toLowerCase(), u.name);
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <PaperBackground>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-5">
          <Shield size={18} color={COLORS.badge} />
          <span
            className="text-xs tracking-[0.25em]"
            style={{ color: COLORS.badge, fontFamily: "'JetBrains Mono', monospace" }}
          >
            CUERPO DE SEGURIDAD · UNIDAD DE PATRULLA
          </span>
        </div>

        <OfficialCard>
          <CardTab icon={<Shield size={13} />} label="ACCESO" />

          <h1
            className="text-xl tracking-wide mb-1 uppercase"
            style={{ fontFamily: "'Oswald', sans-serif", color: COLORS.ink }}
          >
            Acceso al archivo
          </h1>
          <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>
            Introduce tus credenciales para consultar las fichas.
          </p>

          <label className="block text-xs font-semibold mb-1 tracking-wide" style={{ color: COLORS.inkSoft }}>
            USUARIO
          </label>
          <div
            className="flex items-center gap-2 mb-4 px-3 py-2"
            style={{ border: `1.5px solid ${COLORS.border}`, backgroundColor: "#FFFFFF" }}
          >
            <User size={16} color={COLORS.sirenBlue} />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && pwRef.current?.focus()}
              placeholder="ana"
              className="w-full bg-transparent outline-none text-sm"
              style={{ color: COLORS.ink }}
            />
          </div>

          <label className="block text-xs font-semibold mb-1 tracking-wide" style={{ color: COLORS.inkSoft }}>
            CONTRASEÑA
          </label>
          <div
            className="flex items-center gap-2 mb-2 px-3 py-2"
            style={{ border: `1.5px solid ${COLORS.border}`, backgroundColor: "#FFFFFF" }}
          >
            <Lock size={16} color={COLORS.sirenBlue} />
            <input
              ref={pwRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none text-sm"
              style={{ color: COLORS.ink }}
            />
          </div>

          {error && (
            <p className="text-xs mb-3 font-semibold" style={{ color: COLORS.siren }}>
              {error}
            </p>
          )}

          <button
            onClick={submit}
            className="w-full mt-3 py-2.5 text-sm font-bold tracking-widest uppercase transition-transform active:scale-[0.98]"
            style={{ backgroundColor: COLORS.nightDeep, color: COLORS.badge, fontFamily: "'Oswald', sans-serif" }}
          >
            Entrar
          </button>

        </OfficialCard>
      </div>
    </PaperBackground>
  );
}

function VersionSelectScreen({ userLabel, onSelect, onLogout }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customUnit, setCustomUnit] = useState("");

  return (
    <PaperBackground>
      <div className="w-full max-w-md">
        <TopBar userLabel={userLabel} right={<LogoutButton onLogout={onLogout} />} />

        <OfficialCard>
          <CardTab icon={<Layers size={13} />} label="UNIDAD" />

          <h1
            className="text-xl mb-6 uppercase"
            style={{ fontFamily: "'Oswald', sans-serif", color: COLORS.ink }}
          >
            Elige unidad
          </h1>

          <div className="grid grid-cols-2 gap-3">
            {VERSIONS.map((v) => (
              <button
                key={v}
                onClick={() => onSelect(v)}
                className="py-5 text-lg font-bold tracking-wide transition-transform active:scale-[0.97] hover:-translate-y-0.5"
                style={{
                  border: `1.5px solid ${COLORS.border}`,
                  backgroundColor: "#FFFFFF",
                  color: COLORS.nightDeep,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="mt-3 pt-4" style={{ borderTop: `1px dashed ${COLORS.border}` }}>
            {!showCustom ? (
              <button
                onClick={() => setShowCustom(true)}
                className="w-full py-4 text-sm font-bold tracking-widest uppercase transition-transform active:scale-[0.97] hover:-translate-y-0.5"
                style={{
                  border: `1.5px dashed ${COLORS.border}`,
                  backgroundColor: "#FFFFFF",
                  color: COLORS.nightDeep,
                  fontFamily: "'Oswald', sans-serif",
                }}
              >
                Otra unidad
              </button>
            ) : (
              <div>
                <label className="block text-xs font-semibold mb-2 tracking-wide" style={{ color: COLORS.inkSoft }}>
                  NOMBRE DE LA UNIDAD
                </label>
                <div className="flex gap-2">
                  <input
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && customUnit.trim() && onSelect(customUnit.trim())}
                    placeholder="Ej. Unidad Canina"
                    autoFocus
                    className="flex-1 px-3 py-2 text-sm outline-none"
                    style={{ border: `1.5px solid ${COLORS.border}`, backgroundColor: "#FFFFFF", color: COLORS.ink }}
                  />
                  <button
                    onClick={() => customUnit.trim() && onSelect(customUnit.trim())}
                    disabled={!customUnit.trim()}
                    className="px-4 py-2 text-xs font-bold tracking-widest uppercase"
                    style={{
                      backgroundColor: customUnit.trim() ? COLORS.nightDeep : COLORS.paperDim,
                      color: customUnit.trim() ? COLORS.badge : COLORS.inkSoft,
                      fontFamily: "'Oswald', sans-serif",
                      cursor: customUnit.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    Usar
                  </button>
                </div>
              </div>
            )}
          </div>
        </OfficialCard>
      </div>
    </PaperBackground>
  );
}

const INDIA_DELTA_MANUAL_START = 23 * 60; // 23:00
const INDIA_DELTA_MANUAL_SPAN = 7 * 60; // 23:00 a 06:00 = 420 minutos

const INDIA_DELTA_MANUAL_SLOTS = (() => {
  const slots = [];
  for (let off = 0; off <= INDIA_DELTA_MANUAL_SPAN; off += 5) {
    slots.push(absToLabel(INDIA_DELTA_MANUAL_START + off));
  }
  return slots;
})();

function isWithinIndiaDeltaManualRange(label) {
  const [h, m] = label.split(":").map(Number);
  const abs = h * 60 + m;
  const offset = abs >= INDIA_DELTA_MANUAL_START ? abs - INDIA_DELTA_MANUAL_START : abs + (1440 - INDIA_DELTA_MANUAL_START);
  return offset <= INDIA_DELTA_MANUAL_SPAN;
}

function PoolReportScreen({ userLabel, version, onAnswer, onBack, onLogout }) {
  return (
    <PaperBackground>
      <div className="w-full max-w-md">
        <TopBar userLabel={`${userLabel} · ${version}`} right={<LogoutButton onLogout={onLogout} />} />

        <OfficialCard>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold mb-4"
            style={{ color: COLORS.inkSoft }}
          >
            <ChevronLeft size={14} /> Cambiar unidad
          </button>

          <CardTab icon={<Waves size={13} />} label="PISCINA" />

          <h1
            className="text-xl mb-1 uppercase"
            style={{ fontFamily: "'Oswald', sans-serif", color: COLORS.ink }}
          >
            ¿Añadir informe de la Piscina Murcia Parque?
          </h1>
          <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>
            Son dos o tres vigilancias periódicas adicionales (el número exacto se decide al
            iniciar sesión), con las mismas reglas de horario que el resto de informes.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAnswer(true)}
              className="py-4 text-sm font-bold tracking-widest uppercase transition-transform active:scale-[0.97] hover:-translate-y-0.5"
              style={{ backgroundColor: COLORS.nightDeep, color: COLORS.badge, fontFamily: "'Oswald', sans-serif" }}
            >
              Sí
            </button>
            <button
              onClick={() => onAnswer(false)}
              className="py-4 text-sm font-bold tracking-widest uppercase transition-transform active:scale-[0.97] hover:-translate-y-0.5"
              style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, backgroundColor: "#FFFFFF", fontFamily: "'Oswald', sans-serif" }}
            >
              No
            </button>
          </div>
        </OfficialCard>
      </div>
    </PaperBackground>
  );
}

function TimeSelectScreen({ userLabel, version, onSelect, onBack, onLogout }) {
  const [manualTime, setManualTime] = useState("");
  const [manualError, setManualError] = useState("");

  const confirmManual = () => {
    if (!manualTime) return;
    if (!isWithinIndiaDeltaManualRange(manualTime)) {
      setManualError("La hora debe estar entre las 23:00 y las 06:00.");
      return;
    }
    setManualError("");
    onSelect(manualTime);
  };

  return (
    <PaperBackground>
      <div className="w-full max-w-md">
        <TopBar userLabel={`${userLabel} · ${version}`} right={<LogoutButton onLogout={onLogout} />} />

        <OfficialCard>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold mb-4"
            style={{ color: COLORS.inkSoft }}
          >
            <ChevronLeft size={14} /> Cambiar unidad
          </button>

          <CardTab icon={<Clock size={13} />} label="HORA" />

          <h1
            className="text-xl mb-1 uppercase"
            style={{ fontFamily: "'Oswald', sans-serif", color: COLORS.ink }}
          >
            ¿A qué hora has hecho el India Delta?
          </h1>
          <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>
            Selecciona la hora correspondiente.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {INDIA_DELTA_TIMES.map((t) => (
              <button
                key={t}
                onClick={() => onSelect(t)}
                className="py-5 text-lg font-bold tracking-wide transition-transform active:scale-[0.97] hover:-translate-y-0.5"
                style={{
                  border: `1.5px solid ${COLORS.border}`,
                  backgroundColor: "#FFFFFF",
                  color: COLORS.nightDeep,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="pt-4" style={{ borderTop: `1px dashed ${COLORS.border}` }}>
            <label className="block text-xs font-semibold mb-2 tracking-wide" style={{ color: COLORS.inkSoft }}>
              O introduce la hora manualmente (23:00 a 06:00)
            </label>
            <div className="flex gap-2">
              <select
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                className="flex-1 px-3 py-2 text-sm outline-none"
                style={{
                  border: `1.5px solid ${COLORS.border}`,
                  backgroundColor: "#FFFFFF",
                  color: COLORS.ink,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <option value="">-- : --</option>
                {INDIA_DELTA_MANUAL_SLOTS.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                onClick={confirmManual}
                disabled={!manualTime}
                className="px-4 py-2 text-xs font-bold tracking-widest uppercase"
                style={{
                  backgroundColor: manualTime ? COLORS.nightDeep : COLORS.paperDim,
                  color: manualTime ? COLORS.badge : COLORS.inkSoft,
                  fontFamily: "'Oswald', sans-serif",
                  cursor: manualTime ? "pointer" : "not-allowed",
                }}
              >
                Usar
              </button>
            </div>
            {manualError && (
              <p className="text-xs mt-2 font-semibold" style={{ color: COLORS.siren }}>
                {manualError}
              </p>
            )}
          </div>
        </OfficialCard>
      </div>
    </PaperBackground>
  );
}

// Opciones disponibles para un hueco concreto: dentro de 22:00-06:00, fuera
// de los 45 minutos del India Delta, con al menos 60 minutos respecto a otra
// vigilancia del mismo informe, y al menos 20 minutos respecto a vigilancias
// de otros informes (para que no se solapen). Es una función pura para poder
// reutilizarla también en el generador aleatorio.
function computeOptionsForSlot(times, ri, ti, indiaDeltaOffset) {
  const current = times[ri][ti];
  const constraints = [];
  times.forEach((arr, r2) =>
    arr.forEach((val, t2) => {
      if (r2 === ri && t2 === ti) return;
      if (!val) return;
      constraints.push({ offset: labelToOffset(val), gap: r2 === ri ? SAME_REPORT_GAP : BLOCK_GAP });
    })
  );
  return ALL_SLOTS.filter((slot) => {
    if (slot.label === current) return true;
    if (slot.offset >= indiaDeltaOffset && slot.offset < indiaDeltaOffset + INDIA_DELTA_DURATION) {
      return false;
    }
    return !constraints.some((c) => Math.abs(slot.offset - c.offset) < c.gap);
  });
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Intenta generar un set completo de horas al azar, respetando todas las
// reglas. Como el relleno es secuencial y aleatorio, algún intento puede
// quedarse sin huecos válidos al final; por eso se reintenta varias veces.
function tryGenerateRandomTimes(reports, indiaDeltaOffset) {
  const times = reports.map((r) => Array(r.timesCount).fill(""));
  for (let ri = 0; ri < reports.length; ri++) {
    for (let ti = 0; ti < reports[ri].timesCount; ti++) {
      const options = computeOptionsForSlot(times, ri, ti, indiaDeltaOffset);
      if (options.length === 0) return null;
      times[ri][ti] = randomPick(options).label;
    }
  }
  return times;
}

function generateRandomTimes(reports, indiaDeltaTime, maxAttempts = 400) {
  const indiaDeltaOffset = labelToOffset(indiaDeltaTime);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = tryGenerateRandomTimes(reports, indiaDeltaOffset);
    if (result) return result;
  }
  return null;
}

// --- Formulario de horas de vigilancias (paso previo a los informes) ---
function TimesFormScreen({ userLabel, version, indiaDeltaTime, reports, initialTimes, variantMap, onSubmit, onBack, onLogout }) {
  const [times, setTimes] = useState(
    initialTimes || reports.map((r) => Array(r.timesCount).fill(""))
  );
  const [randomError, setRandomError] = useState("");

  const updateTime = (reportIdx, timeIdx, value) => {
    setTimes((prev) => {
      const next = prev.map((arr) => [...arr]);
      next[reportIdx][timeIdx] = value;
      return next;
    });
  };

  const allFilled = times.every((arr) => arr.every((t) => t !== ""));

  const indiaDeltaOffset = labelToOffset(indiaDeltaTime);

  const optionsFor = (ri, ti) => computeOptionsForSlot(times, ri, ti, indiaDeltaOffset);

  const handleRandomize = () => {
    const result = generateRandomTimes(reports, indiaDeltaTime);
    if (!result) {
      setRandomError("No se ha podido generar un horario válido, inténtalo de nuevo.");
      return;
    }
    setRandomError("");
    setTimes(result);
  };

  return (
    <PaperBackground>
      <div className="w-full max-w-2xl">
        <TopBar userLabel={`${userLabel} · ${version}`} right={<LogoutButton onLogout={onLogout} />} />

        <OfficialCard>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold mb-4"
            style={{ color: COLORS.inkSoft }}
          >
            <ChevronLeft size={14} /> Cambiar unidad
          </button>

          <CardTab icon={<ClipboardList size={13} />} label="VIGILANCIAS" />

          <h1
            className="text-xl mb-1 uppercase"
            style={{ fontFamily: "'Oswald', sans-serif", color: COLORS.ink }}
          >
            Horas de las vigilancias
          </h1>
          <p className="text-sm mb-1" style={{ color: COLORS.inkSoft }}>
            Horario permitido: <b style={{ color: COLORS.ink }}>22:00 a 06:00</b>. Cada vigilancia dura
            10 minutos.
          </p>
          <p className="text-sm mb-1" style={{ color: COLORS.inkSoft }}>
            Dentro de un mismo informe, cada vigilancia debe ir al menos{" "}
            <b style={{ color: COLORS.ink }}>60 minutos</b> después de la anterior. Entre vigilancias de
            informes distintos basta con <b style={{ color: COLORS.ink }}>20 minutos</b> para que no se
            solapen.
          </p>
          <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>
            El India Delta dura 45 minutos: de <b style={{ color: COLORS.ink }}>{indiaDeltaTime}</b> a{" "}
            <b style={{ color: COLORS.ink }}>{offsetToLabel(labelToOffset(indiaDeltaTime) + INDIA_DELTA_DURATION)}</b>{" "}
            no aparecerán horas de vigilancia disponibles.
          </p>

          <button
            onClick={handleRandomize}
            className="w-full mb-6 py-2.5 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase transition-transform active:scale-[0.98]"
            style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.nightDeep, backgroundColor: "#FFFFFF", fontFamily: "'Oswald', sans-serif" }}
          >
            <Shuffle size={14} /> Generar horas aleatoriamente
          </button>
          {randomError && (
            <p className="text-xs -mt-4 mb-6 font-semibold" style={{ color: COLORS.siren }}>
              {randomError}
            </p>
          )}

          <div className="flex flex-col gap-6">
            {reports.map((report, ri) => {
              const variantKey = `${version}-${report.id}`;
              const variantIndex = variantMap ? variantMap[variantKey] ?? 0 : 0;
              const variantTotal = report.templates.length;
              return (
                <div key={report.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className="text-[10px] tracking-widest"
                      style={{ color: COLORS.sirenBlue, fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {report.tag}
                    </div>
                    <div
                      className="text-[10px] tracking-widest px-2 py-0.5"
                      style={{
                        color: COLORS.badge,
                        backgroundColor: COLORS.nightDeep,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                      title="Variante de redacción que se usará al generar este informe"
                    >
                      VARIANTE {variantIndex + 1}/{variantTotal}
                    </div>
                  </div>
                  <h2 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                    {report.title} ({report.timesCount} vigilancias)
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Array.from({ length: report.timesCount }).map((_, ti) => {
                      const options = optionsFor(ri, ti);
                    return (
                      <div key={ti}>
                        <label className="block text-[11px] mb-1" style={{ color: COLORS.inkSoft }}>
                          Vigilancia {ti + 1}
                        </label>
                        <select
                          value={times[ri][ti]}
                          onChange={(e) => updateTime(ri, ti, e.target.value)}
                          className="w-full px-2 py-2 text-sm outline-none"
                          style={{
                            border: `1.5px solid ${COLORS.border}`,
                            backgroundColor: "#FFFFFF",
                            color: COLORS.ink,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          <option value="">-- : --</option>
                          {options.map((opt) => (
                            <option key={opt.label} value={opt.label}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => allFilled && onSubmit(times)}
            disabled={!allFilled}
            className="w-full mt-8 py-2.5 text-sm font-bold tracking-widest uppercase transition-transform active:scale-[0.98]"
            style={{
              backgroundColor: allFilled ? COLORS.nightDeep : COLORS.paperDim,
              color: allFilled ? COLORS.badge : COLORS.inkSoft,
              fontFamily: "'Oswald', sans-serif",
              cursor: allFilled ? "pointer" : "not-allowed",
            }}
          >
            {allFilled ? "Generar informes" : "Completa todas las horas"}
          </button>
        </OfficialCard>
      </div>
    </PaperBackground>
  );
}

// --- Caja única con los 3 informes combinados: copiar / editar ---
function CombinedReportBox({ reports, times, variantMap, version }) {
  const generated = useMemo(() => buildCombinedText(reports, times, variantMap, version), [reports, times, variantMap, version]);
  const [override, setOverride] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(generated);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const current = override ?? generated;

  useEffect(() => {
    if (!editing) setDraft(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, editing]);

  const copy = async () => {
    const ok = await copyTextToClipboard(current);
    if (ok) {
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 1400);
    } else {
      setCopyFailed(true);
    }
  };

  return (
    <div className="relative" style={{ backgroundColor: COLORS.paper, border: `1.5px solid ${COLORS.border}` }}>
      <CheckerBand />

      <div className="relative p-6">
        {copied && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ backgroundColor: "rgba(243,240,230,0.65)" }}
          >
            <div
              className="px-4 py-1.5 border-2 rotate-[-8deg] flex items-center gap-1.5"
              style={{
                borderColor: COLORS.sirenBlue,
                color: COLORS.sirenBlue,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              <Check size={16} /> COPIADO
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div
            className="text-[10px] tracking-widest"
            style={{ color: COLORS.sirenBlue, fontFamily: "'JetBrains Mono', monospace" }}
          >
            INFORMES 1 · 2 · 3
          </div>
          {override && !editing && (
            <button
              onClick={() => setOverride(null)}
              className="flex items-center gap-1 text-[10px]"
              style={{ color: COLORS.inkSoft }}
              title="Volver al texto generado automáticamente"
            >
              <RotateCcw size={11} /> restablecer
            </button>
          )}
        </div>

        {editing ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={16}
            className="w-full text-sm p-3 outline-none"
            style={{ border: `1.5px solid ${COLORS.border}`, backgroundColor: "#FFFFFF", color: COLORS.ink }}
          />
        ) : (
          <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: COLORS.inkSoft }}>
            {current}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setOverride(draft);
                  setEditing(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide uppercase"
                style={{ backgroundColor: COLORS.sirenBlue, color: "#FFFFFF", fontFamily: "'Oswald', sans-serif" }}
              >
                <Save size={13} /> Guardar
              </button>
              <button
                onClick={() => {
                  setDraft(current);
                  setEditing(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide uppercase"
                style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, backgroundColor: "#FFFFFF", fontFamily: "'Oswald', sans-serif" }}
              >
                <X size={13} /> Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-transform active:scale-[0.97]"
                style={{
                  backgroundColor: copied ? COLORS.sirenBlue : COLORS.nightDeep,
                  color: COLORS.badge,
                  fontFamily: "'Oswald', sans-serif",
                }}
              >
                <Copy size={13} /> Copiar
              </button>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide uppercase"
                style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, backgroundColor: "#FFFFFF", fontFamily: "'Oswald', sans-serif" }}
              >
                <Pencil size={13} /> Editar
              </button>
            </>
          )}
        </div>
        {copyFailed && (
          <p className="text-xs mt-2 font-semibold" style={{ color: COLORS.siren }}>
            No se ha podido copiar automáticamente. Mantén pulsado el texto de arriba para
            seleccionarlo y copiarlo a mano.
          </p>
        )}
      </div>
    </div>
  );
}

function ReportsScreen({ userLabel, version, indiaDeltaTime, reports, times, variantMap, onEditTimes, onBack, onLogout }) {
  return (
    <PaperBackground>
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: COLORS.badge }}
              >
                <ChevronLeft size={14} /> Cambiar unidad
              </button>
              <button
                onClick={onEditTimes}
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: COLORS.badge }}
              >
                <Clock size={14} /> Editar horas
              </button>
            </div>
            <div
              className="text-xs tracking-widest mb-1"
              style={{ color: COLORS.badge, fontFamily: "'JetBrains Mono', monospace" }}
            >
              ARCHIVO DE INFORMES · {version} · INDIA DELTA {indiaDeltaTime}
            </div>
            <h1
              className="text-2xl uppercase"
              style={{ fontFamily: "'Oswald', sans-serif", color: COLORS.paper }}
            >
              Informes de {version}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: COLORS.paperDim }}>
              Sesión: <b style={{ color: COLORS.badge }}>{userLabel}</b>
            </div>
            <LogoutButton onLogout={onLogout} />
          </div>
        </div>

        <CombinedReportBox reports={reports} times={times} variantMap={variantMap} version={version} />
      </div>
    </PaperBackground>
  );
}

// --- Fichas estáticas (versiones sin formulario todavía) ---
function SnippetCard({ item }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const ok = await copyTextToClipboard(item.content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div
      className="relative flex flex-col justify-between p-5"
      style={{ backgroundColor: COLORS.paper, border: `1.5px dashed ${COLORS.border}`, minHeight: "170px" }}
    >
      {copied && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: "rgba(243,240,230,0.65)" }}
        >
          <div
            className="px-4 py-1.5 border-2 rotate-[-8deg] flex items-center gap-1.5"
            style={{
              borderColor: COLORS.sirenBlue,
              color: COLORS.sirenBlue,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            <Check size={16} /> COPIADO
          </div>
        </div>
      )}
      <div>
        <div
          className="text-[10px] mb-1 tracking-widest"
          style={{ color: COLORS.sirenBlue, fontFamily: "'JetBrains Mono', monospace" }}
        >
          {item.tag}
        </div>
        <h3 className="text-base mb-2 uppercase" style={{ fontFamily: "'Oswald', sans-serif", color: COLORS.ink }}>
          {item.title}
        </h3>
        <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: COLORS.inkSoft }}>
          {item.content}
        </p>
      </div>
      <button
        onClick={copy}
        className="mt-4 self-start flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-transform active:scale-[0.97]"
        style={{
          backgroundColor: copied ? COLORS.sirenBlue : COLORS.nightDeep,
          color: COLORS.badge,
          fontFamily: "'Oswald', sans-serif",
        }}
      >
        <Copy size={13} /> Copiar
      </button>
    </div>
  );
}

function CatalogScreen({ userLabel, version, indiaDeltaTime, onBack, onLogout }) {
  const snippets = SNIPPETS_BY_VERSION[version] || [];
  return (
    <PaperBackground>
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-semibold mb-2"
              style={{ color: COLORS.badge }}
            >
              <ChevronLeft size={14} /> Cambiar unidad
            </button>
            <div
              className="text-xs tracking-widest mb-1"
              style={{ color: COLORS.badge, fontFamily: "'JetBrains Mono', monospace" }}
            >
              ARCHIVO DE TEXTOS · {version} · INDIA DELTA {indiaDeltaTime}
            </div>
            <h1 className="text-2xl uppercase" style={{ fontFamily: "'Oswald', sans-serif", color: COLORS.paper }}>
              Fichas de {version}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: COLORS.paperDim }}>
              Sesión: <b style={{ color: COLORS.badge }}>{userLabel}</b>
            </div>
            <LogoutButton onLogout={onLogout} />
          </div>
        </div>

        {snippets.length === 0 ? (
          <p className="text-sm" style={{ color: COLORS.paperDim }}>
            Todavía no hay fichas cargadas para {version}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {snippets.map((item) => (
              <SnippetCard key={item.tag} item={item} />
            ))}
          </div>
        )}
      </div>
    </PaperBackground>
  );
}

// --- Franja horaria en la que la app está disponible (hora del dispositivo). ---
// Desactivada de momento a petición del usuario: pon esto en `true` para
// volver a restringir el uso a la franja AVAILABILITY_START_MIN/END_MIN.
const AVAILABILITY_ENABLED = false;
const AVAILABILITY_START_MIN = 5 * 60 + 30; // 05:30
const AVAILABILITY_END_MIN = 6 * 60 + 45; // 06:45

function isAppAvailableNow() {
  if (!AVAILABILITY_ENABLED) return true;
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= AVAILABILITY_START_MIN && minutes <= AVAILABILITY_END_MIN;
}

function UnavailableScreen() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);

  const label = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  return (
    <PaperBackground>
      <div className="w-full max-w-sm">
        <OfficialCard>
          <CardTab icon={<Lock size={13} />} label="FUERA DE HORARIO" />
          <h1 className="text-xl mb-3 uppercase" style={{ fontFamily: "'Oswald', sans-serif", color: COLORS.ink }}>
            App no disponible ahora
          </h1>
          <p className="text-sm mb-2" style={{ color: COLORS.inkSoft }}>
            Solo se puede usar entre las{" "}
            <b style={{ color: COLORS.ink }}>{absToLabel(AVAILABILITY_START_MIN)}</b> y las{" "}
            <b style={{ color: COLORS.ink }}>{absToLabel(AVAILABILITY_END_MIN)}</b> horas.
          </p>
          <p className="text-xs" style={{ color: COLORS.inkSoft }}>
            Hora actual del dispositivo: <b style={{ color: COLORS.ink }}>{label}</b>
          </p>
        </OfficialCard>
      </div>
    </PaperBackground>
  );
}

function QuickLoginScreen({ onLogin }) {
  return (
    <PaperBackground>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-5">
          <Shield size={18} color={COLORS.badge} />
          <span
            className="text-xs tracking-[0.25em]"
            style={{ color: COLORS.badge, fontFamily: "'JetBrains Mono', monospace" }}
          >
            CUERPO DE SEGURIDAD · UNIDAD DE PATRULLA
          </span>
        </div>

        <OfficialCard>
          <CardTab icon={<Shield size={13} />} label="ACCESO" />

          <h1
            className="text-xl tracking-wide mb-2 uppercase"
            style={{ fontFamily: "'Oswald', sans-serif", color: COLORS.ink }}
          >
            Acceso al archivo
          </h1>
          <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>
            Pulsa para entrar y empezar a rellenar los informes de la unidad.
          </p>

          <button
            onClick={onLogin}
            className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase transition-transform active:scale-[0.98]"
            style={{ backgroundColor: COLORS.nightDeep, color: COLORS.badge, fontFamily: "'Oswald', sans-serif" }}
          >
            <Shield size={15} /> Iniciar sesión
          </button>
        </OfficialCard>
      </div>
    </PaperBackground>
  );
}

export default function App() {
  useGoogleFonts();
  const [available, setAvailable] = useState(isAppAvailableNow());
  const [version, setVersion] = useState(null);
  const [includePool, setIncludePool] = useState(null); // null = aún no preguntado
  const [indiaDeltaTime, setIndiaDeltaTime] = useState(null);
  const [times, setTimes] = useState(null); // array of arrays, per report
  const [timesSubmitted, setTimesSubmitted] = useState(false);
  const [session, setSession] = useState(null); // { username, name }
  const [variantMap, setVariantMap] = useState(null);
  const previousVariantMapRef = useRef(null);
  const [timesCountMap, setTimesCountMap] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setAvailable(isAppAvailableNow()), 15000);
    return () => clearInterval(id);
  }, []);

  if (!available) {
    return <UnavailableScreen />;
  }

  const resetAfterVersion = () => {
    setIncludePool(null);
    setIndiaDeltaTime(null);
    setTimes(null);
    setTimesSubmitted(false);
  };

  const handleBackToVersion = () => {
    setVersion(null);
    resetAfterVersion();
  };

  // "Salir" cierra la sesión del todo: la próxima vez que se inicie sesión,
  // los informes de todas las unidades se redactan con otra variante al azar.
  const handleLogout = () => {
    setSession(null);
    setVariantMap(null);
    setVersion(null);
    resetAfterVersion();
  };

  if (!session) {
    return (
      <LoginScreen
        onLogin={(username, name) => {
          const newMap = pickRandomVariantMap(previousVariantMapRef.current);
          previousVariantMapRef.current = newMap;
          setVariantMap(newMap);
          setTimesCountMap(pickRandomTimesCountMap());
          setSession({ username, name });
        }}
      />
    );
  }

  if (!version) {
    return (
      <VersionSelectScreen
        userLabel={session.name}
        onSelect={(v) => setVersion(v)}
        onLogout={handleLogout}
      />
    );
  }

  const baseReports = REPORTS_BY_VERSION[version];

  if (!indiaDeltaTime) {
    return (
      <TimeSelectScreen
        userLabel={session.name}
        version={version}
        onSelect={(t) => setIndiaDeltaTime(t)}
        onBack={handleBackToVersion}
        onLogout={handleLogout}
      />
    );
  }

  if (baseReports && includePool === null) {
    return (
      <PoolReportScreen
        userLabel={session.name}
        version={version}
        onAnswer={(answer) => setIncludePool(answer)}
        onBack={handleBackToVersion}
        onLogout={handleLogout}
      />
    );
  }

  const rawReports = baseReports
    ? includePool
      ? [...baseReports, createPoolReport(baseReports.length + 1)]
      : baseReports
    : undefined;

  const reports = rawReports ? withSessionTimesCounts(rawReports, version, timesCountMap) : undefined;

  // Versión con formulario de horas (por ahora, V10)
  if (reports) {
    if (!timesSubmitted) {
      return (
        <TimesFormScreen
          userLabel={session.name}
          version={version}
          indiaDeltaTime={indiaDeltaTime}
          reports={reports}
          initialTimes={times}
          variantMap={variantMap}
          onSubmit={(t) => {
            setTimes(t);
            setTimesSubmitted(true);
          }}
          onBack={handleBackToVersion}
          onLogout={handleLogout}
        />
      );
    }

    return (
      <ReportsScreen
        userLabel={session.name}
        version={version}
        indiaDeltaTime={indiaDeltaTime}
        reports={reports}
        times={times}
        variantMap={variantMap}
        onEditTimes={() => setTimesSubmitted(false)}
        onBack={handleBackToVersion}
        onLogout={handleLogout}
      />
    );
  }

  // Versiones sin formulario todavía: fichas estáticas de ejemplo
  return (
    <CatalogScreen
      userLabel={session.name}
      version={version}
      indiaDeltaTime={indiaDeltaTime}
      onBack={handleBackToVersion}
      onLogout={handleLogout}
    />
  );
}
