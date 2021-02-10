<template>
  <div class="multiple-text-editor">
    <div class="row-center">
      <div class="btn-bullet" @click="remove">
        <font-awesome-icon :class="{ disabled: !hasRem }" icon="trash" />
      </div>

      <div class="btn-bullet" :class="{ disabled: !hasPrev }" @click="prev">
        <font-awesome-icon icon="chevron-left" />
      </div>
      {{ currentIndex + 1 }} de {{ texts.length }}
      <div class="btn-bullet" :class="{ disabled: !hasNext }" @click="next">
        <font-awesome-icon icon="chevron-right" />
      </div>

      <div class="btn-bullet" @click="add">
        <font-awesome-icon icon="plus" />
      </div>
    </div>
    <textarea v-model="texts[currentIndex]"></textarea>
  </div>
</template>
<script>
export default {
  props: {
    texts: Array,
  },
  data: () => ({
    currentIndex: 0,
  }),
  computed: {
    hasPrev() {
      return this.currentIndex !== 0;
    },
    hasNext() {
      return this.currentIndex < this.texts.length - 1;
    },
    hasRem() {
      return this.texts.length > 1;
    },
  },
  methods: {
    add() {
      this.texts.push("");
    },
    remove() {
      this.texts.splice(this.currentIndex, 1);
      if (this.currentIndex >= this.texts.length) {
        this.currentIndex = this.texts.length - 1;
      }
    },
    next() {
      if (this.currentIndex < this.texts.length - 1) this.currentIndex++;
    },
    prev() {
      if (this.currentIndex !== 0) this.currentIndex--;
    },
  },
};
</script>
<style lang="scss">
textarea {
  height: 60px;
  padding: 6px;
  border: none;
  margin-top: 16px;
  font-family: sans-serif;
  resize: vertical;
}
.multiple-text-editor{
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
</style>
