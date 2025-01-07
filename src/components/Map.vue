<template>
  <div id="map" ref="map"></div>
</template>

<script>
export default {
  name: "Map",
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const map = new google.maps.Map(this.$refs.map, {
        center: { lat: 47.4979, lng: 19.0402 }, // Budapest központja
        zoom: 12,
      });

      // Hozzáadhatunk egy marker-t is a térképhez
      new google.maps.Marker({
        position: { lat: 47.4979, lng: 19.0402 },
        map: map,
        title: "Budapesti szolgáltató",
      });
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 300px;
  border-radius: 10px;
}
</style>
