import Queue from 'queue'


type Handler<Event> = (e: Event) => Promise<any>
type Handlers<EventTypes extends Record<string, any>> = { [E in keyof EventTypes]: Handler<EventTypes[E]>[] }

export class AsyncEventEmitterBuilder<EventTypes extends Record<string, any>> {
    constructor(private readonly events: string[], private handlers: Handlers<EventTypes>) {}

    static init() {
        return new AsyncEventEmitterBuilder<{}>([], {})
    }

    define<EventType, EventName extends string>(event: EventName):
        AsyncEventEmitterBuilder<EventTypes & { [K in EventName]: EventType }>
    {
        return new AsyncEventEmitterBuilder([...this.events, event], this.handlers)
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

const builder = AsyncEventEmitterBuilder.init()
    .define<{ something: 'here' }, '1'>('1')
    .define<{ else: 2 }, '2'>('2')
    .on('1', async (e) => null)
    .define<{another: 'hi'}, '3'>('3')
    .on('2', async (e) => null)

const emitter = builder.build()

emitter.emit('1', { something: 'here' })
