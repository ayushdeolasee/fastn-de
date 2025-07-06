class MainComponent extends HTMLElement {
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
    
    addWindow() {
      const window = document.createElement('my-window');
      window.classList.add('window')
      this.shadowRoot.querySelector('.parent').appendChild(window);
    }
    
    connectedCallback() {
      this.shadowRoot.innerHTML = this.renderTemplate(); 
    }
}

class MyWindow extends HTMLElement {
  static zIndexCounter = 1; // shared across all instances

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
        <button class="close-button">close</button>
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

    // Global z-index logic
    this.addEventListener('mousedown', () => {
      this.style.zIndex = MyWindow.zIndexCounter++;
    });

    const topBar = this.shadowRoot.querySelector('.top-bar');
    const corner = this.shadowRoot.querySelector('.corner');
    const closeButton = this.shadowRoot.querySelector('.close-button');

    if (topBar) {
      topBar.addEventListener('mousedown', (event) => {
        event.preventDefault();
        let l = this.offsetLeft;
        let t = this.offsetTop;
        let startX = event.pageX;
        let startY = event.pageY;
        const parent = this.parentElement;
        const drag = (event) => {
          const dx = event.pageX - startX;
          const dy = event.pageY - startY;
          let newLeft = l + dx;
          let newTop = t + dy;
          newLeft = Math.max(0, Math.min(newLeft, parent.clientWidth - this.offsetWidth));
          newTop = Math.max(0, Math.min(newTop, parent.clientHeight - this.offsetHeight));
          this.style.left = newLeft + 'px';
          this.style.top = newTop + 'px';
        };
        const mouseup = () => {
          document.removeEventListener('mousemove', drag);
          document.removeEventListener('mouseup', mouseup);
        };
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', mouseup);
      });
    }

    if (corner) {
      corner.addEventListener('mousedown', (event) => {
        event.preventDefault();
        let w = this.clientWidth;
        let h = this.clientHeight;
        let startX = event.pageX;
        let startY = event.pageY;
        const parent = this.parentElement;
        const drag = (event) => {
          const currentLeft = this.offsetLeft;
          const currentTop = this.offsetTop;
          let newWidth = w + (event.pageX - startX);
          let newHeight = h + (event.pageY - startY);
          const maxWidth = parent.clientWidth - currentLeft;
          const maxHeight = parent.clientHeight - currentTop;
          newWidth = Math.max(100, Math.min(newWidth, maxWidth));
          newHeight = Math.max(100, Math.min(newHeight, maxHeight));
          this.style.width = newWidth + 'px';
          this.style.height = newHeight + 'px';
        };
        const mouseup = () => {
          document.removeEventListener('mousemove', drag);
          document.removeEventListener('mouseup', mouseup);
        };
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', mouseup);
      });
    }

    if (closeButton) {
      closeButton.addEventListener('click', (event) => {
        event.preventDefault();
        this.remove();
      });
    }
  }
}

class BottomBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
  }
  renderTemplate() {
    return `
    <style>
    </style>
    <div class="bottom-bar">
      <button class="fifthtry-button">Fifthtry App</button>
    </div>
    `
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = this.renderTemplate();
    this.shadowRoot.querySelector('.fifthtry-button').addEventListener('click', () => {
      const mainComponent = document.querySelector('main-component');
      mainComponent.addWindow();
    });
  }
}

customElements.define('main-component', MainComponent);
customElements.define('bottom-bar', BottomBar);
customElements.define('my-window', MyWindow);
