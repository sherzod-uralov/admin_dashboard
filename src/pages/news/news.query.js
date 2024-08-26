import axios from "axios";
import api_url from "../../api";

const getNews = async ({ page, limit, lang }) => {
  const response = await axios.post(
    `${api_url}/news/filter?page=${page}&limit=${limit}&lang=${lang}`,
    {},
    {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    },
  );
  return response.data.data;
};

const addNews = async (data) => {
  const response = await axios.post(`${api_url}/news/create`, data, {
    headers: {
      Authorization: localStorage.getItem("accessToken"),
    },
  });
};

const deleteNews = async (id) => {
  const response = await axios.delete(`${api_url}/news/${id}`, {
    headers: {
      Authorization: localStorage.getItem("accessToken"),
    },
  });
};

export const updateNews = async ({ id, newsData }) => {
  const response = await axios.put(
    `https://journal2.nordicun.uz/news/${id}`,
    newsData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
    },
  );

  return response;
};

export const getNewsById = async (id) => {
  const response = await axios.get(`https://journal2.nordicun.uz/news/${id}`, {
    headers: {
      Authorization: localStorage.getItem("accessToken"),
    },
  });

  return response;
};

export { getNews, addNews, deleteNews };
