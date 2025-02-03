import { LocalVariable } from './api_types.ts'
import FigmaApi from './figma_api.ts'
import { Token, TokensFile } from './token_types.ts'
import {
  green,
  tokenTypeFromVariable,
  tokenValueFromVariable,
} from './utils.ts'

export async function getTokensFiles(access_token: string, file_key: string) {
  const api = new FigmaApi(access_token)
  const variablesResponse = await api
    .getLocalVariables(file_key)

  const localVariableCollections = variablesResponse.meta.variableCollections
  const localVariables = variablesResponse.meta.variables

  const tokenFiles: { [fileName: string]: TokensFile } = {}

  for (const variable of Object.values(localVariables) as LocalVariable[]) {
    const collection = localVariableCollections[variable.variableCollectionId]
    if (!collection) continue

    for (const mode of collection.modes) {
      const fileName = generateFileName(collection.name, mode.name)

      if (!tokenFiles[fileName]) {
        tokenFiles[fileName] = {}
      }

      const tokenPath = buildTokenPath(
        variable.name.split('/'),
        tokenFiles[fileName],
      )

      const token: Token = {
        $type: tokenTypeFromVariable(variable),
        $value: tokenValueFromVariable(variable, mode.modeId, localVariables),
        $description: variable.description || '',
      }

      Object.assign(tokenPath, token)
    }
  }

  return tokenFiles
}

function generateFileName(collectionName: string, modeName: string): string {
  if (!['light', 'dark'].includes(modeName)) {
    return `${collectionName}.json`
  }

  return `${collectionName}.${modeName}.json`
}

export async function writeTokensToJson(tokenFiles: any) {
  const outputDir = 'tokens'
  const componentDir = `${outputDir}/components`

  await Deno.mkdir(outputDir, { recursive: true })
  await Deno.mkdir(componentDir, { recursive: true })

  for await (const [fileName, fileContent] of Object.entries(tokenFiles)) {
    const isComponent = fileName.toLowerCase().startsWith('component')

    if (isComponent) {
      for (
        const [componentName, componentData] of Object.entries(
          fileContent as Record<string, any>,
        )
      ) {
        const componentFilePath = `${componentDir}/${componentName}.json`
        const component = { [componentName]: componentData }
        await Deno.writeTextFile(
          componentFilePath,
          JSON.stringify(component, null, 2),
        )
        console.log(`Wrote ${componentFilePath}`)
      }
      continue
    }

    const filePath = `${outputDir}/${fileName}`
    await Deno.writeTextFile(filePath, JSON.stringify(fileContent, null, 2))
    console.log(`Wrote ${filePath}`)
  }

  console.log(
    green(`✅ Tokens files have been written to the ${outputDir} directory`),
  )
}

function buildTokenPath(
  pathParts: string[],
  root: Record<string, any>,
): Record<string, any> {
  return pathParts.reduce((current, part) => {
    if (!current[part]) {
      current[part] = {}
    }

    return current[part]
  }, root)
}
