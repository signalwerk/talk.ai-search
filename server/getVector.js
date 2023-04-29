import fetch from "node-fetch";

export const getVector = async ({ text, API_URL, API_KEY, API_MODEL }) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: API_MODEL || "text-embedding-ada-002",
    }),
  };

  return fetch(
    API_URL || "https://api.openai.com/v1/embeddings",
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      return data.data[0].embedding;
    })
    .catch((error) => console.error(error));
};
