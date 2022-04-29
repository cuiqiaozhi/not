# 萌新绕道！！！萌新绕道！！！萌新绕道！！！这项目不适合你，请自觉关闭网页
# 安装
clone 本仓库
```node
npm install
npm run dev
```

# 添加bot
## 1.oitq add 添加（此方法需要全局安装@oitq/cli或npm link @oitq/cli 后才能使用）
```node
oitq add
```
然后跟着流程走
## 2.更改配置文件
`npm run dev`后，会在当前目录生成默认配置文件oitq.config.json，往配置文件的bots数组中添加你的bot信息，可配置字段见当前目录下的bot.default.json，(注：bot.default.json中没有uin和password字段，需要填写自己的账号信息)
# 编写自己的插件
## 1.在oitq.config.json中添加plugin_di字段，值为你即将编写插件的目录绝对路径，以便程序能自动查找到对应插件
## 2.在你的插件目录新建js或ts文件编写你的插件逻辑
## 3.在oitq.config.json的plugins对象中添加一个键值对，key为你插件文件的名称，后缀名可省略，value为插件所需的config配置，没有则为true即可
