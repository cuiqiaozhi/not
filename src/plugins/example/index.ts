import {Context,NSession} from 'oitq'
import {AtElem} from "oicq/lib/message/elements";

export const name='example'
function applyAdminHandler(ctx:Context,session:NSession<'request'>){
    const dispose=ctx.private(...session.bot.admins).middleware(async (sess)=>{
        if(['同意','拒绝','不同意'].includes(sess.cqCode)){
            await session.approve(['同意'].includes(sess.cqCode))
            await sess.reply(`已完成你的操作：【${sess.cqCode}】`)
            const otherAdmin=session.bot.admins.filter(admin=>admin!==sess.user_id)
            await session.bot.broadcast(otherAdmin,`管理员【${sess.user_id}】已处理`)
            dispose()
        }
    })
}
export function install(ctx:Context){
    ctx.group()
        .command('admin/bot/mute [user_id:number]','禁言群成员')
        .option('time','-t <time:number> 禁言时长（单位：秒；默认：600）')
        .check(({session})=>{
            if((!['admin','owner'].includes(session.sender['role']) && !session.bot.admins.includes(session.sender.user_id))
                || (!session.bot.pickGroup(session.group_id).pickMember(session.self_id).is_admin
                    && !session.bot.pickGroup(session.group_id).pickMember(session.self_id).is_owner)){
                return '权限不足'
            }
        })
        .action(async ({session,bot,options},user_id)=>{
            if(!user_id){
                const atUser=(session.message.find(msg=>msg.type==='at') as AtElem)?.qq
                if(typeof atUser==='number')user_id=atUser
            }
            if(!user_id){
                const {id}=await session.prompt({
                    type:'number',
                    message:'请输入你要禁言的成员qq',
                    name:'id'
                })
                if(id)user_id=id
            }
            if(!user_id) return 'user_id无效'
            return bot.pickGroup(session.group_id).muteMember(user_id,options.time)
        })

    ctx.group()
        .command('admin/bot/kick [user_id:number]','踢出群成员')
        .option('block','-b 是否拉入黑名单(默认false)')
        .check(({session})=>{
            if((!['admin','owner'].includes(session.sender['role']) && !session.bot.admins.includes(session.sender.user_id))
                || (!session.bot.pickGroup(session.group_id).pickMember(session.self_id).is_admin
                    && !session.bot.pickGroup(session.group_id).pickMember(session.self_id).is_owner)){
                return '权限不足'
            }
        })
        .action(async ({session,bot,options},user_id)=>{
            if(!user_id){
                const atUser=(session.message.find(msg=>msg.type==='at') as AtElem)?.qq
                if(typeof atUser==='number')user_id=atUser
            }
            if(!user_id){
                const {id}=await session.prompt({
                    type:'number',
                    message:'请输入你要踢出的成员qq',
                    name:'id'
                })
                if(id)user_id=id
            }
            if(!user_id) return 'user_id无效'
            return bot.pickGroup(session.group_id).kickMember(user_id,options.block)
        })
    ctx.group()
        .command('admin/bot/invite [user_id:number]','邀请好友加入群')
        .check(({session})=>{
            if((!['admin','owner'].includes(session.sender['role']) && !session.bot.admins.includes(session.sender.user_id))
                || (!session.bot.pickGroup(session.group_id).pickMember(session.self_id).is_admin
                    && !session.bot.pickGroup(session.group_id).pickMember(session.self_id).is_owner)){
                return '权限不足'
            }
        })
        .action(async ({session,bot,options},user_id)=>{
            if(!user_id){
                const atUser=(session.message.find(msg=>msg.type==='at') as AtElem)?.qq
                if(typeof atUser==='number')user_id=atUser
            }
            if(!user_id){
                const {id}=await session.prompt({
                    type:'number',
                    message:'请输入你要踢出的成员qq',
                    name:'id'
                })
                if(id)user_id=id
            }
            if(!user_id) return 'user_id无效'
            return bot.pickGroup(session.group_id).invite(user_id)
        })

    ctx.on('bot.request.friend.add',async (session)=>{
        if(session.bot.admins.includes(session.user_id)) return session.approve(true)
        await session.bot.broadcast(session.bot.admins,`来自【${session.source}】的【${session.nickname}】请求添加好友`)
        applyAdminHandler(ctx,session)
    })
    ctx.on('bot.request.group.add',async (session)=>{
        if(session.bot.admins.includes(session.user_id)) return session.approve(true)
        await session.bot.broadcast(session.bot.admins,`【${session.group_name}】:【${session.nickname}】请求加群，备注信息:\n${session.comment}`)
        applyAdminHandler(ctx,session)
    })
    ctx.on('bot.request.group.invite',async (session)=>{
        if(session.bot.admins.includes(session.user_id)) return session.approve(true)
        await session.bot.broadcast(session.bot.admins,`【${session.user_id}】邀请加群【${session.group_name}】`)
        applyAdminHandler(ctx,session)
    })
}

