/* eslint-disable no-lone-blocks */
import {Col} from "react-bootstrap";
import Aside from "../../components/aside";
import {useContext, useEffect, useState} from "react";
import {DeleteOutlined} from '@ant-design/icons'
import "./articles.css";
import {Link, useNavigate} from "react-router-dom";
import {Button,message,Modal} from "antd";
import {MyState} from "../../state/Context.store";
import OpenSide from "../../helpers/OpenMenu";
import api_url from "../../api";
import axios from "axios";
import { GrUpdate } from "react-icons/gr";
import OpenSideMenu from "../../helpers/OpenSideMenu";
import SideUpdateMenu from "../../helpers/OpenSideMenu";

const Article = () => {
  const [data, setData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(10);
  const [changer, setChanger] = useState(true);
  const [update, setUpdate] = useState(true);
  const {open,setOpen,add} = useContext(MyState)
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()
  const handleArticleDelete = async (id) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${api_url}/article/delete`,
        data: {
          id: id
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        }
      });

      if (response.status === 200) {
        setChanger((prev) => !prev);  // Toggle to force update or refresh
        message.success('Article deleted successfully');
      } else {
        // Handle other status codes as necessary
        message.error('Failed to delete the article');
      }
    } catch (err) {
      console.error('Error deleting the article:', err);
      message.error('Failed to delete the article due to an error');
    }
  };

  const showModal = (item) => {
    setSelectedId(item)
    setIsModalOpen(true);
  };

  console.log(data)
  const filteredData = data ? data.filter(item => item?.title?.toLowerCase()?.includes(searchTerm.toLowerCase())) : [];



  const handleOk = () => {
    if(selectedId){
      handleArticleDelete(selectedId)
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleArticleUpdates = (id) => {
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
        `${process.env.REACT_APP_API_URL}/article?${limit}&${page}`,
        requestOptions
      ).then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setData(data.data);
        }
      });
    })();

  }, [changer, update,add]);




  const handleArticleUpdate = async (id) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${api_url}/article/update/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        }
      });
      console.log(response)
      if (response.status === 200) {
        setChanger((prev) => !prev);
        message.success('Article deleted successfully');
      } else {
        message.error('Failed to delete the article');
      }
    } catch (err) {
      console.error('Error deleting the article:', err);
      message.error('Failed to delete the article due to an error');
    }
  };

  return (
    <>
      <Modal title="malumot!" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <h2>shu maqolani o'chirishga aminmisiz?</h2>
        <p>malumotni o'chirganingizdan keyin qayta tiklab bo'lmaydi!</p>
      </Modal>
      <SideUpdateMenu
          id={selectedArticleId}
          visible={updateVisible}
          onClose={() => setUpdateVisible(false)}
          onUpdate={() => setChanger(prev => !prev)}
      />
      <OpenSide/>
      <div className="articles">
        <div className="asid">
          <Aside />
        </div>
        <div className="articles-page">
          <div className="filter d-flex">
            <form className="search-card d-flex">
              <label htmlFor="">
                <input placeholder="Search" value={searchTerm} className="search" type="text"
                       onChange={e => setSearchTerm(e.target.value)}/>
              </label>
              <Button size="large" onClick={() => setSearchTerm("")} className="search-btn edit-btn">Clear
                Search</Button>
            </form>
            <div className="add-article">
              <Button onClick={() => {
                setOpen(true)
                console.log('sasdf')
              }} className="add-btn department-add__btn edit-btn">
                Article Add
              </Button>
            </div>
          </div>

          <Col md={11} lg={11}>
            <div>
              <table className="table-wrapper" responsive="lg">
                <thead>
                <tr>
                  <th>#</th>
                  <th>IMAGE</th>
                  <th>NAME</th>
                  <th>STATUS</th>
                  <th>UPDATE</th>
                  <th className="delete-title">DELETE</th>
                  </tr>
                </thead>
                <tbody className="articles-table__body">
                  {filteredData &&
                      filteredData.map((item, index) => (
                      <tr  key={item.id}>
                        <td>{index + 1}</td>
                        <td className="cursor-pointer" onClick={() => {
                          navigate(`/articles/article/${item.id}`)
                        }}>
                          {item.file_id ? (
                            <img
                              style={{ width: "50px", height: "50px" }}
                              src={`${process.env.REACT_APP_API_URL}/${item.file_id}`}
                              alt=""
                            />
                          ) : (
                            <img
                              style={{ width: "50px", height: "50px" }}
                              src={`${api_url}${item?.image?.file_path}`}
                              alt=""
                            />
                          )}
                        </td>
                        <td>{item.title}
                        </td>
                        <td className={`${item.status === null ? "text-yellow-300" : item.status === 'ACCEPT' ? 'text-green-400' : 'text-red-300'}`}>{item.status === null ? "Jarayonda" : item.status === 'ACCEPT' ? 'Qabul qilingan' : 'Rad etilgan'}</td>
                        <td className="cursor-pointer">
                          <GrUpdate
                              className="m-auto block"
                            onClick={(event) =>
                                handleArticleUpdates(item.id)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={"24px"}
                              height={"24px"}
                              viewBox="0 0 448 512"
                              fill="rgb(42, 119, 51)"
                            >
                              {" "}
                              <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                            </svg>
                          </GrUpdate>
                        </td>
                        <td className="">
                          <Button icon={<DeleteOutlined />} type="primary" onClick={() => showModal(item.id)}>
                            o'chirish
                          </Button>
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
export default Article;
