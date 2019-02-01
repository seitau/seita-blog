---
title: "Goでブロックチェーンを作る  Part 1: 基本型"
date: 2019-02-01T00:41:08-08:00
banner: "img/gopher.png"
narrowBanner: true
description: ""
images: ["img/gopher.png"]
menu: ""
categories: ["programming"]
tags: ["blockchain", "golang"]
draft: false
---

この記事はIvan Kuznetsovさんの[Building Blockchain in Go. Part 1: Basic Prototype](https://jeiwan.cc/posts/building-blockchain-in-go-part-1/)を本人の許可を得て翻訳したものです。本来はpart1からpart7までのシリーズになっていますが、今回はpart1のみを翻訳しました。随時他のパートも翻訳していく予定です。

<!--more-->

翻訳経験に乏しいため、誤訳や不足等がありましたらご指摘お願い致します。


# Introduction

ブロックチェーンは21世紀における最も革新的な技術の一つであり、その秘めたる可能性は未だ最大限に発揮されずに成熟過程にある。ブロックチェーンとは要するに分散したデータベースなのだが、他と一線を画しているのは、それがプライベートなものではなく、パブリックなものであるということだ。利用する者全てがデータベースの一部もしくは全体のコピーを持っており、新しい記録は他のデータベースの保持者の同意のもと追加される。そしてこのブロックチェーンこそが暗号通貨やスマートコントラクトを可能にしたのである*1。

この一連の記事を通じて、シンプルなブロックチェーンを土台とした簡単な暗号通貨の作成を目指す。

*1 訳注：ブロックチェーン上で実行されるスマートコントラクトを指すと思われます。

# Block

それでは、「ブロックチェーン」の「ブロック」から始めよう。

ブロックチェーンにおいて重要な情報を格納するのがブロックだ。例えば、ビットコインのブロックはトランザクションのデータを格納している、あらゆる暗号通貨の肝だ。この他にも、ブロックは技術的な情報を格納している。バージョンや現時点のタイムスタンプ、以前のブロックのハッシュ値などだ。

今回の記事では、いわゆる本格的なブロックチェーンやビットコインで用いられるようなブロックの実装はしない。代わりに、重要な情報のみを含んだわかりやすいものを使用する。それが以下のブロックだ:

```Go
type Block struct {
        Timestamp     int64
        Data          []byte
        PrevBlockHash []byte
        Hash          []byte
}
```

`Timestamp`はブロック生成時点のタイムスタンプ、`Data`はブロックに格納されている重要な情報、`PrevBlockHash`は以前のブロックのハッシュ値を示しており、`Hash`はこのブロックのハッシュ値を指している。ビットコインに限った話をすると、`Timestamp`、`PrevBlockHash`と`Hash`はブロックヘッダーに記録されて独立したデータ構造を形成しており、トランザクション（上記のブロックの`Data`にあたる情報）は個々のデータ構造を有しているのだが、ここでは分かりやすさを優先してそれらの情報を一箇所にまとめている。

では、ハッシュ値はどのように算出するのだろうか？ハッシュ値の算出方法はブロックチェーンの重要な特徴の一つであり、ブロックチェーンの堅牢性を支えるものだ。

ハッシュ値を算出するのは計算上とても困難な作業であり、高性能なコンピュータをもってしても少なからず時間がかかる（これがビットコインのマイニングのために高性能なGPUが売れている理由である）。このように設計することで新しいブロックの生成を困難にし、一度生成されたブロックが保持するデータの改ざんを防いでいるのである。このメカニズムについてはまた今度実装する予定だ。

とりあえずここでは、上記のブロックを連結し、連結した組み合わせからSHA-256ハッシュを算出する。以下の`SetHash`メソッドで実行しよう:

```Go
func (b *Block) SetHash() {
        timestamp := []byte(strconv.FormatInt(b.Timestamp, 10))
        headers := bytes.Join([][]byte{b.PrevBlockHash, b.Data, timestamp}, []byte{})
        hash := sha256.Sum256(headers)

        b.Hash = hash[:]
}
```

次はGo言語の慣習に従い、簡単なブロックの生成機能を実装する:

```Go
func NewBlock(data string, prevBlockHash []byte) *Block {
        block := &Block{time.Now().Unix(), []byte(data), prevBlockHash, []byte{}}
        block.SetHash()
        return block
}
```

「ブロック」については以上だ！

# Blockchain

それでは、ブロックチェーンの実装に移ろう。

ブロックチェーンは順序だった後部リンク型のリスト構造を持つデータベースである。つまりブロックは生成された順番で格納され、それぞれ一つ前のブロックとリンクしている。こういった構造によりチェーンに存在する最新のブロックを（効率的に）参照することが可能になっている。

Go言語では配列とマップを使用することでこの構造を実装できる。配列は順に並べられたハッシュ値を保持し（Go言語の配列には順序がある)、マップはハッシュ値とブロックのペア情報を保持する（マップに順序はない)。しかし今回はハッシュ値からブロックを取得する必要はないので、配列のみを使用しよう:

