export const downloadFile = (data, name, type = 'text/plain;charset=utf-8') => {
  let blob = new Blob([data], { type: type });
  let downloadElement = document.createElement('a');
  let href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = name;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  downloadElement.remove();
  window.URL.revokeObjectURL(href);
};
