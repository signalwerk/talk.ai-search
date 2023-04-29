import React, { useState } from "react";

import "./Search.css";
import Typesense from "typesense";

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
  const [index, URL, requestOptions] = getOpenAI(search);
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

  const onSearchChange = (e) => setSearch(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!search) {
      console.log("Please add a search");
      searchEmpty(setResult);
      return;
    }

    //

    searchAI(search, setResult);
  };

  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="search">
      <form>
        <br />
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
        <br />
        <button type="submit" onClick={handleSubmit}>
          GO
        </button>
      </form>
      <div className="search__results">
        {results?.hits?.length &&
          results.hits.map((result) => (
            <div className="search__result" key={result.document.id}>
              <div className="search__result-text">
                <h3>{result.document.title}</h3>

                {/* <p>
                  <small>{result.document.id}</small>
                </p> */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Search;
