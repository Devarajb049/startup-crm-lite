import fs from 'fs';
import readline from 'readline';

async function run() {
  const fileStream = fs.createReadStream('C:/Users/bhoja/.gemini/antigravity-ide/brain/b1b94934-1924-4496-8ec6-823cf89c7d93/.system_generated/logs/transcript_full.jsonl');
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('capture_browser_console_logs') || line.includes('browser_get_dom')) {
      const obj = JSON.parse(line);
      console.log(`Step ${obj.step_index} (${obj.type}):`);
      if (obj.tool_calls) {
        console.log('Tool calls:', JSON.stringify(obj.tool_calls));
      }
      if (obj.content && obj.content.length > 500) {
        console.log('Content (trimmed):', obj.content.substring(0, 800));
      } else {
        console.log('Content:', obj.content);
      }
      console.log('--------------------------------------------------');
    }
  }
}

run();
