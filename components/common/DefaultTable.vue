<template>
  <b-row class="w-100">
    <b-col cols="12" class="pb-2">
      <b-row align-v="center">
        <b-col cols="auto">
          <span class="font-weight-bold">
            {{ title }} ({{ totalRows }})
          </span>
        </b-col>
        <b-col class="text-right">
          <slot name="btns" />
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="12">
      <b-table
        :items="items"
        :fields="fields"
        show-empty
        small
        :busy="isLoading"
        @row-clicked="onClickRow"
      >
        <template #table-busy>
          <div class="text-center text-danger my-5 py-3">
            <b-spinner variant="primary" class="align-middle" />
            <span class="ml-3">데이터를 불러오고 있습니다.</span>
          </div>
        </template>
        <template #empty>
          <PageNoResult />
        </template>
        <template #cell()="data">
          <template v-if="data.field.prepend">
            {{ data.field.prepend }}
          </template>
          <template v-if="data.field.numberFormat">
            {{ formatNumber(data.value) }}
          </template>
          <template v-else>
            {{ data.value }}
          </template>
          <template v-if="data.field.append">
            {{ data.field.append }}
          </template>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      require: true,
      default () {
        return []
      }
    },
    fields: {
      type: Array,
      require: true,
      default () {
        return []
      }
    },
    isLoading: {
      type: Boolean,
      require: true,
      default: false
    },
    totalRows: {
      type: Number,
      require: true,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    formatNumber (number) {
      return number.toLocaleString('ko-KR')
    },
    onClickRow (row) {
      console.log('onClickRow', row)
      this.$emit('row-click', row)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
