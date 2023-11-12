import { Handler, Handlers } from './types'
import { AsyncPubSub } from './AsyncPubSub.js'

export class AsyncPubSubBuilder<EventTypes extends Record<string, any>> {
    constructor(private readonly events: string[], private handlers: Handlers<EventTypes>) {
    }

    static init() {
        return new AsyncPubSubBuilder<{}>([], {})
    }

    define<EventName extends string>(event: EventName){
        return <EventType>(): AsyncPubSubBuilder<EventTypes & { [K in EventName]: EventType }> => {
            return new AsyncPubSubBuilder([...this.events, event], this.handlers)
        }
    }

    on<E extends keyof EventTypes>(name: E, handler: Handler<EventTypes[E]>) {
        if (!this.handlers[name]) {
            this.handlers[name] = []
        }

        this.handlers[name].push(handler)

        return this
    }

    build() {
        return new AsyncPubSub<EventTypes>(this.handlers)
    }
}
