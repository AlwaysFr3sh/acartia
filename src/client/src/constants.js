import { getNDaysAgo } from './dateUtils'

export const ALL_SPECIES = "allSpecies"
export const ALL_CONTRIBUTORS = "allContributors"

export function generateInitFilterState(startNDaysAgo, endNDaysAgo) {
  return {
    dateBegin: getNDaysAgo(startNDaysAgo),
    dateEnd: getNDaysAgo(endNDaysAgo),
    species: ALL_SPECIES,
    contributor: ALL_CONTRIBUTORS,
    verifiedOnly: false,
  }
}

