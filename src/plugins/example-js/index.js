module.exports={
    name:'example-js',
    install(ctx){
        ctx.command('testJs')
            .action(({session})=>{
                session.reply('hello js')
            })
    }
}
