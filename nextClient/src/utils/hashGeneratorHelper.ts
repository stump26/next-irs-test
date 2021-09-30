import createHash from 'hash-generator'

interface Props {
  length: number
  count: number
}

export function hashGeneratorHelper({ length, count }: Props): string[] {
  let hashs: string[] = []

  for (let i = 0; i < count; i++) {
    hashs.push(createHash(length))
  }

  return hashs
}
