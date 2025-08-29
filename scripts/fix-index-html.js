const fs = require('fs');
const path = require('path');

// Função para criar um index.html personalizado
function createCustomIndexHtml() {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  const customIndexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="theme-color" content="#000000" />
    <link rel="icon" href="/favicon.ico" />
    <title>Meu Ponto</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #f5f5f5;
      }
      
      #root {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
      }
      
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        background-color: #f5f5f5;
      }
      
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4f46e5;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
      <div class="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
    <script src="/_expo/static/js/web/index-5274c95be6f495126b9c9fddddf02653.js" defer></script>
  </body>
</html>`;
  
  fs.writeFileSync(indexPath, customIndexHtml);
  console.log('index.html personalizado criado com sucesso!');
  
  // Copiar para todas as outras páginas
  const pages = ['perfil.html', 'historico.html', 'onboarding.html', '_sitemap.html', '+not-found.html'];
  pages.forEach(page => {
    const pagePath = path.join(__dirname, 'dist', page);
    fs.copyFileSync(indexPath, pagePath);
    console.log(`${page} criado com sucesso!`);
  });
}

// Executar a função
createCustomIndexHtml();