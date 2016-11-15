---
title: git使用指南
date: 2015-12-09 14:57:45
tags:
- github
categories:
- 技术
---
Git命令行使用指南
Git跟踪的是修改而非文件。
## 1. 在Ubuntu安装git##
安装命令行：
    ``` bash
	   sudo apt-get install git
     ```

设置过程：
  ``` bash
	$ git config --global user.name "my name"
	$ git config --global user.email "name@domain.com"
  ```

## 2. 创建版本库##

1）创建目录：
  ``` bash
	$ mkdir folderName
	$ cd folderName
	$ pwd
  ```

2) git目录初始化
  ``` bash
    $ git init
  ```

## 3. 将文件添加到仓库：
将文件添加到仓库，并同步，提供注释
  ``` bash
    $ git add file.txt
    //$ git add --all
    $ git commit -m "some text"
  ```

## 4. 查看git库中版本状态
  ``` bash
	$ git status
  ```

## 5. 查看文件被修改的内容，(与最新被提交的文件相比)
  ``` bash
	$ git diff
  ```

## 6. 查看历史扳本信息
  ``` bash
	$ git log (--pretty=online)
  ```

## 7.回溯到历史版本
  ``` bash
	$ git reset --hard HEAD^
  ```

> HEAD表示当前版本的指针
>
> HEAD^表示当前版本的上一版本

> HEAD^^表示当前版本上上版本
>
> HEAD~100表示当前版本的上100个版本

也可以使用`commit id`表示版本
  ``` bash
	$ git reset --hard 23462345
  ```

## 8. 历史操作记录
  ``` bash
	$ git reflog
  ```
## 9. 修改回退

1. 修改后保存，未add进入暂存区：
  ``` bash
	$ git checkout -- file.txt
  ```

2. add进入暂存区后，再次修改文件保存：
  ``` bash
	$ git checkout -- file.txt
  ```

变成add后暂存区中的内容

3. 修改后，add进入了暂存区：
  ``` bash
	$ git reset HEAD file.txt
	$ git checkout -- file.txt
  ```
4. 如果add后进入暂存区，又commit提交了，就用版本回退

git checkout'其实是用版本库里的版本替换工作区的版本

## 10. 创建SSH key
  ``` bash
	$ ssh-keygen -t rsa -C "yourname@domain"
  ```

在用户目录中生成.ssh目录，中有id_rsa(私钥)和id_rsa.pub(公钥)。
然后将公钥在gitHub中输入进去。

## 11.push
  ``` bash
	$ git remote add origin git@github.com:michaelliao/learngit.git
	git push -u origin master
  ```

## 12. clone
  ``` bash
	git clone git@github.com:uername/res.git
  ```
