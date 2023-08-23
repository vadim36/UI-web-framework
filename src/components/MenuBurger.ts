import { Component, ComponentOptions,ElementSize } from '../abstract/Abstract';

interface MenuHamburgerOptions extends ComponentOptions {
  animationIndex?:number | null,
  $asideElement?:HTMLElement,
  optionalHandlers?:boolean
}

export class MenuHamburger extends Component<MenuHamburgerOptions> {
  readonly elementOptions:MenuHamburgerOptions = {
    size: ElementSize.Primary,
    animationIndex: 0
  }
  readonly $backdropElement = document.createElement('div');

  constructor(
    readonly $receivedElement:HTMLButtonElement,
    options?:MenuHamburgerOptions
  ) {
    super();
    if (options) this.elementOptions = options;
    this.validateIndexParam(options?.animationIndex);
    if (options?.optionalHandlers === undefined) {
      this.elementOptions.optionalHandlers = false;
    }

    this.render();
  }

  public get isOpen():boolean {
    return this.$receivedElement.ariaExpanded === String(true);
  }

  protected render():void {
    if (this.elementOptions.animationIndex === 1) {
      this.$receivedElement.innerHTML = `
        <svg viewBox="0 0 100 100">
          <line class="line line1"  
            x1="15" x2="85" y1="40" y2="40"
          />
          <line class="line line2"  
            x1="15" x2="85" y1="65" y2="65" 
          />
        </svg>
      `;
    } else {
      this.$receivedElement.innerHTML = `
        <svg viewBox="0 0 100 100">
          <rect class="line line1" 
            width="80" x="10" y="20" 
            height="15" rx="10" 
          />
          <rect class="line line2" 
            width="80" x="10" y="45" 
            height="15" rx="10" 
          />
          <rect class="line line3" 
            width="80" x="10" y="70" 
            height="15" rx="10"
          />
        </svg>
      `;
    }

    if (this.elementOptions.$asideElement) {
      this.renderAsideElement();
    }

    this.addAttributes();
    this.setup();
  }

  private renderAsideElement():void {
    this.elementOptions.$asideElement!.dataset.wfType = 'menu-hamburger-aside';    
    this.elementOptions.$asideElement!.setAttribute('aria-expanded', String(false));
  
    if (this.elementOptions.optionalHandlers) {
      this.$backdropElement.dataset.wfType = 'backdrop';
      this.elementOptions.$asideElement?.after(this.$backdropElement);
    }
  }

  protected addAttributes():void {
    this.$receivedElement.dataset.wfType = "menu-hamburger";
    this.$receivedElement.dataset.animationIndex = String(this.elementOptions.animationIndex);
    this.$receivedElement.dataset.size = this.elementOptions.size;
    this.$receivedElement.ariaExpanded = String(false);
  }

  protected setup():void {
    this.toggle = this.toggle.bind(this);
    this.$receivedElement.addEventListener('click', this.toggle);
  }

  public toggle():void {
    if (this.elementOptions.$asideElement) {
      this.elementOptions.$asideElement.ariaExpanded = this.toggleHandler();
    }

    this.$receivedElement!.ariaExpanded = this.toggleHandler();
    this.windowKeyHandler = this.windowKeyHandler.bind(this);

    if (this.elementOptions.optionalHandlers && this.isOpen === true) {
      this.$backdropElement.dataset.active = '';
      this.$receivedElement.dataset.handlerActive = '';
      this.elementOptions.$asideElement!.dataset.handlerActive = '';

      this.$backdropElement.onclick = this.backdropClickHandler.bind(this);
      this.$receivedElement.onkeydown = this.windowKeyHandler.bind(this);
    }
    
    if (this.elementOptions.optionalHandlers && this.isOpen === false) {
      delete this.$backdropElement.dataset.active;
      delete this.$receivedElement.dataset.handlerActive;
      delete this.elementOptions.$asideElement!.dataset.handlerActive;
      
      this.$backdropElement.onclick = null;
      this.$receivedElement.onkeydown = null;
    }
  }

  public toggleHandler():string {
    return this.isOpen
      ? String(false)
      : String(true)
  }

  private backdropClickHandler(event):void {
    if (!(event.target as HTMLElement)
        .closest('[data-wf-type="menu-hamburger-aside"]') &&
      !(event.target as HTMLElement)
        .closest('[data-wf-type="menu-hamburger"]')
    ) {
      if (this.elementOptions.$asideElement) {
        this.elementOptions!.$asideElement!.ariaExpanded = String(false);
      }
      this.$receivedElement!.ariaExpanded = String(false);
      this.$backdropElement.onclick = null;
    }
  }

  private windowKeyHandler(event):void {
    if (event.key === 'Escape') {
      if (this.elementOptions.$asideElement) {
        this.elementOptions!.$asideElement!.ariaExpanded = String(false);
      }
      this.$receivedElement!.ariaExpanded = String(false);
    }
  }

  public remove(): void {
    this.$receivedElement.removeEventListener('click', this.toggle);
    this.$receivedElement.remove();
  }

  private validateIndexParam(indexParam:number | undefined | null):number | undefined  {
    if (indexParam === undefined) return this.elementOptions.animationIndex = 0;
    if (indexParam! < 0) return this.elementOptions.animationIndex = 0;
    if (indexParam! > 1) return this.elementOptions.animationIndex = 1;
  }
}