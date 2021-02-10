<template>
  <div class="form">
    <div class="header" @click="show = !show">
      <div class="header-btn">
        <font-awesome-icon :class="{ rotateA90: !show }" icon="chevron-down" />
      </div>
      <div class="title">Documento</div>
      <div class="flex-filler"></div>
      <div class="header-btn" @click.stop="$emit('remove', content)">
        <font-awesome-icon icon="trash" />
      </div>
    </div>
    <div class="content" :class="{ show: show }">
      <div class="label">Link</div>
      <input v-model="content.link" />
      <div class="label">Caption</div>
      <input v-model="content.caption" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    content: Object,
  },
  data: () => ({
    show: true,
  }),
};
</script>
<style lang="scss"></style>
