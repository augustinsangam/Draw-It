import { SvgHeader } from './svg/svg-header';
import { SvgShape } from './svg/svg-shape';

export interface ImageFile {
  header: SvgHeader;
  shape: SvgShape;
  draws: string;
}
