import Vue from 'vue'

const CustomDateFormatting = {
  install (Vue, options) {
    Vue.prototype.dateFormatting = (value, delimiter) => {
      function leftPad (value) {
        if (value >= 10) {
          return value
        }

        return `0${value}`
      }
      if (value) {
        if (delimiter.toLowerCase() === 'yymmdd') {
          const year = value.getFullYear()
          const month = leftPad(value.getMonth() + 1)
          const day = leftPad(value.getDate())

          return [year, month, day].join('-')
        } else {
          const date = value.split('T')[0]
          const year = date.split('-')[0]
          const month = date.split('-')[1]
          const day = date.split('-')[2]

          return [year, month, day].join(delimiter)
        }
      } else {
        return '-'
      }
    }
  }
}
export { CustomDateFormatting }

Vue.use(CustomDateFormatting)
