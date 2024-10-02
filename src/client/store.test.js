import store from './src/store'
import { getNDaysAgo } from './src/dateUtils'
import {ALL_SPECIES, ALL_CONTRIBUTORS} from './src/constants'

describe('Vuex Store Initial State', () => {
  it('should have the correct initial state for user state', () => {
    expect(store.state.isAuthenticated).toBe(false);
    expect(store.state.token).toBe(null);
    expect(store.state.userDetails).toEqual([]);
    expect(store.state.isAdmin).toBe(false);
    expect(store.state.userRequestList).toEqual([]);
  });

  it('should have the correct initial state for data state', () => {
    expect(store.state.sightings).toEqual([]);
    expect(store.state.filteredSightings).toEqual([]);
    expect(store.state.lastSighting).toBeUndefined();
    expect(store.state.loading).toBe(false);
    expect(store.state.error).toBe(null);
  });

  it('should have the correct initial state for map state', () => {
    expect(store.state.mapFilters).toEqual({
        dateBegin: getNDaysAgo(7),
        dateEnd: getNDaysAgo(0),
        species: ALL_SPECIES,
        contributor: ALL_CONTRIBUTORS,
        verifiedOnly: false,
      });
    expect(store.state.mapOptions).toEqual({
      contributors: [],
      species: [],
    });
    expect(store.state.map).toBe(null);
    expect(store.state.activeMapLayer).toBe("ssemi-map-layer");
  });

  it('should have the correct initial state for table view state', () => {
    expect(store.state.tableFilters).toEqual(expect.objectContaining({
        date: getNDaysAgo(1),
        species: ALL_SPECIES,
        contributor: ALL_CONTRIBUTORS,
      }))
    expect(store.state.tableSightings).toEqual([]);
  });
});
