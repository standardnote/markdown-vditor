import Vditor from 'vditor'

const toolbar = {
  web: [
    'headings',
    'bold',
    'italic',
    'strike',
    'link',
    '|',
    'list',
    'ordered-list',
    'check',
    '|',
    'code',
    'inline-code',
    'table',
    'insert-before',
    'insert-after',
    '|',
    'undo',
    'redo',
    '|',
    'outline',
    'edit-mode',
    {
      name: 'more',
      toolbar: [
        'quote',
        'line',

        'outdent',
        'indent',

        // 'fullscreen',
        'preview',
        'emoji',
        'export',
      ],
    },
  ],
  mobile: [
    'emoji',
    'undo',
    'redo',
    'insert-after',
    'edit-mode',
    {
      name: 'more',
      toolbar: [
        'headings',
        'bold',
        'italic',
        'link',

        'check',
        'outdent',
        'indent',

        'insert-after',
        'insert-before',
        'preview',
      ],
    },
  ]
}

export default class VditorEditor {
  editor: Vditor
  init: boolean
  constructor(id: string, options: IOptions, fn: () => void) {
    this.init = false
    const isMobile = window.innerWidth < 768
    const defaultOptions: IOptions = {
      cdn: './assets/vditor',
      typewriterMode: true,
      cache: {
        enable: false,
      },
      mode: 'ir',
      width: '100%',
      height: '100%',
      icon: 'ant', // ant | material
      counter: {
        enable: !isMobile,
        type: 'text',
      },
      preview: {
        markdown: {
          mark: false,
          fixTermTypo: false,
          autoSpace: false,
        },
        hljs: {
          enable: true,
        },
        maxWidth: 9999,
        // mode: both, editor
        // theme: {
        //   current: 'dark'
        // },
      },
      toolbar: isMobile ? toolbar.mobile : toolbar.web,
      outline: {
        enable: false,
        position: 'right',
      },
      tab: '\t',
      // height: window.innerHeight,
      after: () => {
        if (!this.init) {
          this.init = true
          fn()
        }
      }
    }
    if (options) {
      Object.assign(defaultOptions, options)
    }
    this.editor = new Vditor(id, defaultOptions)
  }

  toggleLock(isNoteLocked: boolean) {
    if (isNoteLocked) {
      this.editor.disabled()
    } else {
      this.editor.enable()
    }
  }

  toggleOutline() {
    const button = document.querySelector('button[data-type="outline"]') as HTMLElement | null
    button && button.click()
  }

  setEditMode(mode: IOptions['mode']) {
    const button = document.querySelector(`button[data-mode="${mode}"]`) as HTMLElement | null
    button && button.click()
  }
}
