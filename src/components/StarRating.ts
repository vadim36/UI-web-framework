import { Component, ComponentOptions, ElementSize } from '../abstract/Abstract';

interface StarRatingOptions extends ComponentOptions {
  counterStars?:number,
  selectedStars?:number,
  additionalStyles?:boolean
}

export class StarRating extends Component<StarRatingOptions> {
  readonly elementOptions: StarRatingOptions = {
    size: ElementSize.Primary,
    counterStars: 5,
    selectedStars: 4,
    additionalStyles: false
  }

  constructor(
    readonly $receivedElement:HTMLFormElement,
    options:StarRatingOptions
  ) {
    super();

    if (options) this.elementOptions = options;
    options 
      ? this.validateParams(options, this.elementOptions)
      : null;

    this.render();
    this.setup();
  }

  private validateParams(options, elementOptions):void {
    if (options.counterStars === undefined) elementOptions.counterStars = 5;
    if (options.counterStars > 15) elementOptions.counterStars = 15;
    if (options.counterStars <= 0) elementOptions.counterStars = 1;
    if (options.selectedStars === undefined) {
      elementOptions.selectedStars = elementOptions.counterStars - 1;
    }
    if (options.selectedStars > options.counterStars ) {
      elementOptions.selectedStars = elementOptions.counterStars;
    }
    if (options.selectedStars < 0) {
      elementOptions.selectedStars = 0;
    }
    if (options.additionalStyles === undefined) elementOptions.additionalStyles = false;
  }

  protected render(): void {
    this.$receivedElement.innerHTML = this.getElementTemplate();

    return this.addAttributes();
  }

  private getElementTemplate():string {
    const $template = document.createElement('template');
    $template.innerHTML = `
      <label for="[data-wf-type='star-rating-link']" aria-labelby="about_this_section">
        Выберите рейтинг(в звездах):
      </label>`;

    for (let index = 0; index < (this.elementOptions.counterStars as number); index++) {
      const $starElement = document.createElement('button');
      $starElement.innerHTML = '★';
      $starElement.role = 'rating-link';

      $starElement.dataset.wfType = 'star-rating-link';
      $starElement.value = String((this.elementOptions.counterStars as number) - index);
      if ((index + 1) > (this.elementOptions.counterStars as number) 
        - (this.elementOptions.selectedStars as number)) {
        $starElement.dataset.checked = '';
      }

      $template.content.append($starElement);
    }

    return $template.innerHTML;
  }

  protected addAttributes(): void {
    this.$receivedElement.dataset.size = this.elementOptions.size;
    this.$receivedElement.dataset.wfType = 'star-rating';
    if (this.elementOptions.additionalStyles) {
      this.$receivedElement.dataset.addStyles = '';
    }
  }

  private setup():void {
    this.clickHandler = this.clickHandler.bind(this);
    this.$receivedElement.addEventListener('click', this.clickHandler);
  }

  private clickHandler(event):void {
    if (event.target.closest('[data-wf-type="star-rating-link"]')) {
      event.preventDefault();

      const $currentLink = event.target.closest('[data-wf-type="star-rating-link"]');
      const isLinkChecked = $currentLink.dataset.checked === '';
      const linkIndex = $currentLink.value;
      const allLinks = event.target.closest('[data-wf-type="star-rating"]')
        .querySelectorAll('[data-wf-type="star-rating-link"]');
      
      [...allLinks].forEach(($link):boolean => delete $link.dataset.checked);
      [...allLinks].forEach(($link):string | undefined => {
        if (Number($link.value) <= linkIndex) {
          return $link.dataset.checked = '';
        }
      });
    }
  }

  public remove():void {
    this.$receivedElement.removeEventListener('click', this.clickHandler);
    this.$receivedElement.remove();
  }
}