---
title: "PolyglotとGoogle Cloud Functionで形態素解析apiを作る"
date: 2019-03-21T00:11:18-07:00
banner: "img/google-cloud-functions.png"
narrowBanner: true
description: ""
images: ["img/google-cloud-functions.png"]
menu: ""
categories: ["programming"]
tags: ["polyglot", "python", "google-cloud-functions"]
showTOC: false
draft: false
---

現在大学の授業で行なっているプロジェクトで英語の文章を形態素に分割することがあったため、pythonの[polyglot](https://polyglot.readthedocs.io/en/latest/Installation.html)を使用し、ついでにgoogle cloud functionでベータ版として提供されている[pythonランタイム](https://cloud.google.com/functions/docs/concepts/python-runtime)で形態素解析apiを作成しました。

<!--more-->

polyglotには様々な機能がありますが、今回は形態素解析だけを使用しています。

```python
from polyglot.text import Text, Word
from polyglot.downloader import downloader
from flask import Flask, jsonify, request, Response
import simplejson as json

def parse_morpheme(request):
    request_json = request.get_json()
    response = Response()
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    try:
        if request.method == 'OPTIONS':
            headers = request.headers.get('Access-Control-Request-Headers')

            if headers:
                response.headers['Access-Control-Allow-Headers'] = headers
                response.status_code = 200
                return response

        if request_json and 'text' in request_json:
            downloader.download("morph2.en")
            text = request_json['text']
            parsedText = Text(text)
            parsedText.language = "en"
            response.set_data(json.dumps({ "result": parsedText.morphemes }))
            response.status_code = 200
            return response

        else:
            response.set_data(json.dumps({ "error": 'invalid request' }))
            response.status_code = 400
            return response

    except:
        response.set_data(json.dumps({ "error": 'internal server error' }))
        response.status_code = 500
        return response

```

このコードを以下のコマンドでgcpにデプロイします。

```bash
gcloud functions deploy parse_morpheme --runtime python37 --trigger-http
```

試しに、"this is an apple"というテキストをparseしてみると、

```json
{
  "result": [
    "th",
    "is",
    "is",
    "an",
    "apple"
  ]
}
```

とリスポンスが返ってきました。うまく行ってそう。



