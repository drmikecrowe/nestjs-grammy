import { createEmitterDecorator } from '../../utils'

/**
 * Registers middleware for provided update type.
 *
 * @see https://telegraf.js.org/#/?id=on
 */
export const On = createEmitterDecorator('on')
