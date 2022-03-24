import { SupportedLocationWitnessPayloads } from '../../model'

export type PayloadValidator<T extends SupportedLocationWitnessPayloads> = (payload: T) => boolean
