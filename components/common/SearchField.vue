<template>
  <b-container fluid class="py-3">
    <b-row v-if="!isLoading" align-v="center" class="search-field" :class="hideSearchButton?'select-mode':'search-mode'">
      <b-col>
        <b-row v-for="(field, idx) in fields" :key="`search-field-${idx}`" align-v="center" class="prepend">
          <b-col cols="auto" class="title py-2" style="min-width: 89px">
            {{ field.title }}
          </b-col>
          <b-col v-if="field.type === 'term'">
            <b-input-group>
              <b-form-datepicker v-model="values[field.key.startKey]" placeholder="시작일" class="col-4" @input="updateOptions" />
              <span class="px-2">{{ ' ~ ' }}</span>
              <b-form-datepicker v-model="values[field.key.endKey]" placeholder="종료일" class="col-4" @input="updateOptions" />
            </b-input-group>
          </b-col>
          <b-col v-else-if="field.type === 'check-group'">
            <b-form-checkbox-group
              v-model="values[field.key]"
              :options="field.options"
              @change="updateOptions"
            />
          </b-col>
          <b-col v-else-if="field.type === 'radio-group'">
            <b-form-radio-group
              v-model="values[field.key]"
              :options="field.options"
              @change="updateOptions"
            />
          </b-col>
          <b-col v-else-if="field.type === 'select'">
            <b-form-select v-model="values[field.key]" :options="field.options" :class="field.class" />
          </b-col>
          <b-col v-else>
            <b-input-group>
              <b-form-input v-model="values[field.key]" />
            </b-input-group>
          </b-col>
        </b-row>
      </b-col>
      <b-col v-if="!hideSearchButton" cols="auto">
        <b-button variant="primary" class="btn-search" @click="onClickSearch">
          검색
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: 'CommonSearchField',
  props: {
    fields: {
      type: Array,
      require: true,
      default () {
        return []
      }
    },
    hideSearchButton: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      values: {},
      isLoading: true
    }
  },
  watch: {
    fields: {
      deep: true,
      handler () {
        // fields changed ==> reset values
        this.initValues()
      }
    }
  },
  mounted () {
    this.initValues()
  },
  methods: {
    initValues () {
      for (const field of this.fields) {
        if (field.type === 'term') {
          this.values[field.key.startKey] = null
          this.values[field.key.endKey] = null
        } else if (field.value) {
          this.values[field.key] = field.value
        } else {
          this.values[field.key] = null
        }
      }
      this.isLoading = false
    },
    onClickSearch () {
      console.log('onClickSearch', this.values)
      this.$emit('search', this.values)
    },
    updateOptions (val) {
      console.log('updateOptions', this.values)
      this.$emit('update-options', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-search::v-deep {
    width: 7rem;
}
.search-field {
  padding: 0;
  &.select-mode{
    .prepend{
      border: 1px solid #cdcdcdcd;
      display: inline-flex;
      .title{
        background-color: var(--brown-100);
        border-right: 1px solid #cdcdcdcd
      }
    }
  }
  &.search-mode {
    background-color: var(--brown-100);
    padding: 1rem 0;
    .prepend{
      border: none;
      display: flex;
    }
  }
}
</style>
