export const validateForm = {
  methods: {
    emailValidation (email) {
      const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

      if (!email.length) {
        return null
      } else if (!emailReg.test(email)) {
        return false
      }
      return true
    }
  }
}

export const yearMonthOptions = {
  methods: {
    getYear () {
      const currentYear = new Date().getFullYear()
      const yearArr = []
      for (let year = currentYear; year > 1989; year--) {
        const yearObj = {
          value: `${year}`,
          text: `${year}년`
        }
        yearArr.push(yearObj)
      }
      yearArr.unshift({ value: null, text: '년도 선택' })
      return yearArr
    },
    getMonth () {
      const monthArr = []
      for (let month = 1; month < 13; month++) {
        const monthObj = {
          value: String(month).length === 1 ? String(month).padStart(2, '0') : `${month}`,
          text: `${month}월`
        }
        monthArr.push(monthObj)
      }
      monthArr.unshift({ value: null, text: '월 선택' })
      return monthArr
    }
  }
}

export const timeOptions = {
  methods: {
    getHours () {
      const hoursArr = []
      for (let hours = 0; hours < 24; hours++) {
        const hoursObj = {
          value: String(hours).length === 1 ? String(hours).padStart(2, '0') : `${hours}`,
          text: String(hours).length === 1 ? `${String(hours).padStart(2, '0')}시` : `${hours}시`
        }
        hoursArr.push(hoursObj)
      }
      hoursArr.unshift({ value: null, text: '시간 선택' })
      return hoursArr
    },
    getMinutes () {
      const minArr = []
      for (let min = 0; min < 60; min++) {
        const minObj = {
          value: String(min).length === 1 ? String(min).padStart(2, '0') : `${min}`,
          text: String(min).length === 1 ? `${String(min).padStart(2, '0')}분` : `${min}분`
        }
        minArr.push(minObj)
      }
      minArr.unshift({ value: null, text: '분 선택' })
      return minArr
    },
    getSeconds () {
      const secArr = []
      for (let sec = 0; sec < 60; sec++) {
        const secObj = {
          value: String(sec).length === 1 ? String(sec).padStart(2, '0') : `${sec}`,
          text: String(sec).length === 1 ? `${String(sec).padStart(2, '0')}초` : `${sec}초`
        }
        secArr.push(secObj)
      }
      secArr.unshift({ value: null, text: '초 선택' })
      return secArr
    }
  }
}

export const sortTableItems = {
  methods: {
    sortTableItems (row, fields) {
      /********
       * @param {object} row 테이블 로우 : API 응답 리스트 배열 안 객체
       * @param {Array} fields 테이블 옵션
       * @description 테이블 로우를 키값에 맞게 정렬
       * @return {object} row 정렬된 테이블 로우
       ********/

      // fields에서 key값만 가지고와서 배열에 넣는다.
      const newFields = []
      fields.forEach((field) => {
        return newFields.push(field.key)
      })

      /**
       * @var {string} i : 인덱스 넘버
       * @var {Object} newFields : [fields의 key값들로 이루어진 배열]
       * @return {Object} newCols : [{key: select, value: }]
       */
      const newCols = []
      for (const i in newFields) {
        newCols.push({
          key: newFields[i],
          value: row[newFields[i]]
        })
      }

      return newCols
    }
  }
}

