/* ===========================================================
   barcode.js — camera scanning, USB handheld scanner support,
   and barcode image generation.
   Requires: JsBarcode (generation) + @zxing/library (camera).
   =========================================================== */
const GSBarcode = (function(){

  let zxingReader = null;
  let cameraStream = null;

  /* ---------------- Generation ---------------- */
  function renderBarcodeSVG(svgEl, value, options){
    if(!window.JsBarcode){ svgEl.outerHTML = '<div class="gs-hint">Barcode library failed to load — check your internet connection.</div>'; return; }
    try{
      JsBarcode(svgEl, value || '0000000000', Object.assign({
        format: 'CODE128', width: 2, height: 60, displayValue: true, fontSize: 13, margin: 8
      }, options || {}));
    }catch(e){
      svgEl.outerHTML = `<div class="gs-hint">Could not generate a barcode for "${value}".</div>`;
    }
  }

  function randomBarcode(){
    // EAN-13-style 12 digit + check-free number, unique enough for an in-shop SKU barcode
    let digits = '20'; // internal-use prefix range
    for(let i=0;i<10;i++) digits += Math.floor(Math.random()*10);
    return digits;
  }

  /* ---------------- USB / handheld scanner ---------------- */
  // Handheld scanners act like a very fast keyboard, typing the code then Enter.
  // We listen globally and buffer fast keystrokes; if a burst arrives faster than
  // a human could type, followed by Enter, we treat it as a scan.
  function attachUsbListener(onScan, opts){
    let buffer = '';
    let lastTime = 0;
    const maxGapMs = (opts && opts.maxGapMs) || 40; // scanners type much faster than humans
    const minLength = (opts && opts.minLength) || 4;

    function handler(e){
      const active = document.activeElement;
      const inScanInput = active && active.dataset && active.dataset.gsBarcodeInput === 'true';
      const now = Date.now();
      const gap = now - lastTime;
      lastTime = now;

      if(e.key === 'Enter'){
        if(buffer.length >= minLength){
          onScan(buffer);
        }
        buffer = '';
        return;
      }
      if(e.key.length === 1){
        // If typing normally (large gaps) and not in a dedicated scan field, ignore —
        // this avoids hijacking regular typing elsewhere in the app.
        if(gap > maxGapMs && !inScanInput){ buffer = ''; }
        buffer += e.key;
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler); // detach fn
  }

  /* ---------------- Camera scanning ---------------- */
  async function startCameraScan(videoEl, statusEl, onDetect){
    if(!window.ZXing){
      if(statusEl) statusEl.textContent = 'Camera scanning library failed to load.';
      return;
    }
    try{
      zxingReader = new ZXing.BrowserMultiFormatReader();
      const devices = await ZXing.BrowserMultiFormatReader.listVideoInputDevices();
      if(!devices.length){ if(statusEl) statusEl.textContent = 'No camera found on this device.'; return; }
      const deviceId = devices[devices.length - 1].deviceId; // prefer back camera on most devices
      if(statusEl) statusEl.textContent = 'Point the camera at a barcode…';
      zxingReader.decodeFromVideoDevice(deviceId, videoEl, (result, err) => {
        if(result){
          if(statusEl) statusEl.textContent = 'Scanned: ' + result.getText();
          onDetect(result.getText());
        }
      });
    }catch(e){
      if(statusEl) statusEl.textContent = 'Camera access failed: ' + (e.message || 'permission denied.');
    }
  }

  function stopCameraScan(){
    try{ if(zxingReader) zxingReader.reset(); }catch(e){}
    zxingReader = null;
  }

  /* ---------------- Combined scan modal ----------------
     Opens a modal offering both camera scan and a manual/USB-scanner
     input field. Calls onDetect(code) and closes itself. */
  function openScanModal(title, onDetect){
    const back = document.createElement('div'); back.className='gs-modal-back';
    back.innerHTML = `<div class="gs-modal">
      <h3>${title || 'Scan a barcode'}</h3>
      <div class="gs-scan-row">
        <input id="gs-scan-manual" placeholder="Scan with USB scanner, or type a code…" data-gs-barcode-input="true" autocomplete="off">
        <button class="gs-btn gs-btn-primary gs-btn-sm" id="gs-scan-manual-go">Use</button>
      </div>
      <div class="gs-hint" style="margin-bottom:10px;">A handheld USB scanner will fill the field above automatically — just aim and trigger it.</div>
      <div id="gs-camera-wrap">
        <video id="gs-camera-video" muted playsinline></video>
        <div class="gs-scan-frame"></div>
      </div>
      <div class="gs-scan-status" id="gs-scan-status">Starting camera…</div>
      <div class="gs-modal-actions">
        <button class="gs-btn gs-btn-ghost" id="gs-scan-close">Cancel</button>
      </div>
    </div>`;
    document.body.appendChild(back);

    const videoEl = back.querySelector('#gs-camera-video');
    const statusEl = back.querySelector('#gs-scan-status');
    const manualInput = back.querySelector('#gs-scan-manual');
    manualInput.focus();

    let detached = false;
    function finish(code){
      if(detached) return;
      detached = true;
      stopCameraScan();
      detachUsb();
      back.remove();
      onDetect(code.trim());
    }

    startCameraScan(videoEl, statusEl, finish);
    const detachUsb = attachUsbListener(finish);

    back.querySelector('#gs-scan-manual-go').addEventListener('click', () => {
      if(manualInput.value.trim()) finish(manualInput.value);
    });
    manualInput.addEventListener('keydown', e => { if(e.key === 'Enter' && manualInput.value.trim()) finish(manualInput.value); });

    back.addEventListener('click', e => { if(e.target === back){ stopCameraScan(); detachUsb(); back.remove(); } });
    back.querySelector('#gs-scan-close').addEventListener('click', () => { stopCameraScan(); detachUsb(); back.remove(); });
  }

  /* ---------------- Barcode display / print modal (Inventory) ---------------- */
  function openBarcodeModal(product, onSave){
    const back = document.createElement('div'); back.className='gs-modal-back';
    back.innerHTML = `<div class="gs-modal">
      <h3>Barcode — ${(product.name||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</h3>
      <div class="gs-field"><label>Barcode value</label>
        <div style="display:flex;gap:8px;">
          <input id="gs-bc-value" value="${product.barcode || ''}" placeholder="Leave blank to auto-generate" style="flex:1;">
          <button class="gs-btn gs-btn-ghost gs-btn-sm" id="gs-bc-random">Generate new</button>
        </div>
      </div>
      <div class="gs-barcode-preview"><svg id="gs-bc-svg"></svg></div>
      <div class="gs-modal-actions">
        <button class="gs-btn gs-btn-ghost" id="gs-bc-close">Close</button>
        <button class="gs-btn gs-btn-ghost" id="gs-bc-print">Print label</button>
        <button class="gs-btn gs-btn-primary" id="gs-bc-save">Save to product</button>
      </div>
    </div>`;
    document.body.appendChild(back);

    function draw(){
      const val = back.querySelector('#gs-bc-value').value.trim() || randomBarcode();
      renderBarcodeSVG(back.querySelector('#gs-bc-svg'), val);
    }
    if(!product.barcode) back.querySelector('#gs-bc-value').value = randomBarcode();
    draw();

    back.querySelector('#gs-bc-value').addEventListener('input', draw);
    back.querySelector('#gs-bc-random').addEventListener('click', () => { back.querySelector('#gs-bc-value').value = randomBarcode(); draw(); });
    back.addEventListener('click', e => { if(e.target===back) back.remove(); });
    back.querySelector('#gs-bc-close').addEventListener('click', () => back.remove());
    back.querySelector('#gs-bc-print').addEventListener('click', () => {
      const svgHtml = back.querySelector('#gs-bc-svg').outerHTML;
      const w = window.open('', '_blank', 'width=340,height=260');
      w.document.write(`<html><head><title>Barcode label</title></head><body style="text-align:center;padding:20px;font-family:sans-serif;">
        <div>${(product.name||'').replace(/</g,'&lt;')}</div>${svgHtml}</body></html>`);
      w.document.close(); w.print();
    });
    back.querySelector('#gs-bc-save').addEventListener('click', () => {
      const val = back.querySelector('#gs-bc-value').value.trim();
      if(!val){ alert('Enter or generate a barcode value.'); return; }
      onSave(val);
      back.remove();
    });
  }

  return { renderBarcodeSVG, randomBarcode, attachUsbListener, openScanModal, openBarcodeModal, stopCameraScan };
})();
