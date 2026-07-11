export const getImageDimensions = (img: HTMLImageElement, maxSize: number) => {
  const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));

  return {
    width: img.width * ratio,
    height: img.height * ratio,
  };
};
