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

  get elementContent():string | null {
    return this.$receivedElement.textContent;
  }

  protected render():void {
    this.$receivedElement.innerHTML = this.getDropdownTemplate();

    if (this.elementOptions.additionalStyles) {
      this.$receivedElement.dataset.addStyles = '';
    }

    this.addAttributes();
  }

  private getDropdownTemplate():string {
    const $template = document.createElement('template');
    $template.innerHTML = `
      <span data-wf-type="dropdown-title">${this.elementContent}</span>
      <div data-wf-type="dropdown-content"></div>
    `;

    const $dropdownContentElement = $template.content
      .querySelector('div[data-wf-type="dropdown-content"]');
    const dropdownContent = this.elementOptions.dropdownItem;

    if (typeof dropdownContent == 'string') {
      const $dropdownText = document.createElement('p');
      $dropdownText.innerText = dropdownContent;
      $dropdownContentElement?.append($dropdownText);
    }

    if (dropdownContent instanceof HTMLElement) {
      $dropdownContentElement?.append(dropdownContent);
    }

    if (Array.isArray(dropdownContent)) {
      const $dropdownList = document.createElement('ul');

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
  }

  public remove():void {
    this.$receivedElement.remove();
  }
}