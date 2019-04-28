---
title: "browserify+babelでasync/awaitを使用した快適p5.js開発環境構築"
filename: "p5js-browserify"
slug: "new-post"
date: 2019-04-26T20:09:30-07:00
banner: "img/p5js.png"
narrowBanner: false
description: ""
images: ["img/p5js.png"]
menu: ""
categories: ["programming"]
tags: ["p5.js", "processing", "babel", "browserify", "javascript"]
showTOC: false
draft: false
---

今回は、[processing](https://processing.org/)のjs版として、ブラウザでインタラクティブなグラフィックを実装できる[p5js](https://p5js.org)を使用してwebsiteに以下のようなアニメーションを実装した経験から、自分がどのように快適な開発環境を構築したかをご紹介します。

<!--more-->

<div id="p5js-example" style="margin:0px 20%;width:60%;height:auto;background:rgb(0,0,0,0);position:relative;">
</div>
{{< script path="script.js" >}}

## async/awaitを使おう

上記の例では使用していませんが、jsでapiを叩いたりするとpromiseのハンドリングが必要になります。しかし、promiseが頻繁に登場するとthen/catchが複雑になったりして可読性が損なわれることがあるので、モダンなasync/awaitで同期処理をスッキリ書きたいところです。

比較的新しい機能であるこのasync/awaitを各主要ブラウザで使用するには、babel等のツールでブラウザに互換性のある形式にjsをトランスパイルする必要があります。

babelとasync/awaitについてはこちらの記事で詳しく説明されているのでご参照ください。
{{< web-embed url="https://qiita.com/ea54595/items/e6e36fcf1d10deadc17a" >}}

### browserify+babel


