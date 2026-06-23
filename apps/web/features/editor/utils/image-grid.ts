export const getGridSize = (count: number) => {
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);

  return { rows, cols };
};

export const getCenteredOffset = (index: number, count: number, size: number) =>
  index * size - ((count - 1) * size) / 2;
