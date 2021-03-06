export type StrokeLinejoin = 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round'
export const strokeLinejoinSchema = {
  type: 'string',
  enum: ['arcs', 'bevel',  'miter',  'miter-clip',  'round'],
}

export type StrokeLinecap = 'butt' | 'round' | 'square'
export const strokeLinecapSchema = {
  type: 'string',
  enum: ['butt', 'round', 'square'],
}

export type TextAnchor = 'start' | 'middle' | 'end'
export const textAnchorSchema = {
  type: 'string',
  enum: ['start', 'middle', 'end'],
}

export interface CommonStyle {
  opacity?: number
}
export const commonStyleSchema = {
  type: 'object',
  properties: {
    opacity: { type: 'number', minimum: 0, maximum: 1 },
  }
}

export interface StrokeStyle extends CommonStyle {
  stroke?: string
  strokeWidth?: number
  strokeLinejoin?: StrokeLinejoin
  strokeDasharray?: number[]
  strokeDashoffset?: number
  strokeLinecap?: StrokeLinecap
  strokeOpacity?: number
}
export const strokeStyleSchema = {
  type: 'object',
  properties: {
    ...commonStyleSchema.properties,
    stroke: { type: 'string' },
    strokeWidth: { type: 'number' },
    strokeLinejoin: strokeLinejoinSchema,
    strokeDasharray: { type: 'array', items: { type: 'number' } },
    strokeDashoffset: { type: 'number'},
    strokeLinecap: strokeLinecapSchema,
    strokeOpacity: { type: 'number' }, 
  }
}

export interface FillStyle extends CommonStyle {
  fill?: string
  fillOpacity?: number
}
export const fillStyleSchema = {
  type: 'object',
  properties: {
    ...commonStyleSchema.properties,
    fill: { type: 'string' },
    fillOpacity: { type: 'number', minimum: 0, maximum: 1 },
  }
}

export interface TextStyle extends CommonStyle {
  fontFamily?: string
  fontSize?: number
  textAnchor?: TextAnchor
}
export const textStyleSchema = {
  type: 'object',
  properties: {
    ...commonStyleSchema.properties,
    fontFamily: { type: 'string' },
    fontSize: { type: 'number' },
    textAnchor: textAnchorSchema,
  }
}

// By layer

export interface LineStyle extends StrokeStyle {}
export const lineStyleSchema = strokeStyleSchema


export interface PolygonStyle extends StrokeStyle, FillStyle {}
export const polygonStyleSchema = {
  type: 'object',
  properties: {
    ...strokeStyleSchema.properties,
    ...fillStyleSchema.properties,
  }
}

export interface CircleStyle extends StrokeStyle, FillStyle {
  r: number
}
export const circleStyleSchema = {
  type: 'object',
  properties: {
    r: { type: 'number' },
    ...strokeStyleSchema.properties,
    ...fillStyleSchema.properties,  
  },
  required: ['r']
}

export interface LabelStyle extends StrokeStyle, FillStyle, TextStyle {
  text: string
  translate?: number[]
}
export const labelStyleSchema = {
  type: 'object',
  properties: {
    text: { type: 'string' },
    ...strokeStyleSchema.properties,
    ...fillStyleSchema.properties,  
    ...textStyleSchema.properties,
  },
  required: ['text']
}

export interface MarkerStyle extends StrokeStyle, FillStyle {
  width?: number
}
export const markerStyleSchema = {
  type: 'object',
  properties: {
    width: { type: 'number' },
    ...strokeStyleSchema.properties,
    ...fillStyleSchema.properties,  
  }
}

export interface TilesStyle {
  attribution?: string
  ext?: string
  subdomains?: string
  url: string
}
export const tilesStyleSchema = {
  type: 'object',
  properties: {
    attribution: { type: 'string' },
    ext: { type: 'string' },
    subdomains: { type: 'string' },
    url: { type: 'string' },
  },
  required: [
    'url'
  ]
}