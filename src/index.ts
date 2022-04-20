import {createApp} from 'oitq'
import * as database from '@oitq/plugin-database'
import * as qa from '@oitq/plugin-qa'
import * as schedule from '@oitq/plugin-schedule'
import * as common from '@oitq/plugin-common'
import * as callme from '@oitq/plugin-callme'
import * as music from '@oitq/plugin-music'
const app=createApp()
app.plugin(callme)
    .plugin(music)
    .plugin(common,{operator:1659488338})
    .plugin(qa)
    .plugin(schedule)
    .plugin(database,{
        dialect:'mysql',
        host:'*.*.*。*',
        database:'oitq',
        username:'root',
        password:'123456',
        logging:()=>{}
    })
app.start(8086)
