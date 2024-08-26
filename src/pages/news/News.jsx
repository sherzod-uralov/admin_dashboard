import { Col } from "react-bootstrap";
import Aside from "../../components/aside";
import { useState } from "react";
import "../articles/articles.css";
import { Button, message, Modal } from "antd";
import { TiPlus } from "react-icons/ti";
import { GrUpdate } from "react-icons/gr";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteNews, getNews } from "./news.query";
import SideMenuNews from "./sideMenuNews";
import UpdateNews from "./sideUpdateMenu";
import dayjs from "dayjs";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [openNews, setOpenNews] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalId, setGlobalId] = useState(null);
  const queryClient = useQueryClient();
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const { data: newsData } = useQuery({
    queryKey: ["news"],
    queryFn: () => getNews({ page: 1, limit: 10, lang: "uz" }),
    refetchOnMount: false,
  });

  const mutation = useMutation(deleteNews, {
    onSuccess: () => {
      queryClient.invalidateQueries("news");
      message?.success(`yangilik muvaffaqiyatli o'chirildi!`);
    },
    onError: () => {
      setIsModalOpen(false);
      message?.error(`yangilikni o'chirishda mummo bor!`);
    },
  });

  const showModal = (id) => {
    setGlobalId(id);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    mutation.mutate(globalId);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="yangilikni o'chirish"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Yangilikni o‘chirilgandan so‘ng qayta tiklab bo‘lmaydi!</p>
      </Modal>
      <UpdateNews
        open={openNews}
        setOpen={setOpenNews}
        newsId={selectedArticleId}
      />
      <SideMenuNews open={open} setOpen={setOpen} />
      <div className="articles">
        <div className="asid">
          <Aside />
        </div>
        <div className="articles-page">
          <div className="filter d-flex">
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
            <div className="add-article">
              <Button
                icon={<TiPlus className="ml-2" />}
                iconPosition="end"
                onClick={() => setOpen(true)}
                className="add-btn py-6 department-add__btn edit-btn"
              >
                Yangilik yaratish
              </Button>
            </div>
          </div>

          <Col className="pr-[74px]">
            <div>
              <table className="table-wrapper">
                <thead>
                  <tr>
                    <th>№</th>
                    <th>rasmi</th>
                    <th>sarlavha</th>
                    <th>vaqti</th>

                    <th className="text-center">yangilash</th>
                    <th className="text-center">o'chirish</th>
                  </tr>
                </thead>
                <tbody className="articles-table__body">
                  {newsData &&
                    newsData?.map((item, index) => (
                      <tr key={item?.id} className="cursor-pointer">
                        <td>{index + 1}</td>
                        <td>
                          {item.source ? (
                            <img
                              style={{ width: "50px", height: "50px" }}
                              src={`${process.env.REACT_APP_API_URL}${item.source.file_path}`}
                            />
                          ) : (
                            <div style={{ width: "50px", textAlign: "center" }}>
                              -
                            </div>
                          )}
                        </td>
                        <td>{item?.news_title_uz}</td>
                        <td>{dayjs(item.news_time).format("MMMM D, YYYY")}</td>
                        <td
                          onClick={() => {
                            setSelectedArticleId(item.id);
                            setOpenNews(true);
                          }}
                        >
                          <GrUpdate className="m-auto block"></GrUpdate>
                        </td>
                        <td onClick={() => showModal(item.id)}>
                          <svg
                            width={"24px"}
                            height={"24px"}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="rgba(236,26,26,1)"
                            className="m-auto cursor-pointer"
                          >
                            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" />
                          </svg>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Col>
        </div>
      </div>
    </>
  );
};
export default News;
