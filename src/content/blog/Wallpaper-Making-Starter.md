---
title: "Wallpaper壁纸制作上手"
description: "试了一下做了一个Wallpaper壁纸"
tags:
  - 技术
pubDate: "2025-05-25"
---

# 前言

最近一直在搜罗新奇的Wallpaper壁纸

这是我的壁纸列表

![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAPhanrx6IapRrrx84_1VtBnRJJYhwcAArgMaxvNBtlHLS8tSBVfzKcBAAMCAAN3AAM9BA.webp)

这些都是我比较喜欢的壁纸

如你所见，大部分都是二次元就是了（

本文将基于[https://steamcommunity.com/sharedfiles/filedetails/?id=2475742954](https://steamcommunity.com/sharedfiles/filedetails/?id=2475742954)这一炮姐**网页**壁纸的素材，重构为**场景**类壁纸

使其性能消耗更少，打开速度更快！

建议有编程基础再尝试制作壁纸，会如同如鱼得水

## 言归正传

Wallpaper是一个非常好的壁纸引擎

[https://store.steampowered.com/app/431960/Wallpaper\_Engine/](https://store.steampowered.com/app/431960/Wallpaper_Engine/)

我是19RMB入手的，现在似乎涨到22.9了，不过依旧可以理解

据说Wallpaper的开发者只有俩人

毕竟也是要吃饭的嘛

## 为什么使用Wallpaper

Wallpaper得益于steam强大且丰富的创意工坊，拥有一大批精美优秀的壁纸

这也是为什么所有人都不推荐使用WeGame版本的原因

事实上，只要你b站视频刷的够多，你肯定见过Wallpaper的身影，绝大多数动态壁纸都是Wallpaper上来的

# 上手

## 类型

Wallpaper将壁纸分为了

- 场景

- 视频

- 网页

- 应用程序

这四大类，下面就简要说明一下

### 场景

这是Wallpaper中最常见的类型，同时也是官方推荐使用的，因为它足够简单易用，功能繁多，广受好评

本文的上手也是基于这一类型制作的

场景类的编程语言是**SceneScript**，可以先去看看[SceneScript Introduction | Wallpaper Engine - Designer Documentation](https://docs.wallpaperengine.io/en/scene/scenescript/introduction.html)这篇官方文档

可以大致了解一下，其实和js非常像

### 视频

顾名思义 视频

就是将普通视频作为壁纸而已 ，无需多言

### 网页

就是将网页作为壁纸使用

可以使用网页的css和js

因此熟悉网页开发的朋友可以轻易地上手

但是如果你会js的话，其实倒不如直接做场景类壁纸

### 应用程序

**最不推荐！！！**

应用程序类壁纸具有相当大的安全隐患

这也是“赛博花柳”存在的原因！！！

就是直接运行一个应用程序并全屏以及无边框到你的桌面，因此，Wallpaper并做不了任何限制，你电脑上的所有数据、密码之类任其读取

并且这类同样是创意工坊上存在的，千万不要下载！！！就算要下载也要选择信任的作者，多看评论区！

## 开始编写

Wallpaper自带一个极其丰富的编辑器

在主界面的左下角就能找到

打开之后，你就可以看到上文提到的壁纸类型了，你可以先试试视频和网页，先摸清Wallpaper编辑器的基础使用

![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAPjanrx7_7Jb31y4isIJcUtVn2be-IAArkMaxvNBtlHcHlK_0zPudQBAAMCAAN4AAM9BA.webp)

这里就以场景类壁纸做上手了

先从 原壁纸那里提取出四个webm格式视频，转化为mp4，加入素材

![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAPkanrx8iQ5P0osHeNwe8_zVMjKTCQAAroMaxvNBtlH06B5AAEoXN-dAQADAgADeAADPQQ.webp)

之后在页面下方的“用户属性”面板添加几个属性，这就是用户可以自定义的内容

![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAPoanrx9vH-E-W4vgfrDHgmpGVYlCsAArsMaxvNBtlHnqWRQpGDJrQBAAMCAAN5AAM9BA.webp)

可以看到出现了警告图标，鼠标放上面一看，没有绑定组件，我们在这里使用脚本对其进行检测和绑定，可以直接忽略

但是实际上做些简单的壁纸是可以直接绑定的，这样可以实现0代码自定义壁纸，详情可以看这篇官方文档，这里就不再赘述了

[https://docs.wallpaperengine.io/en/scene/userproperties/overview.html](https://docs.wallpaperengine.io/en/scene/userproperties/overview.html)

在图层详情的右上角可以看见一个齿轮图标，点击打开“绑定脚本”

![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAPxanryG7wp7bZkgOCHiyztFpNrFOcAArwMaxvNBtlH9Zirh4wTEHoBAAMCAANtAAM9BA.webp)

然后按照js的语法写了一些简单的代码，大佬轻喷

```javascript
"use strict";

/**
 * @param {Boolean} value - for property 'visible'
 * @return {Boolean} - update current property value
 */
export function update(value) {
  check(engine.userProperties); //每一刻都检查用户属性
  return value;
}
/**
 * @param {Object} changedUserProperties - only includes user properties that were recently changed!
//没错，only includes user properties that were recently changed!
//所以这是个麻烦事，还不如直接使用engine.userProperties来进行读取属性
 */
export function applyUserProperties(changedUserProperties) {
  check(changedUserProperties); //用户属性被更改时更需要检查
}
export function check(changedUserProperties) {
  if (changedUserProperties.wallpaperetype !== undefined) {
    shared.chose = changedUserProperties.wallpaperetype; //拿到wallpaperetype组件用户选择的类型（默认是Auto）（没错，我多打了个e，只能将错就错）
  }

  //console.log("Current choice:", shared.chose);
  if (engine.userProperties.wallpaperetype === "Auto") {
    let date = new Date();
    let hour = date.getHours(); //拿到小时
    //let hour = 1;
    //console.log(hour,shared.hour);
    //console.log(engine.userProperties.daystarts,engine.userProperties.eveningstarts);
    if (
      hour >= engine.userProperties.daystarts &&
      hour < engine.userProperties.eveningstarts
    ) {
      //如果在指定的时间范围内
      thisLayer.visible = true; //图层可见
    } else {
      //否则
      thisLayer.visible = false; //不可见
    }
  } else if (shared.chose === "Day") {
    //如果选择为Day，那么就始终可见
    thisLayer.visible = true;
  } else {
    thisLayer.visible = false;
  }
}

/**
 * @param {Boolean} value - for property 'visible'
 * @return {Boolean} - update current property value
 */
export function init(value) {
  engine.userProperties.wallpaperetype = "Auto"; //阿巴阿巴我也不知道这是干嘛的，但是如果不加可能会导致拿不到属性值
  engine.userProperties.daystarts = 5;
  return value;
}
```

然后以此类推复制四份出来稍微改一下，尤其是Night的跨24点的策略

```javascript
"use strict";

/**
 * @param {Boolean} value - for property 'visible'
 * @return {Boolean} - update current property value
 */
export function update(value) {
  check(engine.userProperties);
  return value;
}
/**
 * @param {Object} changedUserProperties - only includes user properties that were recently changed!
 */
export function applyUserProperties(changedUserProperties) {
  check(changedUserProperties);
}
export function check(changedUserProperties) {
  if (changedUserProperties.wallpaperetype !== undefined) {
    shared.chose = changedUserProperties.wallpaperetype;
  }
  //console.log("Current choice:", shared.chose);
  if (shared.chose === "Auto") {
    const date = new Date();
    const hour = date.getHours();
    const nightStarts = engine.userProperties.nightstarts;
    const morningStarts = engine.userProperties.morningstarts;

    // 处理跨天逻辑
    if (nightStarts < morningStarts) {
      // 常规时间段（不跨天）
      thisLayer.visible = hour >= nightStarts && hour < morningStarts;
    } else {
      // 跨天时间段（覆盖午夜）
      thisLayer.visible = hour >= nightStarts || hour < morningStarts;
    }
  } else if (shared.chose === "Night") {
    thisLayer.visible = true;
  } else {
    thisLayer.visible = false;
  }
}
```

然后运行测试一下，完美！更改属性也能正常应用，只不过切换动画有点懒得做了Qrz...，之后补上（画饼，毕竟涉及到太多，我才上手一下午）

## 发布！

![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAP1anryLRrZhGsL7LZt7bWYiy79jOoAAr0MaxvNBtlHx9jn71Gl9RoBAAMCAAN4AAM9BA.webp)

按照原作者的信息填一下各个信息，加个前缀表明是场景版，直接发布！

[https://steamcommunity.com/sharedfiles/filedetails/?id=3487356362](https://steamcommunity.com/sharedfiles/filedetails/?id=3487356362)

完美！

# 总结

Wallpaper的场景壁纸只要是会js语法的都能快速上手

编写简单壁纸也没有想象中的那么难，更别提编辑器的组件和代码之类的也有创意工坊了

但是涉及到复杂壁纸，那么就是应付不过来了，毕竟我也是刚上手，但是**SceneScript+场景**都能实现！

比如 夜萤 和 麻瓜这俩大佬就是全程使用场景！

Wallpaper是非常好的一款软件，大家都可以入手体验一下，哪怕不适合自己也能退款（
