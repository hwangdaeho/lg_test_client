import Vue from 'vue'
import VCalendar from 'v-calendar'
import Calendar from 'v-calendar/lib/components/calendar.umd'
Vue.use(VCalendar, {
  componentPrefix: 'vc'
})

Vue.component('VCalender', Calendar)
