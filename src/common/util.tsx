export const getFilesize = (size: number) => {
  //把字节转换成正常文件大小
  if (!size) return '';
  const num = 1024.0; //byte
  if (size < num) return size + ' B';
  if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + ' KB'; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + ' MB'; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + ' G'; //G
  return (size / Math.pow(num, 4)).toFixed(2) + ' T'; //T
};
