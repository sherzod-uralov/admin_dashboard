/**
 * eslint-disable no-lone-blocks
 *
 * @format
 */

import { Col, Form, Modal } from "react-bootstrap";
import Aside from "../../components/aside";
import { useContext, useEffect, useState } from "react";

import "../articles/articles.css";
import { useNavigate } from "react-router-dom";
import { Button, message, Modal as Mod } from "antd";
import { MyState } from "../../state/Context.store";

import api_url from "../../api";
import axios from "axios";
import { TiPlus } from "react-icons/ti";
import { GrUpdate } from "react-icons/gr";
import moment from "moment";

const EmptyState = {
  full_name: "",
  phone_number: "+998",
  password: "",
  science_degree: "",
  birthday: "",
  job: "",
  place_position: "",
};

const Author = () => {
  const [data, setData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(10);
  const [changer, setChanger] = useState(true);
  const [update, setUpdate] = useState(true);
  const { open, setOpen, add } = useContext(MyState);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateId, setUpdateId] = useState(null);
  const [categoryShow, setCategoryShow] = useState(false);
  const [categoryUpdateShow, setCategoryUpdateShow] = useState(false);
  const navigate = useNavigate();
  const [updateCategory, setUpdateCategory] = useState({
    full_name: "",
    phone_number: "+998",
    password: "",
    science_degree: "",
    birthday: "",
    job: "",
    place_position: "",
  });

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const allFieldsFilled = Object.values(updateCategory).every(
      (value) => value.trim() !== "",
    );
    setIsComplete(allFieldsFilled);
  }, [updateCategory]);

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Ensure the prefix +998 stays in place
    if (!input.startsWith("+998")) {
      setUpdateCategory((prevState) => ({
        ...prevState,
        phone_number: "+998" + input.replace(/[^\d]/g, ""), // Remove non-digits and add prefix
      }));
    } else {
      setUpdateCategory((prevState) => ({
        ...prevState,
        phone_number: input,
      }));
    }
  };

  console.log(data);

  const handleKeyDown = (e) => {
    // Prevent the user from deleting '+998'
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      updateCategory.phone_number === "+998"
    ) {
      e.preventDefault();
    }
  };

  const handleArticleDelete = async (id) => {
    console.log(id);
    try {
      const response = await axios({
        method: "DELETE",
        url: `${api_url}/author/${id.id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      if (response.status === 200) {
        setChanger((prev) => !prev);
        message.success("Muallif Muvaffaqiyatli o'chirildi!");
      } else {
        message.error("Muallifni o'chirishda qandaydir xatolik ketti!");
      }
    } catch (err) {
      console.error("Error deleting the article:", err);
      message.error("Failed to delete the article due to an error");
    }
  };

  const handleSubmit = async () => {
    if (isComplete) {
      try {
        const response = await axios.post(
          "https://journal2.nordicun.uz/author/create",
          updateCategory,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        if (response.status === 201) {
          setUpdateCategory(EmptyState);
          message.success("Muallif muvaffaqiyatli qo'shildi");
          setCategoryShow(false);
          setChanger((prev) => !prev);
          setCategoryShow(false);
        } else {
          message.error("server xatoligi!");
        }
      } catch (error) {
        message.info("bu raqam avval ro'yxatdan o'tgan!");
      }
    } else {
      message.info("Iltimos hamma maydonlarni to'ldiring!");
    }
  };

  const showModal = (item) => {
    console.log(item);
    setSelectedId(item);
    setIsModalOpen(true);
  };

  const filteredData = data
    ? data?.filter((item) =>
        item?.full_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
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

  const handleCategoryShow = () => {
    setUpdateCategory(EmptyState);
    setCategoryShow(true);
  };

  const handleCategoryClose = () => {
    setCategoryShow(false);
  };

  const handleUpdateCategoryShow = (item) => {
    console.log(moment(item.birthday));
    setUpdateCategory({
      full_name: item.full_name,
      phone_number: item.phone_number,
      password: item.password,
      science_degree: item.science_degree,
      birthday: moment(item.birthday).format("YYYY-MM-DD"),
      job: item.job,
      place_position: item.place_position,
    });
    setUpdateId(item.id);
    setCategoryUpdateShow(true);
  };

  const handleUpdateCategoryClose = () => {
    setUpdateCategory(EmptyState);
    setCategoryUpdateShow(false);
  };

  const handleUpdateSubmit = async (updateId) => {
    if (isComplete) {
      try {
        const response = await axios.post(
          `${api_url}/author/update/${updateId}`,
          updateCategory,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("accessToken")}`,
            },
          },
        );
        console.log(response);
        if (response.status === 201) {
          setUpdateCategory(EmptyState);
          message.success("Muallif muvaffaqiyatli yangilandi");
          setUpdateVisible(false);
          handleUpdateCategoryClose();
          setChanger((prev) => !prev);
        } else {
          message.error("Server xatoligi!");
        }
      } catch (error) {
        console.log(error);
        message.error("Yangilashda xatolik yuz berdi!");
      }
    } else {
      message.info("Iltimos hamma maydonlarni to'ldiring!");
    }
  };

  useEffect(() => {
    (async () => {
      const requestOptions = {
        method: "get",
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      };

      await fetch(
        `${process.env.REACT_APP_API_URL}/author/list`,
        requestOptions,
      ).then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setData(data.data);
        }
      });
    })();
  }, [changer, update, add]);

  return (
    <>
      <Mod
        title="malumot!"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h2>shu maqolani o'chirishga aminmisiz?</h2>
        <p>malumotni o'chirganingizdan keyin qayta tiklab bo'lmaydi!</p>
      </Mod>
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
                onClick={() => {
                  handleCategoryShow();
                }}
                icon={<TiPlus className="ml-2" />}
                iconPosition="end"
                className="add-btn py-6 department-add__btn edit-btn"
              >
                Muallif yaratish
              </Button>
            </div>
          </div>

          <Col className="pr-[74px]">
            <div>
              <table className="table-wrapper" responsive="lg">
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Ism</th>
                    <th>Ish joyi</th>
                    <th>Kasbi</th>
                    <th>Ilmiy daraja</th>
                    <th>Telefon raqami</th>
                    <th>Tahrirlash</th>
                    <th>O'chirish</th>
                  </tr>
                </thead>
                <tbody className="articles-table__body">
                  {filteredData &&
                    filteredData.map((item, index) => (
                      <tr key={item?.id} className="cursor-pointer">
                        <td>{index + 1}</td>
                        <td

                        //   onClick={() => {
                        //     navigate(`/articles/article/${item.id}`);
                        //   }}
                        >
                          {item?.full_name}
                        </td>
                        <td>{item.place_position}</td>
                        <td>{item.job}</td>
                        <td>{item.science_degree}</td>
                        <td>{item.phone_number}</td>
                        <td>
                          <GrUpdate
                            className="m-auto block"
                            onClick={(event) => handleUpdateCategoryShow(item)}
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
                        </td>
                        <td>
                          <svg
                            width={"24px"}
                            height={"24px"}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="rgba(236,26,26,1)"
                            className="m-auto cursor-pointer"
                            onClick={(e) => showModal(item)}
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
      <Modal
        aria-labelledby="example-modal-sizes-title-sm"
        size="md"
        show={categoryShow}
        onHide={handleCategoryClose}
      >
        <Modal.Header closeButton>
          <h2 className="modal-title">Muallif qo'shish</h2>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-category">
            <Form.Group className="mb-3">
              <Form.Label>To'liq ismi</Form.Label>
              <Form.Control
                type="text"
                placeholder="To'liq ism kiriting"
                value={updateCategory.full_name}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    full_name: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefon raqam</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Telefon raqam kiriting"
                value={updateCategory.phone_number}
                onChange={handlePhoneNumberChange}
                onKeyDown={handleKeyDown}
                onFocus={(e) => e.target.select()}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parol</Form.Label>
              <Form.Control
                type="password"
                placeholder="Parol kiriting"
                value={updateCategory.password}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    password: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ilmiy darajasi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ilmiy darajasiga kiriting"
                value={updateCategory.science_degree}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    science_degree: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>tug'ilgan kun</Form.Label>
              <Form.Control
                type="date"
                placeholder="tug'ilgan kunni kiriting"
                value={updateCategory.birthday}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    birthday: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>kasbi</Form.Label>
              <Form.Control
                type="text"
                placeholder="kasbni kiriting"
                value={updateCategory.job}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    job: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ish joyi</Form.Label>
              <Form.Control
                type="text"
                placeholder="ish joyini kiriting"
                value={updateCategory.place_position}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    place_position: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <div className="footer-modal -mr-16">
          <button
            onClick={handleCategoryClose}
            className="delete-btn close-btn"
          >
            Yopish
          </button>
          <button
            className="edit-btn save-btn"
            onClick={() => handleSubmit()}
            type="submit"
          >
            Qo'shish
          </button>
        </div>
      </Modal>
      <Modal
        aria-labelledby="example-modal-sizes-title-sm"
        size="sm"
        show={categoryUpdateShow}
        onHide={handleUpdateCategoryClose}
      >
        <Modal.Header closeButton>
          <h2 className="modal-title">Muallifni tahrirlash</h2>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-category">
            <Form.Group className="mb-3">
              <Form.Label>To'liq ismi</Form.Label>
              <Form.Control
                type="text"
                placeholder="To'liq ism kiriting"
                value={updateCategory.full_name}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    full_name: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefon raqam</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Telefon raqam kiriting"
                value={updateCategory.phone_number}
                onChange={handlePhoneNumberChange}
                onKeyDown={handleKeyDown}
                onFocus={(e) => e.target.select()}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parol</Form.Label>
              <Form.Control
                type="password"
                placeholder="Parol kiriting"
                value={updateCategory.password}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    password: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ilmiy darajasi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ilmiy darajasiga kiriting"
                value={updateCategory.science_degree}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    science_degree: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>tug'ilgan kun</Form.Label>
              <Form.Control
                type="date"
                placeholder="tug'ilgan kunni kiriting"
                value={updateCategory.birthday}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    birthday: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>kasbi</Form.Label>
              <Form.Control
                type="text"
                placeholder="kasbni kiriting"
                value={updateCategory.job}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    job: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ish joyi</Form.Label>
              <Form.Control
                type="text"
                placeholder="ish joyini kiriting"
                value={updateCategory.place_position}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    place_position: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <div className="footer-modal -mr-16">
          <button
            onClick={handleUpdateCategoryClose}
            className="delete-btn close-btn"
          >
            Yopish
          </button>
          <button
            className="edit-btn save-btn"
            onClick={() => handleUpdateSubmit(updateId)}
            type="submit"
          >
            Tahrirlash
          </button>
        </div>
      </Modal>
    </>
  );
};
export default Author;
