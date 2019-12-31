declare global {
    interface Window {[key: string]: any;}
}

interface CacheItem {
    element: HTMLElement
    promise: Promise<void>
}

function addScriptTag(src: string): CacheItem {
    const element = document.createElement('script')
    element.setAttribute('src', src)

    const promise = new Promise<void>((resolve, reject) => {
        element.addEventListener('error', reject)
        element.addEventListener('load', () => resolve())
        document.body.appendChild(element)
    })

    return { element, promise }
}

function getExpectFromWindow(expects: string[]): any[] {
    return expects.map((key: string) => {
        const ext: any = window[key]
        typeof ext === undefined && console.error(`No external named '${key}' in window`)
        return ext
    })
}

const CachedMap = new Map<string, CacheItem>()

export default async function fetchJsFromCDN(src: string, expects: string[] = []): Promise<any[]> {
    let cache = CachedMap.get(src)
    if (cache) {
        return cache.promise.then(() => getExpectFromWindow(expects))
    } else {
        cache = addScriptTag(src)
        CachedMap.set(src, cache)
        return cache.promise.then(() => getExpectFromWindow(expects))
    }
}
