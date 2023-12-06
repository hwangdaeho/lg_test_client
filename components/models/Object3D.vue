<template>
  <div
    id="canvas-container"
    class="canvas-container"
    style="width: 100%; min-width: 100%; height: 500px"
  />
</template>
<script>
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Color,
  DirectionalLight,
  PlaneGeometry,
  Mesh,
  Vector2,
  // GridHelper,
  MeshBasicMaterial,
  Raycaster,
  BoxGeometry,
  HemisphereLight,
  MeshPhongMaterial,
  Fog,
  PCFSoftShadowMap,
  Quaternion,
  Euler,
  Vector3,
  AxesHelper
  //
  // BoxGeometry,
  // WireframeGeometry,
  // LineSegments,
  // LineBasicMaterial,
  // Box3,
  // Vector3
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'

export default {
  name: 'Object3D',
  props: {
    points: { type: Array, required: false, default: () => [] }
  },
  data () {
    return {
      canvasContainer: null,
      canvasInfo: null,
      scene: null,
      camera: null,
      renderer: null,
      modelObj: null,
      robotObj: null
    }
  },
  watch: {
    points: {
      deep: true,
      handler () {
        this.createPoints()
      }
    }
  },
  mounted () {
    this.initCanvas()
  },
  methods: {
    initCanvas () {
      this.scene = new Scene()
      this.scene.background = new Color(0xA0A0A0)
      this.scene.fog = new Fog(0xA0A0A0, 1, 500)
      this.renderer = new WebGLRenderer({ antialias: true })
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = PCFSoftShadowMap
      this.canvasContainer = document.getElementById('canvas-container')
      this.canvasInfo = this.canvasContainer.getBoundingClientRect()

      this.camera = new PerspectiveCamera(35, this.canvasInfo.width / this.canvasInfo.height, 1, 500)
      this.canvasContainer.appendChild(this.renderer.domElement)
      // this.camera.position.set(4, 1.6, 4.5)
      this.camera.position.set(50, 40, 50)
      // this.camera.zoom = 0.8
      this.camera.lookAt(this.scene.position)
      // this.camera.updateProjectionMatrix()
      // 그림자
      this.renderer.shadowMap.enabled = true
      // 조명
      const hemiLight = new HemisphereLight(0xFFFFFF, 0x8D8D8D, 3)
      hemiLight.position.set(0, 100, 0)
      this.scene.add(hemiLight)
      const dirLight = new DirectionalLight(0xFFFFFF, 3)
      dirLight.position.set(0, 40, 50)
      dirLight.castShadow = true
      dirLight.shadow.camera.top = 50
      dirLight.shadow.camera.bottom = -25
      dirLight.shadow.camera.left = -25
      dirLight.shadow.camera.right = 25
      dirLight.shadow.camera.near = 0.1
      dirLight.shadow.camera.far = 200
      dirLight.shadow.mapSize.set(this.canvasInfo.width, this.canvasInfo.height)
      this.scene.add(dirLight)
      // 그라운드
      const ground = new Mesh(new PlaneGeometry(this.canvasInfo.width, this.canvasInfo.height), new MeshPhongMaterial({ color: 0xCBCBCB, depthWrite: false }))
      ground.rotation.x = -Math.PI / 2
      ground.receiveShadow = true
      this.scene.add(ground)
      // 3D모델
      new MTLLoader()
        .setPath('/obj/')
        .load('r8.mtl', function (materials) {
          materials.preload()

          new OBJLoader()
            .setMaterials(materials)
            .setPath('/obj/')
            .load('r8.obj', function (object) {
              object.traverse(function (child) {
                child.castShadow = true
                if (child.isMesh) {
                  const vHelper = new VertexNormalsHelper(child, 50, 0x343434)
                  child.add(vHelper)
                }
              })
              object.position.set(0, 0, 0)
              object.scale.setScalar(0.01)
              this.scene.add(object)
              this.modelObj = object
            }.bind(this))
        }.bind(this))
      // 로봇팔
      const gltfLoader = new GLTFLoader()
      const that = this
      Promise.all([
        gltfLoader.loadAsync('/gltf/ur10e.gltf')
      ]).then((results) => {
        const [robot] = results
        // gltf 마지막 관절 조절
        const gltfModel = robot.scene
        gltfModel.traverse((child) => {
          child.castShadow = true
          if (child.name === 'wrist3') {
            const flange = new Mesh()
            flange.name = 'flange'
            flange.position.set(0, 0.12, 0)
            child.add(flange)
          }
        })
        gltfModel.scale.setScalar(10)
        gltfModel.position.set(25, 0, 0)
        that.scene.add(gltfModel)
        that.robotObj = gltfModel
      }).catch((error) => {
        console.log('load error ', error)
      })
      //
      // const loader = new GLTFLoader()
      // Promise.all([
      //   loader.loadAsync('/gltf/flex_base_v4.glb'),
      //   loader.loadAsync('/gltf/ur10e.gltf')
      // ]).then((results) => {
      //   const [base, robot] = results
      //   this.scene.add(base.scene)
      //   const baseModelBox = new Box3().setFromObject(base.scene)
      //   const baseModelSize = new Vector3()
      //   const baseModelHeight = baseModelBox.getSize(baseModelSize).y
      //   // gltf 마지막 관절 조절
      //   const robotModel = robot.scene
      //   robotModel.traverse((child) => {
      //     if (child.name === 'wrist3') {
      //       const flange = new Mesh()
      //       flange.name = 'flange'
      //       flange.position.set(0, 0.12, 0)
      //       child.add(flange)
      //     }
      //   })
      //   // gltfModel.rotateY(Math.PI)
      //   base.scene.add(robotModel)
      //   base.scene.position.set(0, 0, 0)
      //   robotModel.position.set(0, baseModelHeight, 0)
      //
      //   const wTm = [
      //     robotModel.position.x, robotModel.position.y, robotModel.position.z, robotModel.quaternion.x, robotModel.quaternion.y, robotModel.quaternion.z, robotModel.quaternion.w
      //   ]
      //   this.$emit('get-wTm', wTm)
      // }).catch((error) => {
      //   console.log('load error ', error)
      // })
      // //
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      // this.controls.minDistance = 30 // 최소 줌 거리소
      this.controls.maxDistance = 200 // 최대 줌 거리
      this.controls.maxPolarAngle = Math.PI / 2 - 0.1 // 상하 회전각 제한
      window.addEventListener('resize', this.onResize)
      this.canvasContainer.addEventListener('mousedown', (e) => {
        e = e || window.event
        let isRightButton = false
        if ('which' in e) {
          // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
          isRightButton = e.which === 3
        } else if ('button' in e) {
          // IE, Opera
          isRightButton = e.button === 2
        }
        // 3D 모델에 좌클릭한 경우 카메라 조정 제한
        this.controls.enabled = isRightButton
      })
      this.canvasContainer.addEventListener('mousemove', () => {
        this.controls.enabled = true
      })
      this.canvasContainer.addEventListener('mouseup', this.getPoints, false)
      this.onResize()
      this.onAnimate()
    },
    getPoints (event) {
      if (this.controls.enabled) {
        return
      }
      // 표면 좌표구하고 빨간점 생성해보기
      event.preventDefault()
      const raycaster = new Raycaster()
      // const intersect = raycaster.intersectObjects(this.scene.children)
      const mouse = new Vector2()
      // 마우스 클릭 지점의 스크린 좌표를 가져옴
      mouse.x = (event.offsetX / this.canvasInfo.width) * 2 - 1
      mouse.y = -(event.offsetY / this.canvasInfo.height) * 2 + 1

      // 레이캐스터를 업데이트
      raycaster.setFromCamera(mouse, this.camera)

      // 레이와 3D 모델의 교차점을 찾음
      const intersects = raycaster.intersectObject(this.modelObj, true)
      if (intersects.length > 0) {
        // 곡면 값
        const normal = intersects[0].face.normal
        const quaternion = new Quaternion().setFromUnitVectors(intersects[0].point, normal)
        const rotation = new Euler().setFromQuaternion(quaternion)
        // 클릭한 지점의 표면상의 좌표를 출력
        const point = {
          x: intersects[0].point.x,
          y: intersects[0].point.y,
          z: intersects[0].point.z,
          point: intersects[0].point,
          title: `포인트${this.points.length + 1 < 10 ? `0${this.points.length + 1}` : this.points.length + 1}`,
          normal,
          quaternion,
          rotation
        }
        this.$emit('update-points', point)
      }
    },
    createPoints () {
      const sceneMeshes = [...this.scene.children]
      if (this.points.length > 0) {
        // 기존에 scene 에 추가된 요소를 모두 제거
        sceneMeshes.forEach((item) => {
          if (item.type === 'point') {
            this.scene.remove(item)
          }
        })
        this.points.forEach((item) => {
          // const ballGeometry = new SphereGeometry(1)
          const ballGeometry = new BoxGeometry(2, 2, 2)
          const ballMaterial = new MeshBasicMaterial({ color: 0x51FF0D })
          const point = new Mesh(ballGeometry, ballMaterial)

          // const edges = new WireframeGeometry(ballGeometry)
          // const line = new LineSegments(edges, new LineBasicMaterial({ color: 0x198038 }))
          // point.add(line)

          point.castShadow = true
          point.receiveShadow = true
          point.scale.x = 0.2
          point.scale.y = 0.2
          point.scale.z = 0.2
          point.position.set(item.x, item.y, item.z)
          // point.position.copy(item.point)
          point.lookAt(new Vector3().addVectors(item.point, item.normal))
          point.type = 'point'
          point.title = item.title
          this.scene.add(point)
          // const vHelper = new VertexNormalsHelper(point, 1, 0xFF0000)
          // this.scene.add(vHelper)
          const axesHelper = new AxesHelper(10)
          point.add(axesHelper)
        })
      } else {
        sceneMeshes.forEach((item) => {
          if (item.type === 'point') {
            this.scene.remove(item)
          }
        })
      }
    },
    onResize () {
      this.renderer.setSize(this.canvasInfo.width, this.canvasInfo.height)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.camera.updateProjectionMatrix()
    },
    onAnimate () {
      requestAnimationFrame(this.onAnimate)
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>
<style lang="scss">
.canvas-container{
  .canvas-title{
    font-weight: 900;
    font-size: 1.750rem;
  }
}

</style>
