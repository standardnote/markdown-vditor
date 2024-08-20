import Editor from './editor'

// patch node_modules/@standardnotes/component-relay/dist/dist.js
// document.referrer&&e.origin!=='null'&&new URL(document.referrer).origin!==new URL(e.origin).origin)return;

const el = document.createElement('div')
el.id = 'vditor'
document.body.append(el)
const editor = new Editor('vditor')
