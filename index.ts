type TResult<Result> = [
    /**
      * @Param load
      * Load data
      */
    () => Promise<Result>,
    /**
      * @Param get
      * Get data
      */
    () => Promise<Result>,
    /**
      * @Param stop
      * Stop loading data
      */
    () => void,
    /**
      * @Param getItems
      * Get last previous saved items
      */
    () => Result[]
]

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function createLoadGetter<Result>(fn: () => PromiseLike<Result>, repeatTimeout = 500): TResult<Result> {
    let data: any;
    let timeout = 0;
    let isLoading = false;
    let interval: Timer;
    let prevItems: Result[] = [];
    let lastUsage = Date.now();
    const noActivityTimeout = 10 * 60 * 1000;

    const get = async (times = 0): Promise<Result> => {
        if (Date.now() - noActivityTimeout > lastUsage) {
            isLoading = false;
            await load()
        }
        lastUsage = Date.now();
        if (timeout && Date.now() - timeout > 2 * 1000 * 1000) {
            await wait(1000);
            return get(times + 1);
        }

        if (!data && !isLoading) {
            isLoading = true;
            load()
            return fn();
        }
        if (data) {
            return data;
        }

        await wait(100);

        if (!data) {
            await wait(1000);
            return get(times + 1);
        }

        return data;
    }

    const load = async () => {
        if (interval) {
            clearInterval(interval);
        }

        isLoading = true;
        interval = setInterval(async () => {
            if (Date.now() - noActivityTimeout > lastUsage) {
                clearInterval(interval)
                return;
            }
            data = await fn()
            if (!prevItems.some((p) => JSON.stringify(p) === JSON.stringify(data))) {
                prevItems = prevItems.concat(data).slice(-50);
            }
            // console.log(`Loaded: ${fn.toString()}, ${JSON.stringify(data)}`)
        }, repeatTimeout)

        data = await fn();
        return data as Result;
    }

    const stop = () => {
        clearInterval(interval);
    }

    return [
        get,
        load,
        stop,
        () => prevItems,
    ]
}
