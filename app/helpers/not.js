import { helper } from '@ember/component/helper';

function not([param]) {
  const result = Array.isArray(param) ? param.length > 0 : Boolean(param);
  return !result;
}

export default helper(not);
