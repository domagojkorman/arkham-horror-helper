import Component from '@glimmer/component';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import cards from 'arkham-horror-helper/models/cards';
import {A as emberArray } from '@ember/array';
import CardModel from 'arkham-horror-helper/models/card';

const Mode = {
  IN_GAME: 1,
  EDIT_TOKENS: 2,
  EDIT_DECK: 3,
  EDIT_PLAY_AREA: 4,
}
export default class GameBoardComponent extends Component {

  @tracked tokens = []
  @tracked deck = []
  @tracked mode = Mode.IN_GAME

  get isEditMode() {
    return this.mode !== Mode.IN_GAME
  }

  get isEditTokensMode() {
    return this.mode === Mode.EDIT_TOKENS;
  }

  @action onEditTokensClick() {
    this.mode = Mode.EDIT_TOKENS;
  }

  @action onTokensChange(tokens) {
    this.tokens = tokens;
    this.mode = Mode.IN_GAME;
  }
}
