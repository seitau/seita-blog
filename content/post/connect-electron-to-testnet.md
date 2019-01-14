---
banner: "img/bch-electron-cash.png"
categories: ["programming", "cryptocurrency"]
date: "2019-01-13T16:58:06+02:00"
description: ""
images: []
menu: ""
tags: [cryptocurrency, tech, blockchain]
title: "Electrum Litecoin Wallet・Electron Cashをテストネットにつなぐ"
draft: false
---
開発に使う目的でインストールしたけどデフォルトでメインネットに接続してしまってテストネットへの切り替えボタンも見当たらなかったのでメモ。
コマンドラインで以下のように開けばテストネットに繋がる。

## Electrum Litecoin Wallet
{{< highlight text >}}
open -n /Applications/Electrum-LTC.app/ --args --testnet
{{< /highlight >}}

## Electron Cash
{{< highlight text >}}
open -n /Applications/Electron-Cash.app --args --testnet
{{< /highlight >}}


