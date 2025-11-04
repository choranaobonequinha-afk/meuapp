const { writeFileSync, mkdirSync, existsSync, readFileSync } = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const scriptsDir = path.join(projectRoot, 'scripts');

const exportScript = [
  "const { createWriteStream, readFileSync } = require('fs');",
  "const path = require('path');",
  "const archiver = require('archiver');",
  "",
  "const projectRoot = path.resolve(__dirname, '..');",
  "",
  "function getProjectName() {",
  "  try {",
  "    const packageJsonPath = path.join(projectRoot, 'package.json');",
  "    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));",
  "    return packageJson.name || 'project';",
  "  } catch (error) {",
  "    console.error('Erro ao ler package.json:', error);",
  "    return 'project';",
  "  }",
  "}",
  "",
  "function createZip() {",
  "  return new Promise((resolve, reject) => {",
  "    const projectName = getProjectName();",
  "    const outputPath = path.join(projectRoot, `${projectName}.zip`);",
  "    const output = createWriteStream(outputPath);",
  "    const archive = archiver('zip', { zlib: { level: 9 } });",
  "",
  "    output.on('close', () => {",
  "      console.log(`? Arquivo ${projectName}.zip criado com sucesso!`);",
  "      console.log(`Tamanho total: ${(archive.pointer() / 1024).toFixed(2)} KB`);",
  "      resolve();",
  "    });",
  "",
  "    output.on('error', reject);",
  "    archive.on('error', reject);",
  "",
  "    archive.pipe(output);",
  "    archive.glob('**/*', {",
  "      cwd: projectRoot,",
  "      ignore: ['node_modules/**', '.git/**', '*.zip'],",
  "    });",
  "",
  "    archive.finalize();",
  "  });",
  "}",
  "",
  "createZip().catch(error => {",
  "  console.error('Erro ao criar arquivo ZIP:', error);",
  "  process.exit(1);",
  "});",
].join('\n');

const readmeAddition = [
  '## Exportação do Projeto',
  '',
  'Para exportar o projeto em um arquivo compactado, execute:',
  '',
  '### No Windows:',
  '```bash',
  'npm run export:win',
  '```',
  '',
  '### No Linux/Mac:',
  '```bash',
  'npm run export',
  '```',
  '',
  'O script de exportação irá:',
  '1. Criar um arquivo ZIP com o nome do projeto',
  '2. Incluir todos os arquivos essenciais do projeto, incluindo:',
  '   - Código fonte',
  '   - Arquivos de configuração',
  '   - Scripts de utilidade',
  '   - Assets e recursos',
  '3. Excluir automaticamente:',
  '   - `node_modules/` (dependências)',
  '   - `.git/` (controle de versão)',
  '   - Arquivos ZIP existentes',
  '',
  'O arquivo gerado será salvo na raiz do projeto com o nome `[nome-do-projeto].zip`.',
  '',
  '### Após Descompactar o Projeto:',
  '```bash',
  '# Entrar na pasta do projeto',
  'cd nome-do-projeto',
  '',
  '# Instalar as dependências',
  'npm install',
  '',
  '# Iniciar o projeto',
  'npm start',
  '```',
].join('\n');

async function installExportScripts() {
  try {
    if (!existsSync(scriptsDir)) {
      mkdirSync(scriptsDir);
      console.log('? Diretório scripts criado');
    }

    writeFileSync(path.join(scriptsDir, 'export.js'), exportScript + '\n');
    writeFileSync(path.join(scriptsDir, 'export.windows.js'), exportScript + '\n');
    console.log('? Scripts de exportação criados');

    console.log('?? Instalando dependência archiver...');
    execSync('npm install archiver --save-dev', { stdio: 'inherit', cwd: projectRoot });
    console.log('? Dependência archiver instalada');

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      export: 'node scripts/export.js',
      'export:win': 'node scripts/export.windows.js',
    };
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('? package.json atualizado');

    const readmePath = path.join(projectRoot, 'README.md');
    if (existsSync(readmePath)) {
      const readmeContent = readFileSync(readmePath, 'utf8');
      if (!readmeContent.includes('## Exportação do Projeto')) {
        writeFileSync(readmePath, readmeContent + '\n' + readmeAddition + '\n');
        console.log('? README.md atualizado');
      }
    } else {
      writeFileSync(readmePath, '# ' + packageJson.name + '\n' + readmeAddition + '\n');
      console.log('? README.md criado');
    }

    console.log('\n?? Instalação concluída com sucesso!');
    console.log('\nAgora você pode usar:');
    console.log('  npm run export     - Para exportar no Linux/Mac');
    console.log('  npm run export:win - Para exportar no Windows');
  } catch (error) {
    console.error('? Erro durante a instalação:', error);
    process.exit(1);
  }
}

installExportScripts();
