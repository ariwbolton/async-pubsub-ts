import Queue from 'queue'

import { Handlers } from './types'


export class AsyncPubSub<EventTypes extends Record<string, any>> {
    private queue = new Queue({ autostart: true, concurrency: 2 })

    constructor(private readonly handlers: Handlers<EventTypes>) {
        this.queue.addEventListener('start', e => console.log('start!'))
        this.queue.addEventListener('success', e => console.log('success!'))
        this.queue.addEventListener('error', e => console.log('error!'))
        this.queue.addEventListener('timeout', e => console.log('timeout!'))
        this.queue.addEventListener('end', e => console.log('end!'))
    }

    async start() {
        await this.queue.start()
    }

    publish<N extends keyof EventTypes>(name: N, event: EventTypes[N]) {
        if (!this.handlers[name]) {
            throw new Error(`Invalid event '${String(name)}'`)
        }

        this.queue.push(...this.handlers[name].map(handler => async () => handler(event)))
    }
}

