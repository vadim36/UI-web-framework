export enum ElementSize {
  Small = 'sm',
  Primary = 'pm',
  Large = 'lg'
}


export interface ComponentOptions {
  size:ElementSize
}

export abstract class Component {
  readonly elementOptions = {
    size: ElementSize.Primary
  }

  constructor(options) {
    if (options) this.elementOptions = options;
  }

  protected abstract render():void;
  protected abstract addAttributes():void;
  abstract remove():void;
}