class WindowWebComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  

  renderTemplate() {
    return `
    <style>
    .parent {
      height: 500px;
      position: relative;
      overflow: hidden;
    } 
    .window {
      min-width: 350px;
      min-height: 350px;
      position: absolute; 
      overflow: clip;
      top: 0;
      left: 0;
    }
    </style>
    
    <div class="parent">
    
    </div>
    ` 
  }
  
  connectedCallback() {
    this.shadowRoot.innerHTML = this.renderTemplate(); 
    const data = window.ftd.component_data(this);
    const record = data.data.get();
    const url = record.get("url").get()
    const parent = this.shadowRoot.querySelector('.parent');
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = "100%";
    iframe.style.border = "none";
    parent.appendChild(iframe);
  }
}


customElements.define('window-web-component', WindowWebComponent);
