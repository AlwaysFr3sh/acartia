import dayjs from 'dayjs'
import { getNDaysAgo } from './dateUtils'

// Function to generate the mapboxgl match expression
export function generateMatchExpression(colorMappings) {
  const matchExpression = ['match', ['get', 'type']];
  for (const [type, color] of Object.entries(colorMappings)) {
    matchExpression.push(type, color);
  }
  matchExpression.push('#000000'); // Set default to black if type doesn't match any
  return matchExpression;
}

// Method to filter sightings by a user's DID
export function filterUserSightings(sightings, did) {
  return sightings.filter(sighting => {
    if (!sighting.submitter) {
      return false
    }

    const submitterDid = sighting.submitter_did;
    // Check if the sighting's DID matches the provided DID
    return submitterDid && submitterDid === did;
  });
}

export function getSpeciesAndContributors(dataPoints) {
  let speciesList = new Set()
  let contributorList = new Set()

  dataPoints.forEach(sighting => {
    speciesList.add(sighting.properties.type)
    contributorList.add(sighting.properties.witness)
  })

  speciesList = [...speciesList]
  speciesList = speciesList.filter(species => {
    if (!species) {
      return false
    } else {
      return true
    }
  }).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  contributorList = [...contributorList]
  contributorList = contributorList.filter(contributor => {
    if (!contributor) {
      return false
    } else {
      return true
    }
  }).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

  return {
    speciesList: speciesList,
    contributorList: contributorList
  }
}

export function sortApiDataChronologically(dataPoints) {
  return dataPoints.sort((a, b) => {
    if (dayjs(a.created).isBefore(dayjs(b.created))) {
      return -1
    } else {
      return 1
    }
  })
}

export function transformApiDataToMappableData(currSights) {
  let dataPoints = []

  Object.values(currSights).forEach((value) => {
    //get curr date
    // Create new array instance of two numbers for mapbox marker coordinate
    if (value && value.created) {
      // Check if the fields for the sighting is valid or compatible
      let filtered_long = (isNaN(value.longitude)) ? 1 : value.longitude
      let filtered_lat = (isNaN(value.latitude)) ? 1 : value.latitude
      let filtered_sightings = (isNaN(value.no_sighted)) ? 1 : value.no_sighted
      let filtered_date = dayjs('2011-01-01 20:00:00')
      let days_ago = 0
      let f_day = 1
      let f_month = 1
      let f_year = 2011
      let f_epoch_date = new Date().getTime()

      if (filtered_date.isValid()) {
        filtered_date = dayjs(value.created.substr(0, 10).split(' ')[0], ['YYYY-MM-DD', 'MM/DD/YY', 'DD/MM/YY', 'D/M/YY'])
        f_day = filtered_date.date()
        f_month = filtered_date.month() + 1
        f_year = filtered_date.year()
        days_ago = dayjs().diff(filtered_date, 'day')
        f_epoch_date = new Date(filtered_date).getTime()
      }

      const sightingEntry = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [filtered_long, filtered_lat]
        },
        "properties": {
          "entity": value.data_source_entity,
          "ssemmi_id": value.ssemmi_id,
          "created": value.created,
          "type": value.type,
          "day": f_day,
          "month": f_month,
          "year": f_year,
          "epoch_date": f_epoch_date,
          "no_sighted": filtered_sightings,
          "days_ago": days_ago.toString(),
          "witness": value.data_source_witness,
          "comments": value.data_source_comments,
          "ssemmi_date_added": value.ssemmi_date_added,
          "verified": value.trusted,
          "sightingRef": value.entry_id,
        }
      }

      dataPoints.push(sightingEntry)
    }
  })

  return dataPoints
}

export function getSpeciesCounts(sightingData) {
  if (sightingData.length == 0) return []
  let speciesCount = {}
  const whaleRegex = /orca|killer/i;

  let today = dayjs()
  let today2 = dayjs()
  let todaysMonth = today.month()

  while (today.month() == todaysMonth) {
    today = today.subtract(1, "day")
  }

  let diff = today2.diff(today, "day")
  sightingData = filterByDateRange(sightingData, { dateBegin: getNDaysAgo(diff), dateEnd: getNDaysAgo(0) })

  sightingData = sightingData.forEach(sighting => {
    //check if type of killer whale or orca. lets combine due to messy data
    let species = sighting.properties.type

    if (whaleRegex.test(sighting.properties.type)) {
      species = "Orca"
    }

    if (speciesCount[species]) {
      speciesCount[species]++
    } else {
      speciesCount[species] = 1
    }
  })

  let arr = Object.entries(speciesCount).map(([species, value]) => {
    return { species, value }
  }).sort((a, b) => {
    if (a.value < b.value) {
      return 1
    } else {
      return -1
    }
  })

  return arr
}


