/* globals customElements */
import { LitElement, html } from '../vendor/lit-element/lit-element'
import * as bg from './bg-process-rpc'
import './setup'
import './create-archive'
import './fork-archive'
import './select-archive'
import './select-file'
import './prompt'
import './basic-auth'
import './user'
import './create-user-session'

class ModalsWrapper extends LitElement {
  static get properties () {
    return {
      currentModal: {type: String}
    }
  }

  constructor () {
    super()
    this.currentModal = null
    this.cbs = null

    // export interface
    window.runModal = this.runModal.bind(this)

    // fetch platform information
    var {platform} = bg.beakerBrowser.getInfo()
    window.platform = platform
    if (platform === 'darwin') {
      document.body.classList.add('darwin')
    }
    if (platform === 'win32') {
      document.body.classList.add('win32')
    }

    // global event listeners
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.cbs.reject(new Error('Canceled'))
      }
    })
  }

  async runModal (name, params) {
    window.isModalActive = true
    this.currentModal = name
    await this.updateComplete
    return new Promise((resolve, reject) => {
      this.cbs = {resolve, reject}
      this.shadowRoot.querySelector(`${name}-modal`).init(params, {resolve, reject})
    }).then(
      v => { window.isModalActive = false; return v },
      v => { window.isModalActive = false; throw v }
    )
  }

  render () {
    return html`<div @contextmenu=${this.onContextMenu}>${this.renderMenu()}</div>`
  }

  renderMenu () {
    switch (this.currentModal) {
      case 'setup':
        return html`<setup-modal></setup-modal>`
      case 'create-archive':
        return html`<create-archive-modal></create-archive-modal>`
      case 'fork-archive':
        return html`<fork-archive-modal></fork-archive-modal>`
      case 'select-archive':
        return html`<select-archive-modal></select-archive-modal>`
      case 'select-file':
        return html`<select-file-modal></select-file-modal>`
      case 'prompt':
        return html`<prompt-modal></prompt-modal>`
      case 'basic-auth':
        return html`<basic-auth-modal></basic-auth-modal>`
      case 'user':
        return html`<user-modal></user-modal>`
      case 'create-user-session':
        return html`<create-user-session-modal></create-user-session-modal>`
    }
    return html`<div></div>`
  }

  onContextMenu (e) {
    e.preventDefault() // disable context menu
  }
}

customElements.define('modals-wrapper', ModalsWrapper)