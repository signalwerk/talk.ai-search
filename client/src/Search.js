import React, { useState, useEffect } from "react";

import "./Search.css";
import Typesense from "typesense";

import monkey1 from "./icons/noun-monkey-2006789.svg";
import monkey2 from "./icons/noun-monkey-2006784.svg";
import monkey3 from "./icons/noun-monkey-2017945.svg";
import monkey4 from "./icons/noun-monkey-2006785.svg";
import banana from "./icons/noun-banana-2026487.svg";
import melon from "./icons/noun-water-melon-1006230.svg";

import { Spinner } from "./Spinner";

// similarity
// https://community.openai.com/t/embeddings-and-cosine-similarity/17761/20
// https://weaviate.io/blog/distance-metrics-in-vector-search

function getImage(name) {
  switch (name) {
    case "Chimpanzee":
      return monkey1;
    case "Gorilla":
      return monkey2;
    case "Monkey":
      return monkey3;
    case "Bonobo":
      return monkey4;
    case "Banana":
      return banana;
    case "Watermelon":
      return melon;

    default:
      return null;
  }
}

const client = new Typesense.Client({
  nodes: [
    {
      host: "typesense.signalwerk.ch",
      port: "443",
      protocol: "https",
    },
  ],
  apiKey: process.env.REACT_APP_TYPESENSE_JOBS_SEARCH_KEY,
  connectionTimeoutSeconds: 20,
});

function searchEmpty(setResult) {
  const searchParameters = {
    q: "*",
    query_by: "title",
    sort_by: "title:asc",
    page: 1,
    per_page: 10,
    exhaustive_search: true,
  };
  client
    .collections("test")
    .documents()
    .search(searchParameters)
    .then(function (searchResults) {
      console.log(searchResults);
      setResult(searchResults);
    });
}

function searchTitle(search, setResult) {
  const searchParameters = {
    q: "*",
    query_by: "title",
    filter_by: `title:${search}`,
    sort_by: "title:asc",
    page: 1,
    per_page: 10,
    exhaustive_search: true,
  };
  client
    .collections("test")
    .documents()
    .search(searchParameters)
    .then(function (searchResults) {
      console.log(searchResults);
      setResult(searchResults);
    });
}

function getOpenAI(search) {
  const data = {
    input: `${search}`.toLowerCase(),
    model: "text-embedding-ada-002",
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    },
    body: JSON.stringify(data),
  };
  return ["test", "https://api.openai.com/v1/embeddings", requestOptions];
}
function getSBERT(search) {
  const data = {
    input: `${search}`.toLowerCase(),
    model: "text-embedding-multilingual-001",
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_SBERT_API_KEY}`,
    },
    body: JSON.stringify(data),
  };
  return [
    "test-sbert",
    "https://embeddings.srv.signalwerk.ch/v1/embeddings",
    requestOptions,
  ];
}

function searchAI(search, setResult) {
  const [index, URL, requestOptions] = getOpenAI(`search for: ${search}`);
  // const [index, URL, requestOptions] = getSBERT(search);
  fetch(URL, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      const vector = res.data[0].embedding;
      console.log(res);

      const vectorTxt = vector.join(",");
      console.log({ vector, vectorTxt });

      let searchRequests = {
        searches: [
          {
            collection: index,
            q: "*",
            vector_query: `vector:([${vector.join(",")}], k:20)`,
            per_page: 20,
          },
        ],
      };

      let commonSearchParams = {};

      client.multiSearch
        .perform(searchRequests, commonSearchParams)
        .then(function (searchResults) {
          console.log(searchResults.results[0]);
          setResult(searchResults.results[0]);
        });
    });
}

function Search() {
  const [search, setSearch] = useState("");
  const [results, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    searchEmpty(setResult);
    setLoading(false);
  }, []);

  const onSearchChange = (e) => setSearch(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!search) {
      console.log("Please add a search");
      searchEmpty(setResult);
      return;
    }

    setLoading(true);
    searchAI(search, (data) => {
      setResult(data);
      setLoading(false);
    });
  };

  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const distance = (distance) => {
    if (!distance) {
      return null;
    }

    const fixed = distance.toFixed(3);
    return <span className="search__result-distance">{fixed} · distance</span>;
  };

  return (
    <div className="search">
      <form>
        <br />
        <div>
          <label>
            <div className="search__label">Search</div>
            <textarea
              className="search__input"
              name="postContent"
              placeholder="Search term"
              onChange={onSearchChange}
              onKeyDown={handleKeyDown}
              value={search}
              rows={3}
            />
          </label>
        </div>
        <button className="search__submit" type="submit" onClick={handleSubmit}>
          GO
        </button>
      </form>

      {loading ? (
        <Spinner />
      ) : (
        <div className="search__results">
          {results?.hits?.length &&
            results.hits.map((result) => (
              <div className="search__result" key={result.document.id}>
                <div className="search__result-img">
                  <img src={getImage(result.document.title)} alt="monkey" />
                </div>
                <div className="search__result-text">
                  <h3>
                    {result.document.title}
                    {distance(result?.vector_distance)}
                  </h3>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Search;
