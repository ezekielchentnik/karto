import htm from '../../node_modules/htm/dist/htm'
import { flatten } from 'ramda'
import { isKartoElement } from '../elements'

const h = (type: string, props: { [key: string]: string }, ...children: any[]) => {
  const element = { type, props: props || {}, children: flatten(children) }
  if (!isKartoElement(element)) {
    throw new Error(`Type "${type}" is invalid`)
  }
  return element
}

export const karto = htm.bind(h)