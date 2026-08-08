---
title: '[技术分析]U盘蠕虫病毒'
description: '一不小心U盘被感染了，解决完之后分析一下原理'
tags:
  - 技术
  - 病毒
pubDate: '2025-09-29'
---
HASH

SHA256:523043df1038626b7b99d866ec0eb1e9417c02199cdde5b79c053a417012f540

MD5:b76dfdbed9694290f4f441fb67c45c86

SHA1:414fc2ae569cd5d75c7c11e8e2226ddd10c99b66

[https://s.threatbook.com/report/file/523043df1038626b7b99d866ec0eb1e9417c02199cdde5b79c053a417012f540](https://s.threatbook.com/report/file/523043df1038626b7b99d866ec0eb1e9417c02199cdde5b79c053a417012f540)

  

# 前情提要

今天上午我日常上机房课的时候，插入U盘，瞬间感觉不对劲

-   系统缓慢
    
-   CPU吃满
    
-   U盘大量读写
    
-   文件扩展名消失（无法打开）
    
-   隐藏文件夹消失（无法打开）
    
-   打开U盘文件夹在新窗口打开
    
-   文件夹图标是Windows xp的
    

我就瞬间感觉到不对劲了，立马下了个火绒，安装完一运行，大量的蠕虫病毒自动处理映入眼帘

我立马感觉糟了

# 应急处置

1.  下载/打开安全软件，扫描U盘重要文件目录，让安全软件自动恢复重要文件，查杀恶意进程
    
2.  打开具有管理员权限的cmd，运行
    

    taskkill /f /im NTDETECT.EXE
    taskkill /f /im WINDOWS.EXE

3.  删除 c:\\NTDETECT.EXE C:\\WINDOWS.EXE （NTDETECT.EXE被隐藏，需要打开显示被系统保护的隐藏文件）
    
4.  使用安全软件的粉碎功能删除U盘根目录下的autorun.inf文件夹（受保护，被隐藏）
    
5.  检查注册表键：
    

    HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run\AVG
    HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced\HideFileExt
    HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced\Hidden

是否为正常值

6.  使用安全软件的自启动管理，检查是否有可疑启动项
    
7.  使用安全软件在U盘插上的情况下执行全盘扫描，确保没有遗漏项
    

# 技术分析

[https://s.threatbook.com/report/file/523043df1038626b7b99d866ec0eb1e9417c02199cdde5b79c053a417012f540](https://s.threatbook.com/report/file/523043df1038626b7b99d866ec0eb1e9417c02199cdde5b79c053a417012f540)

1.  执行了来源不明的恶意可执行文件（.exe）
    
2.  在C盘根目录释放了以下文件：`C:\NTDETECT.EXE` 和 `C:\WINDOWS.EXE`
    
3.  注册了系统自启动项
    
4.  修改了注册表设置，隐藏了文件扩展名和系统文件夹
    
5.  释放autorun.inf，使其就算删除了文件也会自动执行
    
6.  将原始U盘文件夹标记为受系统保护的文件并设置为隐藏属性
    
7.  在原始目录中释放了一个大小为173KB的可执行文件，该文件与文件夹同名
    
8.  遍历所有U盘中的文件夹，重复执行上述第6和第7项操作
    

该蠕虫程序不会修改用户文件内容，而是通过将可执行文件伪装成文件夹的方式进行传播。经哈希值验证，确认了此行为特征。

# 文件夹恢复

我让kimi给我写了个脚本，我亲测可用，你们可以运行这个python脚本来还原文件夹、删除恶意exe

（理论上**应急处置的操作7可以代替这个脚本**，如果你不想花太多时间的话可以使用这个脚本，但还是建议进行全面查杀，这只是将可以预见的风险消除了）

先

```powershell
pip install pywin32
```

    import os
    import sys
    import hashlib
    import stat
    import win32api  # pip install pywin32
    import win32con
    import win32file
    
    VIRUS_MD5 = "b76dfdbed9694290f4f441fb67c45c86"
    
    
    # ---------- 工具函数 ----------
    def md5_of_file(path: str, buf_size=65536) -> str:
        """计算文件 MD5"""
        h = hashlib.md5()
        with open(path, "rb") as f:
            while chunk := f.read(buf_size):
                h.update(chunk)
        return h.hexdigest()
    
    
    def is_removable_drive(drive_letter: str) -> bool:
        """判断盘符是否为可移动磁盘"""
        try:
            # 需要盘符为 "X:" 形式
            drive_letter = drive_letter.strip().rstrip("\\/")
            if len(drive_letter) != 2 or drive_letter[1] != ":":
                return False
            drive_num = ord(drive_letter[0].upper()) - ord("A")
            return win32file.GetDriveType(drive_letter + "\\") == win32con.DRIVE_REMOVABLE
        except Exception:
            return False
    
    
    def unset_hidden_attribute(path: str):
        """去掉文件/目录隐藏属性"""
        try:
            attrs = win32api.GetFileAttributes(path)
            win32api.SetFileAttributes(path, attrs & ~win32con.FILE_ATTRIBUTE_HIDDEN)
        except Exception as e:
            print(f"[WARN] 无法恢复 {path} 属性：{e}")
    
    
    def delete_readonly_file(path: str):
        """强制删除可能带只读属性的文件"""
        try:
            os.chmod(path, stat.S_IWRITE)
            os.remove(path)
        except Exception as e:
            print(f"[WARN] 删除失败 {path}：{e}")
    
    
    # ---------- 主逻辑 ----------
    def scan_and_clean(root: str):
        """递归扫描并清理"""
        for folder, subdirs, files in os.walk(root):
            for fname in files:
                if not fname.lower().endswith(".exe"):
                    continue
                exe_path = os.path.join(folder, fname)
                try:
                    if md5_of_file(exe_path) != VIRUS_MD5:
                        continue
                except Exception as e:
                    print(f"[WARN] 无法计算 MD5 {exe_path}：{e}")
                    continue
    
                # 检查同目录下是否存在同名隐藏目录
                dir_path = os.path.join(folder, fname[:-4])  # 去掉 .exe
                if not os.path.isdir(dir_path):
                    continue
    
                attrs = win32api.GetFileAttributes(dir_path)
                if not (attrs & win32con.FILE_ATTRIBUTE_HIDDEN):
                    continue
    
                # 确认病毒场景，开始清理
                print(f"[VIRUS] 发现病毒：{exe_path}")
                delete_readonly_file(exe_path)
                unset_hidden_attribute(dir_path)
                print(f"[FIXED] 已删除病毒并恢复目录：{dir_path}")
    
    
    def main():
        if not win32api.GetUserName():  # 简单判断管理员权限
            print("请以管理员身份运行本脚本！")
            sys.exit(1)
    
        # 枚举所有盘符
        drives = [
            f"{ch}:\\" for ch in "ABCDEFGHIJKLMNOPQRSTUVWXYZ" if os.path.exists(f"{ch}:\\")
        ]
    
        usb_roots = [d for d in drives if is_removable_drive(d)]
        if not usb_roots:
            print("未检测到可移动磁盘，退出。")
            return
    
        print(f"检测到可移动磁盘：{usb_roots}")
        for r in usb_roots:
            print(f"\n开始扫描 {r} …")
            try:
                scan_and_clean(r)
            except Exception as e:
                print(f"[ERROR] 扫描 {r} 时异常：{e}")
    
        print("\n处理完毕，按回车键退出。")
        input()
    
    
    if __name__ == "__main__":
        main()
    

# 情报分析

经初步调查分析，确认该病毒来源于学校服务器向各机房计算机桌面**分发**的**IllustratorCCPortable.rar**压缩文件。

该压缩包本应为标准软件安装包，但学校**从下崽站获取了包含蠕虫病毒**的安装包，导致所有计算机系统遭受感染，并进一步通过U盘传播。

由于机房系统具备自动安装功能，病毒程序得以成功执行、释放恶意文件、注册自启动项，并实现持续传播。

最终，所有接入学校机房电脑的U盘均被病毒感染。

# 杂谈

该蠕虫没有联网行为，其目的不明确。可能是为了展示技术或恶意干扰，具体意图难以判断。

学校的行为存在严重问题。我检查了学校的文件中心，发现大量非正版软件

如果因预算问题无法购买正版软件尚可理解，但学校不仅未进行病毒查杀，还将这些软件分发到所有电脑，导致我们的U盘被感染

这种做法极不负责