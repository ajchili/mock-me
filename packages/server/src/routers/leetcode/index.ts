import { Router } from "express";

const ENDPOINT = "https://alfa-leetcode-api.onrender.com";

const router = Router();

router.get("*", async (request, response) => {
  try {
    const url = new URL(ENDPOINT);
    url.pathname = request.path;
    for (const key in request.query) {
      url.searchParams.append(key, request.query[key] as string);
    }

    const res = await fetch(url);
    if (res.status === 404) {
      response.status(404);
      response.send();
      return;
    }

    const data = await res.json();
    response.json(data);
  } catch (error) {
    response.status(500);
    response.send();
    console.error(error);
  }
});

export { router };
