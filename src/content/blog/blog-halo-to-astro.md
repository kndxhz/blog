---
title: "Astro 迁移日志"
description: "近期以来,Halo愈发繁重,而且问题不断,遂直接在AI的帮助下重构并迁移到Astro,此篇文章记录了一些迁移的过程"
tags:
  - 日常
  - 技术
pubDate: "2026-08-13"
---
## 前言
我之前的博客一直使用 Halo 作为平台，刚部署完的时候觉得美滋滋，事实上也确实如此    
可是过了将近一年之后，Halo的弊端便显现出来了

 - 繁重的Java，在低配置服务器上运行并不是很流畅
 - 频繁的更新，加载速度极慢的主页
 - 虽说有插件、主题，但是定制化仍然不够
 - 日益商业化，甚至出现了“Halo 专业版”这种东西

因此，我不得不迫切寻找一个替代的平台，可以满足我所有的需求  
最后，我在我[一些朋友](https://www.kndxhz.cn/partners.html) 的站点里找...  
我找到了一个非常好、非常现代化的框架：Astro 。 也就是你现在所看到的这个
## 一些基础工作

毋庸置疑，我必须有一套完整的工作流，否则我将很难在无后台的博客框架上畅快的使用  
为了这一套工作流，我是真的~~在数学课上~~思考了好久。最后总结出一套方案，大概是这样的  

1. 开源，使用Github作为托管平台，也就是 https://github.com/kndxhz/blog
2. 使用 [Markra](https://markra.app/) 作为markdown编辑器，获得和Typecho近似的体验
3. 使用 [Umami](https://umami.is/) 分析访客，使用 [Artalk](https://artalk.js.org/) 作为评论区
4. 基于 [GitHub Action](https://github.com/kndxhz/blog/actions) 和我服务器上的自动构建脚本进行网页的 CI/CD 构建，每次commit自动部署（以下有脚本内容，是在我的服务器上的，在自己用的时候一定要注意ssh账户的权限管理！！！）
5. 把静态网页文件交由1panel的openresty进行分发

````sh
set -e

export NVM_DIR="$HOME/.nvm"
export DEPLOY_DIR="/opt/1panel/www/sites/blog.kndxhz.cn/index"

if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh" >/dev/null 2>&1
fi

nvm use 22 >/dev/null 2>&1


# =========================
# 解析 SSH 参数
# =========================

case "$SSH_ORIGINAL_COMMAND" in

    "deploy -commit "*)
        COMMIT="${SSH_ORIGINAL_COMMAND#deploy -commit }"
        ;;

    *)
        echo "Command not allowed"
        exit 1
        ;;

esac


if [ -z "$COMMIT" ]; then
    echo "Commit not specified"
    exit 1
fi


echo "Deploy commit: $COMMIT"


# =========================
# 获取代码
# =========================

cd /home/deployer


if [ -d "/home/deployer/blog/.git" ]; then

    cd /home/deployer/blog

    echo "Fetching repository..."

    git fetch origin

else

    echo "Cloning repository..."

    git clone https://github.com/kndxhz/blog /home/deployer/blog

    cd /home/deployer/blog

fi


# =========================
# 切换指定 commit
# =========================

echo "Checking out commit..."

git fetch origin

git checkout "$COMMIT"


# =========================
# 构建 Astro
# =========================

echo "Installing dependencies..."

npm ci


echo "Building Astro..."

npm run build -- --commit="$COMMIT"


# =========================
# 部署静态文件
# =========================

echo "Deploying files..."

rm -rf "$DEPLOY_DIR"/*

cp -r dist/* "$DEPLOY_DIR"/


echo "Deploy finished"
````

## Astro博客的编写
首当其冲的，当然是基于 Astro 框架自带的 blog 模板进行魔改  
你可能发现了，这个博客是MD3风格的，这是我觉得非常好看的一种风格，辅以我最喜欢的绿色主色调  
开发部分其实我自己只负责很少一部分，毕竟现在 AI 这么发达（）  
大部分都是GPT 5.5 和 GPT 5.6 写的  
你从我的 commit 记录就能看出我博客演变的过程了，中间还鸽了好久一段时间就是了
## 难题
由于我的服务器带宽实在是太小了，好像是 10M ，大部分都是由 EdgeOne CDN 硬缓的，所以我不得不思考一个问题：**网页这种好加载的不必多言，那么...图片呢？**  
因此，我又想出了一个解决方案：使用 telegram 机器人实现自动图片转WebP，然后自动上传到雨云存储桶。  
当然了，这个机器人也是开源的，即 https://github.com/kndxhz/telegram-img2s3-bot  
使用效果如下：  
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAIBfGp96uv6O6IT1pITVyOEYHr9wm0aAAKuDGsb3zDwR8HoS7HzHPDxAQADAgADeQADPQQ.webp)  
![image](https://blog-image.cn-sy1.rains3.com/AgACAgEAAxkBAAIBeWp96s3ep1nxmEPBIwOQffmopBY1AAKtDGsb3zDwR3FkoWgalgaoAQADAgADeQADPQQ.webp)    
这样就即实现了高效的加载，也不用担心自己的带宽不足，简直是一举两得
## 概括一下
总而言之我当时可能是图方便吧，就选了 Halo  
如今我真的是特别后悔这个选择，实在是toooooooooooo heavy了  
我也想告诉所有想搭自己博客的人：  
**尽量使用静态无后台博客**  
这样哪怕出了什么问题，自己的服务器不可用，那么  Vercel、Github pages  这些当代互联网大善人仍然可以帮助你最低限度的托管、运行你的博客。  
这也是一部分人一开始初始的选择，这样就能在无服务器、无域名的情况下，哪怕没有电脑也可以直接搭建属于你自己的博客了
 