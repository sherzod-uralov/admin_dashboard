import axios from "axios";
import api_url from "../../api";

const getData = async (url) => {
  const response = await axios.get(`${api_url}/${url}`, {
    headers: {
      Authorization: localStorage.getItem("accessToken"),
    },
  });
  return response.data;
};

const getPostMethodData = async ({ url, data }) => {
  const response = await axios.post(`${api_url}/${url}`, data, {
    headers: {
      Authorization: localStorage.getItem("accessToken"),
    },
  });

  return response.data;
};

const fetchSearchAnalytics = async () => {
  const token =
    "ya29.a0AXooCgu93XLcYF9HT9UQ1ClBIrrIZfSOGCqF-TRfRn9dvSXCADtlLhUwN2QixK6L7Nmz0PFXClsP5zRHo3lLiAORLPWuvl11QS9DGKAh73s3ajZ9Kgg8areCLWhkPOfrk1dTCBErfp4ryMzzIGjHfDT-jkMjAfQTkh7JaCgYKAcISARESFQHGX2MiZKXgk7AWYl7AT0zIfpjPJQ0171";
  const siteUrl = "https://journal.nordicuniversity.org";
  const startDate = "2024-01-01";
  const endDate = "2024-01-31";

  const response = await axios.post(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 10,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export { getPostMethodData, fetchSearchAnalytics, getData };
