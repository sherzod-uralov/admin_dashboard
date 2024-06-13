/* eslint-disable no-lone-blocks */
import { Col } from "react-bootstrap";
import Aside from "../../components/aside";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import "./article.css";
import { Link } from "react-router-dom";
import api_url from "../../api";

const Article = () => {
  const [data, setData] = useState(null);
  // const [upload, setUpload] = useState();
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
        console.log(data);
        if (response.ok) {
          setData(data);
        }
      });
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <div className="articles">
        <div className="asid">
          <Aside />
        </div>
        <div className="article-page">
          {data && (
              <Col md={11} lg={11}>
                <div className="article-about gap-2 items-start flex ">
                  <img className="w-[500px] object-fit-cover h-[610px]" src={`${api_url}${data.image.file_path}`} alt=""/>
                  <div><h2 className="article-title">{data?.title}</h2>
                    <p className="article-subtitle">{data?.abstract}</p>
                    <div className="article-desc__wrapper">
                      <p className="article-desc">{data?.keyword}</p>
                      <p className="article-desc">{data?.doi}</p>
                      <p className="article-desc">{data?.category.name}</p>
                      <p className="article-desc">{data?.SubCategory.name}</p>
                    </div>
                    <div className={"download-btn__wrapper"}>
                      <Link
                          className="download-btn"
                          to={process.env.REACT_APP_API_URL + "/" + data?.source}
                          target="_blank"
                          rel="noreferrer"
                          type="button"
                      >
                        To'liq maqola
                      </Link>
                    </div>
                  </div>
                </div>
                <p className="article-desc">{data?.description}</p>
              </Col>
          )}
        </div>
      </div>
    </>
  );
};
export default Article;
