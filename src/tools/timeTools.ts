export const numberToTime = (time: number) => {
  if (time < 99 * 60 * 60 + 59 * 60 + 60) {
    return `${("00" + Math.floor(time / 3600)).slice(-2)}:${(
      "00" + Math.floor((time % 3600) / 60)
    ).slice(-2)}:${("00" + (time % 60)).slice(-2)}`;
  } else {
    return "time to give up";
  }
};
