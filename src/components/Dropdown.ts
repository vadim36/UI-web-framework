import { Component, ComponentOptions, ElementSize } from '../abstract/Abstract';

type DropdownItem = string | HTMLElement | Array<string | HTMLElement>;

interface DropdownMenuOptions extends ComponentOptions {
  additionalStyles?:boolean,
  dropdownItem?: DropdownItem
}

export class DropdownMenu extends Component<DropdownMenuOptions> {
  readonly elementOptions: DropdownMenuOptions = {
    size: ElementSize.Primary,
    additionalStyles: false,
    dropdownItem: 'Hello world🥺'
  }

  constructor(
    readonly $receivedElement:HTMLButtonElement | HTMLAnchorElement,
    options?:DropdownMenuOptions
  ) {
    super();
    if (options) this.elementOptions = options;
    if (!options?.dropdownItem) {
      this.elementOptions.dropdownItem = 'Hello world🥺'
    }

    this.render();
  }

  private get elementContent():string | undefined {
    return this.$receivedElement.textContent?.trim();
  }

  public get isOpen():boolean {
    return this.$receivedElement.ariaExpanded === String(true);
  }

  private get $backdrop():HTMLElement | null | undefined {
    return this.$receivedElement.nextElementSibling
      ?.closest('[data-wf-type="backdrop"]');
  }

  protected render():void {
    this.$receivedElement.innerHTML = this.getDropdownTemplate();

    if (this.elementOptions.additionalStyles) {
      this.$receivedElement.dataset.addStyles = '';
    }

    const $backdrop = document.createElement('div');
    $backdrop.dataset.wfType = 'backdrop';
    this.$receivedElement.after($backdrop);

    this.addAttributes();
    this.setup();
  }

  private getDropdownTemplate():string {
    const $template = document.createElement('template');
    $template.innerHTML = `
      <span data-wf-type="dropdown-title">${this.elementContent}</span>
      <div data-wf-type="dropdown-content"></div>
    `;

    const $dropdownContentElement = $template.content
      .querySelector('div[data-wf-type="dropdown-content"]');

    if ( this.elementOptions.dropdownItem == '' || 
      Array.isArray(this.elementOptions.dropdownItem) && 
      !this.elementOptions.dropdownItem.length) {
        this.elementOptions.dropdownItem = 'Hello world🥺';
      }

    if (Array.isArray(this.elementOptions.dropdownItem)) {
      this.elementOptions.dropdownItem.forEach((arrayElement:string | HTMLElement) => {
        if (arrayElement == '') {
          this.elementOptions.dropdownItem = 'Hello world🥺';
        }
      })
    }

    const dropdownContent = this.elementOptions.dropdownItem;

    if (typeof dropdownContent == 'string') {      
      const $dropdownText = document.createElement('p');
      $dropdownText.setAttribute('data-wf-type', 'dropdown-text');
      $dropdownText.innerText = dropdownContent;
      $dropdownContentElement?.append($dropdownText);
    }

    if (dropdownContent instanceof HTMLElement) {
      $dropdownContentElement?.append(dropdownContent);
    }

    if (Array.isArray(dropdownContent)) {
      const $dropdownList = document.createElement('ul');
      $dropdownList.setAttribute('data-wf-type', 'dropdown-list');

      dropdownContent.forEach((dropdownListItem:string | HTMLElement):void => {
        const $dropdownListItem = document.createElement('li');

        if (typeof dropdownListItem == 'string') {
          $dropdownListItem.innerText = dropdownListItem;
        }

        if (dropdownListItem instanceof HTMLElement) {
          $dropdownListItem.append(dropdownListItem);
        }

        $dropdownList.append($dropdownListItem);
      });
      
      $dropdownContentElement?.append($dropdownList);
    }

    return $template.innerHTML;
  }

  protected addAttributes():void {
    this.$receivedElement.dataset.wfType = 'dropdown';
    this.$receivedElement.dataset.size = this.elementOptions.size;
    this.$receivedElement.setAttribute('aria-expanded', String(false)); 
  }

  private setup():void {
    this.clickHandler = this.clickHandler.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
    this.backdropClickHandler = this.backdropClickHandler.bind(this);

    this.$receivedElement.addEventListener('click', this.clickHandler);
    this.$receivedElement.addEventListener('keydown', this.keyHandler);
    this.$backdrop?.addEventListener('click', this.backdropClickHandler);
  }

  private clickHandler(event):string | boolean {
    event.preventDefault();
    this.closeAllDropdown(event);
    this.toggle();
  
    return this.isOpen
      ? this.$backdrop!.dataset.active = ''
      : delete this.$backdrop?.dataset.active;
  }

  private closeAllDropdown(event):void {
    const $allActiveDropdowns = document
      .querySelectorAll('[data-wf-type="dropdown"][data-wf-active]');

    if ($allActiveDropdowns.length) {
      $allActiveDropdowns.forEach(($dropdown):void => {
        $dropdown.removeAttribute('data-wf-active');
      });
    }

    event.target.closest('[data-wf-type="dropdown"]').dataset.wfActive = '';
  
    const $allDropdowns = document
      .querySelectorAll('[data-wf-type="dropdown"]:not([data-wf-active])');
    return $allDropdowns.forEach(($dropdown):void => {
      return $dropdown.setAttribute('aria-expanded', String(false));
    });
  }

  public toggle():string {
    return this.$receivedElement.ariaExpanded = 
      this.isOpen
        ? String(false)
        : String(true);
  }

  private keyHandler(event):string | void {
    if (event.key == 'Escape') {
      this.closeAllDropdown(event);
      return this.close();
    }
  }

  public close():string {
    return this.$receivedElement.ariaExpanded = String(false);
  }

  private backdropClickHandler(event):void {
    if (!event.target.closest('[data-wf-type="dropdown"]')) {
      this.close();
      this.$backdrop?.removeAttribute('data-active');
    }
  }

  public remove():void {
    this.$receivedElement.removeEventListener('click', this.clickHandler);
    this.$receivedElement.removeEventListener('keydown', this.keyHandler);
    this.$backdrop?.removeEventListener('click', this.backdropClickHandler);
    this.$receivedElement.remove();
  }
}