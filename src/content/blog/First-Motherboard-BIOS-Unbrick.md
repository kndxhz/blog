---
title: "第一次主板BIOS救砖"
description: "瞎玩bios给bios干炸了，不得不开始救砖"
tags:
  - 技术
pubDate: "2025-07-28"
---

# 前情提要

我昨天刚换了个i3-12100f的板u套装，板子是昂达B610E-B**（第二代），丐板**

刚开始系统进不去，b站了一下，还好找到了解决方法，就是CSM的视频（媒体）要设置为传统，不能是UEFI（我也不知道为什么）

# 故事开始

我完事在微调散热器RGB的时候发现这个主板的bios竟然不是最新的！

这可要老命了，一般来说，我只要有时间，看到更新都会立马更新

又不是我之前那个华硕的B150M-PLUS刷了魔改bios，那种就是千万不能刷的

可是这个虽说是丐板，但是也算个品牌吧

于是就去官网下载了昂达B610E-B **（第三代）** 的最新固件，刷入我这个和我年龄差不多的4GB的刷机专用U盘

![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAIBAWp68mJPNTMmPz5vkuNZQSAsLduAAALADGsbzQbZR_CudStPd5HOAQADAgADdwADPQQ.webp)

虽然说我是第一次刷bios没错啦，可是看到这个官方文档里就这几步，我心想“这怎么可能错”

![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAIBAmp68mPEGFYYqA1vf28scAo2SJfTAALBDGsbzQbZR-UasxSg0Ax3AQADAgADeQADPQQ.webp)

结果您猜怎么着，正如标题所言，还真就错了

我明明已经按照教程操作，看到绿色的“FPT Operation Successful.”了

教程说下一步重启就行了

可是我重启完，就黑屏了

这时候，我意识到“完了！刷坏了！”

# 救砖

我手机砖是救了不少啦，什么9008什么MTK工程模式什么没搞过

可是当我真正开始救主板的时候，我发现无从下手

1.  我身边没有第二台电脑

2.  我不知道什么情况

3.  我是从闲鱼买的板u，应该没有售后

这几个困难让我晕头转向

bing了好久，b站了好久，试了好多方法，都不管用！

# 机遇

在这里，我真的感谢kimi K2，kimi本身就是做ai搜索起家的，没想到资源整合能力这么强

在我脑海里，他除了情商不如ds r1，其他的都是远远超过

![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAIBCWp68oNQTcxMVTSNNYpNchwFWF1HAALCDGsbzQbZR_NZG_yQn_B0AQADAgADdwADPQQ.webp)

以上是kimi的解决方案

猜猜我在哪步胜利了？

就是在

    ② 让系统自动刷写
    只要 Shell 能启动，它会自动执行 startup.nsh，里面通常写着：
    fpt.efi -f OI60EB01.rom -y
    或
    fpt.efi -bios -f OI60EB01.rom -y
    等待 3-5 分钟，期间不要断电。
    刷完后，主板会自动重启，若能亮机即恢复成功。

这一段

当我按照这个操作做完之后，没想到散热器RGB亮了！

这时候我就知道，我成功了！

随后再随便设置设置bios，就完成救砖了！

# 复盘

看到我第一大段和第二大段的加粗了么？

没错！

我的板子是**第二代**，而我下了**第三代**的固件

最后导致黑屏不开机

解决方法也很简单，用手机+OTG直接去官网再下一份第二代的，然后覆盖再按照kimi给出的操作就行了

下次搞涉及这种固件的东西一定要擦亮眼睛！

常言道“软件出bug顶死系统卡死（不涉及底层），硬件出bug直接报废”

第一次刷bios兼第一次救主板砖就这么结束了喵（擦汗

**本来机器码就变了一次，导致大部分注重安全的软件（例如Windows更新，PCL隐藏主题）就全部掉了**

**这下刷了bios好了，又掉一回**o(╥﹏╥)o
