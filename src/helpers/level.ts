/** ***************************************************************************
 *  helpers/level.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com> & @elonm
 *  | || | |___ \
 *  | || |_  __) |            Created: 2022/01/30 5:23 AM by Сорок два
 *  |__   _|/ __/             Updated: 2022/01/30 5:25 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */

const calculate = (message: number): number => {
  const multiplier = 1.5
  if (message <= 10) {
    return 1
  }

  return Math.floor(
    Math.log((multiplier * message) / 10) / Math.log(multiplier),
  )
}

export {
  // eslint-disable-next-line import/prefer-default-export
  calculate,
}
