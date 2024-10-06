<template>
  <!--Last sighting -->
  <div class="sighting">
    <h2 class="sighting-header">Last sighting</h2>
    <LastSightingMap />
    <div class="row sighting-text">
      <div class="col-6 mb-2">
        <p class="sighting-title">Type:</p>
        <p class="sighting-text">{{ mostRecentSightingType }}</p>
      </div>
      <div class="col-6 mb-2">
        <p class="sighting-title">Sighter:</p>
        <p class="sighting-text">{{ mostRecentSightingProfileName }}</p>
      </div>
      <div class="col-6 mb-2">
        <p class="sighting-title">Date:</p>
        <p class="sighting-text">{{ mostRecentSightingDate }}</p>
      </div>
      <div class="col-6 mb-2">
        <p class="sighting-title">Pod/Non Pod:</p>
        <p class="sighting-text">Non Pod</p>
      </div>
      <div class="col-6 mb-2">
        <p class="sighting-title">Location:</p>
        <p class="sighting-text">Lat: {{ mostRecentSightingLatitude }} <br /> Long: {{ mostRecentSightingLongitude }}
        </p>
      </div>
      <div class="col-6 mb-2">
        <p class="sighting-title">Photos:</p>
        <p class="sighting-text">{{ mostRecentSightingPhotoUrl ? mostRecentSightingPhotoUrl : "0" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LastSightingMap from './LastSightingMap.vue';

export default {
  name: 'LastSighting',
  components: {
    LastSightingMap
  },
  computed: {
    mostRecentSighting() {
      return this.$store.getters.getLastSighting
    },
    mostRecentSightingType() {
      return this.$store.getters.getLastSighting.type
    },
    mostRecentSightingProfileName() {
      return this.$store.getters.getLastSighting.profile.name
    },
    mostRecentSightingDate() {
      return this.$store.getters.getLastSighting.created
    },
    mostRecentSightingLatitude() {
      return this.$store.getters.getLastSighting.latitude
    },
    mostRecentSightingLongitude() {
      return this.$store.getters.getLastSighting.longitude
    },
    mostRecentSightingPhotoUrl() {
      return this.$store.getters.getLastSighting.photo_url
    },
  }
}

</script>

<style scoped>
h2 {
  font-family: Mukta;
  font-size: 1.5rem !important;
  font-style: normal;
  font-weight: 500;
  line-height: 105%;
  text-align: center;
}

.sighting {
  text-align: center;
  border-radius: 15px;
  margin-top: 1rem;
}

.sighting-header {
  margin-bottom: 1rem;
}

.sighting-title {
  overflow-x: visible;
  font-family: Montserrat;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 0px;
}

.sighting-text {
  color: var(--Neutrals-Black, #0C0826);
  text-align: center;
  font-family: Montserrat;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
}
</style>
