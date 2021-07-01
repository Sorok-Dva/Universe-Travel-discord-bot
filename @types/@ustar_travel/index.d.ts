/** ***************************************************************************
 *  index.d.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/23 12:53 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 10:20 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
declare module '@ustar_travel/discord-bot' {
  /**
   * Standard Opaque type definition.
   *
   * @alias Opaque
   */
  export type Opaque<K, T> = T & { readonly tag: K }

  /**
   * Switch all object properties recursively as required
   *
   * @alias DeepRequired
   */
  export type DeepRequired<T> = Required<{
    [K in keyof T]: DeepRequired<T[K]>
  }>
}
