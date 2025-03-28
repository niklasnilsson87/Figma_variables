import StyleDictionary from 'npm:style-dictionary@4.3.3'

import { join } from 'https://deno.land/std@0.224.0/path/mod.ts'

interface TokenSet {
  source: string
  references?: string[]
  outputReference: boolean
  destination: string
}

async function getCollections(): Promise<TokenSet[]> {
  const collections: TokenSet[] = []

  for await (const dirEntry of Deno.readDir('./tokens')) {
    if (dirEntry.isFile) {
      collections.push({
        source: dirEntry.name.replace('.json', ''),
        references: dirEntry.name.includes('semantic')
          ? ['tokens/foundation.json']
          : [],
        outputReference: dirEntry.name.includes('semantic') ? true : false,
        destination: `css/${dirEntry.name.replace('.json', '.css')}`,
      })
    }

    console.log(dirEntry)

    if (dirEntry.isDirectory) {
      const tokenFiles = []
      for await (const file of Deno.readDir(join('./tokens', dirEntry.name))) {
        if (file.isFile) {
          tokenFiles.push(file.name)
        }
      }

      // console.log(tokenFiles)

      tokenFiles.forEach((file) => {
        // console.log('file', file)
        collections.push({
          source: `${dirEntry.name}/${file.replace('.json', '')}`,
          references: [
            'tokens/semantic.light.json',
            'tokens/semantic.dark.json',
          ],
          outputReference: true,
          destination: `css/${dirEntry.name}/${file.replace('.json', '.css')}`,
        })
      })
    }
  }

  return collections
}

const collections = await getCollections()
// console.log(collections)

collections.forEach((collection) => {
  const styleDictionary = new StyleDictionary({
    include: collection.references || [],
    source: [`tokens/${collection.source}.json`],
    platforms: {
      css: {
        transformGroup: 'css',
        files: [
          {
            format: 'css/variables',
            destination: collection.destination,
            options: {
              outputReferences: collection.outputReference,
            },
          },
        ],
      },
    },
    log: {
      warnings: 'warn',
      verbosity: 'verbose',
      errors: {
        brokenReferences: 'throw',
      },
    },
  })

  styleDictionary.cleanAllPlatforms()
  styleDictionary.buildAllPlatforms()
})
