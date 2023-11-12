
type Handler<Event> = (e: Event) => Promise<void>
type HandlerReg<EventTypes extends Record<string, any>, EventName extends keyof EventTypes> = {
    event: EventName
    handler: Handler<EventTypes[EventName]>
}

export class AsyncEventEmitterBuilder<
    EventTypes extends Record<string, any>,
    EventHandlers extends readonly HandlerReg<EventTypes, any>[]
> {
    constructor(private readonly events: string[], private readonly handlers: EventHandlers) {}

    static start() {
        return new AsyncEventEmitterBuilder<{}, []>([], [])
    }

    define<EventType, EventName extends string>(event: EventName):
        AsyncEventEmitterBuilder<
            EventTypes & { [K in EventName]: EventType },
            EventHandlers
        >
    {
        return new AsyncEventEmitterBuilder([...this.events, event], this.handlers)
    }

    on<
        EventName extends keyof EventTypes,
        H extends Handler<EventTypes[EventName]>
    >(event: EventName, handler: H) {
        const eventReg: HandlerReg<EventTypes, EventName> = {
            event,
            handler
        }

        return new AsyncEventEmitterBuilder<EventTypes, [...EventHandlers, typeof eventReg]>(this.events, [...this.handlers, eventReg])
    }

    build() {}
}

export class AsyncEventEmitter<T> {
    constructor() {}

    emit() {}
}

const builder = AsyncEventEmitterBuilder.start()
    .define<{ something: 'here' }, 'event1'>('event1')
    .define<{ else: 2 }, 'event2'>('event2')
