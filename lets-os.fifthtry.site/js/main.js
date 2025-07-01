console.log("main.js called")

class HelloWorld extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    renderTemplate() {
      return `
      <style>
      </style>
      
      <div class="parent">
        <my-window></my-window>
      </div>

      ` 
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = this.renderTemplate();
    }
  }
  

class MyWindow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
  }
  renderTemplate() {
    return `
    <div class="parent">
      <div class="top-bar">
        <button>close</button>
      </div>
      <div class="iframe">
        <iframe src="https://www.fifthtry.com/" title="Fifthtry Site"></iframe>
      </div>
    </div>
    `
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = this.renderTemplate();
  }
}

customElements.define('hello-world', HelloWorld);
customElements.define('my-window', MyWindow);
