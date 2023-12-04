<template>
  <b-container class="index-page" fluid>
    <b-row>
      <b-col cols="6" class="main-box py-4">
        <h3 class="mb-3 canvas-title">
          3D Object
        </h3>
        <div class="overflow-hidden canvas-box" style="border-radius: 0.5rem">
          <ModelsObject3D :points="points" @update-points="updatePoints" />
        </div>
        <p class="mt-2 pl-2 fs-small text-muted d-flex align-items-center" @contextmenu="false">
          <b-icon icon="info-circle-fill" variant="secondary" class="mr-2" />
          클릭한 위치에 포인트가 생성됩니다.
        </p>
      </b-col>
      <b-col cols="6" class="main-box py-4">
        <h3 class="mb-3 canvas-title">
          <b-icon icon="sliders" scale="0.9" />
          Setting
        </h3>
        <div class="points-container">
          <template v-if="points.length>0">
            <b-form-group
              v-for="(point, idx) in points"
              :key="`point-${idx}`"
              class="point-input-group"
            >
              <div class="title">
                <b-icon icon="circle-fill" variant="emerald-green" scale="0.7" shift-v="-0.5" /> {{ point.title }}
              </div>
              <label :for="`pointX${idx}`">x: </label>
              <b-form-input :id="`pointX${idx}`" v-model="point.x" type="number" class="hide-num-ctrl" />
              <label :for="`pointY${idx}`">y: </label>
              <b-form-input :id="`pointY${idx}`" v-model="point.y" type="number" class="hide-num-ctrl" />
              <label :for="`pointZ${idx}`">z: </label>
              <b-form-input :id="`pointZ${idx}`" v-model="point.z" type="number" class="hide-num-ctrl" />
              <b-icon icon="x-circle-fill" variant="mid-gray" scale="1.2" class="ml-auto cursor-pointer mr-2" @click="removePoint(idx)" />
            </b-form-group>
          </template>
          <template v-else>
            <p class="fs-default text-muted px-3 py-2" style="font-weight: 500">
              화면의 물체를 클릭하여 포인트를 생성해주세요.
            </p>
          </template>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      pauseModalStatus: false, // 정지 후 외부장치 조정 모달
      points: [],
      isClient: process.client
    }
  },
  computed: {
  },
  watch: {},
  mounted () {
    const el = document.body.querySelector('.canvas-box')
    const elInfo = el.getBoundingClientRect()
    const el2 = document.body.querySelector('.points-container')
    el2.style.maxHeight = elInfo ? `${elInfo.height}px` : '500px'
  },
  methods: {
    async getList () {
      this.isLoading = true
      try {
        const { status, data: { data } } = await this.$axios.get('/temp/list')
        if (status === 200) {
          // 데이터 처리
          this.items = data
        }
      } catch (error) {
        console.log('error = ', error)
        alert(error)
      } finally {
        // 로딩 완료
        this.isLoading = false
      }
    },
    calcMaxHeight () {
      const el = document.body.querySelector('.canvas-box')
      const elInfo = el.getBoundingClientRect()
      return elInfo.height
    },
    updatePoints (val) {
      this.points.push(val)
    },
    removePoint (idx) {
      this.points.splice(idx, 1)
    }
  }
}
</script>
<style lang="scss">
.main-box{
  //background-color: #efefef;
  //border-radius: 0.5rem;
  height: fit-content;
}
.canvas-box{
  height: fit-content;
}
.points-container{
  overflow-y: auto;
  height: 100%;
  padding: 0.5rem;
  background-color: rgba(220,220,220,0.2);
  border-radius: 0.5rem;
  border: 1px solid  #dedede;
  // scrollbar style
  //  ::-webkit-scrollbar : 스크롤바 전체
  //  ::-webkit-scrollbar-thumb:드래그 가능한 스크롤 핸들 막대
  //  ::-webkit-scrollbar-track:스크롤바 트랙 (스크롤이 움직이는 영역 / 스크롤 진행률 표시줄)
  //  ::-webkit-scrollbar-button: 스크롤바의 방향 버튼 (= 위/아래 표시 화살표)
  //  ::-webkit-scrollbar-track-piece : 스크롤 진행률 표시줄에서 스크롤 핸들 막대 부분을 제외한 남은 빈 공간
  //  ::-webkit-scrollbar-corner :수평/수직 스크롤 막대가 만나는 스크롤 막대의 하단 모서리
  //  ::-webkit-resizer : 요소의 하단 모서리에 나타나는 크기 조정 핸들
  ::-webkit-scrollbar-track{
    background: transparent;
    border: none;
  }
  .point-input-group{
    border-radius: 0.5rem;
    //background-color: #f6f6f6;
    background-color: #fff;
    border: 1px solid #EFEFEF;
    box-shadow: 1px 1px 1px 1px rgba(220,220,220,0.5);
    padding: 0.5rem;
    margin-bottom: 2rem;
    position: relative;
    &:first-of-type{
      margin-top: 1.5rem;
    }
    &:last-of-type{
      margin-bottom: 0.5rem;
    }
    &>div{
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      .title{
        font-size: 0.750rem;
        font-weight: 600;
        margin-right: 0.5rem;
        color: #333;
        position: absolute;
        left: 0.5rem;
        top: -1.5rem;
        background-color: #fff;
        padding: 0.25rem 0.625rem 0 0.625rem;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border: 1px solid #EFEFEF;
        border-bottom-color: #fff;
        border-collapse: collapse;
      }
      label{
        margin: 0 0.5rem 0 1rem;
      }
      .form-control{
        max-width: 20%;
      }
    }
  }
}
</style>