export const editorStyles = {
  methods: {
    defineEditorStyle (editorNode, renderStatus) {
      if (editorNode) {
        const editor = editorNode.querySelector('.toastui-editor-defaultUI')
        const toolbar = editor.querySelector('.toastui-editor-defaultUI-toolbar')
        const toolbarBtn = toolbar.querySelectorAll('button')

        if (toolbar && toolbarBtn) {
          // const headingBtn = toolbar.querySelector('.heading')
          // const boldBtn = toolbar.querySelector('.bold')
          // const italicBtn = toolbar.querySelector('.italic')
          // const strikeBtn = toolbar.querySelector('.strike')
          // const quoteBtn = toolbar.querySelector('.quote')
          // const hrLineBtn = toolbar.querySelector('.hrline')
          // const bulletBtn = toolbar.querySelector('.bullet-list')
          // const orderedBtn = toolbar.querySelector('.ordered-list')
          // const checkboxBtn = toolbar.querySelector('.task-list')
          // const indentBtn = toolbar.querySelector('.indent')
          // const outdentBtn = toolbar.querySelector('.outdent')
          //
          // const tableBtn = toolbar.querySelector('.table')
          // const imageBtn = toolbar.querySelector('.image')
          // const linkBtn = toolbar.querySelector('.link')
          // const codeBtn = toolbar.querySelector('.code')
          // const codeBlockBtn = toolbar.querySelector('.codeblock')
          toolbarBtn.forEach((btn, index) => {
            if (btn) {
              btn.style.backgroundImage = 'none'

              const span = document.createElement('span')
              if (renderStatus && span) {
                toolbarBtn[index].appendChild(span)
                // span.setAttribute('class')
                span.innerHTML = index + 1
              }
            }
          })

          // if (renderStatus) {
          //   // headingBtn.innerHTML = '<span><i class="fa-solid fa-heading"></i></span>'
          //   // boldBtn.innerHTML = '<span><i class="fa-solid fa-bold"></i>'
          //   // italicBtn.innerHTML = '<span><i class="fa-solid fa-italic"></i>'
          //   // strikeBtn.innerHTML = '<span><i class="fa-solid fa-strikethrough"></i>'
          //   // quoteBtn.innerHTML = '<span><i class="fa-solid fa-quote-left"></i></span>'
          //   // hrLineBtn.innerHTML = '<span>―</span>'
          //   // bulletBtn.innerHTML = '<span><i class="fa-solid fa-list-ul"></i>'
          //   // orderedBtn.innerHTML = '<span><i class="fa-solid fa-list-ol"></i></span>'
          //   // checkboxBtn.innerHTML = '<span><i class="fa-regular fa-square-check"></i>'
          //   // indentBtn.innerHTML = '<span><i class="fa-solid fa-indent"></i>'
          //   // outdentBtn.innerHTML = '<span><i class="fa-solid fa-outdent"></i></span>'
          //   // tableBtn.innerHTML = '<span><i class="fa-solid fa-table"></i></span>'
          //   // imageBtn.innerHTML = '<span><i class="fa-solid fa-image"></i></span>'
          //   // linkBtn.innerHTML = '<span><i class="fa-solid fa-link"></i>'
          //   // codeBtn.innerHTML = '<span><i class="fa-solid fa-code"></i>'
          //   // codeBlockBtn.innerHTML = '<span>CB</span>'
          //   // headingBtn.innerHTML = '<span><i class="fa-solid fa-heading"></i></span>'
          //   // boldBtn.innerHTML = '<span><i class="fa-solid fa-bold"></i>'
          //   // italicBtn.innerHTML = '<span><i class="fa-solid fa-italic"></i>'
          //   // strikeBtn.innerHTML = '<span><i class="fa-solid fa-strikethrough"></i>'
          //   // quoteBtn.innerHTML = '<span><i class="fa-solid fa-quote-left"></i></span>'
          //   hrLineBtn.innerHTML = '<span v-if="renderStatus">―</span>'
          //   // bulletBtn.innerHTML = '<span><i class="fa-solid fa-list-ul"></i>'
          //   // orderedBtn.innerHTML = '<span><i class="fa-solid fa-list-ol"></i></span>'
          //   // checkboxBtn.innerHTML = '<span><i class="fa-regular fa-square-check"></i>'
          //   // indentBtn.innerHTML = '<span><i class="fa-solid fa-indent"></i>'
          //   // outdentBtn.innerHTML = '<span><i class="fa-solid fa-outdent"></i></span>'
          //   // tableBtn.innerHTML = '<span><i class="fa-solid fa-table"></i></span>'
          //   // imageBtn.innerHTML = '<span><i class="fa-solid fa-image"></i></span>'
          //   // linkBtn.innerHTML = '<span><i class="fa-solid fa-link"></i>'
          //   // codeBtn.innerHTML = '<span><i class="fa-solid fa-code"></i>'
          //   codeBlockBtn.innerHTML = '<span v-if="renderStatus">CB</span>'
          // }
        }
      } else {
        editorNode.destroy()
      }
    }
  }
}
export const commonFuctions = {
  methods: {
    paintMoneyComma (num) {
      if (!num) { return num }
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
