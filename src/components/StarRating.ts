import { Component, ComponentOptions, ElementSize } from '../abstract/Abstract';

interface StarRatingOptions extends ComponentOptions {
  counterStars?:number,
  selectedStars?:number
}

export class StarRating extends Component<StarRatingOptions> {
  readonly elementOptions: StarRatingOptions = {
    size: ElementSize.Primary,
    counterStars: 5,
    selectedStars: 4
  }

  constructor(
    readonly $receivedElement:HTMLElement,
    options:StarRatingOptions
  ) {
    super();
    options 
      ? this.validateParams(options, this.elementOptions)
      : null;

    this.render();
  }

  private validateParams(options, elementOptions):number | void {
    console.log(options);
    if (options) elementOptions = options;
    if (options.counterStars === undefined) elementOptions.counterStars = 5;
    if (options.counterStars > 15) elementOptions.counterStars = 15;
    if (options.counterStars <= 0) elementOptions.counterStars = 1;
    if (options.selectedStars === undefined) {
      elementOptions.selectedStars = elementOptions.counterStars - 1;
    }
    if (options.selectedStars > options.counterStars ) {
      elementOptions.selectedStars = elementOptions.counterStars - 1;
    }
    if (options.selectedStars < 0) {
      elementOptions.selectedStars = 0;
    }
  }

  protected render(): void {
    this.$receivedElement.innerHTML = this.getElementTemplate();

    return this.addAttributes();
  }

  private getElementTemplate():string {
    const $template = document.createElement('template');
    return $template.innerHTML;
  }

  protected addAttributes(): void {}
  public remove():void {}
}