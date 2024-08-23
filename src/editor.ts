import VditorEditor from './vditorEditor'
import { EditorKit } from './editorKit'

interface Status {
    mode: IOptions['mode']
    locked: boolean
    outline: boolean
}

export default class Editor {
    vditor: VditorEditor | undefined
    editorKit: EditorKit | undefined
    status: Status = {
        mode: 'ir',
        locked: false,
        outline: false,
    }

    constructor() {
        this.configureEditorKit()
    }

    configureEditorKit() {
        const delegate = {
            clearUndoHistory: () => {
                try {
                    this.vditor?.editor.clearStack();
                } catch (e) {}
            },
            onNoteLockToggle: (isLocked: boolean) => {
                this.status.locked = isLocked
                this.vditor?.toggleLock(this.status.locked)
            },
            onNoteValueChange: async (note: any) => {
                this.status.mode = this.editorKit?.getComponentDataValueForKey('mode') || 'ir'
                this.status.locked = this.editorKit?.getItemAppDataValue('locked') ?? false
                // this.status.outline = this.editorKit?.getComponentDataValueForKey('outline') || false
                // get outline from meta data
                this.status.outline = this.editorKit?.getItemMetadata('outline') === 'true' || false

                if (this.vditor) {
                    if (this.status.mode !== this.vditor.editor.getCurrentMode()) {
                        this.vditor.setEditMode(this.status.mode)
                    }
                    if (this.status.outline !== this.vditor.editor.vditor.options.outline!.enable) {
                        this.status.outline = !this.status.outline
                        this.vditor.toggleOutline()
                    }
                }
            },
            setEditorRawText: async (rawText: string) => {
                if (this.vditor) {
                    this.vditor.editor.setValue(rawText)
                } else {
                    this.configureEditor(rawText)
                }
            },
            onThemesChange: () => { },
        }
        this.editorKit = new EditorKit(delegate, {
            mode: 'markdown',
            coallesedSavingDelay: 0
        })
    }

    configureEditor(content: string) {
        this.vditor = new VditorEditor('vditor', {
            input: (text: string) => {
                if (this.status.locked) {
                    return
                }
                this.editorKit?.onEditorValueChanged(text)
            },
            focus: () => {
                this.editorKit?.sendCustomEvent('focus', {})
            },
            blur: () => {
                this.editorKit?.sendCustomEvent('blur', {})
            },
            value: content,
            mode: this.status.mode,
            outline: {
                enable: this.status.outline,
                position: 'right',
            },
        }, () => {
            document.querySelectorAll('button[data-mode]')
                .forEach(button => button.addEventListener('click', e => {
                    const currentMode = this.vditor?.editor.getCurrentMode()
                    if (currentMode && this.status.mode !== currentMode) {
                        this.status.mode = currentMode
                        this.editorKit?.setComponentDataValueForKey('mode', this.status.mode)
                    }
                }))

            document.querySelector('button[data-type="outline"]')?.addEventListener('click', e => {
                this.status.outline = document.querySelector('button[data-type="outline"]')?.classList.contains('vditor-menu--current') || false
                // this.editorKit?.setComponentDataValueForKey('outline', this.status.outline)
                // save outline to meta data
                this.editorKit?.saveItemMetadata('outline', this.status.outline.toString()) || false
            })

            if (this.status.locked) {
                this.vditor?.editor.disabled()
            }
        })
    }
}
