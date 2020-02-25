const SVG_NS = 'http://www.w3.org/2000/svg';

enum Mouse {
  LEFT_BTN,
  MIDDLE_BTN,
  RIGHT_BTN,
}

enum UndoRedoAction {
  SVG,
}

enum Opacity {
  SEMI = .5,
  FULL = 1,
}

interface DrawConfig {
  color: string;
  height: number;
  width: number;
  id?: number;
  name?: string;
  tags?: string[];
  gEl?: SVGGElement;
}

export {
  DrawConfig,
  Mouse,
  Opacity,
  SVG_NS,
  UndoRedoAction,
};