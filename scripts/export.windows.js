const { createWriteStream, readFileSync } = require('fs');
const path = require('path');
const archiver = require('archiver');

const projectRoot = path.resolve(__dirname, '..');

function getProjectName() {
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return packageJson.name || 'project';
  } catch (error) {
    console.error('Erro ao ler package.json:', error);
    return 'project';
  }
}

function createZip() {
  return new Promise((resolve, reject) => {
    const projectName = getProjectName();
    const outputPath = path.join(projectRoot, `${projectName}.zip`);
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`? Arquivo ${projectName}.zip criado com sucesso!`);
      console.log(`Tamanho total: ${(archive.pointer() / 1024).toFixed(2)} KB`);
      resolve();
    });

    output.on('error', reject);
    archive.on('error', reject);

    archive.pipe(output);
    archive.glob('**/*', {
      cwd: projectRoot,
      ignore: ['node_modules/**', '.git/**', '*.zip'],
    });

    archive.finalize();
  });
}

createZip().catch(error => {
  console.error('Erro ao criar arquivo ZIP:', error);
  process.exit(1);
});
