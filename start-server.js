import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = resolve(__dirname, 'src/server/index.ts');

const server = spawn('ts-node', ['--esm', serverPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--experimental-specifier-resolution=node'
  }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit();
}); 