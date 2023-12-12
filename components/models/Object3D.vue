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
  // Euler,
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
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'

export default {
  name: 'Object3D',
  props: {
    points: { type: Array, required: false, default: () => [] },
    robotPos: { type: Object, required: false, default: () => {} }
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
      handler () {
        this.createPoints(true)
      },
      deep: true
    },
    robotPos () {
      this.updateRobotPos()
    }
  },
  mounted () {
    this.initCanvas()
  },
  methods: {
    initCanvas () {
      this.scene = new Scene()
      this.scene.background = new Color(0xA0A0A0)
      this.scene.fog = new Fog(0xA0A0A0, 0.1, 10)
      this.renderer = new WebGLRenderer({ antialias: true })
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = PCFSoftShadowMap
      this.canvasContainer = document.getElementById('canvas-container')
      this.canvasInfo = this.canvasContainer.getBoundingClientRect()

      this.camera = new PerspectiveCamera(35, this.canvasInfo.width / this.canvasInfo.height, 0.1, 500)
      this.canvasContainer.appendChild(this.renderer.domElement)
      // this.camera.position.set(4, 1.6, 4.5)
      this.camera.position.set(0, 0.3, 1)
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
      new OBJLoader()
        .setPath('/obj/')
        .load('drawer_scaled.obj', function (object) {
          object.traverse(function (child) {
            child.castShadow = true
            // if (child.isMesh) {
            //   // 법선 시각화
            //   const vHelper = new VertexNormalsHelper(child, 50, 0xA9A9A9)
            //   child.add(vHelper)
            // }
          })
          object.position.set(0, 0, 0)
          // object.scale.setScalar(100)
          this.scene.add(object)
          this.modelObj = object
        }.bind(this))
      // new MTLLoader()
      //   .setPath('/obj/')
      //   .load('r8.mtl', function (materials) {
      //     materials.preload()
      //
      //     new OBJLoader()
      //       .setMaterials(materials)
      //       .setPath('/obj/')
      //       .load('r8.obj', function (object) {
      //         object.traverse(function (child) {
      //           child.castShadow = true
      //           if (child.isMesh) {
      //             // 법선 시각화
      //             const vHelper = new VertexNormalsHelper(child, 50, 0xA9A9A9)
      //             child.add(vHelper)
      //           }
      //         })
      //         object.position.set(0, 0, 0)
      //         object.scale.setScalar(0.01)
      //         this.scene.add(object)
      //         this.modelObj = object
      //       }.bind(this))
      //   }.bind(this))
      // 로봇팔
      // const gltfLoader = new GLTFLoader()
      // const that = this
      // Promise.all([
      //   gltfLoader.loadAsync('/gltf/ur10e.gltf')
      // ]).then((results) => {
      //   const [robot] = results
      //   // gltf 마지막 관절 조절
      //   const gltfModel = robot.scene
      //   gltfModel.traverse((child) => {
      //     child.castShadow = true
      //     if (child.name === 'wrist3') {
      //       const flange = new Mesh()
      //       flange.name = 'flange'
      //       flange.position.set(0, 0.12, 0)
      //       child.add(flange)
      //     }
      //   })
      //   gltfModel.scale.setScalar(10)
      //   // gltfModel.position.set(25, 0, 0)
      //   gltfModel.position.set(25, 0, 0)
      //   that.scene.add(gltfModel)
      //   that.robotObj = gltfModel
      // }).catch((error) => {
      //   console.log('load error ', error)
      // })
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
      this.controls.minDistance = 0.5 // 최소 줌 거리
      this.controls.maxDistance = 5 // 최대 줌 거리
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
      if (intersects.length > 0 && intersects[0].face) {
        // 곡면 값
        const normal = intersects[0].face.normal
        const quaternion = new Quaternion().setFromUnitVectors(intersects[0].point, normal)
        // const rotation = new Euler().setFromQuaternion(quaternion)
        //
        const ballGeometry = new BoxGeometry(1, 1, 1)
        const ballMaterial = new MeshBasicMaterial({ color: 0x51FF0D })
        const point = new Mesh(ballGeometry, ballMaterial)
        point.position.copy(intersects[0].point)
        point.lookAt(new Vector3().addVectors(intersects[0].point, normal))
        // 클릭한 지점의 표면상의 좌표를 출력
        const item = {
          x: intersects[0].point.x,
          y: intersects[0].point.y,
          z: intersects[0].point.z,
          title: `포인트${this.points.length + 1 < 10 ? `0${this.points.length + 1}` : this.points.length + 1}`,
          normal,
          quaternion
        }
        this.$emit('update-points', item)
      }
    },
    createPoints (isUpdate) {
      // 기존에 scene 에 추가된 요소를 모두 제거
      this.resetPoints()
      if (this.points.length > 0) {
        const reusableVector3 = new Vector3()
        const raycaster = new Raycaster()
        // const rotations = []
        const quaternions = []
        const ballGeometry = new BoxGeometry(1, 1, 1)
        const ballMaterial = new MeshBasicMaterial({ color: 0x51FF0D })
        this.points.forEach((item) => {
          // const ballGeometry = new SphereGeometry(1)
          const point = new Mesh(ballGeometry, ballMaterial)
          point.castShadow = true
          point.receiveShadow = true
          point.scale.x = 0.01
          point.scale.y = 0.01
          point.scale.z = 0.01
          const newPoint = reusableVector3.set(Number(item.x), Number(item.y), Number(item.z))
          // point.position.set(item.x, item.y, item.z)
          point.position.copy(newPoint)
          // point.lookAt(new Vector3().addVectors(newPoint, item.normal))
          if (isUpdate) {
            // 포인트의 좌표가 가진 점을 기준으로 교차하는 물체의 표면 방향값 구하기
            const get3dPoint = reusableVector3.set(Number(item.x), Number(item.y), Number(item.z))
            const get2dPoint = get3dPoint.project(this.camera)
            const vector2Point = new Vector2(get2dPoint.x, get2dPoint.y)
            raycaster.setFromCamera(vector2Point, this.camera)
            const intersects = raycaster.intersectObject(this.modelObj)
            if (intersects.length > 0 && intersects[0].face) {
              // 가장 바깥쪽 표면의 방향
              const normal = intersects[0].face.normal
              // 3D 모델의 표면과 같은 방향으로 회전시키기
              point.lookAt(new Vector3().addVectors(newPoint, normal))
              // rotations.push(point.rotation)
              quaternions.push(point.quaternion)
            }
          } else {
            // 3D 모델의 표면과 같은 방향으로 회전시키기
            point.lookAt(new Vector3().addVectors(newPoint, item.normal))
            // rotations.push(point.rotation)
            quaternions.push(point.quaternion)
          }
          point.type = 'point'
          point.title = item.title
          this.scene.add(point)
          const axesHelper = new AxesHelper(5)
          // X 축은 빨간색입니다.
          // Y 축은 녹색입니다.
          // Z 축은 파란색입니다.
          point.add(axesHelper)
        })
        // this.$emit('update-rotation', rotations)
        this.$emit('update-quaternion', quaternions)
      }
    },
    resetPoints () {
      const sceneMeshes = [...this.scene.children]
      sceneMeshes.forEach((item) => {
        if (item.type === 'point') {
          this.scene.remove(item)
        }
      })
    },
    updateRobotPos () {
      // 로봇팔 움직임 업데이트
      // const pos = this.robotPos
      // const joints = ['shoulder', 'upper-arm', 'fore-arm', 'wrist1', 'wrist2', 'wrist3']
      // if (this.robotObj) {
      //   joints.map((joint) => {
      //     this.robotObj.traverse((child) => {
      //       const isSameName = val => val === child.name
      //       if (child.name === 'wrist3') {
      //         const mat = child.matrixWorld
      //         const q = new Quaternion().setFromRotationMatrix(mat, 'XYZ')
      //         this.quaternion = [q.x, q.y, q.z, q.w]
      //       }
      //       const idx = joints.findIndex(isSameName)
      //       if (idx > -1) {
      //         if (child.name === 'wrist2') {
      //           child.rotation.y = pos[idx] * Math.PI / 180 * -1
      //           // child.rotation.z = child.rotation.z * -1
      //         } else {
      //           child.rotation.y = pos[idx] * Math.PI / 180
      //         }
      //       }
      //     })
      //     return joint
      //   })
      // }
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
