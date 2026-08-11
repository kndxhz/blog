---
title: "随身WIFI刷Debian"
description: "如何给随身WIFI刷入Debian系统"
tags:
  - 玩机日志
pubDate: "2024-03-13"
---

本篇文章记录个人刷机过程，如有错误欢迎指出  
~~轻点喷QAQ~~

## 选购

现在很多棒子都不是高通方案，买的时候要么跟车要么碰运气  
板子图片参考下图
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAOtanrwK6OYMVZN0dZL8mPxnpOtZ3kAAqsMaxvNBtlHC78UBDTjCosBAAMCAAN5AAM9BA.webp)

## 软件/工具

加粗为重要

- 螺丝刀
- 镊子
- miko tool
- Qualcomm Premium Tool
- 手
- **不弱智的脑子**

## 固件下载

[Debian · 随身WIFI做主控的4G远程遥控车教程 · 看云 (kancloud.cn)](https://www.kancloud.cn/a813630449/ufi_car/2795165)

## 9008备份、恢复

打开 miko tool 选择红圈里面的选项卡  
点击 `Load Partition Structure` 加载分区表，然后点击 `Read Full Image` 选择一个目录保存备份并等待进度条跑完
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAOxanrwPtd_4PWJVMNbcRAyWVIh_5YAAqwMaxvNBtlH-NgNZqrqM-sBAAMCAAN5AAM9BA.webp)
双击 `Double Click To Open EMMC DATA` 选择备份的文件点 `FLASH!` 刷入
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAO1anrwVanhvw_x-6yadZdhXCM-IRcAAq0MaxvNBtlHhD5ZV4VZe5ABAAMCAAN5AAM9BA.webp)
进入9008模式  
下面是两种对板子动手动脚进入9008的方式  
或者使用命令 `adb reboot edl`
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAO5anrwZLUV-ElNhojK8O9jeZxGylYAAq4MaxvNBtlHAAFOzhockmdJAQADAgADdwADPQQ.webp)
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAO7anrwaDofi9bvrpxdqtPYsKQ_fYsAAq8MaxvNBtlHm-Tm49HDlUABAAMCAAN3AAM9BA.webp)
需要安装9008驱动才能正确显示，不然显示未知设备
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAPBanrwgDzv-btaPGRHSLfyYOOH2dwAArAMaxvNBtlHRXcjK4sl95MBAAMCAAN4AAM9BA.webp)

## 刷机

运行 flash.bat 等待重启后按照提示按下任意键继续刷入，出现 all done 字样时代表刷机完成
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAPFanrxKFYLXPAB15zBIA0zFq_NbY8AArEMaxvNBtlHJIZTIUUF3qQBAAMCAAN5AAM9BA.webp)
如果 BL 锁了部分刷不进去的话需要把 boot 或者 aboot 用 Qualcomm Premium Tool 手动刷进去再执行 flash.bat 脚本刷机  
按照下图中红圈的部分打开对应的选项卡  
先点击紫色的 Scan 加载分区表，在表中选中要刷的分区，再点击黄色的 Write ，点击 Do Job 选择文件刷入
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAPGanrxKhZDgZTSaUqdk_DQdpolE40AArIMaxvNBtlHjRBugSLMeNMBAAMCAAN5AAM9BA.webp)

## 连接Debian

成功后会出现一个名为 `4G_UFI_123456`的WiFi，默认密码是 `12345678  `
建议先重插棒子后会看到设备管理器会出现一个未知设备，右键 更新驱动程序  
选择 `浏览我的电脑以查找驱动程序` - `让我从计算机上的可用驱动程序列表中选取` - `网络适配器` - `Microsoft` - `基于远程NDIS的Internet共享设备`  
选择一个你喜欢的 SSH 工具连接随身 WiFi 的 Debian 系统，IP `192.168.68.1`，用户名 `root`，默认密码 `1`  
使用 `nmtui命令` 按键盘方向键操作，点击 `编辑连接` - `网桥-bridge` - `编辑`  
按照下图把 wifi 的模式改成`Client` ，别忘了翻到最下面保存  
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAPNanrxSD1m8Yt-268l6c9FmWXwYVUAArMMaxvNBtlHNiPHP3I7iSYBAAMCAAN5AAM9BA.webp)
此时返回 nmtui首页选择启用连接就能连接自家 WIFI 了
