<template>
  <div class="d-flex align-items-center" :class="elClass">
    <b-form-datepicker
      v-model="dateValue"
      :placeholder="placeholder"
      style="width: 150px"
      :date-format-options="{
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }"
      class="mr-2"
      :disabled="disabled"
      @input="updateVal"
    />
    <b-form-select
      v-model="hoursValue"
      :options="hours"
      style="width: 100px"
      class="mr-2"
      :disabled="disabled"
      @change="updateVal"
    />
    <b-form-select
      v-model="minutesValue"
      :options="minutes"
      style="width: 100px"
      :disabled="disabled"
      @change="updateVal"
    />
  </div>
</template>

<script>
export default {
  name: 'UiCustomDatePicker',
  props: {
    placeholder: { type: String, required: false, default: '날짜 선택' },
    elClass: { type: String, required: false, default: '' },
    value: { type: String, required: false, default: '' },
    disabled: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      hours: [],
      minutes: [],
      dateValue: '00',
      hoursValue: '00',
      minutesValue: '00'
    }
  },
  created () {
    for (let i = 0; i < 24; i++) {
      this.hours.push({
        value: i < 10 ? `0${i}` : `${i}`,
        text: i < 10 ? `0${i}시` : `${i}시`
      })
    }
    for (let i = 0; i < 60; i++) {
      this.minutes.push({
        value: i < 10 ? `0${i}` : `${i}`,
        text: i < 10 ? `0${i}분` : `${i}분`
      })
    }
  },
  mounted () {
    if (this.value) {
      const date = this.value.split(' ')[0]
      const time = this.value.split(' ')[1]
      this.dateValue = date
      this.hoursValue = time.split(':')[0]
      this.minutesValue = time.split(':')[1]
    }
  },
  methods: {
    updateVal () {
      const time = `${this.dateValue} ${this.hoursValue}:${this.minutesValue}`
      this.$emit('update', time)
    }
  }
}
</script>
