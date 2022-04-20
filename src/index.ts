import {createApp} from 'oitq'
import * as example from '@/plugins/example'

import * as exampleJs from '@/plugins/example-js'
const app=createApp()
app.addBot({
    uin:1689919782,
    type:'qrcode',
    config:{
        platform:5
    }
})
app.plugin(example)
    .plugin(exampleJs)
app.start(8086)
