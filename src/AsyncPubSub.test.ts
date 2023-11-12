import { AsyncPubSubBuilder } from './AsyncPubSubBuilder.js'

describe('AsyncPubSub', function() {
    it('should build and run', async function() {
        const builder = AsyncPubSubBuilder.init()
            .define('1')<{ something: 'here' }>()
            .define('2')<{ else: 2 }>()
            .on('1', async (e) => console.log('handling event 1'))
            .define('3')<{ another: 'hi' }>()
            .on('2', async (e) => console.log('handling event 2'))

        const emitter = builder.build()

        emitter.publish('1', { something: 'here' })
        emitter.publish('2', { else: 2 })
        emitter.publish('1', { something: 'here' })
    })
})
