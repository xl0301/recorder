# recorder

## 文件目录：

### demo h5 演示项目

```bash
安装依赖:npm i
启动:npm run dev
```

### rrweb-player 回放项目（已集成下载功能）

rrweb-player配置项：

~~~js
    const replayInstance = new rrwebPlayer({
      target: replayContainer,
      // 配置项
      props: {
        events: events, //数据源
        skipInactive: false, //是否快速跳过无用户操作的阶段
        showDebug: false, //是否在回放过程中打印 debug 信息
        showWarning: false, //是否在回放过程中打印警告信息
        autoPlay: true, //是否自动播放
        showControlle: true, //是否显示播放器控制 UI
        speedOption: [1, 2, 4, 8], //倍速播放可选值
        UNSAFE_replayCanvas: true,
      },
      // 下载按钮配置项
      downloadConfig: {
        isFullScreen: false, //录制时是否切换全屏开始录制
        target: "", //选择录制的dom元素。默认为.rr-player
      },
    });
~~~

### server 演示上传与下载功能的服务器

~~~bash
安装依赖:npm i
启动:npm run dev
~~~

