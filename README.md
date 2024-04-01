## 说明
这个项目能够让你在不打开b站直播间的情况下看弹幕，花了半天看了electron做的，肯定有一堆问题，但先凑合用吧。
## 原理
套个无视鼠标事件的electron窗口，用[bilibili-live-ws](https://github.com/simon300000/bilibili-live-ws)拿弹幕，用[danmaku](https://github.com/weizhenye/Danmaku)渲染弹幕
## 使用方法
我很忙(懒)，不想写什么界面，先凑合着用吧
### 使用方法1
- 如果你有node，直接clone下来，`npm install`就好
- 我不知道怎么自动获取参数，目前只能手动获取了。`config.ini.sample`是样例配置，填完之后改名为`config.ini`
1. 在浏览器登录b站
2. 访问下列链接，获取token作为config.ini的KEY
https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=改成你要看的直播间ID
3. 打开控制台获取buvid3作为config.ini的BUVID
4. `config.ini.sample`填完之后改名为`config.ini`
5. `npm run start`即可运行
### 使用方法2
- 目前还搞不懂客户端的路径，我用electron forge打了个exe，姑且这样用吧
1. 下载exe
2. 安装，直到安装界面消失，任务栏有个窗口图标但是整个windows窗口是透明的
3. 关掉安装界面，关不掉就去任务管理器kill掉
4. 和使用方法1的一样去，配置文件填好参数改名并放到`C盘用户目录/AppData/Local/bdanmaku_desktop/app-1.0.0/config.ini`
5. 启动exe