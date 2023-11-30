<template>
  <b-row>
    <b-col>
      <b-pagination
        v-model="currentPage"
        :per-page="perPage"
        :total-rows="totalRows"
        :aria-controls="ariaControls"
        :limit="limit ? limit : 10"
        class="lg-pagination"
        align="center"
        hide-ellipsis
        @page-click="onClickPage"
      >
        <template #first-text>
          <span class="page-prev">
            <b-icon icon="chevron-double-left" :scale="iconScale" />
          </span>
        </template>
        <template #prev-text>
          <span class="page-prev">
            <b-icon icon="chevron-left" :scale="iconScale" />
            <!--            <img src="@/assets/icons/shape/chevron_prev.svg" alt="prev">-->
          </span>
        </template>
        <template #page="{ page: pageNum, active }">
          <span :class="{'font-weight-bold': active}">
            {{ pageNum }}
          </span>
        </template>
        <template #next-text>
          <span class="page-next ">
            <b-icon icon="chevron-right" :scale="iconScale" />
            <!--            <img src="@/assets/icons/shape/chevron_next.svg" alt="next">-->
          </span>
        </template>
        <template #last-text>
          <span class="page-next ">
            <b-icon icon="chevron-double-right" :scale="iconScale" />
          </span>
        </template>
      </b-pagination>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'UiPagination',
  props: {
    perPage: {
      type: Number,
      required: false,
      default: 20
    },
    totalRows: {
      type: Number,
      required: true
    },
    ariaControls: {
      type: String,
      required: false,
      default: ''
    },
    page: {
      type: Number,
      required: false,
      default: 1
    },
    limit: {
      type: Number,
      required: false,
      default: 10
    },
    stayLastPage: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      currentPage: 1,
      iconScale: '0.8',
      wasLastPage: false
    }
  },
  computed: {
    lastPage () {
      return Math.ceil(this.totalRows / this.perPage)
    }
  },
  watch: {
    page (val) {
      this.currentPage = val
    },
    currentPage (val) {
      if (this.wasLastPage && this.currentPage === 1) {
        this.currentPage = this.lastPage
      }
      this.$emit('change-page', this.currentPage)
    }
  },
  mounted () {
    if (this.page && this.page !== 1) {
      this.currentPage = this.page
    }
  },
  methods: {
    resetCurrentPage () {
      this.wasLastPage = null
      this.currentPage = 1
    },
    onClickPage (event, page) {
      this.wasLastPage =
        event.important || (this.stayLastPage && this.lastPage === page)
    }
  }
}
</script>
