<template>
  <b-table-simple :fixed="fixed" class="info-field-table">
    <colgroup><col><col><col><col><col><col><col><col></colgroup>
    <b-tbody>
      <b-tr v-for="(fields, idx) in infoFields" :key="`info-row-${idx}`">
        <template v-for="(field, fieldIdx) in fields">
          <b-th
            :key="`info-field-${fieldIdx}`"
            :colspan="field.field_colspan ? field.field_colspan : 1"
            :rowspan="field.field_rowspan ? field.field_rowspan : 1"
          >
            {{ field.text }}
            <slot :name="`th-${field.key}`" />
          </b-th>
          <b-td
            :key="`info-value-${fieldIdx}`"
            :colspan="field.val_colspan ? field.val_colspan : 1"
            :rowspan="field.val_rowspan ? field.val_rowspan : 1"
            :class="bodyTdClass"
            :style="{padding:field.type === 'text-editor'?0:'auto'}"
          >
            <template v-if="field.invisible" />
            <template v-else-if="field.type">
              <b-input-group size="lg" :prepend="field.prepend" :append="field.append">
                <b-form-input
                  v-if="field.type === 'text'"
                  v-model="values[field.key]"
                  type="text"
                  :class="field.class"
                  :maxlength="field.maxLength"
                  :placeholder="field.text"
                  @input="updateValues(field.key,$event)"
                />
                <b-form-input v-else-if="field.type === 'number'" v-model="values[field.key]" type="number" :class="field.class" @input="updateValues(field.key,$event)" />
                <b-form-select v-else-if="field.type === 'select'" v-model="values[field.key]" :options="field.options" :class="field.class" @change="updateValues(field.key,$event)" />
                <b-form-radio-group v-else-if="field.type === 'radio-group'" v-model="values[field.key]" :options="field.options" @change="updateValues(field.key,$event)" />
                <b-form-checkbox-group v-else-if="field.type === 'check-group'" v-model="values[field.key]" :options="field.options" :class="field.class" @input="updateValues(field.key,$event)" />
                <b-form-datepicker v-else-if="field.type === 'datepicker'" v-model="values[field.key]" :placeholder="field.placeholder || '선택'" @input="updateValues(field.key,$event)" />
                <template v-if="field.type === 'term'">
                  <b-form-datepicker v-model="values[field.startKey]" placeholder="시작일" class="col-4" :class="field.class" @input="updateValues(field.key,$event)" />
                  <span class="px-2">{{ ' ~ ' }}</span>
                  <b-form-datepicker v-model="values[field.endKey]" placeholder="종료일" class="col-4" :class="field.class" @input="updateValues(field.key,$event)" />
                </template>
              </b-input-group>
            </template>
            <template v-else-if="values[field.key] && field.key !== 'images'">
              <span v-if="field.prepend" name="prepend">{{ field.prepend }}</span>
              <span v-else-if="field.format === 'formatNumber'">
                {{ formatNumber(values[field.key]) }}
              </span>
              <span v-else :class="field.class">
                {{ values[field.key] }}
              </span>
              <span v-if="field.append" name="append">{{ field.append }}</span>
            </template>
            <slot :name="field.key" />
          </b-td>
        </template>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>
<script>
export default {
  name: 'InfoSimpleTable',
  props: {
    infoFields: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    value: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    bodyTdClass: {
      type: String,
      required: false,
      default: ''
    },
    fixed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update-value'],
  data () {
    return {
      values: {}
    }
  },
  computed: {
    // inputValue: {
    //   get () {
    //     return this.value ?? {}
    //   },
    //   set (val) {
    //     this.$emit('input', val)
    //   }
    // }
  },
  watch: {
    value: {
      deep: true,
      handler () {
        this.initValues()
      }
    }
  },
  mounted () {
    this.initValues()
    // if (this.infoFields) {
    //   this.infoFields.filter((field) => {
    //     return !!field.type
    //   }).forEach((field) => {
    //     // this.inputValue[field.key] = this.value[field.key]
    //   })
    // }
  },
  methods: {
    formatNumber (number) {
      return Number(number).toLocaleString('ko-KR')
    },
    initValues () {
      const newArr = []
      const arr = this.infoFields.slice()
      for (const fields of arr) {
        fields.map((item) => {
          newArr.push(item)
          return item
        })
      }
      for (const field of newArr) {
        this.values[field.key] = this.value[field.key] || null
      }
      this.$forceUpdate()
    },
    updateValues (key, val) {
      const data = {
        key,
        value: val
      }
      console.log('updateValues ', data)
      this.$emit('update-value', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.info-field-table::v-deep {
  &.table tr {
    &:first-child {
      border-top: 1px solid var(--brown-200);
    }
  }
  &.table th {
    font-weight: 600;
    text-align: center;
    //background-color: #ecf0f4;
    background-color: var(--brown-100);
    vertical-align: middle;
    border-top: 1px solid var(--brown-200);
    &:first-child {
      //border-left: 1px solid #dee2e6;
      border-left: 1px solid var(--brown-200);
    }
  }
  &.table td {
    text-align: right;
    padding: 0 0.5rem;
    vertical-align: middle;
  }
  &.table th, &.table td {
    min-width: 12.5%;
    //border-right: 1px solid #dee2e6;
    border-right: 1px solid var(--brown-200);
    //border-bottom: 1px solid #dee2e6;
    border-bottom: 1px solid var(--brown-200);
  }
  &.table tr:last-child th, &.table tr:last-child td {
    //border-bottom: 1px solid #dee2e6;
    border-bottom: 1px solid var(--brown-200);
  }

  .input-group {
    .input-group-prepend, .input-group-append {
      // background-color: #e9ecef;
      background-color: transparent;
      padding: 0.3rem 0.5rem;
      height: 2rem;
      .input-group-text {
        background-color: transparent;
        border: 0;
        padding: 0;
        font-size: 1rem;
      }
    }

    input.form-control {
      padding: 0.3rem;
      height: 2rem;
      font-size: 1rem;
      &:not(:first-child) {
        border-top-left-radius: 0.3rem;
        border-bottom-left-radius: 0.3rem;
      }
      &:not(:last-child) {
        border-top-right-radius: 0.3rem;
        border-bottom-right-radius: 0.3rem;
      }
    }

    .b-form-datepicker {
      //background-color: transparent;
      padding: 0;
      height: 2rem;
      > .btn {
        padding: 0 0.5rem;
        > .b-icon {
          font-size: 100%;
        }
      }
      > .form-control {
        padding: 0.3rem;
        height: auto;
        min-height: unset;
        font-size: 1rem;
      }
    }

    select.custom-select {
      padding: 0.3rem;
      height: 2rem;
      font-size: 1rem;
    }

    .custom-radio, .custom-checkbox {
      font-size: 1rem;
      .custom-control-label::before, .custom-control-label::after {
        top: 0.1125rem;
      }
    }
  }
  .custom-check-group{
    padding-top: 10px;
    .custom-checkbox{
      width: 150px;
      margin-bottom: 10px;
    }
  }
}
</style>
