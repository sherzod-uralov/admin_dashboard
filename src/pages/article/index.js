/* eslint-disable no-lone-blocks */
import { Col } from "react-bootstrap";
import Aside from "../../components/aside";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import "./article.css";
import { Link } from "react-router-dom";

const Article = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json;",
          Authorization: localStorage.getItem("accessToken"),
        },
      };
      await fetch(
        `${process.env.REACT_APP_API_URL}/article/${id}`,
        requestOptions
      ).then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setData(data);
        }
      });
    })();
  }, []);
  console.log(id);
  console.log(data);
  return (
    <>
      <div className="articles">
        <div className="asid">
          <Aside />
        </div>
        <div className="article-page">
          {data && (
            <Col md={11} lg={11}>
              <div className="article-about">
                <span className="article-category">
                  {data?.author.full_name}
                </span>
                <h2 className="article-title">{data?.title}</h2>
                <p className="article-subtitle">{data?.abstract}</p>
                <div className="article-desc__wrapper">
                  <p className="article-desc">{data?.fulldescription}</p>
                  <div className={"download-btn__wrapper"}>
                    <Link
                      className="download-btn"
                      to={process.env.REACT_APP_API_URL + "/" + data?.pdffile}
                      target="_blank"
                      rel="noreferrer"
                      type="button"
                    >
                      To'liq maqola
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          )}
        </div>
      </div>
    </>
  );
};
export default Article;
