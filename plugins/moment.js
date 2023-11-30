import moment from 'moment'
import 'moment/locale/ko'

moment.locale('ko') // 한국어를 기본 로케일로 설정

export default (_, inject) => {
  inject('moment', moment)
}
