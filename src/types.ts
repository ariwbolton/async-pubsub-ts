export type Handler<Event> = (e: Event) => Promise<any>
export type Handlers<EventTypes extends Record<string, any>> = { [E in keyof EventTypes]: Handler<EventTypes[E]>[] }
