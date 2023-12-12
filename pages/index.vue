<template>
  <b-container class="index-page" fluid>
    <b-row>
      <b-col cols="6" class="main-box py-4">
        <h3 class="mb-3 canvas-title">
          3D Object
        </h3>
        <div class="overflow-hidden canvas-box" style="border-radius: 0.5rem">
          <ModelsObject3D
            :points="points"
            :robot-pos="robotPos"
            @update-points="updatePoints"
            @update-quaternion="updateQuaternion"
          />
        </div>
        <p class="mt-2 pl-2 fs-small text-muted d-flex align-items-center" @contextmenu="false">
          <b-icon icon="info-circle-fill" variant="secondary" class="mr-2" />
          클릭한 위치에 포인트가 생성됩니다.
        </p>
      </b-col>
      <b-col cols="6" class="main-box py-4">
        <div class="d-flex justify-content-between align-items-center ">
          <h3 class=" canvas-title mb-3">
            <b-icon icon="sliders" scale="0.9" />
            Setting
          </h3>
          <div class="d-flex">
            <b-button v-if="!isPlaying" variant="emerald-green" :disabled="points?.length < 1 || quaternions?.length < 1" class="mr-2" @click="setReady">
              <b-icon icon="gear-fill" scale="0.9" /> 준비
            </b-button>
            <b-button v-if="!isPlaying" variant="emerald-green" :disabled="!isReady" class="mr-2" @click="onPlay">
              <b-icon icon="play-fill" /> 동작
            </b-button>
            <b-button v-else variant="dark" class="mr-2" @click="onPause">
              <b-icon icon="stop-fill" /> 정지
            </b-button>
            <b-button variant="primary" :disabled="points?.length < 1" @click="downloadJSON">
              <b-icon icon="download" class="mr-1" scale="0.9" />
              다운로드
            </b-button>
          </div>
        </div>
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
              <div class="d-flex align-items-center flex-nowrap mb-2">
                <span class="group-title">
                  위치
                </span>
                <label :for="`pointX${idx}`">x: </label>
                <b-form-input :id="`pointX${idx}`" v-model="point.x" type="number" class="hide-num-ctrl" />
                <label :for="`pointY${idx}`">y: </label>
                <b-form-input :id="`pointY${idx}`" v-model="point.y" type="number" class="hide-num-ctrl" />
                <label :for="`pointZ${idx}`">z: </label>
                <b-form-input :id="`pointZ${idx}`" v-model="point.z" type="number" class="hide-num-ctrl" />
                <b-form-input v-show="false" type="number" class="hide-num-ctrl" />
                <b-icon icon="x-circle-fill" variant="mid-gray" scale="1.2" class="ml-auto cursor-pointer mr-2" @click="removePoint(idx)" />
              </div>
              <div v-if="quaternions.length>0" class="d-flex align-items-center flex-nowrap">
                <span class="group-title">회전</span>
                <label :for="`rotateX${idx}`">x: </label>
                <b-form-input
                  v-if="quaternions[idx]?.x"
                  :id="`rotateX${idx}`"
                  v-model="quaternions[idx].x"
                  disabled
                  type="number"
                  class="hide-num-ctrl"
                />
                <label :for="`rotateY${idx}`">y: </label>
                <b-form-input
                  v-if="quaternions[idx]?.y"
                  :id="`rotateY${idx}`"
                  v-model="quaternions[idx].y"
                  disabled
                  type="number"
                  class="hide-num-ctrl"
                />
                <label :for="`rotateZ${idx}`">z: </label>
                <b-form-input
                  v-if="quaternions[idx]?.z"
                  :id="`rotateZ${idx}`"
                  v-model="quaternions[idx].z"
                  disabled
                  type="number"
                  class="hide-num-ctrl"
                />
                <label :for="`rotateW${idx}`">w: </label>
                <b-form-input
                  v-if="quaternions[idx]?.w"
                  :id="`rotateW${idx}`"
                  v-model="quaternions[idx].w"
                  disabled
                  type="number"
                  class="hide-num-ctrl"
                />
                <b-icon
                  v-show="false"
                  icon="x-circle-fill"
                  variant="mid-gray"
                  scale="1.2"
                  class="ml-auto cursor-pointer mr-2"
                  @click="removePoint(idx)"
                />
              </div>
              <!--              <div v-if="rotations.length>0" class="d-flex align-items-center flex-nowrap">-->
              <!--                <span class="group-title">회전</span>-->
              <!--                <label :for="`rotateX${idx}`">x: </label>-->
              <!--                <b-form-input-->
              <!--                  v-if="rotations[idx]?.x"-->
              <!--                  :id="`rotateX${idx}`"-->
              <!--                  v-model="rotations[idx].x"-->
              <!--                  disabled-->
              <!--                  type="number"-->
              <!--                  class="hide-num-ctrl"-->
              <!--                />-->
              <!--                <label :for="`rotateY${idx}`">y: </label>-->
              <!--                <b-form-input-->
              <!--                  v-if="rotations[idx]?.y"-->
              <!--                  :id="`rotateY${idx}`"-->
              <!--                  v-model="rotations[idx].y"-->
              <!--                  disabled-->
              <!--                  type="number"-->
              <!--                  class="hide-num-ctrl"-->
              <!--                />-->
              <!--                <label :for="`rotateZ${idx}`">z: </label>-->
              <!--                <b-form-input-->
              <!--                  v-if="rotations[idx]?.z"-->
              <!--                  :id="`rotateZ${idx}`"-->
              <!--                  v-model="rotations[idx].z"-->
              <!--                  disabled-->
              <!--                  type="number"-->
              <!--                  class="hide-num-ctrl"-->
              <!--                />-->
              <!--              </div>-->
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
  beforeRouteLeave (to, from, next) {
    if (this.isPlaying) {
      // this.socket.off('get_pose')
      // this.getPoseIntervalFunc = null
    }
    next()
  },
  data () {
    return {
      pauseModalStatus: false, // 정지 후 외부장치 조정 모달
      points: [],
      rotations: [],
      quaternions: [],
      isClient: process.client,
      getPoseIntervalFunc: null,
      isReady: false,
      isPlaying: false,
      robotPos: {},
      socket: null
    }
  },
  computed: {
  },
  watch: {
    isPlaying (val) {
      if (val) {
        // const requestData = () => {
        //   this.socket.emit('get_pose', { message: 'Please send data' })
        // }
        // this.getPoseIntervalFunc = setInterval(requestData, 100)
        // this.socket.on('get_pose', (data) => {
        //   console.log('get_pose :: ', data.data)
        //   // this.robotPos = data.data
        // })
      } else {
        this.getPoseIntervalFunc = null
        // this.socket.off('get_pose')
      }
    }
  },
  mounted () {
    const canvasEl = document.body.querySelector('.canvas-box')
    const canvasElInfo = canvasEl.getBoundingClientRect()
    const pointsEl = document.body.querySelector('.points-container')
    pointsEl.style.maxHeight = canvasElInfo ? `${canvasElInfo.height}px` : '500px'
    if (window && !this.socket) {
      this.socket = this.$nuxtSocket({
        name: 'main',
        channel: '/'
        // emitTimeout: 500
      })
      this.socket.on('connect', () => {
        console.log('소켓 연결 성공')
      })
      this.socket.on('disconnect', () => {
        console.log('소켓 연결이 끊어짐')
      })
      this.socket.on('error', (error) => {
        console.error('소켓 에러:', error)
      })
    }
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
    updatePoints (val) {
      this.points.push(val)
    },
    removePoint (idx) {
      this.points.splice(idx, 1)
    },
    updateRotation (val) {
      this.rotations = val || []
    },
    updateQuaternion (val) {
      this.quaternions = val || []
    },
    setReady () {
      const poses = this.points.map((point, idx) => {
        return [
          point.x, point.y, point.z,
          this.quaternions[idx].x, this.quaternions[idx].y, this.quaternions[idx].z, this.quaternions[idx].w]
      })
      console.log('poses ::: ', poses)
      this.socket.emit('set_motion_plan_goals', { poses })
      this.socket.on('set_motion_plan_goals', (data) => {
        console.log('set_motion_plan_goals :: ', data.data)
        this.isReady = data.data
        this.socket.off('set_motion_plan_goals')
      })
    },
    onPlay () {
      // 동작 시뮬레이션
      this.isPlaying = true
      this.socket.emit('motion_execute', { message: '' })
    },
    onPause () {
      this.isPlaying = false
    },
    downloadJSON () {
      if (this.quaternions?.length < 1) {
        alert('다운로드 중 문제가 발생하였습니다.')
        return
      }
      // JSON 파일 생성
      const data = this.points.map((point, idx) => {
        return {
          x: point.x,
          y: point.Y,
          z: point.Z,
          qx: this.quaternions[idx].x,
          qy: this.quaternions[idx].y,
          qz: this.quaternions[idx].z,
          qw: this.quaternions[idx].w
        }
      })
      const jsonString = JSON.stringify(data)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(blob)
      // 파일명 지정
      const date = new Date()
      const now = this.$moment(date).format('YYYYMMDDHHmmss')
      downloadLink.download = `process_${now}.json`
      downloadLink.textContent = 'Download JSON'

      document.body.appendChild(downloadLink)
      downloadLink.click()
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
      //flex-wrap: nowrap;
      //align-items: center;
      flex-direction: column;
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
      .group-title{
        font-size: 0.875rem;
        color: #333;
        font-weight: 700;
        margin-left: 0.5rem;
        margin-top: 0.18rem;
        white-space: nowrap;
      }
      label{
        margin: 0 0.5rem 0 0.75rem;
        &:first-of-type{
          margin: 0 0.5rem 0 0.5rem;
        }
      }
      .form-control{
        max-width: 15%;
      }
    }
  }
}
.btn-emerald-green:not(:disabled):not(.disabled):active, .btn-emerald-green:not(:disabled):not(.disabled).active, .show > .btn-emerald-green.dropdown-toggle{
  background-color: var(--emerald-green);
  border-color: var(--emerald-green);
}
.btn-emerald-green:not(:disabled):not(.disabled):active:focus, .btn-emerald-green:focus{
  background-color: var(--emerald-green);
  box-shadow: none;
  border-color: var(--emerald-green);
}
</style>
