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

enum Svg {
  PATH = 'path',
}

enum SvgAttr {
  D = 'd',
  FILL = 'fill',
  STROKE = 'stroke',
  STROKE_LINECAP = 'stroke-linecap',
  STROKE_WIDTH = 'stroke-width',
}

enum Texture {
  Texture1 = 'filter1',
  Texture2 = 'filter2',
  Texture3 = 'filter3',
  Texture4 = 'filter4',
  Texture5 = 'filter5'
};

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
  Svg,
  SvgAttr,
  Texture,
  UndoRedoAction,
};