```Go
type Blockchain struct {
        blocks []*Block
}
```

これで初めてのブロックチェーンができた。予想以上に簡単だったね😉

それでは、ブロックの追加ができるようにしよう:

```Go

func (bc *Blockchain) AddBlock(data string) {
        prevBlock := bc.blocks[len(bc.blocks)-1]
        newBlock := NewBlock(data, prevBlock.Hash)
        bc.blocks = append(bc.blocks, newBlock)
}
```

完成！ではない....?

ブロックを追加するにはブロックが存在している必要があるが、まだブロックチェーン上にブロックが一つもない。どんなブロックチェーンでも最低一つはブロックが必要だ。そしてその一番最初のブロックはgenesis blockと呼ばれている。

それでは、メソッドを実装してgenesis blockを生成しよう:

```Go
func NewGenesisBlock() *Block {
        return NewBlock("Genesis Block", []byte{})
}
```

これで、genesis blockを伴ったブロックチェーンを生成する関数を実装できる:

```Go
func NewBlockchain() *Blockchain {
        return &Blockchain{[]*Block{NewGenesisBlock()}}
}
```

実際に予想通り動くか確認しよう:

```Go
func main() {
        bc := NewBlockchain()

        bc.AddBlock("Send 1 BTC to Ivan")
        bc.AddBlock("Send 2 more BTC to Ivan")

        for _, block := range bc.blocks {
                fmt.Printf("Prev. hash: %x\n", block.PrevBlockHash)
                fmt.Printf("Data: %s\n", block.Data)
                fmt.Printf("Hash: %x\n", block.Hash)
                fmt.Println()
        }
}
```

実行結果：

```Go
Prev. hash:
Data: Genesis Block
Hash: aff955a50dc6cd2abfe81b8849eab15f99ed1dc333d38487024223b5fe0f1168

Prev. hash: aff955a50dc6cd2abfe81b8849eab15f99ed1dc333d38487024223b5fe0f1168
Data: Send 1 BTC to Ivan
Hash: d75ce22a840abb9b4e8fc3b60767c4ba3f46a0432d3ea15b71aef9fde6a314e1

Prev. hash: d75ce22a840abb9b4e8fc3b60767c4ba3f46a0432d3ea15b71aef9fde6a314e1
Data: Send 2 more BTC to Ivan
Hash: 561237522bb7fcfbccbc6fe0e98bbbde7427ffe01c6fb223f7562288ca2295d1
```

これで以上だ！

# Conclusion

ここではとてもシンプルなブロックチェーンの基本型を作成した。それぞれが一つ前のブロックと繋がったブロックの配列だ。しかし実際のブロックチェーンはもっと複雑になっている。上記のブロックチェーンでは早く簡単にブロックを生成することができるが、実際にはもっと作業が必要になる。ブロックを追加する権利を得るために大変な計算をしなければならないのだ（このメカニズムはProof-of-Workと呼ばれる）。さらに、分散型データベースには意思決定者が存在しない。つまり新しいブロックはネットワークの参加者によって承認されなければならない（このメカニズムはコンセンサスと呼ばれる）。しかも、今回作成したブロックチェーンにはトランザクションが何もない。

それぞれの特徴については今後掲載する記事の中で触れていきたいと思う。




