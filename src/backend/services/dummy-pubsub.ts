// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SubscriberFn = (message: any) => void;

const subscribers: Record<string, SubscriberFn[] | undefined> = {};

export function subscribeToChannel(channel: string, subscriber: SubscriberFn) {
    console.debug("subscribeToChannel", { channel });
    let subs = subscribers[channel];
    if (!subs) {
        subs = [];
        subscribers[channel] = subs;
    }
    subs.push(subscriber);
    if (subs.length > 50) {
        console.warn("subscribeToChannel: large number of subscribers", {
            channel,
            count: subs.length,
        });
    }
    return () => {
        unsubscribeFromChannel(channel, subscriber);
    };
}

export function unsubscribeFromChannel(channel: string, subscriber: SubscriberFn) {
    console.debug("unsubscribeFromChannel", { channel });
    if (!subscribers[channel]) {
        return;
    }
    subscribers[channel] = subscribers[channel].filter((s) => s !== subscriber);
}

export function publishMessage<T = unknown>(channel: string, message: T) {
    const subs = subscribers[channel];
    console.debug("publishMessage", { channel, message, subscribers: (subs ?? []).length });
    if (!subs || subs.length === 0) {
        return;
    }
    subs.forEach((subFn) => subFn(message));
}
