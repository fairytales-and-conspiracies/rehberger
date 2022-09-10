export default (url, filename, extension) => {
  fetch(url)
    .then((res) => res.blob())
    .then((file) => {
      const tempUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.download = filename && extension ? `${filename}.${extension}` : true;
      link.href = tempUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(tempUrl);
    })
    .catch(() => {
      // TODO: LOG
      console.error('Failed to download file!');
    });
};
