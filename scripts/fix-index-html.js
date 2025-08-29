const fs = require('fs');
const path = require('path');

// Função para criar um index.html personalizado com o nome correto do arquivo JS
function createCustomIndexHtml() {
  // Caminho correto para o diretório dist (relativo ao diretório raiz do projeto)
  const distPath = path.join(__dirname, '..', 'dist');
  
  // Verificar se o diretório dist existe
  if (!fs.existsSync(distPath)) {
    console.error('Diretório dist não encontrado em:', distPath);
    process.exit(1);
  }
  
  // Copiar arquivos de _expo/static para static na raiz
  const expoStaticSourceDir = path.join(distPath, '_expo', 'static');
  const staticTargetDir = path.join(distPath, 'static');
  
  if (fs.existsSync(expoStaticSourceDir)) {
    // Copiar recursivamente todo o conteúdo de _expo/static para static
    copyDir(expoStaticSourceDir, staticTargetDir);
    console.log('Arquivos copiados de _expo/static para static');
  }
  
  // Encontrar o arquivo JS correto
  const jsDir = path.join(distPath, 'static', 'js', 'web');
  if (!fs.existsSync(jsDir)) {
    console.error('Diretório de arquivos JS não encontrado em:', jsDir);
    process.exit(1);
  }
  
  const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
  if (jsFiles.length === 0) {
    console.error('Nenhum arquivo JS encontrado em:', jsDir);
    process.exit(1);
  }
  
  // Pegar o primeiro arquivo JS (deveria ser o único)
  const jsFileName = jsFiles[0];
  // O caminho correto agora é /static/js/web/
  const jsFilePath = `/static/js/web/${jsFileName}`;
  
  console.log('Arquivo JS encontrado:', jsFileName);
  
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
    <script src="${jsFilePath}" defer></script>
  </body>
</html>`;
  
  // Criar ou sobrescrever o index.html
  const indexPath = path.join(distPath, 'index.html');
  fs.writeFileSync(indexPath, customIndexHtml);
  console.log('index.html personalizado criado com sucesso em:', indexPath);
  
  // Copiar para todas as outras páginas
  const pages = ['perfil.html', 'historico.html', 'onboarding.html', '_sitemap.html', '+not-found.html'];
  pages.forEach(page => {
    const pagePath = path.join(distPath, page);
    fs.copyFileSync(indexPath, pagePath);
    console.log(`${page} criado com sucesso!`);
  });
}

// Função auxiliar para copiar diretórios recursivamente
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Executar a função
createCustomIndexHtml();