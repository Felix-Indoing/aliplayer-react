declare global {
    interface Window {[key: string]: any;}
}

async function addScriptTag(src: string): Promise<void> {
    const element = document.createElement('script')
    element.setAttribute('src', src)

    return new Promise<void>((resolve, reject) => {
        element.addEventListener('error', reject)
        element.addEventListener('load', () => resolve())
        document.body.appendChild(element)
    })
}

interface PromiseCache {
    [key: string]: Promise<void>
}

const promiseCache: PromiseCache = {}

async function addScriptTagWithCache(src: string): Promise<void> {
    let cache = promiseCache[src]
    if (!cache) {
        cache = addScriptTag(src)
        promiseCache[src] = cache
    }

    return cache
}

function getExpectFromWindow(expects: string[]): any[] {
    return expects.map((key: string) => {
        const ext: any = window[key]
        typeof ext === undefined && console.error(`No external named '${key}' in window`)
        return ext
    })
}

export default async function fetchJsFromCDN(src: string, expects: string[] = []): Promise<any[]> {
    await addScriptTagWithCache(src)
    return getExpectFromWindow(expects)
}
