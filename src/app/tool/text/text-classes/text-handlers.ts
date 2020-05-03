import {LetterDeleterHandler} from './letter-deleter-handler';
import {TextNavHandler} from './text-nav-handler';

export interface TextHandlers {
  textNav: TextNavHandler;
  letterDelete: LetterDeleterHandler;
}
