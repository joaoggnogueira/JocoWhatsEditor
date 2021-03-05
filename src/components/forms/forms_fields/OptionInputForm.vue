<template>
  <div class="option-input-form">
    <div class="header">
      <div class="header-btn" @click="show = !show">
        <font-awesome-icon
          :class="{ rotateA90: !show }"
          class="transformEasing"
          icon="chevron-down"
        />
      </div>
      <div class="title" v-if="!editingName" @click.stop="editName">
        <template v-if="option.name">{{ option.name }}</template>
        <template v-else
          ><i class="error-span">Clique aqui para colocar o titulo</i></template
        >
        <span class="subheader-error" v-if="option.duplicated"> (Intent duplicada)</span>
        <span class="subheader-error" v-if="existsDuplicatedSyn">
          (Variação duplicada)</span
        >
      </div>
      <template v-else>
        <input
          v-model="option.name"
          @keyup="$emit('updated')"
          @keydown.enter="editName"
        />
        <div class="header-btn" @click.stop="editName">
          <font-awesome-icon icon="save" />
        </div>
      </template>
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
        <input
          class="input-synonyms input-right"
          @keyup="$emit('updated')"
          :class="{ 'input-error': !option.synonyms[index] || (duplicatedSynonyms && duplicatedSynonyms[index]) }"
          v-model="option.synonyms[index]"
        />
      </div>
      <div class="row-center">
        <input
          class="input-synonyms"
          placeholder="Digite a variação e aperte ENTER para adicionar"
          @keydown.enter="novaVariacao"
          v-model="newValue"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    show: true,
    newValue: "",
    editingName: false,
  }),
  computed: {
    existsDuplicatedSyn() {
      return (
        this.duplicatedSynonyms && this.duplicatedSynonyms.some((d) => d)
      );
    },
  },
  methods: {
    remove(index) {
      this.option.synonyms.splice(index, 1);
      this.$emit("updated");
    },
    novaVariacao() {
      this.option.synonyms.push(this.newValue);
      this.newValue = "";
      this.$emit("updated");
    },
    editName() {
      this.editingName = !this.editingName;
    },
  },
  watch: {
    watchKey: {
      handler() {
        this.$forceUpdate();
      },
    },
    duplicatedSynonyms: {
      handler() {
        this.$forceUpdate();
      },
    },
  },
  props: {
    option: Object,
    locked: Boolean,
    watchKey: Boolean,
    duplicatedSynonyms: Array,
  },
};
</script>
<style lang="scss" scoped>
.option-input-form {
  margin: 8px;
  background: #eee;
  border-radius: 8px;
  .subheader-error {
    color: red;
    font-size: 14px;
    font-weight: 100;
  }
  > .header {
    height: 30px;
    line-height: 30px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > .title {
      font-size: 14px;
      font-weight: bold;
      text-transform: lowercase;
    }
    input {
      cursor: text;
      text-transform: lowercase;
    }
    > .header-btn {
      color: #555555;
      margin-left: 16px;
      margin-right: 16px;
      cursor: pointer;
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
      text-transform: lowercase;
    }
  }
}
</style>
