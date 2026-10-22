import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const servicePath = resolve(__dirname, '../node_modules/json-server/lib/service.js')

if (existsSync(servicePath)) {
  let content = readFileSync(servicePath, 'utf-8')
  
  // Procura pela linha original: const item = { ...data, id: randomId() };
  if (content.includes('const item = { ...data, id: randomId() };')) {
    const replacement = `let id = (data.id !== undefined && data.id !== null && String(data.id).trim() !== '') ? String(data.id) : undefined;
        if (!id) {
            const numericIds = items.map((i) => Number(i.id)).filter((n) => !Number.isNaN(n) && Number.isInteger(n) && n > 0);
            id = numericIds.length > 0 ? String(Math.max(...numericIds) + 1) : "1";
        }
        const item = { ...data, id };`

    content = content.replace('const item = { ...data, id: randomId() };', replacement)
    writeFileSync(servicePath, content, 'utf-8')
    console.log('[patch-json-server] json-server service.js patched successfully for sequential IDs.')
  } else if (content.includes('numericIds')) {
    console.log('[patch-json-server] json-server service.js already patched.')
  }
}
