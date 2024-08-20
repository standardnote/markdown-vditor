import VditorEditor from './vditorEditor'
import { EditorKit } from './editorKit'

export default class Editor {
    vditor: VditorEditor | undefined
    editorKit: EditorKit | undefined
    isEditorInit = false
    isNoteLocked = false
    rawText = ''
    vditorMode: IOptions['mode'] = 'ir'

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
                this.isNoteLocked = isLocked
                if (this.isEditorInit) {
                    this.vditor!.toggleLock(this.isNoteLocked)
                }
            },
            onNoteValueChange: async (note: any) => {
                this.vditorMode = this.editorKit?.getComponentDataValueForKey('mode')
            },
            setEditorRawText: async (rawText: string) => {
                if (this.isEditorInit) {
                    this.vditor!.editor.setValue(rawText)
                } else {
                    this.rawText = rawText
                    this.isNoteLocked = this.getNoteLockState()
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
        const editorInit = () => {
            if (!this.isEditorInit) {
                this.isEditorInit = true
                if (this.rawText) {
                    this.vditor?.editor.setValue(this.rawText)
                    // vditor locked
                    const isLocked = this.getNoteLockState()
                    isLocked && this.vditor?.editor.disabled()
                    // vditor mode
                    this.vditorMode !== 'ir' && this.vditor?.setVditorMode(this.vditorMode)
                }
            }
        }

        this.vditor = new VditorEditor(id, {
            input: (text: string) => {
                if (this.isNoteLocked) {
                    return
                }
                this.editorKit?.onEditorValueChanged(text)
                this.updateVditorMode()
            },
            after: editorInit,
            mode: this.vditorMode,
            focus: () => {
                this.editorKit?.sendCustomEvent('focus', {})
            },
            blur: () => {
                this.editorKit?.sendCustomEvent('blur', {})
            }
        })
    }

    updateVditorMode() {
        const currentMode = this.vditor?.editor.getCurrentMode()
        if (currentMode !== this.vditorMode) {
            this.vditorMode = currentMode
            this.editorKit?.setComponentDataValueForKey('mode', currentMode)
            this.vditor?.setVditorMode(this.vditorMode)
        }
    }

    getNoteLockState() {
        return this.editorKit?.getItemAppDataValue('locked') ?? false
    }
}