export function filterByDateRange(sightingData, filterObj) {
  let startDate = filterObj.dateBegin
  let endDate = filterObj.dateEnd

  if (!startDate || !endDate) return []

  let endIdx = sightingData.length - 1
  let startIdx = 0

  //Sliding window; find last valid idx in date range
  for (let i = endIdx; i >= 0; i--) {
    if (dayjs(sightingData[i].properties.created.slice(0, 10)).isSame(dayjs(endDate))) {
      endIdx = i
      break
    }
  }

  //Sliding window; start at final valid data point and iterate backwards to find the first idx in date range
  for (let i = endIdx; i >= 0; i--) {
    if (dayjs(sightingData[i].properties.created.slice(0, 10)).isBefore(dayjs(startDate))) {
      startIdx = i + 1
      break
    }
  }

  sightingData = sightingData.slice(startIdx, endIdx + 1) //+1 as slice is non-inclusive of the last element
  return sightingData
}

export function filterByVerificationStatus(sightingData, filterObj) {
  if (filterObj.verifiedOnly === true) {
    sightingData = sightingData.filter(sighting => sighting.properties.verified)
  }
  return sightingData
}

export function filterBySpecies(sightingData, filterObj) {
  if (sightingData.length == 0) return []

  //If no applied species filters, return data untouched.
  if (filterObj.species.length == 0) return sightingData

  let selectedSpecies = filterObj.species.map(obj => obj.name)

  sightingData = sightingData.filter(sighting => {
    if (selectedSpecies.includes(sighting.properties.type)) {
      return true
    } else {
      return false
    }
  })
  return sightingData
}

export function filterByContributor(sightingData, filterObj) {
  if (sightingData.length == 0) return []

  //If no applied species filters, return data untouched.
  if (filterObj.contributor.length == 0) return sightingData

  let selectedContributors = filterObj.contributor.map(obj => obj.name)

  sightingData = sightingData.filter(sighting => {
    if (selectedContributors.includes(sighting.properties.witness)) {
      return true
    } else {
      return false
    }
  })

  return sightingData
}


export function filterSightingData(sightingData, filterObj) {
  sightingData = filterByDateRange(sightingData, filterObj)
  sightingData = filterByVerificationStatus(sightingData, filterObj)
  sightingData = filterBySpecies(sightingData, filterObj)
  sightingData = filterByContributor(sightingData, filterObj)
  return sightingData
}

export function filterTableData(sightingData, filterObj) {
  sightingData = filterByDateRange(sightingData, filterObj)
  sightingData = filterBySpecies(sightingData, filterObj)
  sightingData = filterByContributor(sightingData, filterObj)
  return sightingData
}




export const legendColorMap = {
  "Atlantic White-sided Dolphin": "#FF5733",
  "Atlantic White-sided Dolphin Sighting:": "#FF8D1A",
  "Autre": "#FFC300",
  "Baird's Beaked Whale": "#DAF7A6",
  "Beluga": "#33FF57",
  "Beluga Whale": "#33FFBF",
  "Beluga Whale Sighting:": "#33A1FF",
  "black right whale": "#337BFF",
  "Blue Shark": "#8A2BE2",
  "Blue Whale": "#7B33FF",
  "Blue Whale Sighting:": "#6A5ACD",
  "Bottlenose Dolphin": "#FF33F6",
  "Bottlenose Whale": "#FF33A1",
  "Common Dolphin": "#FF5733",
  "Common Dolphin - Unidentified": "#FF8D1A",
  "Common Dolphin Sighting:": "#FFC300",
  "Common Long-Beaked Dolphin": "#DAF7A6",
  "Common Short-Beaked Dolphin": "#33FF57",
  "Dall's Porpoise": "#33FFBF",
  "Dall\\'s Porpoise": "#33A1FF",
  "Fin Whale": "#337BFF",
  "Fin Whale Sighting:": "#8A2BE2",
  "Finback Whale": "#7B33FF",
  "Gray Whale": "#6A5ACD",
  "Gray Whale Sighting:": "#FF33F6",
  "Grey": "#FF33A1",
  "grey whale": "#FF5733",
  "Harbor Porpoise": "#FF8D1A",
  "Humpback": "#FFC300",
  "Humpback Sighting:": "#DAF7A6",
  "Humpback Whale": "#33FF57",
  "Killer Whale": "#33FFBF",
  "Killer Whale (Orca)": "#33A1FF",
  "Killer Whale (Orca) Sighting:": "#337BFF",
  "Killer Whale Sighting:": "#8A2BE2",
  "long-beaked common dolphin": "#7B33FF",
  "Long-beaked Common Dolphin": "#6A5ACD",
  "Marsouin commun": "#FF33F6",
  "Minke Whale": "#FF33A1",
  "Minke Whale Sighting:": "#FF5733",
  "Mola Mola / Sunfish": "#FF8D1A",
  "Non spÃ©cifiÃ©": "#FFC300",
  "Non spécifié": "#DAF7A6",
  "Northern Right Whale Dolphin": "#33FF57",
  "Northern Right Whale Dolphin Sighting:": "#33FFBF",
  "Orca": "#33A1FF",
  "Orca Sighting:": "#337BFF",
  "Other": "#8A2BE2",
  "Other (Specify in comments)": "#7B33FF",
  "Other (Specify in comments) Sighting:": "#6A5ACD",
  "Other Sighting:": "#FF33F6",
  "Other Species": "#FF33A1",
  "Pacific White-Sided Dolphin": "#FF5733",
  "Pacific White-sided Dolphin": "#FF8D1A",
  "Pacific White-sided Dolphin Sighting:": "#FFC300",
  "Petit rorqual": "#DAF7A6",
  "Right Whale": "#33FF57",
  "Right Whale Sighting:": "#33FFBF",
  "Risso's Dolphin": "#33A1FF",
  "Risso's Dolphin Sighting:": "#337BFF",
  "Risso\\'s Dolphin": "#8A2BE2",
  "Sei Whale": "#7B33FF",
  "Short Finned Pilot Whale": "#6A5ACD",
  "Short Finned Pilot Whale Sighting:": "#FF33F6",
  "Southern Resident Killer Whale": "#FF33A1",
  "Southern Resident Killer Whale Sighting:": "#FF5733",
  "Southern Resident Orca": "#FF8D1A",
  "Sowerby's Beaked Whale": "#FFC300",
  "Sperm Whale": "#DAF7A6",
  "Sperm Whale Sighting:": "#33FF57",
  "steller sealion": "#33FFBF",
  "Striped Dolphin": "#33A1FF",
  "Unspecified": "#337BFF",
  "Unspecified Sighting:": "#8A2BE2",
  "Whale - Unidentified": "#7B33FF"
};

