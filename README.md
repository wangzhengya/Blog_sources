## 这是zhengyaing.win博客的hexo源码。

git clone https://github.com/wangzhengya/Blog_sources.git

## 初始化

    ``` bash
    $ npm install
    $ npm install -g cnpm --registry=https://registry.npm.taobao.org
    $ npm install -g hexo-cli
    ```
    
## new
创建一个新的文章，执行下列命令
    ``` bash
    $ hexo new [layout] <title>
    ```
如果出现无法修改文件内容，则是因为权限不够
    ``` bash
    $ sudo chmod -R 777 blog/
    ```

## generate
生成静态文件，执行下列命令：
    ``` bash
    $ hexo generate
    ```
Option  | Description
------------- | -------------
-d,  | --deploy	Deploy after generation finishes
-w,  | --watch	Watch file changes
## deploy
发布文章：
    ``` bash
    $ hexo deploy
    ```
示例：

    deploy:
    type: git
    repo: https://github.com/wangzhengya/wangzhengya.github.io.git
    branch: master
    message:

Option |	Description
------------- | -------------
-g, |--generate	Generate before deployment

## Global Asset Folder
Assets are non-post files in the source folder, such as images, CSS or JavaScript files. 如果想要在文章中插入图片，最简单的方法是将图片保存在source/images中，然后使用下列语句引用图片

    ! [] (/images/image.jpg).
例如：![](/images/logo300-300.png)

## markdown格式
[格式参考](http://www.jianshu.com/p/f3fd881548ad)


