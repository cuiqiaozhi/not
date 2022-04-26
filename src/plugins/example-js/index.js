module.exports={
    name:'example-js',
    install(ctx){
        console.log(1)
        ctx.command('testJs','js样例')
            .action(({session})=>{
                session.reply('hello js')
            })
    }
}
