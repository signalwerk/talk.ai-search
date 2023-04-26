---
theme: signalwerk
title: AI-Powered Search
---

```fm
style: negative
background: true
```

## Hello _👋_

# {{process.content.frontmatter.title}}

_Advancements and Impact_

<footer>

2023 · Zurich · Stefan Huber

</footer>

--s--

```fm
style: image
background:
  image: https://portrait.signalwerk.ch/illustration/2020/rgb/w4000/stefan-huber.jpg
  position: 50% 40%
```

## Stefan

<div class="box box--w40p box--bottom box--white box--padding small">

- Developer @ Liip
- ❦ Typography

</div>

<footer class="footer--right">

Illustration by [Benjamin Güdel](http://www.guedel.biz/) · 2020

</footer>

--s--

## Search

# Finding the _right information_

### … but you don't know **what is there**

--s--

```fm
style: negative
background: true
```

## Problems _🧨_

# _Search_ to **Data** missmatch

--s--

## AI/Drupal

### _Not specific to Drupal._ <br>But we implement it right now with Search API

--s--

## _Different wording_ · Example

### Search: `Artificial Intelligence`

| Data    |
| ------- |
| `AI`    |
| `table` |
| `saw`   |

| _Found_ |
| ------- |
| ❌      |

--s--

## _Different wording_ · Workaround

### Search: `Artificial Intelligence`

| Data    | Keywords                                            |
| ------- | --------------------------------------------------- |
| `AI`    | `Artificial Intelligence`, `ML`, `Machine Learning` |
| `table` | `desk`, `board`, `stand`                            |
| `saw`   | `cut`, `blade`, `metal`                             |

| _Data_ | _Found Keyword_           |
| ------ | ------------------------- |
| `AI`   | `Artificial Intelligence` |

--s--

## _Different form_ · Example

### Search: `tables` <small>(not `table`)</small>

| Data    |
| ------- |
| `AI`    |
| `table` |
| `saw`   |

| _Found_ |
| ------- |
| ❌      |

--s--

## Some _🧨_

- Abbreviation: `AI` vs `Artificial Intelligence`
- Normalization: `don't` vs `do not`
- Pluralization: `tables` vs `table`
- Tense: `saw` vs `see`
- Linguistic diversity: `gray` (US) vs `grey` (UK)
- …

--s--

## _Different form_ · Workaround

# Use a **stemmer** on _data_ and on _search query_

<!-- <small>and be prepared for frailing</small> -->

→ speak about Lemmatization if you wanna impress the linguists in the room (but it's not the same)

--s--

## _Different form_ · Workaround

### Search: `tables` → `table` after stemming

| Data    | Stem                      |
| ------- | ------------------------- |
| `AI`    | `Artificial Intelligence` |
| `table` | `table`                   |
| `saw`   | `see`                     |

| _Data_  | _Found Stem_ |
| ------- | ------------ |
| `table` | `table`      |

--s--

## _Different form_ · Workaround

### Search: `see` 👀 → `see` 👀 after stemming

| Data     | Stem                      |
| -------- | ------------------------- |
| `AI`     | `Artificial Intelligence` |
| `table`  | `table`                   |
| `saw` 🪚 | `see` 👀                  |

| _Data_   | _Found Stem_                    |
| -------- | ------------------------------- |
| `saw` 🪚 | `see` 👀 → ❌ false positive 🧨 |

--s--

## Before AI-Search

# Your Database/Index is clever

- Stemmer · `tables` → `table`
- Typo Tolerance · `tabl` → `table`
- Stopwords · <br> `cat on/at/by the/a/that table` → `cat ⏹ ⏹ table`
- …

--s--

```fm
style: negative
background: true
```

## Embeddings

# _Vector Search_ with **AI**

--s--

## What is a vector?

- magnitude (length)
- direction (angle)
- in given space (dimensions)

--s--

## Vector Example in 2D

![](https://www.mathsisfun.com/algebra/images/vector-mag-dir.svg)

<footer>

Source: [MathsIsFun.com](https://www.mathsisfun.com/algebra/vectors.html)

</footer>

--s--

```fm
style: negative
background: true
```

## Example

# Vectors for Words

--s--

## Stupid one dimensional vector-search

<div style="font-size: .6em">

| Data         | Fake Vector |
| ------------ | ----------- |
| `Banana`     | `1`         |
| `Bonobo`     | `2`         |
| `Chimpanzee` | `3`         |
| `Gorilla`    | `4`         |
| `Monkey`     | `5`         |
| `Watermelon` | `6`         |

</div>

--s--

## Stupid one dimensional vector-search

<div style="font-size: .6em">

| Data         | Fake Vector |
| ------------ | ----------- |
| `Banana`     | `1`         |
| `Bonobo`     | `2`         |
| `Chimpanzee` | `3`         |
| `Gorilla`    | `4`         |
| `Monkey`     | `5`         |
| `Watermelon` | `6`         |

### Search: `Monkey` → get `5` as (embedding) result

| _Data_   | _Found Vector_ |
| -------- | -------------- |
| `Monkey` | `5`            |

</div>
--s--

## Stupid one dimensional vector-search

<div style="font-size: .6em">

| Data         | Fake Vector |
| ------------ | ----------- |
| `Banana`     | `1`         |
| `Bonobo`     | `2`         |
| `Chimpanzee` | `3`         |
| `Gorilla`    | `4`         |
| `Monkey`     | `5`         |
| `Watermelon` | `6`         |

### Search: `Monkey` → get `5` as (embedding) result

| _Data_       | _Found Vector_ |
| ------------ | -------------- |
| `Monkey`     | `5`            |
| `Gorilla`    | `4`            |
| `Watermelon` | `6`            |

</div>
--s--

## Stupid one dimensional vector-search

<div style="font-size: .6em">

| Data         | Fake Vector |
| ------------ | ----------- |
| `Banana`     | `1`         |
| `Bonobo`     | `2`         |
| `Chimpanzee` | `3`         |
| `Gorilla`    | `4`         |
| `Monkey`     | `5`         |
| `Watermelon` | `6`         |

### Search: `Ape` → get `7` as (embedding) result

| _Data_       | _Found Vector_ |
| ------------ | -------------- |
| `Watermelon` | `6`            |
| `Monkey`     | `5`            |
| `Gorilla`    | `4`            |

</div>

--s--

## Inteligent vector-search (1 Dimension)

<div style="font-size: .6em">

| Data         | Fake Vector |
| ------------ | ----------- |
| `Monkey`     | `201`       |
| `Bonobo`     | `202`       |
| `Chimpanzee` | `203`       |
| `Gorilla`    | `204`       |
| `Banana`     | `501`       |
| `Watermelon` | `502`       |

### Search: `Ape` → get `200` as (embedding) result

| _Data_       | _Found Vector_ |
| ------------ | -------------- |
| `Monkey`     | `201`          |
| `Bonobo`     | `202`          |
| `Chimpanzee` | `203`          |

</div>

--s--

```fm
style: negative
background: true
```

## Sentence/Word Embeddings

# AI-Powered Search

- Representation of _Sentence/Word in a Vector_
- **1536 Dimensions** for OpenAIs current model
- Not specific to _language_

--s--

## Get Sentence-/Word Embeddings

- `POST` to `https://api.openai.com/v1/embeddings`

<div style="font-size: .7em">

```js
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    input: "Bear", // here the text we would like to have the vector for
    model: "text-embedding-ada-002",
  }),
};
```

</div>

--s--

## Get Sentence-/Word Embeddings

<div style="font-size: .6em">

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [
        -0.000978393,
        // …
        // 1536 dimensional vector for the word "Bear"
        // …
        -0.01352617
      ]
    }
  ],
  "model": "text-embedding-ada-002-v2",
  "usage": {
    "prompt_tokens": 1,
    "total_tokens": 1
  }
}
```

</div>

--s--

## Get a Vector

- [OpenAI API](https://platform.openai.com/docs/guides/embeddings) · $0.0004 / 1K tokens
- Open Alternatives · [SBERT Sentence-Transformers](https://www.sbert.net/docs/pretrained_models.html#multi-lingual-models)

--s--

## Inteligent vector-search

<div style="font-size: .6em">

| Data         | Vector  |
| ------------ | ------- |
| `Monkey`     | `[ … ]` |
| `Bonobo`     | `[ … ]` |
| `Chimpanzee` | `[ … ]` |
| `Gorilla`    | `[ … ]` |
| `Banana`     | `[ … ]` |
| `Watermelon` | `[ … ]` |

### Search: `Ape` → get `[ … ]` as (embedding) result

| _Data_       | _Found Vector_ |
| ------------ | -------------- |
| `Monkey`     | `[ … ]`          |
| `Bonobo`     | `[ … ]`          |
| `Chimpanzee` | `[ … ]`          |

</div>
--s--

## Search with Vector

## [Typesense](https://typesense.org/)

- OpenSource (alternative to [Algolia](https://www.algolia.com/))
- Supports vector search
- Easy to setup
- Easy to use (facets, filters, …)
- Fast

--s--

## Demo

# [Typesense Dashboard](https://bfritscher.github.io/typesense-dashboard/#/)

--s--

```fm
style: negative
background: true
```

## exit 0; thx

# Questions?
