<template>
  <div class="text-control">
    <div class="row-center">
      <div class="btn-bullet" :class="{ disabled: !hasPrev }" @click="prev"><font-awesome-icon icon="chevron-left" /></div>
      {{currentIndex+1}} de {{content.text.length}}
      <div class="btn-bullet" :class="{ disabled: !hasNext }" @click="next"><font-awesome-icon icon="chevron-right" /></div>
    </div>
    <div class="text-field">
      " {{ content.text[currentIndex] | str_limit(100) }} "
    </div>
  </div>
</template>
<script>
export default {
  props: {
    content: Object,
  },
  data: () => ({
    currentIndex: 0,
  }),
  computed: {
    hasPrev() {
      return this.currentIndex !== 0;
    },
    hasNext() {
      return this.currentIndex < this.content.text.length - 1;
    },
  },
  methods: {
    next() {
      if (this.currentIndex < this.content.text.length - 1) this.currentIndex++;
    },
    prev() {
      if (this.currentIndex !== 0) this.currentIndex--;
    },
  },
  mounted() {
    console.log("textfield mounted");
  },
};
</script>
<style lang="scss" scoped>
.text-control {
  background: white;
  border-radius: 8px;
  padding: 4px;
  margin: 4px 8px;
  .text-field {
    flex-grow: 2;
    padding: 8px;
    font-size: 14px;
  }
}
</style>
