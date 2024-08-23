import VditorEditor from './vditorEditor'
import { EditorKit } from './editorKit'

interface Status {
    mode: IOptions['mode']
    content: string
    locked: boolean
    outline: boolean
}

export default class Editor {
    vditor: VditorEditor | undefined
    editorKit: EditorKit | undefined
    isEditorInit = false
    status: Status = {
        content: '',
        mode: 'ir',
        locked: false,
        outline: false,
    }

    constructor(id: string) {
        this.configureEditorKit()
        this.configureEditor(id)
    }

    configureEditorKit() {
        const delegate = {
            clearUndoHistory: () => {
                if (this.isEditorInit) {
                    this.vditor!.editor.clearStack();
                }
            },
            onNoteLockToggle: (isLocked: boolean) => {
                this.status.locked = isLocked
                if (this.isEditorInit) {
                    this.vditor!.toggleLock(this.status.locked)
                }
            },
            onNoteValueChange: async (note: any) => {
                this.status.mode = this.editorKit?.getComponentDataValueForKey('mode') || 'ir'
                // this.status.outline = this.editorKit?.getComponentDataValueForKey('outline') || false
                // get outline from meta data
                this.status.outline = this.editorKit?.getItemMetadata('outline') === 'true' || false
            },
            setEditorRawText: async (rawText: string) => {
                if (this.isEditorInit) {
                    this.vditor!.editor.setValue(rawText)
                    if (this.status.mode !== this.vditor!.editor.getCurrentMode()) {
                        this.vditor!.setEditMode(this.status.mode)
                    }
                    if (this.status.outline !== this.vditor!.editor.vditor.options.outline!.enable) {
                        this.status.outline = !this.status.outline
                        this.vditor!.toggleOutline()
                    }
                } else {
                    this.status.content = rawText
                    this.status.locked = this.getNoteLockState()
                }
            },
            onThemesChange: () => {

            },
        }
        this.editorKit = new EditorKit(delegate, {
            mode: 'markdown',
            coallesedSavingDelay: 0
        })
    }

    configureEditor(id: string) {
        this.vditor = new VditorEditor(id, {
            input: (text: string) => {
                if (this.status.locked) {
                    return
                }
                this.editorKit?.onEditorValueChanged(text)
                // this.updateVditorMode()
            },
            after: () => {
                if (!this.isEditorInit) {
                    this.isEditorInit = true

                    if (this.status.content) { // null
                        this.vditor?.editor.setValue(this.status.content)
                        this.getNoteLockState() && this.vditor?.editor.disabled()
                        this.vditor?.setEditMode(this.status.mode)
                    }

                    document.querySelectorAll('button[data-mode]')
                        .forEach(button => button.addEventListener('click', e => this.updateVditorMode()))

                    document.querySelector('button[data-type="outline"]')?.addEventListener('click', e => {
                        this.status.outline = document.querySelector('button[data-type="outline"]')?.classList.contains('vditor-menu--current') || false
                        // this.editorKit?.setComponentDataValueForKey('outline', this.status.outline)
                        // save outline to meta data
                        this.editorKit?.saveItemMetadata('outline', this.status.outline.toString()) || false
                    })
                }
            },
            focus: () => {
                this.editorKit?.sendCustomEvent('focus', {})
            },
            blur: () => {
                this.editorKit?.sendCustomEvent('blur', {})
            },

            mode: this.status.mode,
            outline: {
                enable: this.status.outline,
                position: 'right',
            },
        })
    }

    updateVditorMode() {
        const currentMode = this.vditor?.editor.getCurrentMode()
        if (currentMode && this.status.mode !== currentMode) {
            this.status.mode = currentMode
            this.editorKit?.setComponentDataValueForKey('mode', currentMode)
        }
    }

    getNoteLockState() {
        return this.editorKit?.getItemAppDataValue('locked') ?? false
    }
}
