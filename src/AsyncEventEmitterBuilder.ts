import { Handler, Handlers } from './types'
import { AsyncEventEmitter } from './AsyncEventEmitter'

export class AsyncEventEmitterBuilder<EventTypes extends Record<string, any>> {
    constructor(private readonly events: string[], private handlers: Handlers<EventTypes>) {
    }

    static init() {
        return new AsyncEventEmitterBuilder<{}>([], {})
    }

    define<EventName extends string>(event: EventName){
        return <EventType>(): AsyncEventEmitterBuilder<EventTypes & { [K in EventName]: EventType }> => {
            return new AsyncEventEmitterBuilder([...this.events, event], this.handlers)
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
        return new AsyncEventEmitter<EventTypes>(this.handlers)
    }
}
