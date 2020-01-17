import React, { useEffect, useRef, useMemo } from 'react'
import loadScript from './load-script'
import './deps/aliplayercomponents-1.0.5.min.js'
import './index.css'

const SOURCE_URL = 'https://g.alicdn.com/de/prismplayer/2.8.7/aliplayer-min.js'

interface Props {
    config: any;
    onGetInstance?: Function;

    [key: string]: any
}

const Aliplayer = React.forwardRef(({ config, onGetInstance, otherProps }: Props, ref: any) => {
        const id = useMemo(() => `aliplayer-${Math.floor(Math.random() * 1000000)}`, [])
        const player = useRef(null)

        useEffect(() => {
            if (!id || player.current) { return }

            loadScript(SOURCE_URL, ['Aliplayer'])
                .then(([Aliplayer]) => {
                    if (player.current) { return }

                    player.current = new Aliplayer({
                        ...config,
                        'id': id,
                    }, (player: any) => {
                        onGetInstance && onGetInstance(player)
                    })
                })
        }, [id, config])

        return (<div {...otherProps} id={id} ref={ref}/>)
    }
)

export const AliPlayerComponent = window.AliPlayerComponent
export default Aliplayer
