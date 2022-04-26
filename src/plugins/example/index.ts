import {Context} from 'oitq'
export const name='example'
export function install(ctx:Context){
    ctx.command('test','ts样例2')
        .action(({session})=>{
            session.reply('hello world')
        })
}
