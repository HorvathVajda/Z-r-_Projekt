<!-- Modal.vue -->
<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <p>{{ message }}</p>
      <button @click="closeModal">OK</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    message: String
  },
  methods: {
    closeModal() {
      this.$emit("update:isVisible", false);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
</style>
