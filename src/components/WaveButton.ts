import { Component, ComponentOptions,ElementSize } from '../abstract/Abstract';

interface WaveButtonOptions extends ComponentOptions {}

export class WaveButton extends Component<WaveButtonOptions> {
  readonly elementOptions = {
    size: ElementSize.Primary
  }

  constructor(
    readonly $receivedElement:HTMLButtonElement,
    options?:WaveButtonOptions
  ) {
    super();
    if (options) this.elementOptions = options;

    this.render();
  }

  get receivedElementTextContent():string | undefined {
    return this.$receivedElement?.textContent?.trim();
  }

  protected render():void {
    this.$receivedElement!.innerHTML = `
      <span>${this.receivedElementTextContent}</span>
      <div></div>
    `;

    return this.addAttributes();
  }

  protected addAttributes():void {
    this.$receivedElement.dataset.wfType = "wave-button";
    this.$receivedElement.dataset.size = this.elementOptions?.size;
  }

  public remove():void {
    return this.$receivedElement.remove();
  }
}