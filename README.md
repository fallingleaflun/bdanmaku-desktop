## 说明
这个项目能够让你在不打开b站直播间的情况下看弹幕，花了半天看了electron做的，肯定有一堆问题，但先凑合用吧。
## 原理
套个无视鼠标事件的electron窗口，用[bilibili-live-ws](https://github.com/simon300000/bilibili-live-ws)拿弹幕，用[danmaku](https://github.com/weizhenye/Danmaku)渲染弹幕
## 使用方法
我很忙(懒)，不想写什么界面，先凑合着用吧，我不知道怎么自动获取会话数据，目前只能手动获取了
### 使用方法1
- 如果你有node，直接clone下来，`npm install`、`npm run start`即可
- 程序运行时，会有一个托盘，托盘里面有一个`复制配置文件路径`的选项，点击后会复制配置文件的路径
- 根据`config.ini.sample`以及下面的描述，在对应路径创建配置文件`config.ini`并填写参数
1. 在浏览器登录b站
2. 访问下列链接，获取token作为config.ini的KEY
https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=改成你要看的直播间ID
3. 打开控制台获取buvid3作为config.ini的BUVID
### 使用方法2
- 用electron forge打了个exe，姑且这样用吧
1. 去下载exe
2. 安装，直到安装界面消失，任务栏会有一个托盘，托盘里面有一个`复制配置文件路径`的选项，点击后会复制配置文件的路径
- 根据`config.ini.sample`以及下面的描述，在对应路径创建配置文件`config.ini`并填写参数
1. 在浏览器登录b站
2. 访问下列链接，获取token作为config.ini的KEY
https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=改成你要看的直播间ID
1. 打开控制台获取buvid3作为config.ini的BUVID
### 使用方法3
1. 在托盘里面点击“登录并选择直播间”的菜单，然后输入要看的直播间，确认后扫码登录，登录成功会自动关闭窗口，可以直接观看
