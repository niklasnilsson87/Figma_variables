import 'jsr:@std/dotenv/load'

import { getTokensFiles, writeTokensToJson } from './figma_to_files.ts'

const FIGMA_ACCESS_TOKEN = Deno.env.get('FIGMA_ACCESS_TOKEN')
const FILE_KEY = Deno.env.get('FILE_KEY')

if (!FIGMA_ACCESS_TOKEN) {
  throw new Error('FIGMA_ACCESS_TOKEN environment variable is required')
}

if (!FILE_KEY) {
  throw new Error('FILE_KEY environment variable is required')
}

try {
  const tokenFiles = await getTokensFiles(FIGMA_ACCESS_TOKEN, FILE_KEY)
  await writeTokensToJson(tokenFiles)
} catch (error) {
  console.log(`Something went terribly wrong 😞 and here's why: ${error}`)
}
