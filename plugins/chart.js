import Vue from 'vue'

import { Bar, Line, Doughnut } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  LineController,
  BarController
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  LineController,
  BarController,
  ChartDataLabels
)

Vue.component('BarChart', {
  extends: Bar
})
Vue.component('LineChart', {
  extends: Line
})
Vue.component('DoughnutChart', {
  extends: Doughnut
})
