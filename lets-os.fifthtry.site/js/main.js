class HelloWorld extends HTMLElement {
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
      } 
      .window {
        min-width: 350px;
        min-height: 350px;
        position: absolute; 
        overflow: clip;
        top: 0;
        left: 0;
      }
      .window2 {
        left: 40px;
        top: 15px;
      }
      </style>
      
      <div class="parent">
      <my-window class="window window1"></my-window>
      <my-window class="window window2"></my-window>
      </div>
      ` 
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = this.renderTemplate();
      let z = 1; 
      
      const windows = this.shadowRoot.querySelectorAll('.window');
      windows.forEach(window => {
        window.addEventListener('mousedown', () => {
          window.style.zIndex = z;
          z++; 
        })


        window.addEventListener('window-ready', () => {
          let topBar = window.shadowRoot.querySelector('.top-bar');
          let corner = window.shadowRoot.querySelector('.corner');
          if (!topBar || !corner) return;
        

          topBar.addEventListener('mousedown', (event) => {
            event.preventDefault()
            let l = window.offsetLeft;
            let t = window.offsetTop;
            let startX = event.pageX;
            let startY = event.pageY;

          const drag = (event) => {
            
            window.style.left = l + (event.pageX - startX) + 'px';
            window.style.top = t + (event.pageY - startY) + 'px';
          }

          const mouseup = () => {
            document.removeEventListener('mousemove', drag)
            document.removeEventListener('mouseup', mouseup)
          }
          document.addEventListener('mousemove', drag)
          document.addEventListener('mouseup', mouseup )
        })
        
        corner.addEventListener('mousedown', (event) => {
          event.preventDefault()
          let w = window.clientWidth
          let h = window.clientHeight
      
          let startX = event.pageX
          let startY = event.pageY
      
          const drag = (event) => {
            
      
            window.style.width = w + (event.pageX - startX) + 'px'
            window.style.height = h + (event.pageY - startY) + 'px'
          }
      
          const mouseup = () => {
            document.removeEventListener('mousemove', drag)
            document.removeEventListener('mouseup', mouseup)
          }
      
          document.addEventListener('mousemove', drag)
          document.addEventListener('mouseup', mouseup)
        })
        }, { once: true })
    })
  }
} 

class MyWindow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
  }
  renderTemplate() {
    return `
    <style>
    .container {
    background-color: grey;
      min-width: 350px;
      min-height: 350px;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      // padding: 10px;
    }
      .corner {
        position: absolute;
        z-index: 100;
        bottom: 0;
        right: 0;
        width: 24px;
        height: 24px;
        cursor: nwse-resize;
      }
      .top-bar {
        cursor: move; 
        display: flex;
        flex-shring: 0;
      }
      .iframe {
        flex: 1 1 0;
        display: flex;
        position: relative;  
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
      }
        .iframe iframe {
        width: 100%;
        height: 100%;
        display: block;
        border: none;
      }
    </style>
    <div class="container">
      <div class="top-bar">
        <button>close</button>
      </div>
      <div class="iframe">
        <iframe src="https://www.fifthtry.com/" title="Fifthtry Site"></iframe>
      </div>
      <div class="corner"></div>
    </div>
    `
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = this.renderTemplate();
    this.dispatchEvent(new CustomEvent('window-ready', { bubbles: true }));
  }
}

customElements.define('hello-world', HelloWorld);
customElements.define('my-window', MyWindow);
