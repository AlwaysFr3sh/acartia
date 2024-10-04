import { transformApiDataToMappableData, filterByContributor } from '../../mapUtils'
import {ALL_CONTRIBUTORS} from '../../constants'
import testData from './testData'

const mappableData = transformApiDataToMappableData(testData)

describe('filter sightings by contributor', () => {
  let sightingData;
  let filterObj;

  beforeEach(() => {
    sightingData = [...mappableData]

    filterObj = {
      contributor: ALL_CONTRIBUTORS,
    };
  });

  it('should return all sightings when contributor filter is set to ALL_CONTRIBUTORS', () => {
    const result = filterByContributor(sightingData, filterObj);
    expect(result.length).toEqual(sightingData.length); // No filtering should occur
  });

  it('should filter sightings by a specific contributor', () => {
    const testContributor = 'OrcaSound'
    filterObj.contributor = testContributor

    const result = filterByContributor(sightingData, filterObj);
    expect(false).toEqual(result.some(sighting => sighting.properties.type != testContributor));
  });

  it('should return an empty array when no sightings match the contributor', () => {
    filterObj.contributor = 'nonExistentContributor';

    const result = filterByContributor(sightingData, filterObj);
    expect(result).toEqual([]);
  });

  it('should return an empty array when sightingData is empty', () => {
    const emptyData = [];
    filterObj.contributor = 'contributorA';

    const result = filterByContributor(emptyData, filterObj);
    expect(result).toEqual([]);
  });
})
