
// Middleware de prerender básico
const prerenderMiddleware = (req, res, next) => {
  const userAgent = req.get('User-Agent');
  
  // Detectar bots de búsqueda
  const isBot = userAgent && (
    userAgent.includes('googlebot') ||
    userAgent.includes('bingbot') ||
    userAgent.includes('slurp') ||
    userAgent.includes('duckduckbot') ||
    userAgent.includes('baiduspider') ||
    userAgent.includes('yandexbot') ||
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('twitterbot') ||
    userAgent.includes('rogerbot') ||
    userAgent.includes('linkedinbot') ||
    userAgent.includes('embedly') ||
    userAgent.includes('quora link preview') ||
    userAgent.includes('showyoubot') ||
    userAgent.includes('outbrain') ||
    userAgent.includes('pinterest/0.') ||
    userAgent.includes('developers.google.com/+/web/snippet') ||
    userAgent.includes('slackbot') ||
    userAgent.includes('vkShare') ||
    userAgent.includes('W3C_Validator') ||
    userAgent.includes('redditbot') ||
    userAgent.includes('Applebot') ||
    userAgent.includes('WhatsApp') ||
    userAgent.includes('flipboard') ||
    userAgent.includes('tumblr') ||
    userAgent.includes('bitlybot') ||
    userAgent.includes('SkypeUriPreview') ||
    userAgent.includes('nuzzel') ||
    userAgent.includes('Discordbot') ||
    userAgent.includes('Google Page Speed') ||
    userAgent.includes('Qwantify')
  );
  
  if (isBot && req.path === '/') {
    // Servir versión prerenderizada para bots
    const prerenderHTML = generatePrerenderHTML();
    res.setHeader('Content-Type', 'text/html');
    res.send(prerenderHTML);
  } else {
    next();
  }
};

function generatePrerenderHTML() {
  // HTML básico prerenderizado con metadatos SEO
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShopManStore - Tienda Online de Ropa y Accesorios</title>
  <meta name="description" content="Descubre la mejor selección de ropa y accesorios en ShopManStore. Calidad, estilo y precios increíbles. ¡Compra online con envío rápido!">
  <meta name="keywords" content="ropa, moda, tienda online, accesorios, comprar ropa, fashion">
  <meta property="og:title" content="ShopManStore - Tienda Online">
  <meta property="og:description" content="La mejor tienda online de ropa y accesorios">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://shopmanstorej.onrender.com">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ShopManStore - Tienda Online">
  <meta name="twitter:description" content="La mejor tienda online de ropa y accesorios">
  <link rel="canonical" href="https://shopmanstorej.onrender.com">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <header class="bg-white shadow">
    <div class="container mx-auto px-4 py-4">
      <h1 class="text-2xl font-bold text-indigo-600">ShopManStore</h1>
    </div>
  </header>
  <main class="container mx-auto px-4 py-8">
    <h2 class="text-xl font-bold mb-4">Bienvenido a ShopManStore</h2>
    <p class="text-gray-600 mb-4">Tu tienda online de confianza para ropa y accesorios de calidad.</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-bold">Calidad Premium</h3>
        <p class="text-sm text-gray-600">Productos seleccionados con los mejores materiales</p>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-bold">Envío Rápido</h3>
        <p class="text-sm text-gray-600">Recibe tus productos en tiempo récord</p>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-bold">Precios Increíbles</h3>
        <p class="text-sm text-gray-600">La mejor relación calidad-precio del mercado</p>
      </div>
    </div>
  </main>
  <script>
    // Redirigir a la app completa después de que el bot haya leído el contenido
    if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
      window.location.reload();
    }
  </script>
</body>
</html>`;
}

module.exports = { prerenderMiddleware };
