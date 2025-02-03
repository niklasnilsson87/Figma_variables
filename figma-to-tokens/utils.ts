import { LocalVariable, RGB, RGBA } from './api_types.ts'

export function tokenTypeFromVariable(
  variable: LocalVariable,
) {
  switch (variable.resolvedType) {
    case 'BOOLEAN':
      return 'boolean'
    case 'COLOR':
      return 'color'
    case 'FLOAT':
      return 'number'
    case 'STRING':
      return 'string'

    default:
      throw new Error(`Unknown resolvedType: ${variable.resolvedType}`)
  }
}

export function tokenValueFromVariable(
  variable: LocalVariable,
  modeId: string,
  localVariables: { [id: string]: LocalVariable },
) {
  const value = variable.valuesByMode[modeId]

  if (typeof value === 'object') {
    if ('type' in value && value.type === 'VARIABLE_ALIAS') {
      const aliasedVariable = localVariables[value.id]
      return `{${aliasedVariable.name.replace(/\//g, '.')}}`
    } else if ('r' in value) {
      return rgbToHex(value)
    }

    throw new Error(`format of variable value is invalid: ${value}`)
  } else {
    return value
  }
}

export function rgbToHex({ r, g, b, ...rest }: RGB | RGBA) {
  const a = 'a' in rest ? rest.a : 1

  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  const hex = [toHex(r), toHex(g), toHex(b)].join('')
  return `#${hex}` + (a !== 1 ? toHex(a) : '')
}

export function green(msg: string) {
  return `\x1b[32m${msg}\x1b[0m`
}
