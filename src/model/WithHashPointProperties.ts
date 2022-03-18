import { GeoJsonProperties } from 'geojson'

export type WithHashProperties = (GeoJsonProperties & { hash: string }) | null
