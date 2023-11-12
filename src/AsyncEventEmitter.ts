import Queue from 'queue'

import { Handlers } from './types'
import { emitter } from './index'


export class AsyncEventEmitter<EventTypes extends Record<string, any>> {
    private queue = new Queue()

    constructor(private readonly handlers: Handlers<EventTypes>) {}

    async start() {
        await this.queue.start()
    }

    emit<N extends keyof EventTypes>(name: N, event: EventTypes[N]) {
        if (!this.handlers[name]) {
            throw new Error(`Invalid event '${String(name)}'`)
        }

        for (const handler of this.handlers[name]) {
            this.queue.push(async () => handler(event))
        }
    }
}

