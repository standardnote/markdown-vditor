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
    'edit-mode',
    // 'fullscreen',
    // '|',
    {
      name: 'more',
      toolbar: [
        'preview',
        'emoji',
        'export',
      ],
    }],
  mobile: [
    'link',
    'edit-mode',
    {
      name: 'more',
      toolbar: [
        'insert-after',
        'fullscreen',
        'emoji',
        'preview',
      ],
    },
  ]
}

export default class VditorEditor {
  editor: Vditor
  constructor(id: string, isRunningInMobileApplication: boolean, options?: IOptions) {
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
        enable: true,
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
      toolbar: isRunningInMobileApplication ? toolbar.mobile : toolbar.web,
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
