const https = require('https');

const VERCEL_TOKEN = 'CnweSoAWNaoKagFE1UFtjumE';

// Função para fazer requisições à API do Vercel
function vercelRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function deploy() {
  console.log('🔍 Testando autenticação...\n');

  // Testar autenticação
  const userInfo = await vercelRequest('GET', '/v2/user');

  if (userInfo.status !== 200) {
    console.log('❌ Erro de autenticação:', userInfo.data);
    console.log('\n⚠️ O token pode não ser válido ou estar expirado.');
    console.log('\nPara gerar um novo token:');
    console.log('1. No Vercel Dashboard → Settings → Tokens');
    console.log('2. Create Token');
    console.log('3. Copiar todo o token (formato: vercel_xxxxxxx...)');
    return;
  }

  console.log('✅ Autenticado como:', userInfo.data.user?.username || userInfo.data.user?.email);
  console.log('');

  // Criar projeto Frontend
  console.log('📦 Criando projeto Frontend...');
  const frontendProject = await vercelRequest('POST', '/v9/projects', {
    name: 'pratika-vistorias-frontend',
    framework: 'vite',
    gitRepository: {
      type: 'github',
      repo: 'franciscoesobral/Sistema-Pratika-Vistorias-Anti-Gravity'
    },
    rootDirectory: 'frontend',
    buildCommand: 'npm run build',
    outputDirectory: 'dist'
  });

  console.log('Frontend:', frontendProject);

  // Criar projeto Backend
  console.log('\n📦 Criando projeto Backend...');
  const backendProject = await vercelRequest('POST', '/v9/projects', {
    name: 'pratika-vistorias-backend',
    framework: 'other',
    gitRepository: {
      type: 'github',
      repo: 'franciscoesobral/Sistema-Pratika-Vistorias-Anti-Gravity'
    },
    rootDirectory: 'backend',
    buildCommand: 'npm run vercel-build'
  });

  console.log('Backend:', backendProject);
}

deploy().catch(console.error);
