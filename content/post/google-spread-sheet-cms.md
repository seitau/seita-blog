---
title: "Google Spreadsheets+NetlifyでHugoの簡易CMS作成"
date: 2019-03-31T15:52:59-07:00
banner: "img/google-sheets.png"
narrowBanner: false
description: ""
images: ["img/google-sheets.png"]
menu: ""
categories: ["programming"]
tags: ["hugo", "cms", "google-spreadsheets", "netlify"]
showTOC: false
draft: false
---

現在留学中のカリフォルニア大学サンタバーバラ校(UCSB)で、[Blockchain at UCSB](https://www.blockchainatucsb.com/)という組織の幹部をしてまして、一応技術担当なので組織の紹介用[website](https://www.blockchainatucsb.com/)を開発していたところ、最近の活動を掲載するセクションを他のメンバーでも編集できるようにしてほしいと要望を受けたため、特定の箇所のみ編集可能なhugoのcmsをgoogleのspreadsheetsを使用して作成しました。

<!--more-->

{{< web-embed url="https://www.blockchainatucsb.com/" >}}

# 先に完成形
完成したsheetはこんな感じです。

各項目のtitle, link, description, google driveに保存したimageのlinkが整理されています。

{{< figure src="/img/google-sheets.png" >}}

右側の派手な"Update Website"というボタンを押すと、netlifyのwebhookをtriggerしてsheetの内容を反映したwebsiteをdeployできます。

updateすると、[website](https://www.blockchainatucsb.com/#activities)のactivitiesセクションのみがsheetの内容に沿って更新されます。

以下のセクションです。
{{< figure src="/img/activities_screenshot.png" >}}

Netlify CMSや他のCMSは今回の用途にはオーバースペックだったのと、spreadsheetsをJSONバックエンドとして使用してみたいという個人的な願望があったため、あえてnetlify+spreadsheetsという構成にしました。

## spreadsheetsのデータをJSONで取得

参考にしたのはこちらのサイト

- [Use a Google Spreadsheet as your JSON backend](https://coderwall.com/p/duapqq/use-a-google-spreadsheet-as-your-json-backend)
- [Simple example of retrieving JSON feeds from Spreadsheets Data API](https://developers.google.com/gdata/samples/spreadsheet_sample)

細かい説明は上記のサイトでみてもらうとして、spreadsheetsを`ファイル`->`webで公開する`の順で公開してから、`https://spreadsheets.google.com/feeds/list/ + spreadsheetsのID + /od6/public/values?alt=json`にGETするとsheetの内容をJSONで受け取ることができます。spreadsheetsのIDは普通にsheetを開いたときのurlに含まれています。

自分のtitle, link, imageurl, descriptionというカラムに分けたsheetではこんな感じでデータがJSONで返ってきます。

```JSON
//省略
"gsx$title": {
  "$t": "Innovation Summit"
},
"gsx$link": {
  "$t": "https://innovateucsb.wixsite.com/website"
},
"gsx$imageurl": {
  "$t": "https://drive.google.com/file/d/1aFXSAnavoPCkVwI5v7VV-UQJEykN9wMt/view?usp=sharing"
},
"gsx$description": {
  "$t": "BCUCSB collaborated with UCSB Innovation Council and other campus organizations to put together a one-day campus event (November 17, 2018) designed to foster and harness creative thinking and develop a innovative business model to improve problems found in global categories such as energy, sustainability, income inequality, digital security, and health."
}
```

## Hugoでsheetの内容を表示する

```go-html-template
{{ $googleSpreadSheetEndpoint := printf "%s%s%s" "https://spreadsheets.google.com/feeds/list/" $.Page.Site.Params.GoogleSpreadSheetId "/od6/public/values?alt=json" }}
{{ $json := getJSON $googleSpreadSheetEndpoint }}

{{ $entries := $json.feed.entry }}

{{ range $entry := $entries }}
  {{ $scratch := newScratch }}
  {{ range $key, $value := $entry }}
    {{ if hasPrefix $key "gsx"}}
      {{ $sanitizedKey := replaceRE "^gsx." "" $key }}
      {{ range $k, $v :=  $value }}
        {{ if (eq $sanitizedKey "imageurl") }}
          {{ $imageId := replaceRE "^https?://drive.google.com/file/d/(.*)/view.usp=sharing" "$1" $v }}
          {{ $v = printf "%s%s" "http://drive.google.com/uc?export=view&id=" $imageId }}
        {{ end }}
      {{ $scratch.Set $sanitizedKey $v }}
    {{ end }}
  {{ end }}
{{ end }}
```
