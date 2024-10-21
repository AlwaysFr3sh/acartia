// Toast.vue

// TODO: different colors and icons for different statuses??
//       (when would we use other statuses?)

<template>
  <Teleport to="body">
    <ul v-if="toasts.length" class="toasts">
      <li v-for="toast in toasts" class="toat" :key="toast.id">
        <img :src="require('@/assets/tick.svg')">
        <p>{{ toast.message }}</p>
      </li>
    </ul>
    <!-- For testing purposes -->
    <!--
    <ul class="toasts">
      <li class="toat">
        <img :src="require('@/assets/tick.svg')">
        <p>This is a test message</p>
      </li>
    </ul>
    -->
  </Teleport>
</template>
<script>

 export default {
  name: 'Toast',
  computed: {
    toasts() {
      return this.$store.state.toasts;
    }
  }
 }

</script>
<style scoped>

p {
  font-family: "Montserrat";
  font-weight: 300;
  font-size: 14px;
  line-height: 19.6px;
  margin: 0;
  margin-left: 10px;
}

img {
  width: 18px;
  height: 18px;
}

.toat {
  background-color: #BFEBED;
  width: 316px;
  height: 48px;
  border-radius: 12px;
  padding: 12px 16px;
  margin-top: 10px;

  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.toasts {
  position: fixed;
  top: 70px;
  left: calc(50% - 158px); /* position at half the page but account for width of the box */
  z-index: 9999999;
  padding: 0;
  margin: 0;
}

</style>