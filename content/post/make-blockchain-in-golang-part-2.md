---
title: "Goでブロックチェーンを作る Part 2: プルーフオブワーク"
date: 2019-02-01T09:24:09-08:00
banner: "img/gopher.png"
narrowBanner: true
description: ""
images: ["img/gopher.png"]
menu: ""
categories: ["programming"]
tags: ["blockchain", "golang", "translation"]
draft: true
---

この記事はIvan Kuznetsovさんの[Building Blockchain in Go. Part 2: Proof-of-Work](https://jeiwan.cc/posts/building-blockchain-in-go-part-2/)を本人の許可を得て翻訳したものです。

<!--more-->

# Introduction
In the previous article we built a very simple data structure, which is the essence of blockchain database. And we made it possible to add blocks to it with the chain-like relation between them: each block is linked to the previous one. Alas, our blockchain implementation has one significant flaw: adding blocks to the chain is easy and cheap. One of the keystones of blockchain and Bitcoin is that adding new blocks is a hard work. Today we’re going to fix this flaw.

以前の記事では、ブロックチェーンのデータベースの本質的でかつ単純なデータ構造を作りました。そして一つ一つのブロックが過去のものと鎖状に繋がるようブロックを追加できるようにもしました。しかしながら、まだ私たちの実装には決定的な欠陥があります。ブロックの追加が簡単すぎるのです。ブロックチェーンやビットコインにとってブロックの追加が困難であることは非常に重要であるため、今回はこの欠陥を修正していきます。

# Proof-of-Work
A key idea of blockchain is that one has to perform some hard work to put data in it. It is this hard work that makes blockchain secure and consistent. Also, a reward is paid for this hard work (this is how people get coins for mining).

ブロックチェーンの鍵となる考えとして、ブロックにデータを保存するには少なからず労力を払う必要があることが挙げられます。この労力こそが、ブロックチェーンを安全で一貫したものにしています。また、この労力には報酬が支払われます(マイニングでお金儲けができるのはこのためです）。

This mechanism is very similar to the one from real life: one has to work hard to get a reward and to sustain their life. In blockchain, some participants (miners) of the network work to sustain the network, to add new blocks to it, and get a reward for their work. As a result of their work, a block is incorporated into the blockchain in a secure way, which maintains the stability of the whole blockchain database. It’s worth noting that, the one who finished the work has to prove this.

この仕組みは、生活を維持するために働き、収入を得るといった、実社会における考え方と似ています。ブロックチェーンでは、数名の参加者（マイナー）がネットワークを維持し、新しいブロックを追加するために労力を支払い、報酬を得ます。彼らの労働により、ブロックチェーンの堅牢性は支えられ、ブロックが安全にデータベースに取り込まれるのです。ひとつ、このブロックを取り込むという作業を遂行した人は自ら申告して、それが自分の仕事であることを証明する必要があるということを覚えておきましょう。

This whole “do hard work and prove” mechanism is called proof-of-work. It’s hard because it requires a lot of computational power: even high performance computers cannot do it quickly. Moreover, the difficulty of this work increases from time to time to keep new blocks rate at about 6 blocks per hour. In Bitcoin, the goal of such work is to find a hash for a block, that meets some requirements. And it’s this hash that serves as a proof. Thus, finding a proof is the actual work.

この「労働して証明する」という一連の仕組みをプルーフオブワークといいます。この「労働」は高性能なコンピュターでも素早く処理できないほど高難度で、大量の計算リソースが必要になります。さらに、計算の難度はブロックの生成間隔が一時間約6ブロックになるよう調整されていて、時間により難易が増すこともあります。ビットコインにおけるこの「労働」の内容は、要件を満たしたハッシュ値をブロック生成のために見つけるというものです。実はこのハッシュ値が「労働の証明」を果たします。すなわち、証明書を見つけるのが実際の仕事ということになります。

One last thing to note. Proof-of-Work algorithms must meet a requirement: doing the work is hard, but verifying the proof is easy. A proof is usually handed to someone else, so for them, it shouldn’t take much time to verify it.

最後に、プルーフオブワークは必ず「労働は困難であるがその証明は簡単」であることを頭に置いておいてください。労働の証明は大抵労働者以外の手に委ねられるため、困難である必要はないのです。

# Hashing
In this paragraph, we’ll discuss hashing. If you’re familiar with the concept, you can skip this part.

この節では、ハッシュ化について話します。もしすでにハッシュ化の概念をご存知なら、この部分は読み飛ばしていただいても構いません。

Hashing is a process of obtaining a hash for specified data. A hash is a unique representation of the data it was calculated on. A hash function is a function that takes data of arbitrary size and produces a fixed size hash. Here are some key features of hashing:

ハッシュ化とは特定のデータのためのハッシュ値を得るための工程のことを指します。ハッシュ値はある算出されたデータを指し示す唯一無二の値です。また、ハッシュ関数は任意のサイズのデータを受けて一定のサイズのハッシュ値を生成する関数です。以下にハッシュ化の主な特徴を挙げます。

1. Original data cannot be restored from a hash. Thus, hashing is not encryption.
2. Certain data can have only one hash and the hash is unique.
3. Changing even one byte in the input data will result in a completely different hash.

1. ハッシュ値からはその元となったデータは復元できない。つまり、ハッシュ化は暗号化ではない。
2. 一定のデータは一つのハッシュ値のみ持つことができ、その値は唯一無二である。
3. インプットのデータがたとえ１バイトでも違えば結果として得られるハッシュ値は全く異なるものになる。

{{< figure src="https://jeiwan.cc/images/hashing-example.png" >}}

Hashing functions are widely used to check the consistency of data. Some software providers publish checksums in addition to a software package. After downloading a file you can feed it to a hashing function and compare produced hash with the one provided by the software developer.

ハッシュ関数はデータの一貫性を確かめるために幅広く使用されています。ソフトウェアのパッケージにチェックサムを添付する企業もあり、パッケージをダウンロードしたのちにその製品から得られたハッシュ値と添付されたハッシュ値を比較することができるようになっています。

In blockchain, hashing is used to guarantee the consistency of a block. The input data for a hashing algorithm contains the hash of the previous block, thus making it impossible (or, at least, quite difficult) to modify a block in the chain: one has to recalculate its hash and hashes of all the blocks after it.

ブロックチェーンでは、ハッシュ化はブロックの一貫性を保証するために用いられています。新しいブロックを生成する際にハッシュアルゴリズムへ投入されるデータは以前のブロックのハッシュ値を含んでおり、ブロックチェーン上のブロックのデータを改ざんすることは不可能（もしくは非常に困難）になっています。なぜなら、数珠つなぎになったブロックそれぞれのハッシュ値を再度計算しなければならないからです。

# Hashcash
Bitcoin uses Hashcash, a Proof-of-Work algorithm that was initially developed to prevent email spam. It can be split into the following steps:

ビットコインはもともとemailのスパムを防止するために開発されたハッシュキャッシュというプルーフオブワークアルゴリズムを採用しています。このアルゴリズムは以下のステップに分割されます。

Thus, this is a brute force algorithm: you change the counter, calculate a new hash, check it, increment the counter, calculate a hash, etc. That’s why it’s computationally expensive.

1. 何かしらの公開されたデータを用意します。(emailの場合は受信者のアドレス、ビットコインの場合はブロックヘッダー)
2. そのデータに0から始まるカウンターを追加します。
3. データとカウンターを組み合わてハッシュ化します。
4. そのハッシュ値が一定の要件を満たしているか確認します。
5. もし満たしていれば、終了です。
6. もし満たしていなければ、カウンターを増加させステップ3と4を繰り返します。

つまり、これはブルートフォースアルゴリズム([力まかせ探索](https://ja.wikipedia.org/wiki/%E5%8A%9B%E3%81%BE%E3%81%8B%E3%81%9B%E6%8E%A2%E7%B4%A2))です。カウンターを変化させ、新しいハッシュ値を取得し、確認する作業を繰り返します。計算リソースを大量に消費するわけがお分りいただけたでしょうか。

Now let’s look closer at the requirements a hash has to meet. In the original Hashcash implementation, the requirement sounds like “first 20 bits of a hash must be zeros”. In Bitcoin, the requirement is adjusted from time to time, because, by design, a block must be generated every 10 minutes, despite computation power increasing with time and more and more miners joining the network.

ここで、ハッシュ値が満たすべき要件に目を向けてみましょう。ハッシュキャッシュのもともとの実装では、この要件は「ハッシュ値の先頭の20ビットはゼロでなくてはならない」というようなものです。ビットコインでは、設計上、マイナーの増減による計算リソースの変化に関わらずブロックの生成間隔を10分ごとに保つ必要があるため、この要件は時間ごとに調整されます。

To demonstrate this algorithm, I took the data from the previous example (“I like donuts”) and found a hash that starts with 3 zero-bytes:

このアルゴリズムを実際に試してみるため、一つ前の例からデータを拝借して("I like donuts")、先頭の3バイトが0から始まるハッシュ値を見つけました。

{{< figure src="https://jeiwan.cc/images/hashcash-example.png" >}}

`ca07ca` is the hexadecimal value of the counter, which is 13240266 in the decimal system.

`ca07ca` はカウンターの16進数の値です。10進数では13240266になります。

# Implementation
Ok, we’re done with the theory, let’s write code! First, let’s define the difficulty of mining:

以上で、理論の解説は済みました。ここからはコードを書いていきましょう。最初に、マイニングの難易度を定義しましょう。

```go
const targetBits = 24
```

In Bitcoin, “target bits” is the block header storing the difficulty at which the block was mined. We won’t implement a target adjusting algorithm, for now, so we can just define the difficulty as a global constant.

ビットコインでは、"target bits"は掘られたブロックのヘッダーに格納されますが、今回は難易度の調整アルゴリズムは実装しないため、クローバル定数として定義してしまいましょう。

24 is an arbitrary number, our goal is to have a target that takes less than 256 bits in memory. And we want the difference to be significant enough, but not too big, because the bigger the difference the more difficult it’s to find a proper hash.

24は適当な数字です、私たちの目標はメモリーを256ビット以上消費しないtargetを取得することです。また、targetのビット数と256ビットの差分は十分に大きくしますが、あまりにも大きいと適当なハッシュ値を得るのが困難になるためほどほどにしましょう。

```go
type ProofOfWork struct {
	block  *Block
	target *big.Int
}

func NewProofOfWork(b *Block) *ProofOfWork {
	target := big.NewInt(1)
	target.Lsh(target, uint(256-targetBits))

	pow := &ProofOfWork{b, target}

	return pow
}
```

Here create ProofOfWork structure that holds a pointer to a block and a pointer to a target. “target” is another name for the requirement described in the previous paragraph. We use a big integer because of the way we’ll compare a hash to the target: we’ll convert a hash to a big integer and check if it’s less than the target.

ここで`block`と`target`へのポインターを持った`ProofOfWork`構造体を定義しています。`target`とは、少し前の節で説明した「要件」の別名です。今回は、ハッシュ値をbig integerに変換して`target`よりも小さいか確認するため、型にはbig integerを用いています。

In the NewProofOfWork function, we initialize a big.Int with the value of 1 and shift it left by 256 - targetBits bits. 256 is the length of a SHA-256 hash in bits, and it’s SHA-256 hashing algorithm that we’re going to use. The hexadecimal representation of target is:

```text
0x10000000000000000000000000000000000000000000000000000000000
```

And it occupies 29 bytes in memory. And here’s its visual comparison with the hashes from the previous examples:

```text
0fac49161af82ed938add1d8725835cc123a1a87b1b196488360e58d4bfb51e3
0000010000000000000000000000000000000000000000000000000000000000
0000008b0f41ec78bab747864db66bcb9fb89920ee75f43fdaaeb5544f7f76ca
```

The first hash (calculated on “I like donuts”) is bigger than the target, thus it’s not a valid proof of work. The second hash (calculated on “I like donutsca07ca”) is smaller than the target, thus it’s a valid proof.

You can think of a target as the upper boundary of a range: if a number (a hash) is lower than the boundary, it’s valid, and vice versa. Lowering the boundary will result in fewer valid numbers, and thus, more difficult work required to find a valid one.

Now, we need the data to hash. Let’s prepare it:

```go
func (pow *ProofOfWork) prepareData(nonce int) []byte {
	data := bytes.Join(
		[][]byte{
			pow.block.PrevBlockHash,
			pow.block.Data,
			IntToHex(pow.block.Timestamp),
			IntToHex(int64(targetBits)),
			IntToHex(int64(nonce)),
		},
		[]byte{},
	)

	return data
}
```

This piece is straightforward: we just merge block fields with the target and nonce. nonce here is the counter from the Hashcash description above, this is a cryptographic term.

Ok, all preparations are done, let’s implement the core of the PoW algorithm:

```go
func (pow *ProofOfWork) Run() (int, []byte) {
	var hashInt big.Int
	var hash [32]byte
	nonce := 0

	fmt.Printf("Mining the block containing \"%s\"\n", pow.block.Data)
	for nonce < maxNonce {
		data := pow.prepareData(nonce)
		hash = sha256.Sum256(data)
		fmt.Printf("\r%x", hash)
		hashInt.SetBytes(hash[:])

		if hashInt.Cmp(pow.target) == -1 {
			break
		} else {
			nonce++
		}
	}
	fmt.Print("\n\n")

	return nonce, hash[:]
}
```

First, we initialize variables: hashInt is the integer representation of hash; nonce is the counter. Next, we run an “infinite” loop: it’s limited by maxNonce, which equals to math.MaxInt64; this is done to avoid a possible overflow of nonce. Although the difficulty of our PoW implementation is too low for the counter to overflow, it’s still better to have this check, just in case.

In the loop we:

Prepare data.
Hash it with SHA-256.
Convert the hash to a big integer.
Compare the integer with the target.
As easy as it was explained earlier. Now we can remove the SetHash method of Block and modify the NewBlock function:

```go
func NewBlock(data string, prevBlockHash []byte) *Block {
	block := &Block{time.Now().Unix(), []byte(data), prevBlockHash, []byte{}, 0}
	pow := NewProofOfWork(block)
	nonce, hash := pow.Run()

	block.Hash = hash[:]
	block.Nonce = nonce

	return block
}
```

Here you can see that nonce is saved as a Block property. This is necessary because nonce is required to verify a proof. The Block structure now looks so:

```go
type Block struct {
	Timestamp     int64
	Data          []byte
	PrevBlockHash []byte
	Hash          []byte
	Nonce         int
}
```

Alright! Let’s run the program to see if everything works fine:

```bash
Mining the block containing "Genesis Block"
00000041662c5fc2883535dc19ba8a33ac993b535da9899e593ff98e1eda56a1

Mining the block containing "Send 1 BTC to Ivan"
00000077a856e697c69833d9effb6bdad54c730a98d674f73c0b30020cc82804

Mining the block containing "Send 2 more BTC to Ivan"
000000b33185e927c9a989cc7d5aaaed739c56dad9fd9361dea558b9bfaf5fbe
```

```bash
Prev. hash:
Data: Genesis Block
Hash: 00000041662c5fc2883535dc19ba8a33ac993b535da9899e593ff98e1eda56a1

Prev. hash: 00000041662c5fc2883535dc19ba8a33ac993b535da9899e593ff98e1eda56a1
Data: Send 1 BTC to Ivan
Hash: 00000077a856e697c69833d9effb6bdad54c730a98d674f73c0b30020cc82804

Prev. hash: 00000077a856e697c69833d9effb6bdad54c730a98d674f73c0b30020cc82804
Data: Send 2 more BTC to Ivan
Hash: 000000b33185e927c9a989cc7d5aaaed739c56dad9fd9361dea558b9bfaf5fbe
```

Yay! You can see that every hash now starts with three zero bytes, and it takes some time to get these hashes.

There’s one more thing left to do: let’s make it possible to validate proof of works.

```go
func (pow *ProofOfWork) Validate() bool {
	var hashInt big.Int

	data := pow.prepareData(pow.block.Nonce)
	hash := sha256.Sum256(data)
	hashInt.SetBytes(hash[:])

	isValid := hashInt.Cmp(pow.target) == -1

	return isValid
}
```

And this is where we need the saved nonce.

Let’s check one more time that everything’s ok:

```go
func main() {
	...

	for _, block := range bc.blocks {
		...
		pow := NewProofOfWork(block)
		fmt.Printf("PoW: %s\n", strconv.FormatBool(pow.Validate()))
		fmt.Println()
	}
}
```

Output:

```bash
Prev. hash:
Data: Genesis Block
Hash: 00000093253acb814afb942e652a84a8f245069a67b5eaa709df8ac612075038
PoW: true

Prev. hash: 00000093253acb814afb942e652a84a8f245069a67b5eaa709df8ac612075038
Data: Send 1 BTC to Ivan
Hash: 0000003eeb3743ee42020e4a15262fd110a72823d804ce8e49643b5fd9d1062b
PoW: true

Prev. hash: 0000003eeb3743ee42020e4a15262fd110a72823d804ce8e49643b5fd9d1062b
Data: Send 2 more BTC to Ivan
Hash: 000000e42afddf57a3daa11b43b2e0923f23e894f96d1f24bfd9b8d2d494c57a
PoW: true
```

Conclusion
Our blockchain is a step closer to its actual architecture: adding blocks now requires hard work, thus mining is possible. But it still lacks some crucial features: the blockchain database is not persistent, there are no wallets, addresses, transactions, and there’s no consensus mechanism. All these things we’ll implement in future articles, and for now, happy mining!

