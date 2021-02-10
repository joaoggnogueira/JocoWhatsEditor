<template>
  <div class="option-input-form">
    <div class="header" @click="show = !show">
      <div class="header-btn">
        <font-awesome-icon :class="{ rotateA90: !show }" icon="chevron-down" />
      </div>
      <div class="title">{{ option.name }}</div>
      <div class="flex-filler"></div>
      <div class="header-btn" @click.stop="$emit('remove', option)">
        <font-awesome-icon :icon="locked ? 'lock' : 'trash'" />
      </div>
    </div>
    <div class="content" :class="{ show: show }">
      <div class="row-center" v-for="(synonym, index) in option.synonyms" :key="index">
        <div class="btn-left-icon" @click="remove(index)">
          <font-awesome-icon icon="trash" />
        </div>
        <input class="input-synonyms input-right" v-model="option.synonyms[index]" />
      </div>
      <div class="row-center">
        <input class="input-synonyms" placeholder="Digite a variação e aperte ENTER para adicionar" @keydown.enter="novaVariacao" v-model="newValue" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    show: true,
    newValue: ""
  }),
  methods: {
    remove(index) {
      this.option.synonyms.splice(index, 1);
    },
    novaVariacao(){
      this.option.synonyms.push(this.newValue);
      this.newValue = "";
    }
  },
  props: {
    option: Object,
    locked: Boolean,
  },
};
</script>
<style lang="scss" scoped>
.option-input-form {
  margin: 8px;
  background: #eee;
  border-radius: 8px;
  > .header {
    height: 30px;
    line-height: 30px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    > .title {
      font-size: 14px;
      font-weight: bold;
    }
    > .header-btn {
      color: #555555;
      margin-left: 16px;
      margin-right: 16px;
      &:hover {
        color: #242424;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
    &.show {
      display: none;
    }
    .input-synonyms {
      flex-grow: 2;
      border: none;
    }
  }
}
</style>
