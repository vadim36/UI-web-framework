import { Component, ComponentOptions,ElementSize } from '../abstract/Abstract';

interface TabContentOption {
  tabName:string,
  tabContent:string | HTMLElement,
  isCurrentTab?:boolean
}

interface TabsOptions extends ComponentOptions {
  tabs: TabContentOption[]
}

type TabsElementObject = {
  tab:HTMLLIElement,
  tabPanel:HTMLDivElement
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

  readonly tabsElements: TabsElementObject[] = [];

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
    this.setup();
  }

  private getTabsTemplate():string {
    const $template = document.createElement('template');
    $template!.innerHTML = `
      <ul
        data-wf-tablist 
        aria-controls="[data-wf-type='tabs']" 
        aria-label="for-tabs-element"
        role="presentation">
      </ul>
    `;

    const $tabsControlButtonsList = $template.content.querySelector('ul[data-wf-tablist]');

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
      
      this.addTabElementAttribute($newControlTab as HTMLLIElement, 'tab', index);
      $newControlTab.setAttribute('tabindex', String(1));
      
      if (index == this.getCurrentTabIndex()) {
        $newControlTab.setAttribute('aria-selected', String(true));
      }

      $appendElement!.append($newControlTab);
    }
  }

  private renderTabpanel($appendElement:HTMLElement | DocumentFragment):void {
    for (let index = 0; index < this.elementOptions.tabs.length; index++) { 
      const tabOption:TabContentOption = this.elementOptions.tabs[index];

      const $newContentTab = document.createElement('div');
      this.addTabElementAttribute($newContentTab as HTMLDivElement, 'tabpanel', index);
      $newContentTab.setAttribute('aria-labelby', `tab-${index}`);
      $newContentTab.setAttribute('tabindex', String(-1));

      if (typeof tabOption.tabContent == 'string') {
        $newContentTab.innerHTML = `${tabOption.tabContent}`;
      }

      if (tabOption.tabContent instanceof HTMLElement) {
        $newContentTab.append(tabOption.tabContent);
      }

      if (index == this.getCurrentTabIndex()) {
        $newContentTab.setAttribute('aria-selected', String(true));
      }

      $appendElement.append($newContentTab);
    }
  }

  private addTabElementAttribute($tabElement:HTMLElement, 
    tabRole:string, index:number):void 
  {
    $tabElement.setAttribute('role', tabRole);
    $tabElement.setAttribute('aria-selected', String(false));
    $tabElement.setAttribute('data-tab-index', String(index));
  }

  private getCurrentTabIndex() {
    let currentTabObjectIndex:number = [...this.elementOptions.tabs]
      .findIndex((tabOption:TabContentOption):boolean | undefined => {
        return tabOption.isCurrentTab;
    });

    if (currentTabObjectIndex == -1) currentTabObjectIndex = 0;

    return currentTabObjectIndex;
  }

  private setup():void {
    this.setupHandler = this.setupHandler.bind(this);
    this.$receivedElement.addEventListener('click', this.setupHandler);
  }

  private setupHandler(event):void {
    if (event.target.closest('li[role="tab"]')) {
      event.preventDefault();

      const selectedTab = event.target.closest('li[role="tab"]');
      const selectedTabPanel = this.$receivedElement
        .querySelector(`div[data-tab-index="${selectedTab.dataset.tabIndex}"`);
      
      this.$receivedElement
        .querySelector('li[aria-selected="true"]')!.ariaSelected = String(false);
      this.$receivedElement
        .querySelector('div[aria-selected="true"]')!.ariaSelected = String(false);

      selectedTab!.ariaSelected = String(true);
      selectedTabPanel!.ariaSelected = String(true);
    }
  }

  protected addAttributes():void {
    this.$receivedElement.dataset.wfType = 'tabs';
    this.$receivedElement.dataset.size = this.elementOptions.size; 
  }

  public remove():void {
    this.setupHandler = this.setupHandler.bind(this);
    this.$receivedElement.removeEventListener('click', this.setupHandler);
    return this.$receivedElement.remove();
  }
}