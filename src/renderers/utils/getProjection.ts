import { geoMercator } from 'd3-geo'
import { KartoMap } from '../../elements/map'
import { Geometry, Position, BBox, Polygon } from 'geojson'
import { pipe, map } from 'ramda'

const POINT_MARGIN = 0.001

const hasGeometry = (d: Geometry | undefined): d is Geometry => d !== undefined

const getGeometries = (map: KartoMap): Geometry[] =>
  // @ts-ignore
  map.children
    .map(layer => layer.type === 'tiles' ? undefined : layer.props.geometry)
    .filter(hasGeometry)

const flat = <T>(arr: T[][]): T[] =>
  arr.reduce((r, c) => ([ ...r, ...c ]), [])

const getPositions = (geometry: Geometry): Position[] => {
  if (geometry.type === 'Point') {
    return [geometry.coordinates]
  }
  if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
    return geometry.coordinates
  }
  if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
    return flat(geometry.coordinates)
  }
  if (geometry.type === 'MultiPolygon') {
    return flat(flat(geometry.coordinates))
  }
  return []
}

const fixIfNoPositions = (positions: Position[]): Position[] =>
  positions.length === 0
    ? [[-180, -85],[180, 85]]
    : positions

const getBbox = (positions: Position[]): BBox => {
  const start: BBox = [Infinity, Infinity, -Infinity, -Infinity]
  const reducer = ([xMin, yMin, xMax, yMax]: BBox, [x, y]: Position): BBox => ([
    x < xMin ? x : xMin,
    y < yMin ? y : yMin,
    x > xMax ? x : xMax,
    y > yMax ? y : yMax,
  ])
  return positions.reduce(reducer, start)
}

const fixIfPoint = ([xMin, yMin, xMax, yMax]: BBox): BBox => {
  if (xMin === xMax || yMin === yMax) {
    return [
      xMin - POINT_MARGIN,
      yMin - POINT_MARGIN,
      xMax + POINT_MARGIN,
      yMax + POINT_MARGIN,
    ]
  }
  return [xMin, yMin, xMax, yMax]
}

const bboxToGeom = ([xMin, yMin, xMax, yMax]: BBox): Polygon => ({
  type: 'Polygon',
  coordinates: [[
    [xMin, yMin],
    [xMin, yMax],
    [xMax, yMax],
    [xMax, yMin],
    [xMin, yMin],
  ]]
}) 

export const getBboxGeom = pipe(
  getGeometries,
  map(getPositions),
  flat,
  fixIfNoPositions,
  getBbox,
  fixIfPoint,
)

export default (map: KartoMap, width: number, height: number) => {
  if (map.props.projection) {
    return map.props.projection
  }
  return geoMercator().fitExtent(
    [[0, 0], [width, height]],
    bboxToGeom(getBboxGeom(map))
  )
}