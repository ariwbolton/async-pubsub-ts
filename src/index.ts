import { AsyncEventEmitterBuilder } from './AsyncEventEmitterBuilder'

const builder = AsyncEventEmitterBuilder.init()
    .define('1')<{ something: 'here' }>()
    .define('2')<{ else: 2 }>()
    .on('1', async (e) => null)
    .define('3')<{ another: 'hi' }>()
    .on('2', async (e) => null)

export const emitter = builder.build()
