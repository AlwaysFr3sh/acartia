import { getNDaysAgo } from './dateUtils'

export const ALL_SPECIES = "allSpecies"
export const ALL_CONTRIBUTORS = "allContributors"

export const initMapFilterState = {
  dateBegin: getNDaysAgo(7),
  dateEnd: getNDaysAgo(0),
  species: ALL_SPECIES,
  contributor: ALL_CONTRIBUTORS,
  verifiedOnly: false,
}

export const initTableFilterState = {
  date: getNDaysAgo(1),
  species: ALL_SPECIES,
  contributor: ALL_CONTRIBUTORS,
}

