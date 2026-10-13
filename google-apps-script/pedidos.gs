/**
 * FIESTIKA — Recibe los pedidos de la web y los anota en la hoja "PEDIDOS 2026".
 *
 * Cómo instalarlo (una sola vez):
 * 1. Abre la hoja de Google > Extensiones > Apps Script.
 * 2. Borra lo que haya, pega TODO este archivo y guarda.
 * 3. Implementar > Nueva implementación > tipo "Aplicación web".
 *      Ejecutar como: Yo   ·   Quién tiene acceso: Cualquier usuario
 * 4. Autoriza los permisos y copia la URL que termina en /exec.
 * 5. Pega esa URL en src/data/config.ts -> urlHojaPedidos.
 * Si cambias este código: Implementar > Gestionar implementaciones > editar > Nueva versión.
 */

const HOJA = "PEDIDOS 2026";
const FILA_INICIO = 7; // primera fila de pedidos (la 6 es el encabezado)

// Columnas de la hoja (número de columna)
const COL = {
  N: 1, MES: 2, ESTADO_PEDIDO: 3, ESTADO_PAGO: 4, CLIENTE: 5, FECHA_INGRESO: 6, FECHA_ENTREGA: 7,
  DIRECCION: 8, CELULAR: 9, BOLETA: 10, DETALLE: 11, PEDIDO: 12, NOTA: 13,
  MONTO: 15, DELIVERY: 16, SUMA: 17, GASTOS: 18, RESTANTE: 19, MOTORIZADO: 20, REPARTIR: 21,
  PAGO1: 22, PAGO2: 23, SUMA_PAGOS: 24, RESTANTE_PAGOS: 25, MEDIO: 26, RECEPCIONO: 28, MONTO_DESTINO: 31,
};

const MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SETIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
// Otras formas en que el mes aparece escrito en la hoja
const ALIAS = { SETIEMBRE: ["SEPTIEMBRE"], OCTUBRE: ["OBTUBRE"] };

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const cuerpo = (e && e.postData && e.postData.contents) || "";
    if (cuerpo.length > MAX_CUERPO) return respuesta({ ok: false });
    if (demasiados()) return respuesta({ ok: false });
    const p = validar(JSON.parse(cuerpo));
    if (!p) return respuesta({ ok: false });
    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);
    const fila = filaLibre(hoja);
    escribir(hoja, fila, p);
    return respuesta({ ok: true });
  } catch (err) {
    console.error(err); // se ve en Apps Script > Ejecuciones; no se le muestra al visitante
    return respuesta({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

// ---------- Seguridad ----------
// La URL de este script es pública (está en la web), así que todo lo que llega se trata como no confiable.
const MAX_CUERPO = 20000; // caracteres
const MAX_PEDIDOS_POR_HORA = 30; // frena a quien intente llenar la hoja con pedidos falsos

function demasiados() {
  const cache = CacheService.getScriptCache();
  const clave = "pedidos-" + Utilities.formatDate(new Date(), "America/Lima", "yyyyMMddHH");
  const n = Number(cache.get(clave) || 0) + 1;
  cache.put(clave, String(n), 3600);
  return n > MAX_PEDIDOS_POR_HORA;
}

/**
 * Evita la "inyección de fórmulas": un texto que empieza con = + - @ se volvería fórmula en la hoja
 * (por ejemplo =IMPORTXML(...) podría enviar los datos de tus clientes a otra web).
 * El apóstrofo inicial hace que Sheets lo guarde como texto y no se ve en la celda.
 */
function texto(v, max) {
  const s = String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function monto(v) {
  const n = Number(v);
  return isFinite(n) && n >= 0 && n <= 100000 ? Math.round(n * 100) / 100 : 0;
}

function validar(p) {
  if (!p || typeof p !== "object") return null;
  const cliente = texto(p.cliente, 120);
  // Solo dígitos, espacios, guiones y un "+" inicial; se guarda en una celda con formato de texto.
  const celular = String(p.celular || "").trim();
  if (!cliente || !/^\+?[\d\s-]{8,20}$/.test(celular)) return null;
  return {
    cliente: cliente,
    celular: celular,
    fechaEntrega: /^\d{4}-\d{2}-\d{2}$/.test(p.fechaEntrega) ? p.fechaEntrega : "",
    direccion: texto(p.direccion, 400),
    comprobante: ["NO", "SI /PENDIENTE DE EMITIR"].includes(p.comprobante) ? p.comprobante : "NO",
    detalle: texto(p.detalle, 1500),
    pedido: texto(p.pedido, 5000),
    monto: monto(p.monto),
    delivery: monto(p.delivery),
    medioPago: ["YAPE", "TARJETA", "TRANSFERENCIA BCP"].includes(p.medioPago) ? p.medioPago : "PENDIENTE",
  };
}

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

const limpio = (v) => String(v || "").toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ]/g, "");

function esMes(valor, mes) {
  const v = limpio(valor);
  return v === mes || (ALIAS[mes] || []).includes(v);
}

/** Usa la primera fila vacía (sin CLIENTE) del mes actual; si no hay, crea una al final del bloque del mes. */
function filaLibre(hoja) {
  const mes = MESES[new Date().getMonth()];
  const ultima = Math.max(hoja.getLastRow(), FILA_INICIO);
  const datos = hoja.getRange(FILA_INICIO, 1, ultima - FILA_INICIO + 1, COL.CLIENTE).getValues();
  let finBloque = -1;
  let numero = 0;
  for (let i = 0; i < datos.length; i++) {
    if (!esMes(datos[i][COL.MES - 1], mes)) continue;
    finBloque = i;
    if (!String(datos[i][COL.CLIENTE - 1]).trim()) return FILA_INICIO + i;
    numero = Math.max(numero, Number(datos[i][COL.N - 1]) || 0);
  }
  let fila;
  if (finBloque >= 0) {
    fila = FILA_INICIO + finBloque + 1;
    hoja.insertRowAfter(fila - 1);
  } else {
    fila = ultima + 2; // deja una fila en blanco entre meses, como en la hoja
  }
  hoja.getRange(fila, COL.N).setValue(numero + 1);
  hoja.getRange(fila, COL.MES).setValue(mes);
  return fila;
}

function fecha(iso) {
  if (!iso) return "";
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
}

function escribir(hoja, f, p) {
  const set = (col, valor) => hoja.getRange(f, col).setValue(valor);
  set(COL.ESTADO_PEDIDO, "POR CONFIRMAR");
  set(COL.ESTADO_PAGO, "PENDIENTE");
  set(COL.CLIENTE, p.cliente);
  set(COL.FECHA_INGRESO, new Date());
  set(COL.FECHA_ENTREGA, fecha(p.fechaEntrega));
  set(COL.DIRECCION, p.direccion);
  hoja.getRange(f, COL.CELULAR).setNumberFormat("@").setValue(p.celular);
  set(COL.BOLETA, p.comprobante);
  set(COL.DETALLE, p.detalle);
  set(COL.PEDIDO, p.pedido);
  set(COL.NOTA, p.nota || "");
  set(COL.MONTO, p.monto);
  set(COL.DELIVERY, p.delivery);
  set(COL.MEDIO, p.medioPago);
  set(COL.RECEPCIONO, "PENDIENTE");
  // Fórmulas (iguales a las de la hoja), por si la fila no las tenía
  hoja.getRange(f, COL.SUMA).setFormula(`=SUM(O${f}:P${f})`);
  hoja.getRange(f, COL.RESTANTE).setFormula(`=Q${f}-R${f}`);
  hoja.getRange(f, COL.REPARTIR).setFormula(`=S${f}-T${f}`);
  hoja.getRange(f, COL.SUMA_PAGOS).setFormula(`=SUM(V${f}:W${f})`);
  hoja.getRange(f, COL.RESTANTE_PAGOS).setFormula(`=Q${f}-V${f}-W${f}`);
  hoja.getRange(f, COL.MONTO_DESTINO).setFormula(`=U${f}`);
}