const monthPrefixes = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12
};

function splitApiDate(dateString) {
  //Date string from API is returned like this
  // Mon Oct 07 2024 18:01:33 GMT+0000 (Coordinated Universal Time)

  let dateTimeArray = dateString.split(" ")
  let month = dateTimeArray[1]
  let date = dateTimeArray[2]
  let year = dateTimeArray[3]
  let time = dateTimeArray[4]
  let fullDate = [year, monthPrefixes[month], date].join("-")

  return { month, date, year, fullDate, time }
}

export function getPopupHtmlString(sighting) {
  let verified = sighting.verified == 1 ? "True" : "False"
  let { fullDate, time } = splitApiDate(sighting.ssemmi_date_added)
  let gmtDateString = [fullDate, time].join(' ')
  let ptDateString = dayjs(gmtDateString).add(4, "hour").toString().slice(0, 25)

  return `<div style="
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #F2F2FF;
    width: 200px;
    padding: 10px;
    padding-top:2rem;
    box-sizing: border-box;
    position: relative;
    border-radius: 10px;
">
    <span></span>

    <hr style="width: 100%; border: 1px solid #ccc; margin: 10px 0;">
    <span style="
        color: var(--Primary, #545F71);
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 19px;
        letter-spacing: -0.28px;
    "><b>Time of Sighting (PT): </b><span style="font-weight: 400;"><br/>

    ${ptDateString} <br/>


    </span></span>

    <hr style="width: 100%; border: 1px solid #ccc; margin: 10px 0;">
    <span style="
        color: var(--Primary, #545F71);
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-style: normal;
text-align: left;
        font-weight: 600;
        line-height: 19px;
        letter-spacing: -0.28px;
    "><b>Species: </b><span style="font-weight: 400;">

    ${sighting.type}

    </span></span>
    <hr style="width: 100%; border: 1px solid #ccc; margin: 10px 0;">
    <span style="
        color: var(--Primary, #545F71);
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 19px;
text-align:left;
        letter-spacing: -0.28px;
    "><b>No Sighted: </b><span style="font-weight: 400;">

    ${sighting.no_sighted}

    <span></span>


    <hr style="width: 100%; border: 1px solid #ccc; margin: 10px 0;">
    <span style="
        color: var(--Primary, #545F71);
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 19px;
        letter-spacing: -0.28px;
    "><b>Submitter: </b><span style="font-weight: 400;">

    ${sighting.entity}

    <span></span>


    <hr style="width: 100%; border: 1px solid #ccc; margin: 10px 0;">
    <span style="
        color: var(--Primary, #545F71);
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 19px;
        letter-spacing: -0.28px;
    "><b>Contributor: </b><span style="font-weight: 400;">

    ${sighting.witness}

   <span></span>


    <hr style="width: 100%; border: 1px solid #ccc; margin: 10px 0;">
    <span style="
        color: var(--Primary, #545F71);
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 19px;
        letter-spacing: -0.28px;
    "><b>Time of Sighting (GMT): </b><span style="font-weight: 400;"><br/>

    ${gmtDateString}

    <span></span>

        <hr style="width: 100%; border: 1px solid #ccc; margin: 10px 0;">
            <span style="
        color: var(--Primary, #545F71);
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 19px;
text-align:left;
        letter-spacing: -0.28px;
    "><b>Sighting Ref: </b><span style="font-weight: 400;">

    ${sighting.sightingRef}

    <span></span>
        <hr style="width: 100%; border: 1px solid #ccc; margin: 10px 0;">

            <span style="
        color: var(--Primary, #545F71);
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 19px;
text-align:left;
        letter-spacing: -0.28px;
    "><b>Verified: </b><span style="font-weight: 400;"> ${verified}
    <span></span>
        <hr style="width: 100%; border: 1px solid #ccc; margin: 10px 0;">
    </div>
`
}
