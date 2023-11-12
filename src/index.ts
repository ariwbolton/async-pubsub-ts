import { AsyncEventEmitterBuilder } from './AsyncEventEmitterBuilder'

const builder = AsyncEventEmitterBuilder.init()
    .define<{ something: 'here' }, '1'>('1')
    .define<{ else: 2 }, '2'>('2')
    .on('1', async (e) => null)
    .define<{ another: 'hi' }, '3'>('3')
    .on('2', async (e) => null)
export const emitter = builder.build()
