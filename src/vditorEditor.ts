import Vditor from 'vditor'

const toolbar = {
  web: [
    'headings',
    'bold',
    'italic',
    'strike',
    'link',
    'emoji',
    '|',
    'list',
    'ordered-list',
    'check',
    'outdent',
    'indent',
    '|',
    'quote',
    'line',
    'code',
    'inline-code',
    'insert-before',
    'insert-after',
    '|',
    'table',
    '|',
    'undo',
    'redo',
    '|',
    // 'fullscreen',
    'preview',
    'edit-mode',
    'export',
  ],
  mobile: [
    'emoji',
    'insert-after',
    'undo',
    'redo',
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
        // 'fullscreen',
        'edit-mode',
        'preview',
      ],
    },
  ]
}

export default class VditorEditor {
  editor: Vditor
  constructor(id: string, options?: IOptions) {
    const isMobile = window.innerWidth <= 768
    const defaultOptions: IOptions = {
      cdn: './assets/vditor',
      typewriterMode: true,
      cache: {
        enable: false,
      },
      mode: 'ir',
      width: '100%',
      height: '100%',
      icon: 'material',
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
      tab: '\t',
      // height: window.innerHeight,
      value: '',
    }
    if (options) {
      Object.assign(defaultOptions, options)
    }
    this.editor = new Vditor(document.getElementById(id) as HTMLElement, defaultOptions)
  }

  toggleLock(isNoteLocked: boolean) {
    if (isNoteLocked) {
      this.editor.disabled()
    } else {
      this.editor.enable()
    }
  }

  setVditorMode(mode: IOptions['mode']) {
    const button = document.querySelector(`button[data-mode="${mode}"]`) as HTMLElement | null
    button && button.click()
  }
}
