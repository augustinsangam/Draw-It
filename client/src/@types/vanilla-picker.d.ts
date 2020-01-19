// github.com/Sphinxxxx/vanilla-picker/issues/30

declare module 'vanilla-picker' {
  interface Color {
    rgba: number[];
    hsla: number[];
    rgbString: string;
    rgbaString: string;
    hslString: string;
    hslaString: string;
    hex: string;
  }

  type ColorCallback = (color: Color) => void;

  interface Options {
    parent: HTMLElement;
    popup?: 'top' | 'bottom' | 'left' | 'right' | false;
    template?: string;
    layout?: string;
    alpha?: boolean;
    editor?: boolean;
    editorFormat?: 'hex' | 'hsl' | 'rgb';
    cancelButton?: boolean;
    color?: string;
    onChange?: ColorCallback;
    onDone?: ColorCallback;
    onOpen?: ColorCallback;
    onClose?: ColorCallback;
  }

  class Picker {
    constructor(options: Options);
    destroy(): void;
    // openHandler
    // closeHandler
    // movePopup
    show(): boolean;
    hide(): boolean;
    setColor(color: string, silent: boolean): void;
    static StyleElement(): HTMLStyleElement;
  }

  export default Picker;
}
