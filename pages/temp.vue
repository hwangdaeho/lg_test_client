<template>
  <div
    id="canvas-container"
    class="canvas-container d-block w-100 h-100 position-relative"
  >
    <div v-if="useBox" class="box-icon cursor-pointer" @click="createBoxModalStatus = true">
      <!--      <img-->
      <!--          src="@/assets/icons/shape/box_add.svg"-->
      <!--          alt="box"-->
      <!--      >-->
    </div>
    <div
      v-if="useBox"
      id="trashCan"
      class="trash-icon cursor-pointer"
      :class="{'temp-invisible': isInvisible}"
    >
      <!--      <img-->
      <!--          src="@/assets/icons/shape/trash_white.svg"-->
      <!--          alt="trash"-->
      <!--      >-->
    </div>
    <div
      v-if="isRotateMode"
      id="slider-container"
      class="position-absolute"
      :style="{
        left: `${rotateCtrlX}px`,
        top: `${rotateCtrlY}px`
      }"
    >
      <vue-slider
        v-model="cubeRotateVal"
        :min="0"
        :max="3.14"
        :interval="0.1"
        :height="6"
        :width="100"
        class="cube-slider"
        tooltip="none"
        process-class="bg-primary"
        @callback="onSliderChange"
        @drag-end="isRotateMode=false;rotationCube = null"
      />
    </div>
    <div
      v-if="isRotateMode"
      ref="cubePosBox"
      class="cube-pos-box"
      :style="{
        left: `${rotateCtrlX}px`,
        top: `${rotateCtrlY + 30}px`
      }"
    >
      <b-row>
        <b-col cols="3" class="cube-pos-title">
          x:
        </b-col>
        <b-col class="cube-pos-input">
          <b-form-input
            v-model="cubePosition.x"
            type="number"
            :autofocus="false"
            placeholder="x좌표"
            @input="updateCubePos"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3" class="cube-pos-title">
          y:
        </b-col>
        <b-col class="cube-pos-input">
          <b-form-input v-model="cubePosition.y" type="number" :autofocus="false" placeholder="y좌표" @input="updateCubePos" />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3" class="cube-pos-title">
          z:
        </b-col>
        <b-col class="cube-pos-input">
          <b-form-input v-model="cubePosition.z" type="number" :autofocus="false" placeholder="z좌표" @input="updateCubePos" />
        </b-col>
      </b-row>
    </div>
    <ModalCreateBox
      :modal-state="createBoxModalStatus"
      @close="createBoxModalStatus = false"
      @ok="createBox"
    />
  </div>
