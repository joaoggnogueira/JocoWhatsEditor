<template>
  <div class="analytics_form">
    <div class="row">
      <input type="checkbox" id="analyticsEnabled" name="analyticsEnabled" v-model="analytics.enabled" />
      <span for="analyticsEnabled">Enviar evento ao Analytics</span>
    </div>
    <input placeholder="Categoria" v-model="analytics.category" />
    <input placeholder="Ação" v-model="analytics.action" />
    <input placeholder="Rótulo" v-model="analytics.label" />
  </div>
</template>
<script>
export default {
  props: {
    analytics: Object,
  },
};
</script>
<style lang="scss">
.analytics_form {
  display: flex;
  flex-direction: column;
}
</style>
