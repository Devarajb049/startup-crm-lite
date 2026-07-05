import fs from 'fs';
import readline from 'readline';

async function run() {
  const fileStream = fs.createReadStream('C:/Users/bhoja/.gemini/antigravity-ide/brain/b1b94934-1924-4496-8ec6-823cf89c7d93/.system_generated/logs/transcript_full.jsonl');
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (line.includes('console') || line.includes('Console') || line.includes('localStorage') || line.includes('FETCHED_LEADS') || line.includes('VITE_API_URL')) {
      console.log(`Line ${lineCount}:`);
      // Print first 400 characters of the line
      console.log(line.substring(0, 400));
      console.log('--------------------------------------------------');
    }
  }
}

run();
