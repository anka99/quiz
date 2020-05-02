export const numberToTime = (time: number) => {
  return `${("00" + Math.floor(time / 60)).slice(-2)}:${(
    "00" +
    (time % 60)
  ).slice(-2)}`;
};
