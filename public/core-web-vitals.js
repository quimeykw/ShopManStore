/**
 * Core Web Vitals Monitoring para ShopManStore
 * Mide LCP, FID, CLS y envía métricas al servidor
 */

// Función para enviar métricas al servidor
function sendMetric(name, value, id) {
  const body = JSON.stringify({
    name,
    value,
    id,
    url: window.location.href,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  });

  // Usar sendBeacon si está disponible, sino fetch
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics', body);
  } else {
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true
    }).catch(console.error);
  }
}

// Función para obtener Web Vitals
function getCLS(onPerfEntry) {
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        onPerfEntry(entry);
      }
    }
  }).observe({ type: 'layout-shift', buffered: true });
}

function getFID(onPerfEntry) {
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      onPerfEntry(entry);
    }
  }).observe({ type: 'first-input', buffered: true });
}

function getLCP(onPerfEntry) {
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    onPerfEntry(lastEntry);
  }).observe({ type: 'largest-contentful-paint', buffered: true });
}

// Inicializar monitoreo
function initWebVitals() {
  // Largest Contentful Paint
  getLCP((entry) => {
    sendMetric('LCP', entry.startTime, entry.id);
  });

  // First Input Delay
  getFID((entry) => {
    sendMetric('FID', entry.processingStart - entry.startTime, entry.id);
  });

  // Cumulative Layout Shift
  let clsValue = 0;
  getCLS((entry) => {
    clsValue += entry.value;
    sendMetric('CLS', clsValue, entry.id);
  });

  // Time to First Byte
  new PerformanceObserver((entryList) => {
    const [pageNav] = entryList.getEntries();
    sendMetric('TTFB', pageNav.responseStart - pageNav.requestStart);
  }).observe({ type: 'navigation', buffered: true });

  // First Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        sendMetric('FCP', entry.startTime);
      }
    }
  }).observe({ type: 'paint', buffered: true });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWebVitals);
} else {
  initWebVitals();
}

// Exportar para uso en otros scripts
window.WebVitals = {
  sendMetric,
  initWebVitals
};