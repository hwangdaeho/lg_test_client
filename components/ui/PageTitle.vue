<template>
  <b-container class="px-0" style="transition: none">
    <b-row class="markup-page-title mx-0">
      <b-col cols="auto">
        <b-row>
          <b-col cols="auto">
            <h2 class="fs-24 font-weight-bold">
              {{ title }}
            </h2>
          </b-col>
          <b-col v-if="isCollapsable" cols="auto" class="p-0">
            <div class="collapse-btns">
              <b-button
                v-b-tooltip.hover.bottomright="'기본 정보 닫기'"
                variant="transparent"
                class="btn cursor-pointer"
                @click="$emit('collapse')"
              >
                <b-icon-arrow-bar-up />
              </b-button>
            </div>
          </b-col>
        </b-row>
        <b-row class="mx-auto mt-2">
          <ul v-if="useBreadcrumb" class="custom-breadcrumb mb-2">
            <li v-for="(crumb, index) in breadcrumb" :key="index" :class="{ 'disabled': crumb.disabled }">
              <NuxtLink v-if="!crumb.disabled" :to="crumb.url">
                {{ crumb.label }}
              </NuxtLink>
              <span v-else>{{ crumb.label }}</span>
            </li>
          </ul>
        </b-row>
      </b-col>
      <b-col cols="auto" class="text-right ml-auto px-4" align-self="center">
        <slot name="buttons" />
        <!--            <b-button class="labeling-btn" to="/train/processing/add">-->
        <!--                <img-->
        <!--                    src="~/assets/img/train/processing/label-add-icon.svg"-->
        <!--                    alt="">-->
        <!--                <span class="fs-18 font-weight-semibold ml-1">데이터 Labeling</span>-->
        <!--            </b-button>-->
        <!--            <b-button disabled class="process-btn fs-18 font-weight-semibold">데이터 가공-->
        <!--            </b-button>-->
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: 'UiPageTitle',
  props: {
    title: {
      type: String,
      required: true
    },
    breadcrumb: {
      type: Array,
      required: true
    },
    useBreadcrumb: {
      type: Boolean,
      required: false,
      default: true
    },
    isCollapsable: {
      type: Boolean,
      default: false
    }
  }
}
</script>
