
type Handler<Event> = (e: Event) => Promise<any>
type BoxedEvent<EventTypes extends Record<string, any>> = {
    [K in keyof EventTypes]: { name: K, event: EventTypes[K] }
}[string]

export class AsyncEventEmitterBuilder<
    EventTypes extends Record<string, any>
> {
    constructor(private readonly events: string[], private handlers: { [E in keyof EventTypes]: Handler<EventTypes[E]>[] }) {}

    static start() {
        return new AsyncEventEmitterBuilder<{}>([], {})
    }

    define<EventType, EventName extends string>(event: EventName):
        AsyncEventEmitterBuilder<EventTypes & { [K in EventName]: EventType }>
    {
        return new AsyncEventEmitterBuilder([...this.events, event], this.handlers)
    }

    on<
        E extends keyof EventTypes,
        H extends Handler<EventTypes[E]>
    >(name: E, handler: H) {
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

export class AsyncEventEmitter<EventTypes extends Record<string, any>> {
    private queue: BoxedEvent<EventTypes>[] = []

    constructor(private readonly handlers: Record<string, Handler<any>[]>) {}

    emit<N extends keyof EventTypes, E extends EventTypes[N]>(name: N, event: E) {
        this.queue.push({ name, event } as BoxedEvent<EventTypes>)
    }
}

const builder = AsyncEventEmitterBuilder.start()
    .define<{ something: 'here' }, '1'>('1')
    .define<{ else: 2 }, '2'>('2')
    .on('1', async (e) => null)
    .define<{another: 'hi'}, '3'>('3')
    .on('2', async (e) => null)

const emitter = builder.build()
