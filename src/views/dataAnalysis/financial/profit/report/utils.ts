export function getText(str: string) {
  return str
    .replace(/<[^<p>]+>/g, '')
    .replace(/<[</p>$]+>/g, '')
    .replace(/&nbsp;/gi, '')
    .replace(/<[^<br/>]+>/g, '');
}
export function isNull(str: string) {
  if (str == '') return true;
  var regu = '^[ ]+$';
  var re = new RegExp(regu);
  return re.test(str);
}
