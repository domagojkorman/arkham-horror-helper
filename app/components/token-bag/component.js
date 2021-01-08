import Component from '@glimmer/component';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import {A as createArray} from '@ember/array';

export default class TokenBagComponent extends Component {

  @tracked drawnTokens = createArray()

  @action onModifyClick() {
    this.args.onModifyTokenBag()
  }

  @action onDrawClick() {
    const {tokens} = this.args;
    const randomIndex = Math.floor(Math.random() * tokens.length);
    this.drawnTokens = [tokens[randomIndex]];
  }

  @action onKeepDrawingClick() {
    const tokens = this.args.tokens.filter((token) => !this.drawnTokens.includes(token));
    if (!tokens.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * tokens.length);
    this.drawnTokens.pushObject(tokens[randomIndex]);
  }
}
