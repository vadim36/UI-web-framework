export enum ElementSize {
  Small = 'sm',
  Primary = 'pm',
  Large = 'lg'
}

export interface ComponentOptions {
  size:ElementSize
}

export abstract class Component<T> {
  readonly abstract elementOptions:T;
  protected abstract render():void;
  protected abstract addAttributes():void;
  abstract remove():void;
}