</template>
<script type="module">
import {
  Scene,
  WebGLRenderer,
  OrthographicCamera,
  Color,
  DirectionalLight,
  PlaneGeometry,
  Mesh,
  Vector2,
  GridHelper,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  BoxGeometry,
  Quaternion,
  Box3,
  Vector3,
  Raycaster
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

let el, elInfo, camera, scene, renderer, gltfModel, sphere, baseModelHeight, baseModel

function onResize () {
  el = document.getElementById('canvas-container')
  elInfo = el.getBoundingClientRect()
  renderer.setSize(elInfo.width, elInfo.height)
  renderer.setPixelRatio(window.devicePixelRatio)
  camera.updateProjectionMatrix()
}

function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

export default {
  name: 'ModelsGltfTest',
  props: {
    onLoad: {
      type: Boolean,
      required: false,
      default: false
    },
    modelInfo: {
      type: Object,
      required: false,
      default: () => {}
    },
    useBall: {
      type: Boolean,
      required: false,
      default: false
    },
    useBox: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function () {
    return {
      cameraControls: null,
      dragControls: null,
      newPosition: { pose: null },
      quaternion: [0, 0, 0, 1],
      createBoxModalStatus: false,
      cubes: [], // 생성가능 cube 수 카운트용
      selectedCube: null, // 삭제될 cube
      isInvisible: false, // 휴지통 클래스 전환
      isRotateMode: false, // cube 회전 모드
      cubeRotateVal: 0, // cube 회전각
      rotationCube: null, // 회전 대상 cube,
      rotateCtrlX: 0,
      rotateCtrlY: 0,
      ballPosition: null,
      cubePosition: {
        x: null,
        y: null,
        z: null
      },
      baseChangeInfo: []
    }
  },
  watch: {
    onLoad (val) {
      if (val) {
        onResize()
      }
    },
    modelInfo: {
      deep: true,
      handler (val) {
        this.updatePosition()
      }
    },
    rotationCube (val) {
      if (val) {
        this.cubePosition.x = val.position.x
        this.cubePosition.y = val.position.y
        this.cubePosition.z = val.position.z
      } else {
        this.cubePosition.x = null
        this.cubePosition.y = null
        this.cubePosition.z = null
      }
    }
  },
  mounted: function () {
    // 렌더링 할 위치
    scene = new Scene()
    scene.background = new Color('#222222')
    renderer = new WebGLRenderer({ antialias: true })
    el = document.getElementById('canvas-container')
    elInfo = el.getBoundingClientRect()
    el.appendChild(renderer.domElement)

    // 카메라
    camera = new OrthographicCamera(elInfo.width / -2, elInfo.width / 2, elInfo.height / 2, elInfo.height / -2, 0.1, 500)
    // camera.lookAt(scene.position)
    // camera.position.set(0, 2, 3)
    camera.position.set(-2, 2, 2)
    camera.lookAt(scene.position)
    // camera.up.set(0, -1, 0)
    camera.zoom = 100
    camera.aspect = elInfo.width / elInfo.height
    camera.updateProjectionMatrix()
    // 그림자
    renderer.shadowMap.enabled = true
    // 조명
    const color = 0xFFFFFF
    const intensity = 5
    const light = new DirectionalLight(color, intensity)
    light.position.set(0, 90, 45)
    // light.target.position.set(0, 0, 0)
    light.castShadow = true
    light.shadow.mapSize = new Vector2(500, 500) // 그림자 해상도 조절
    scene.add(light)
    // scene.add(light.target)
    // Plane 바닥
    const ground = new PlaneGeometry(200, 200)
    ground.rotateX(-Math.PI / 2)
    const plane = new Mesh(ground, new MeshBasicMaterial({ visible: false }))
    plane.receiveShadow = true
    scene.add(plane)
    // grid
    const gridHelper = new GridHelper(10, 20)
    plane.add(gridHelper)
    // ball
    const geometry = new SphereGeometry(10)
    const material = new MeshBasicMaterial({
      color: 0xFFFF00
    })
    if (this.useBall) {
      sphere = new Mesh(geometry, material)
      const scaleConstant = camera.position.z / 500
      sphere.scale.x = scaleConstant
      sphere.scale.y = scaleConstant
      sphere.scale.z = scaleConstant
      // const offsetConstant = camera.position.z * 150 / 500
      // sphere.position.x = offsetConstant
      sphere.position.set(1, 0.2, 0)
      scene.add(sphere)
    }
    // 3D 모델 로더
    const loader = new GLTFLoader()
    Promise.all([
      loader.loadAsync('/gltf/flex_base_v4.glb'),
      loader.loadAsync('/gltf/ur10e.gltf')
    ]).then((results) => {
      const [base, robot] = results
      scene.add(base.scene)
      const baseModelBox = new Box3().setFromObject(base.scene)
      const baseModelSize = new Vector3()
      // gltf 마지막 관절 조절
      baseModelHeight = baseModelBox.getSize(baseModelSize).y
      gltfModel = robot.scene
      gltfModel.traverse((child) => {
        if (child.name === 'wrist3') {
          const flange = new Mesh()
          flange.name = 'flange'
          flange.position.set(0, 0.12, 0)
          child.add(flange)
        }
      })
      // gltfModel.rotateY(Math.PI)
      // scene.add(gltfModel)
      // base.scene.traverse((child) => {
      //   console.log(child)
      //   if (child.name === 'Scene') {
      //     child.add(gltfModel)
      //   }
      // })
      base.scene.add(gltfModel)
      base.scene.position.set(0, 0, 0)
      gltfModel.position.set(0, baseModelHeight, 0)

      baseModel = base.scene

      const wTm = [
        gltfModel.position.x, gltfModel.position.y, gltfModel.position.z, gltfModel.quaternion.x, gltfModel.quaternion.y, gltfModel.quaternion.z, gltfModel.quaternion.w
      ]
      this.$emit('get-wTm', wTm)
      // console.log('gltfModel ::: ', gltfModel)
    }).catch((error) => {
      console.log('load error ', error)
    })
    // 로봇 팔
    // loader.load('/gltf/ur10e.gltf', function (gltf) {
    //   gltfModel = gltf.scene
    //   gltfModel.traverse((child) => {
    //     if (child.name === 'wrist3') {
    //       const flange = new Mesh()
    //       flange.name = 'flange'
    //       flange.position.set(0, 0.12, 0)
    //       child.add(flange)
    //     }
    //   })
    //   // gltfModel.position.set(1, 0.2, 0)
    //   // gltfModel.position.set(0, baseModelHeight, 0)
    //   console.log('!!! ', gltfModel)
    //   scene.add(gltfModel)
    // }, undefined, function (error) {
    //   console.error(error)
    // })
    // 생성한 Box(cube) 에 대한 마우스 이벤트
    if (this.useBox) {
      el.addEventListener('mousemove', (e) => {
        const trashCan = document.getElementById('trashCan')
        const t = trashCan.getBoundingClientRect()
        const offsetX = e.pageX - t.left > 0 && e.pageX - t.right < 0
        const offsetY = e.pageY - t.bottom < 0 && e.pageY - t.top > 0
        this.isInvisible = offsetX && offsetY
      })
      el.addEventListener('touchmove', (e) => {
        e.preventDefault()
        const touch = e.touches[0]
        const trashCan = document.getElementById('trashCan')
        const t = trashCan.getBoundingClientRect()
        const offsetX = touch.pageX - t.left > 0 && touch.pageX - t.right < 0
        const offsetY = touch.pageY - t.bottom < 0 && touch.pageY - t.top > 0
        this.isInvisible = offsetX && offsetY
      })
    }
    // 카메라 컨트롤
    this.controls = new OrbitControls(camera, renderer.domElement)
    // 드래그 컨트롤
    if (this.useBall) {
      this.dragControls = new DragControls([sphere], camera, renderer.domElement)
      this.dragControls.addEventListener('dragstart', function (event) {
        this.controls.enabled = false
        event.object.material.color.set(0xCCCC00)
      }.bind(this))
      this.dragControls.addEventListener('dragend', function (event) {
        if (sphere.position.y < 0.05) {
          sphere.position.y = 0.05
        }
        event.object.material.color.set(0xFFFF00)
        this.controls.enabled = true
        this.newPosition.pose = [
          event.object.position.x,
          sphere.position.y < 0.05 ? 0.05 : event.object.position.y,
          // event.object.position.z + 0.125,
          event.object.position.z,
          ...this.quaternion
        ]
        this.$emit('update-point', this.newPosition)
      }.bind(this))
    }
    if (this.useBox) {
      this.getData()
    }
    window.addEventListener('resize', onResize)

    // test
    el.addEventListener('click', this.onClickTest, false)
    //
    onResize()
    animate()
  },
  methods: {
    onClickTest (event) {
      // 표면 좌표구하고 빨간점 생성해보기
      event.preventDefault()
      const raycaster = new Raycaster()

      const intersect = raycaster.intersectObjects(scene.children)
      console.log('intersectObjects ::: ', intersect)

      const mouse = new Vector2()
      // 마우스 클릭 지점의 스크린 좌표를 가져옴
      mouse.x = (event.offsetX / elInfo.width) * 2 - 1
      mouse.y = -(event.offsetY / elInfo.height) * 2 + 1

      // 레이캐스터를 업데이트
      raycaster.setFromCamera(mouse, camera)

      // 레이와 3D 모델의 교차점을 찾음
      const intersects = raycaster.intersectObject(baseModel)

      if (intersects.length > 0) {
        // 클릭한 지점의 표면상의 좌표를 출력
        console.log(intersects[0].point)

        const ballGeometry = new SphereGeometry(4)
        const ballMaterial = new MeshBasicMaterial({ color: 0xFF0000 })
        const ball = new Mesh(ballGeometry, ballMaterial)
        // const scaleConstant = camera.position.z / 500
        ball.scale.x = 0.002
        ball.scale.y = 0.002
        ball.scale.z = 0.002
        ball.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
        scene.add(ball)
      }
    },
    async getData () {
      try {
        const { data: { data }, status } = await this.$axios.get('/object/positions')
        if (status === 200 && data.length > 0) {
          if (this.useBall && data[0].object_type === 'ball') {
            const ballVal = data[0]
            sphere.position.set(ballVal.x, ballVal.y < 0 ? 0 : ballVal.y, ballVal.z)
            sphere.quaternion.x = ballVal.q_x
            sphere.quaternion.y = ballVal.q_y
            sphere.quaternion.z = ballVal.q_z
            sphere.quaternion.w = ballVal.q_w
            sphere.createId = ballVal.id
          }
          if (data.slice(1).length > 0) {
            this.getCube(data.slice(1))
          }
        }
      } catch (err) {
        console.log('error ::: ', err)
      }
    },
    updatePosition () {
      // 변경된 joint 값으로 적용
      const pos = this.modelInfo.pos
      const joints = ['shoulder', 'upper-arm', 'fore-arm', 'wrist1', 'wrist2', 'wrist3']
      if (gltfModel) {
        joints.map((joint) => {
          gltfModel.traverse((child) => {
            const isSameName = val => val === child.name
            if (child.name === 'wrist3') {
              const mat = child.matrixWorld
              const q = new Quaternion().setFromRotationMatrix(mat, 'XYZ')
              this.quaternion = [q.x, q.y, q.z, q.w]
              // console.log(q)
              // const position = new Vector3().setFromMatrixPosition(mat)
              // sphere.quaternion.copy(q)
              if (sphere && this.newPosition && this.newPosition.pose) {
                this.newPosition = {
                  id: sphere.createId || '',
                  pose: [sphere.position.x, sphere.position.y, sphere.position.z, ...this.quaternion]
                  // pose: [sphere.position.x, sphere.position.y, sphere.position.z + 0.125, ...this.quaternion]
                }
                this.$emit('update-point', this.newPosition)
              } else {
                this.newPosition = {
                  id: '',
                  // pose: [1, 0.4, 0.125, ...this.quaternion]
                  pose: [1, 0.4, 0, ...this.quaternion]
                }
                this.$emit('update-point', this.newPosition)
              }
            }
            const idx = joints.findIndex(isSameName)
            if (idx > -1) {
              if (child.name === 'wrist2') {
                child.rotation.y = pos[idx] * Math.PI / 180 * -1
                // child.rotation.z = child.rotation.z * -1
              } else {
                child.rotation.y = pos[idx] * Math.PI / 180
              }
            }
          })
          return joint
        })
      }
    },
    getCube (items) {
      // 저장된 큐브가 있는 경우
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const width = item.width / 100
        const height = item.height / 100
        const depth = item.area / 100
        const cubeGeometry = new BoxGeometry(width, height, depth)
        const cubeMaterial = new MeshStandardMaterial({ color: item.color })
        const cube = new Mesh(cubeGeometry, cubeMaterial)
        cube.castShadow = true
        cube.receiveShadow = true
        cube.position.set(item.x, item.y, item.z)
        cube.name = item.name
        cube.width = item.width
        cube.height = item.height
        cube.depth = item.depth
        cube.color = item.color
        cube.rotation.x = item.q_x
        cube.rotation.y = item.q_y
        cube.rotation.z = item.q_z
        cube.createId = item.id
        this.cubes.push(cube)
        this.$emit('update-cube', this.cubes)
        scene.add(cube)

        const dragCube = new DragControls([cube], camera, renderer.domElement)
        document.addEventListener('dblclick', function (e) {
          //  상제 회전 UI 생성
          e.preventDefault()
          if (e.target.tagName !== 'CANVAS') {
            return
          }
          if (this.rotationCube) {
            this.isRotateMode = true
            this.createRotationControls(this.rotationCube)
          }
        }.bind(this), true)
        dragCube.addEventListener('dragstart', function (event) {
          // 상자 이동 시작
          this.controls.enabled = false
          event.object.material.opacity = 0.1
          this.rotationCube = event.object
        }.bind(this))
        dragCube.addEventListener('dragend', function (event) {
          // 상자 이동 종료
          event.object.material.opacity = 1
          this.controls.enabled = true
          if (this.isInvisible) {
            this.selectedCube = event.object
            this.removeBox()
          } else {
            this.selectedCube = null
          }
          const cubeBox = new Box3().setFromObject(event.object)
          const cubeSize = new Vector3()
          const cubeHeight = cubeBox.getSize(cubeSize).y
          if (event.object.position.y < cubeHeight / 2) {
            event.object.position.y = cubeHeight / 2
          }
          this.$emit('update-cube', this.cubes)
          this.isRotateMode = false
        }.bind(this))
      }
    },
    // async createTxt (name) {
    //   const textGeometry = new TextBufferGeometry(name, {
    //     font: await new FontLoader().load('/NanumGothic_Regular.json'),
    //     size: 0.01, // 텍스트 크기 조절
    //     height: 0.01 // 텍스트 높이 조절
    //   })
    //
    //   const textMaterial = new MeshBasicMaterial({ color: 0xFFFFFF }) // 텍스트 색상 설정
    //   const textMesh = new Mesh(textGeometry, textMaterial)
    //
    //   return textMesh
    // },
    async createBox (val) {
      // 상자 만들기
      this.createBoxModalStatus = false
      if (this.cubes.length > 5) {
        alert('상자는 6개까지만 추가 가능합니다.')
        return
      }
      const width = val.width / 100
      const height = val.height / 100
      const depth = val.depth / 100
      const cubeGeometry = await new BoxGeometry(width, height, depth)
      const cubeMaterial = await new MeshStandardMaterial({ color: val.color })
      const cube = await new Mesh(cubeGeometry, cubeMaterial)
      cube.castShadow = true
      cube.receiveShadow = true
      // const scaleConstant = camera.position.z / 500
      // cube.scale.x = scaleConstant
      // cube.scale.y = scaleConstant
      // cube.scale.z = scaleConstant
      cube.position.set(-1, height / 2, -1.5)
      cube.name = `cube${this.cubes.length + 1}`
      cube.width = val.width
      cube.height = val.height
      cube.depth = val.depth
      cube.color = val.color
      if (this.cubes.length > 1) {
        // 중복 위치에 생성 방지
        const sameArr = this.cubes.filter(({ position }) => position.x === cube.position.x && position.z === cube.position.z)
        const sumH = sameArr.reduce((accumulator, currentValue) => {
          return accumulator + Number(currentValue.height)
        }, 0)
        cube.position.y = height / 2 + (sumH / 100)
      }
      this.cubes.push(cube)
      this.$emit('update-cube', this.cubes)
      scene.add(cube)
      // const textMesh = await this.createTxt('TEST')
      // textMesh.position.set(cube.position.x, cube.position.y + 0.5, cube.position.z)
      // scene.add(textMesh)

      const dragCube = new DragControls([cube], camera, renderer.domElement)
      document.addEventListener('dblclick', function (e) {
        // 상자 회전 UI 생성
        e.preventDefault()
        this.isRotateMode = true
        if (this.rotationCube) {
          this.createRotationControls(this.rotationCube)
        }
      }.bind(this), true)
      dragCube.addEventListener('dragstart', function (event) {
        // 상자 이동 시작
        this.controls.enabled = false
        event.object.material.opacity = 0.1
        this.rotationCube = event.object
      }.bind(this))
      dragCube.addEventListener('dragend', function (event) {
        // 상자 이동 종료
        event.object.material.opacity = 1
        this.controls.enabled = true
        if (this.isInvisible) {
          this.selectedCube = event.object
          this.removeBox()
        } else {
          this.selectedCube = null
        }
        const cubeBox = new Box3().setFromObject(event.object)
        const cubeSize = new Vector3()
        const cubeHeight = cubeBox.getSize(cubeSize).y
        if (event.object.position.y < cubeHeight / 2) {
          event.object.position.y = cubeHeight / 2
        }
        this.$emit('update-cube', this.cubes)
        this.isRotateMode = false
      }.bind(this))
      // 회전이벤트
    },
    removeBox () {
      if (this.selectedCube) {
        // 배열에서 삭제
        const findIdx = this.cubes.findIndex(cube => cube.name === this.selectedCube.name)
        this.cubes.splice(findIdx, 1)
        if (this.selectedCube.createId) {
          this.$emit('update-remove-cube', this.selectedCube.createId)
        }
        // scene 에서 삭제
        scene.remove(this.selectedCube)
        this.selectedCube.geometry.dispose()
        this.selectedCube.material.dispose()
        this.selectedCube = null
        this.isInvisible = false
      }
    },
    createRotationControls (object) {
      // 3d 좌표를 dom 좌표로 전환
      const vector = new Vector3()
      vector.set(object.position.x, object.position.y, object.position.z)
      const screenPosition = vector.project(camera)
      const containerPosX = (screenPosition.x + 1) * el.offsetWidth / 2
      const containerPosY = (-screenPosition.y + 1) * el.offsetHeight / 2
      this.cubeRotateVal = object.rotation.y
      this.rotateCtrlX = containerPosX
      this.rotateCtrlY = containerPosY
    },
    onSliderChange (event) {
      // 상자 회전 시키기
      const rotationY = event
      if (this.rotationCube) {
        this.rotationCube.rotation.y = rotationY
        this.$emit('update-cube', this.cubes)
      }
    },
    updateCubePos () {
      // 입력받은 상자 좌표 적용하기
      this.rotationCube.position.x = Number(this.cubePosition.x)
      this.rotationCube.position.y = Number(this.cubePosition.y)
      this.rotationCube.position.z = Number(this.cubePosition.z)
    }
  }
}

</script>
<style lang="scss">
.box-icon{
  position: absolute;
  left: 1.5rem;
  top: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #131418;
  border: 1px solid #333;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    width: 1.5rem;
  }
}
.trash-icon{
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
  border-radius: 99px;
  border: 1px solid #333;
  background: #131418;
  padding: 1rem;
  img{
    width: 1.5rem;
  }
  &.temp-invisible{
    opacity:0.7;
    box-shadow: 1px 1px 10px rgba(255,255,255,0.7);
  }
}
.cube-slider{
  position: relative;
  &::after{
    position: absolute;
    left: 50%;
    top: -1rem;
    content: '슬라이더를 조절하여 회전합니다.';
    color: #efefef;
    font-size: 0.75rem;
    transform: translate(-50%,-50%);
    white-space: nowrap;
    text-shadow: 1px 1px 1px #000;
  }
}
.cube-pos-box{
  position: absolute;
  width: 8rem;
  background: #131313;
  color: #FAFAFA;
  border-radius: 0.5rem;
  padding: 0.5rem;
  z-index: 99;
  .row{
    align-items: center;
    margin-bottom: 0.275rem;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color : transparent;
    &:last-of-type{
      margin-bottom: 0;
    }
    .cube-pos-title{
      text-align: center;
      font-size: 0.875rem;
    }
    .cube-pos-input{
      font-size: 1rem;
      padding-left: 0;
      input[type='number']{
        border-radius: 0.5rem;
        background: #212121;
        color: #999;
        border: none;
        font-weight: 500;
        height: 1.8rem;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -ms-user-select: none;
        -webkit-tap-highlight-color : transparent;
        &::-webkit-inner-spin-button,&::-webkit-outer-spin-button{
          -webkit-appearance: none;
          margin: 0;
        }
        &::selection { background:transparent; }
        &:focus{
          box-shadow: none;
        }
      }
    }
  }
}
</style>
