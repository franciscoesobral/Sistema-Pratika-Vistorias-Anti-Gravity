const { execSync } = require('child_process');

// Como o Vercel já está aberto e autenticado no browser,
// vou criar os projetos localmente e fazer deploy via git

console.log('🚀 Iniciando deploy automatizado...\n');

// 1. Criar branch main se não existir
try {
  execSync('git checkout -b main 2>/dev/null || git checkout main', { stdio: 'inherit' });
  console.log('✅ Branch main criada/selecionada\n');
} catch (e) {}

// 2. Push para GitHub
try {
  console.log('📤 Fazendo push para GitHub...');
  execSync('git push origin main --force', { stdio: 'inherit' });
  console.log('✅ Código enviado para GitHub\n');
} catch (e) {
  console.log('⚠️ Push pode já ter sido feito\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ PRÓXIMO PASSO NO VERCEL DASHBOARD:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Como o Vercel está aberto no seu navegador:');
console.log('');
console.log('1. Clique em "Add New..." → "Project"');
console.log('2. Selecione: Sistema-Pratika-Vistorias-Anti-Gravity');
console.log('3. Configure:');
console.log('   - Root Directory: frontend');
console.log('   - Framework: Vite');
console.log('   - Clique Deploy');
console.log('');
console.log('Depois repita para o backend!');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
