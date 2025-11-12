// Elementos
const form = document.getElementById('qr-form');
const urlInput = document.getElementById('url-input');
const qrcodeContainer = document.getElementById('qrcode');
const generateBtn = document.getElementById('generate-btn');
const clearBtn = document.getElementById('clear-btn');
const downloadLink = document.getElementById('download-link');

let qrcodeInstance = null;
const FIXED_SIZE = 256;
const FIXED_MARGIN = 1;

function clearQRCode() {
  qrcodeContainer.innerHTML = '';
  qrcodeInstance = null;
  downloadLink.classList.add('hidden');
}

/* Normaliza la entrada:
   - Si ya tiene esquema (p.ej. http://) se respeta.
   - Si no tiene, añade https:// por defecto.
   - Trim de espacios.
*/
function normalizeUserInput(raw) {
  if (!raw) return '';
  let v = raw.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(v)) {
    return v;
  }
  // Si el usuario ingresó solo dominios o caminos, añadir https://
  return 'https://' + v;
}

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function createQRCode(text) {
  clearQRCode();

  // Protección: asegurarnos de que la librería QRCode esté disponible
  if (typeof QRCode === 'undefined') {
    alert('La librería QRCode no está cargada. Comprueba que el script CDN esté accesible.');
    return;
  }

  qrcodeInstance = new QRCode(qrcodeContainer, {
    text: text,
    width: FIXED_SIZE,
    height: FIXED_SIZE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
    margin: FIXED_MARGIN
  });

  setTimeout(setupDownload, 60);
}

function setupDownload(){
  const canvas = qrcodeContainer.querySelector('canvas');
  const img = qrcodeContainer.querySelector('img');

  if (canvas) {
    const dataUrl = canvas.toDataURL('image/png');
    downloadLink.href = dataUrl;
    downloadLink.classList.remove('hidden');
  } else if (img) {
    downloadLink.href = img.src;
    downloadLink.classList.remove('hidden');
  } else {
    downloadLink.classList.add('hidden');
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const raw = urlInput.value || '';
  const normalized = normalizeUserInput(raw);
  if (!isValidUrl(normalized)) {
    urlInput.setCustomValidity('Por favor introduce una URL válida (p. ej. example.com o https://ejemplo.com)');
    urlInput.reportValidity();
    return;
  }
  urlInput.setCustomValidity('');
  generateBtn.disabled = true;
  createQRCode(normalized);
  setTimeout(() => { generateBtn.disabled = false; }, 300);
});

clearBtn.addEventListener('click', () => {
  urlInput.value = '';
  clearQRCode();
  urlInput.focus();
});

urlInput.addEventListener('input', () => {
  urlInput.setCustomValidity('');
});