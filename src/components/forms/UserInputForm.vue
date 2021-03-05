<template>
  <div class="form-control">
    <div class="header">
      <font-awesome-icon icon="times" @click="$emit('onClose')" />
      <div class="title">Edição de Entrada de Usuário</div>
      <div class="flex-filler"></div>
      <div class="btn" @click="removeBlock">Excluir bloco</div>
    </div>
    <div class="content">
      <div class="row-between">
        <div class="btn-add-content" @click="addIntent">Inserir a partir de</div>
        <select class="intent-selector" v-model="selectedIntentOption">
          <option value="null">Nova Intenção</option>
          <option
            v-for="(option, index) in avaliableIntents"
            :key="option.id"
            :value="index"
            :disabled="!option.avaliableToClone"
          >
            Clonar: "{{ option.name }}"
          </option>
        </select>
      </div>
      <template v-if="block.outputs.length">
        <OptionInputForm
          v-for="option in outputs"
          :key="option.temp_uuid"
          :option="option"
          @remove="remove"
          @updated="checkForm"
          :watchKey="option.duplicated"
          :duplicatedSynonyms="option.duplicatedSynonyms"
          :locked="false"
        />
      </template>
      <template v-else>
        <div class="subheader-empty">Sem tratamento de intenção</div>
      </template>
      <div class="form-fallback">
        <MultipleTextEditor :texts="block.fallback" />
      </div>
      <div class="form-fallback">
        <EventAnalyticsForm :analytics="block.analytics" />
      </div>
    </div>
  </div>
</template>
<script>
import OptionInputForm from "./forms_fields/OptionInputForm.vue";
import MultipleTextEditor from "@/components/MultipleTextEditor.vue";
import EventAnalyticsForm from "./EventAnalyticsForm.vue";

export default {
  props: {
    block: Object,
  },
  components: {
    OptionInputForm,
    MultipleTextEditor,
    EventAnalyticsForm,
  },
  data: () => ({
    selectedIntentOption: "null",
    avaliableIntents: Array,
  }),
  computed: {
    outputs() {
      return this.block.outputs;
    },
  },
  mounted() {
    this.avaliableIntents = [
      {
        name: "sim",
        synonyms: [
          "Sim",
          "Claro que sim",
          "Acho que sim",
          "Acredito que sim",
          "Espero que sim",
        ],
      },
      {
        name: "não",
        synonyms: [
          "Não",
          "Claro que não",
          "Acho que não",
          "Acredito que não",
          "Espero que não",
        ],
      },
      {
        name: "talvez",
        synonyms: ["Talvez"],
      },
    ];
    this.checkForm();
  },
  methods: {
    checkForm() {
      this.avaliableIntents.forEach((d) => {
        d.id = d.id || this.$uuid.v1();
        d.avaliableToClone = this.block.outputs.findIndex((o) => o.name == d.name) == -1;
      });
      this.avaliableIntents.sort((a, b) =>
        a.avaliableToClone < b.avaliableToClone ? 1 : -1
      );

      this.block.outputs.forEach((o) => {
        if (!o.temp_uuid) {
          o.temp_uuid = this.$uuid.v1();
        }
        o.duplicated =
          this.block.outputs.findIndex((d) => o !== d && o.name.toLowerCase() == d.name.toLowerCase()) != -1;
        const allsynonyms = this.block.outputs.flatMap((d) =>
          o !== d ? d.synonyms : []
        );
        o.duplicatedSynonyms = o.synonyms.map((s) => allsynonyms.findIndex((b) => b.toLowerCase() === s.toLowerCase()) != -1);
      });
    },
    removeBlock() {
      this.$eventBus.emit("remove_block", this.block);
      this.$emit("onClose");
    },
    addIntent() {
      if (this.selectedIntentOption === "null") {
        const name = "Opção " + parseInt(Math.random() * 10000);
        this.$eventBus.emit("add_redirect", this.block, {
          name: name,
          synonyms: [name],
          redirect: null,
        });
      } else {
        const option = this.avaliableIntents[this.selectedIntentOption];
        this.$eventBus.emit("add_redirect", this.block, {
          name: option.name,
          synonyms: option.synonyms,
          redirect: null,
        });
      }
      this.selectedIntentOption = "null";
      this.checkForm();
    },
    remove(option) {
      const index = this.block.outputs.indexOf(option);
      this.$eventBus.emit("remove_endpoint", this.block, index);
      this.checkForm();
    },
  },
};
</script>
<style lang="scss">
.intent-selector {
  min-width: 40%;
  min-height: 30px;
}
</style>
