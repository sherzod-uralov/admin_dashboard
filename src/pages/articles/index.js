/**
 * eslint-disable no-lone-blocks
 *
 * @format
 */

import { Col } from "react-bootstrap";
import Aside from "../../components/aside";
import { useContext, useEffect, useState } from "react";

import "./articles.css";
import { useNavigate } from "react-router-dom";
import { Button, message, Modal, Pagination } from "antd";
import { MyState } from "../../state/Context.store";
import OpenSide from "../../helpers/OpenMenu";
import api_url from "../../api";
import axios from "axios";
import { GrUpdate } from "react-icons/gr";
import { FileExcelOutlined } from "@ant-design/icons";
import SideUpdateMenu from "../../helpers/OpenSideMenu";
import { TiPlus } from "react-icons/ti";

const Article = () => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(1);
  const [changer, setChanger] = useState(true);
  const [update, setUpdate] = useState(true);
  const { setOpen, add } = useContext(MyState);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExelOpen, setIsExelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [volume, setVolume] = useState(null);
  const [Index, setIndex] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loader, setLoader] = useState(false);

  const handleArticleDelete = async (id) => {
    try {
      const response = await axios({
        method: "post",
        url: `${api_url}/article/delete`,
        data: {
          id: id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });

      if (response.status === 200) {
        setChanger((prev) => !prev);
        message.success("Maqola muvaffaqiyatli o‘chirildi!");
      } else {
        message.error("Maqola o‘chirishda xatolik!");
      }
    } catch (err) {
      console.error("Error deleting the article:", err);
      message.error("Server xatosi, qaytdan urinib ko‘ring!");
    }
  };

  const showModal = (event, item) => {
    event.stopPropagation();
    setSelectedId(item);
    setIsModalOpen(true);
  };

  const filteredData = data
    ? data.filter((item) =>
        item?.title?.toLowerCase()?.includes(searchTerm.toLowerCase()),
      )
    : [];

  const handleOk = () => {
    if (selectedId) {
      handleArticleDelete(selectedId);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleExelOk = async (isNew) => {
    if (!isNew && !selected) {
      message.info("Iltimos kerakli nashrni tanlang!");
      return;
    }
    setLoader(true);

    const BackendUrl = isNew
      ? `${api_url}/article/export/excel`
      : `${api_url}/article/export/excel?volume=${selected?.id}`;
    try {
      const response = await axios.get(BackendUrl, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const fileName = isNew
        ? "Yangi maqolalar.xlsx"
        : `${selected.title}.xlsx`;
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setIsExelOpen(false);
    } catch (err) {
      console.log(err);
      message.error("Faylni yuklashda xatolik!.");
    } finally {
      setLoader(false);
    }
  };

  const handleArticleUpdates = (event, id) => {
    event.stopPropagation();
    setSelectedArticleId(id);
    setUpdateVisible(true);
  };

  useEffect(() => {
    (async () => {
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
        body: {
          title: "",
          authorName: "",
          description: "",
          keyword: "",
          abstract: "",
        },
      };

      await fetch(
        `${process.env.REACT_APP_API_URL}/article?limit=${limit}&page=${page}`,
        requestOptions,
      ).then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          setTotal(data?.totalPages);
          setPage(data?.currentPage);
          setData(data?.data);
        }
      });
    })();
  }, [changer, updateVisible, add, page, limit]);
  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setLimit(pageSize);
  };

  useEffect(() => {
    axios
      .get(`${api_url}/volume`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setVolume(response.data);
      })
      .catch((err) => {});
  }, [changer]);

  const selectVolume = (itemId, index) => {
    setIndex(index);
    setSelected(itemId);
  };

  return (
    <>
      <Modal
        title="Ogohlantirish!"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Maqola o‘chirilgandan so‘ng qayta tiklab bo‘lmaydi!</p>
      </Modal>
      <Modal
        title="Nashrni tanlang!"
        open={isExelOpen}
        cancelButtonProps={{ style: { display: "none" } }}
        okText={"Exelni yuklab olish"}
        width={"95%"}
        okButtonProps={{
          loading: loader,
          disabled: loader,
        }}
        onOk={() => handleExelOk(false)}
        onCancel={() => setIsExelOpen(false)}
      >
        <div className="mt-5 flex gap-2 max-lg:flex-wrap justify-center">
          {volume?.map((item, index) => (
            <div
              key={index}
              onClick={() => selectVolume(item, index)}
              className={`${Index === index ? "bg-gray-200" : ""} rounded-md cursor-pointer transition-all pb-4 hover:bg-gray-200`}
            >
              <img
                className="h-[330px]"
                loading="lazy"
                src={`${api_url}${item?.image?.file_path}`}
                alt=""
              />
              <span className="text-center m-auto block text-lg font-semibold">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </Modal>
      <SideUpdateMenu
        id={selectedArticleId}
        visible={updateVisible}
        onClose={() => setUpdateVisible(false)}
        onUpdate={() => setChanger((prev) => !prev)}
      />
      <OpenSide />
      <div className="articles">
        <div className="asid">
          <Aside />
        </div>
        <div className="articles-page">
          <div className="filter flex items-center justify-between">
            <form className="search-card d-flex">
              <label htmlFor="">
                <input
                  placeholder="Qidiruv"
                  value={searchTerm}
                  className="search"
                  type="text"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
              <Button
                size="large"
                onClick={() => setSearchTerm("")}
                className="search-btn edit-btn"
              >
                Tozalash
              </Button>
            </form>
            <div className="add-article flex items-center gap-3">
              <Button
                icon={<FileExcelOutlined />}
                iconPosition="end"
                size="large"
                onClick={() => handleExelOk(true)}
                className="bg-green-700"
                type="primary"
              >
                Yangi maqolalar bo'yicha
              </Button>
              <Button
                icon={<FileExcelOutlined />}
                iconPosition="end"
                size="large"
                onClick={() => setIsExelOpen(true)}
                className="bg-green-700"
                type="primary"
              >
                Nashr bo'yicha
              </Button>
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                size="large"
                className="add-btn department-add__btn edit-btn"
              >
                Maqola qo‘shish <TiPlus className="ml-2" />
              </Button>
            </div>
          </div>

          <Col
            className="overflow-y-auto overflow-x-hidden"
            style={{
              maxWidth: "calc(100vw - 380px)",
              height: "calc(100vh - 250px)",
            }}
          >
            <table className="table-wrapper">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Rasm</th>
                  <th className="max-w-[400px]">Sarlavha</th>
                  <th>Muallif</th>
                  <th className="text-center">Holati</th>
                  <th className="text-center">Nashr</th>
                  <th className="text-center">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="articles-table__body">
                {filteredData &&
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="cursor-pointer">
                      <td
                        onClick={() => {
                          navigate(`/articles/article/${item.id}`);
                        }}
                      >
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td
                        onClick={() => {
                          navigate(`/articles/article/${item.id}`);
                        }}
                      >
                        {item.image ? (
                          <img
                            style={{ width: "50px", height: "50px" }}
                            src={`${process.env.REACT_APP_API_URL}${item.image.file_path}`}
                          />
                        ) : (
                          <div style={{ width: "50px", textAlign: "center" }}>
                            <img
                              style={{ width: "50px", height: "50px" }}
                              src={`https://polinka.top/uploads/posts/2023-06/1686095337_polinka-top-p-kartinka-inkognito-muzhchina-instagram-69.png`}
                            />
                          </div>
                        )}
                      </td>
                      <td
                        onClick={() => {
                          navigate(`/articles/article/${item.id}`);
                        }}
                        className="max-w-[400px]"
                      >
                        {item.title}
                      </td>
                      <td
                        onClick={() => {
                          navigate(`/articles/article/${item.id}`);
                        }}
                      >
                        {item.author.full_name}
                      </td>
                      <td
                        className={`${
                          item.status === "NEW"
                            ? "text-yellow-300"
                            : item.status === "REVIEW"
                              ? "text-blue-400"
                              : item.status === "PLAGIARISM"
                                ? "text-purple-400"
                                : item.status === "ACCEPT"
                                  ? "text-green-400"
                                  : "text-red-300"
                        } text-center`}
                        onClick={() => {
                          navigate(`/articles/article/${item.id}`);
                        }}
                      >
                        {item.status === "NEW"
                          ? "🆕 Yangi"
                          : item.status === "REVIEW"
                            ? "🔍 Taqriz - baholash va tahlil qilish jarayoni"
                            : item.status === "PLAGIARISM"
                              ? "📊 Antiplagiat - o‘xshashlik darajasini aniqlash"
                              : item.status === "ACCEPT"
                                ? "✅ Qabul qilingan"
                                : "❌ Rad etilgan"}
                      </td>
                      <td className="cursor-pointer text-center">
                        {item.volume ? item.volume?.title : "-"}
                        {}
                      </td>
                      <td className="text-center">
                        <div className="flex">
                          <GrUpdate
                            className="m-auto block"
                            onClick={(event) =>
                              handleArticleUpdates(event, item.id)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={"24px"}
                              height={"24px"}
                              viewBox="0 0 448 512"
                              fill="rgb(42, 119, 51)"
                            >
                              <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                            </svg>
                          </GrUpdate>
                          <svg
                            width={"24px"}
                            height={"24px"}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="rgba(236,26,26,1)"
                            className="m-auto cursor-pointer"
                            onClick={(e) => showModal(e, item.id)}
                          >
                            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Col>
          <div
            style={{ maxWidth: "calc(100vw - 380px)" }}
            className="pt-10 flex w-full justify-end"
          >
            <Pagination
              current={page}
              pageSize={limit}
              total={total * limit}
              onChange={handlePageChange}
              showSizeChanger
              onShowSizeChange={handlePageChange}
              pageSizeOptions={["10", "20", "50", "100"]}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Article;
