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
        .command('admin/bot/mute [...userIds]','禁言群成员')
        .option('time','-t <time:number> 禁言时长（单位：秒；默认：600）')
        .check(({session})=>{
            if((!['admin','owner'].includes(session.sender['role']) && !session.bot.admins.includes(session.sender.user_id))
                || (!session.bot.pickGroup(session.group_id).is_admin
                    && !session.bot.pickGroup(session.group_id).is_owner)){
                return '权限不足'
            }
        })
        .action(async ({session,bot,options},...user_ids)=>{
            let muteUsers:number[]=[]
            muteUsers.push(...user_ids.filter(user_id=>user_id.match(/^[0-9]*$/)).map(Number))
            muteUsers.push(...session.message.filter(msg=>msg.type==='at'&& typeof msg.qq==='number').map(msg=>msg['qq']))
            if(!muteUsers.length){
                const {ids}=await session.prompt({
                    type:'list',
                    message:'请输入你要禁言的成员qq',
                    name:'ids',
                    format:(value)=>value.map(val=>Number(val))
                })
                if(ids.length)muteUsers.push(...ids)
            }
            if(!muteUsers.length)return '禁言了0个成员'
            for(const user_id of muteUsers){
                await bot.pickGroup(session.group_id).muteMember(user_id,options.time)
            }
            if(options.time===0)return `已解除禁言:${muteUsers.join(',')}。`
            return `已禁言:${muteUsers.join(',')}。\n禁言时长：${(options.time||600)/60}分钟`
        })

    ctx.group()
        .command('admin/bot/kick [...user_id]','踢出群成员')
        .option('block','-b 是否拉入黑名单(默认false)')
        .check(({session})=>{
            if((!['admin','owner'].includes(session.sender['role']) && !session.bot.admins.includes(session.sender.user_id))
                || (!session.bot.pickGroup(session.group_id).is_admin
                    && !session.bot.pickGroup(session.group_id).is_owner)){
                return '权限不足'
            }
        })
        .action(async ({session,bot,options},...user_ids)=>{
            let kickUsers:number[]=[]
            kickUsers.push(...user_ids.filter(user_id=>user_id.match(/^[0-9]*$/)).map(Number))
            kickUsers.push(...session.message.filter(msg=>msg.type==='at'&& typeof msg.qq==='number').map(msg=>msg['qq']))
            if(!kickUsers.length){
                const {ids}=await session.prompt({
                    type:'list',
                    message:'请输入你要踢出的成员qq',
                    name:'ids',
                    format:(value)=>value.map(val=>Number(val))
                })
                if(ids.length)kickUsers.push(...ids)
            }
            if(!kickUsers.length)return '踢出了0个成员'
            for(const user_id of kickUsers){
                await bot.pickGroup(session.group_id).kickMember(user_id,options.block)
            }
            return `已踢出成员:${kickUsers.join(',')}。`
        })
    ctx.group()
        .command('admin/bot/invite [...user_id:number]','邀请好友加入群')
        .check(({session})=>{
            if((!['admin','owner'].includes(session.sender['role']) && !session.bot.admins.includes(session.sender.user_id))
                || (!session.bot.pickGroup(session.group_id).is_admin
                    && !session.bot.pickGroup(session.group_id).is_owner)){
                return '权限不足'
            }
        })
        .action(async ({session,bot,options},...user_ids)=>{
            if(!user_ids.length){
                const {ids}=await session.prompt({
                    type:'list',
                    message:'请输入你要邀请的好友qq',
                    format:(value)=>value.map(val=>Number(val)),
                    name:'ids'
                })
                if(ids)user_ids.push(...ids)
            }
            if(!user_ids.length) return '邀请了了0个好友'
            for(const user_id of user_ids){
                await bot.pickGroup(session.group_id).invite(user_id)
            }
            return `已邀请:${user_ids.join(',')}。`
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

