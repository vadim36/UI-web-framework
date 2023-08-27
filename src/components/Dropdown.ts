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

    this.render();
  }

  private get elementContent():string | undefined {
    return this.$receivedElement.textContent?.trim();
  }

  public get isOpen():boolean {
    return this.$receivedElement.ariaExpanded === String(true);
  }

  protected render():void {
    this.$receivedElement.innerHTML = this.getDropdownTemplate();

    if (this.elementOptions.additionalStyles) {
      this.$receivedElement.dataset.addStyles = '';
    }

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
    this.$receivedElement.addEventListener('click', this.clickHandler.bind(this));
  }

  private clickHandler(event):string {
    event.preventDefault();

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
    $allDropdowns.forEach(($dropdown):void => {
      return $dropdown.setAttribute('aria-expanded', String(false));
    });

    return this.toggle();
  }

  public toggle():string {
    return this.$receivedElement.ariaExpanded = 
      this.isOpen
        ? String(false)
        : String(true);
  }

  public remove():void {
    document.addEventListener('click', this.clickHandler.bind(this));
    this.$receivedElement.remove();
  }
}