import { Component, ComponentOptions,ElementSize } from '../abstract/Abstract';

interface MenuHamburgerOptions extends ComponentOptions {
  animationIndex?:number,
  $asideElement?:HTMLElement
}

export class MenuHamburger extends Component<MenuHamburgerOptions> {
  readonly elementOptions:MenuHamburgerOptions = {
    size: ElementSize.Primary,
    animationIndex: 0
  }

  constructor(
    readonly $receivedElement:HTMLButtonElement,
    options?:MenuHamburgerOptions
  ) {
    super();
    if (options) this.elementOptions = options;
    if (this.elementOptions.animationIndex) {
      this.validateIndexParam(this.elementOptions.animationIndex);
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
    this.elementOptions.$asideElement!.setAttribute('aria-expanded', String(true));
  }

  protected addAttributes():void {
    this.$receivedElement.dataset.wfType = "menu-hamburger";
    this.$receivedElement.dataset.animationIndex = String(this.elementOptions.animationIndex);
    this.$receivedElement.dataset.size = this.elementOptions.size;
    this.$receivedElement.ariaExpanded = String(true);
  }

  protected setup():void {
    this.$receivedElement.addEventListener('click', this.toggle.bind(this));
  }

  public toggle():string {
    if (this.elementOptions.$asideElement) {
      this.toggleAside();   
    }

    return this.$receivedElement!.ariaExpanded = this.toggleHandler();
  }

  private toggleHandler():string {
    return this.isOpen
      ? String(false)
      : String(true);
  }

  private toggleAside():string {
    return this.elementOptions.$asideElement!.ariaExpanded = this.toggleHandler();
  }

  public remove(): void {
    this.$receivedElement.removeEventListener('click', this.toggle);
    this.$receivedElement.remove();
  }

  private validateIndexParam(indexParam:number):number | undefined {
    if (indexParam < 0) return this.elementOptions.animationIndex = 0;
    if (indexParam > 1) return this.elementOptions.animationIndex = 1;
  }
}