import Component from '@glimmer/component';
import {action} from '@ember/object';

export default class InputComponent extends Component {

  @action onInput(event) {
    const {value} = event.target;
    this.args.onChange(value);
  }
}
