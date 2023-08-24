import { Component, ComponentOptions,ElementSize } from '../abstract/Abstract';

interface TabContentOption {
  tabName:string,
  tabContent:string | HTMLElement,
  isCurrentTab?:boolean
}

interface TabsOptions extends ComponentOptions {
  tabs: TabContentOption[]
}

export class Tabs extends Component<TabsOptions> {
  readonly elementOptions:TabsOptions = {
    size: ElementSize.Primary,
    tabs: [
      {
        tabName: 'Default Tab',
        tabContent: 'Hello world✨!'
      }
    ]
  }

  constructor(
    readonly $receivedElement:HTMLDivElement,
    options?:TabsOptions
  ) {
    super();
    if (options) this.elementOptions = options;

    this.render();
    this.addAttributes();
  }

  protected render():void {
    this.$receivedElement.innerHTML = this.getTabsTemplate();
  }

  private getTabsTemplate():string {
    const $template = document.createElement('template');
    $template!.innerHTML = `
      <ul
        data-tablist 
        aria-controls="[data-wf-type='tabs']" 
        aria-label="for-tabs-element"
        role="tablist">
      </ul>
    `;

    const $tabsControlButtonsList = $template.content.querySelector('ul[data-tablist]');

    this.renderTablist($tabsControlButtonsList as HTMLElement);
    this.renderTabpanel($template.content as DocumentFragment);

    return $template!.innerHTML;
  }

  private renderTablist($appendElement:HTMLElement):void {
    for (let index = 0; index < this.elementOptions.tabs.length; index++) {
      const tabOption:TabContentOption = this.elementOptions.tabs[index];
      
      const $newControlTab = document.createElement('li');
      $newControlTab.innerHTML = 
        `<a href="">${tabOption.tabName}</a>`;
      
      this.addTabElementAttribute($newControlTab as HTMLLIElement, 'tab');
      
      if (index == this.setCurrentTab()) {
        $newControlTab.setAttribute('aria-selected', String(true));
      }

      $appendElement!.append($newControlTab);
    }
  }

  private renderTabpanel($appendElement:HTMLElement | DocumentFragment):void {
    for (let index = 0; index < this.elementOptions.tabs.length; index++) { 
      const tabOption:TabContentOption = this.elementOptions.tabs[index];

      const $newContentTab = document.createElement('div');
      this.addTabElementAttribute($newContentTab as HTMLDivElement, 'tabpanel');
      $newContentTab.innerHTML = `${tabOption.tabContent}`;

      if (index == this.setCurrentTab()) {
        $newContentTab.setAttribute('aria-selected', String(true));
      }

      $appendElement.append($newContentTab);
    }
  }

  private addTabElementAttribute($tabElement:HTMLElement, tabRole:string):void {
    $tabElement.setAttribute('role', tabRole);
    $tabElement.setAttribute('aria-selected', String(false));
  }

  private setCurrentTab() {
    let currentTabObjectIndex:number = [...this.elementOptions.tabs]
      .findIndex((tabOption:TabContentOption):boolean | undefined => {
        return tabOption.isCurrentTab;
    });

    if (currentTabObjectIndex == -1) currentTabObjectIndex = 0;

    return currentTabObjectIndex;
  }

  protected addAttributes():void {
    this.$receivedElement.dataset.wfType = 'tabs';
    this.$receivedElement.dataset.size = this.elementOptions.size; 
  }

  public remove():void {
    return this.$receivedElement.remove();
  }
}