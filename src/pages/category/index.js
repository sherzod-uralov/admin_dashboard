/** @format */

import { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import Aside from "../../components/aside";
import { useNavigate } from "react-router-dom";
import { Button, message, Modal as ModalDelete } from "antd";
import axios from "axios";
import { GrUpdate } from "react-icons/gr";
import { TiPlus } from "react-icons/ti";
import "./department.css";


const initialState = {
  title: "",
  file_id: "",
}

const Category = () => {
  const [data, setData] = useState(null);
  const [changer, setChanger] = useState(true);
  const [img, setImg] = useState(null);
  const title = useRef("");
  const image = useRef("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryShow, setCategoryShow] = useState(false);
  const [categoryUpdateShow, setCategoryUpdateShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateCategory, setUpdateCategory] = useState({
    title: "",
    file_id: "",
  });


  const [isCompleted,setCompleted] = useState(false)
  const navigate = useNavigate();

  const [updateId, setUpdateId] = useState(null);


  useEffect(() => {
    setCompleted(updateCategory.file_id.trim() !== "")
  }, []);

  const handleCategoryDelete = async (id) => {
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/category/delete/${id}`,
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      if (response.status === 200) {
        setChanger((prev) => !prev);
        message.success("Yo‘nalish muvaffaqiyatli o‘chirildi!");
      } else {
        message.error("Server xatosi, qaytdan urinib ko‘ring");
      }
    } catch (err) {
      if (err.response.status === 500) {
        message.warning("Yo‘nalishga tegishli sohalarni o‘chirish kerak!", 5);
      }
    }
  };
  // Image
  const handleUploadImage = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/file/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        const imageId = data.link.id;
        setImg(imageId);
        message.success("Muvaffaqiyatli yuklandi");
      } else {
        message.error("Xatolik yuz berdi!");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      message.error("Xatolik yuz berdi!");
    }
  };

  const showModal = (itemId) => {
    setSelectedId(itemId);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (selectedId) {
      handleCategoryDelete(selectedId);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdateImage = async (event) => {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      try {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/file/upload`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: localStorage.getItem("accessToken"),
              },
            }
        );

        if (response.status === 200) {
          const data = await response.json();
          const imageId = data.link.id;
          setUpdateCategory((prevState) => ({ ...prevState, file_id: imageId }));
          message.success("Muvaffaqiyatli yuklandi");
        } else {
          message.error("Xatolik yuz berdi!");
        }
      } catch (err) {
        console.error("Error uploading file:", err);
        message.error("Xatolik yuz berdi!");
      }
  };

  const filteredData = data
    ? data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCategoryAdd = async (event) => {
    event.preventDefault();
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({ name: title.current.value, file_id: img }),
    };

    await fetch(`${process.env.REACT_APP_API_URL}/category/create`, request)
      .then((res) => {
        if (res.status === 200) {
          setChanger(!changer);
          handleCategoryClose();
        }
      })
      .catch((err) => console.log(err));
  };

  console.log(isCompleted)
  const handleCategoryUpdate = async (e, id) => {
    e.preventDefault();

    let requestBody = {
      name: updateCategory.title,
    };

    if (updateCategory.file_id.trim() !== "") {
      requestBody.file_id = updateCategory.file_id;
    }

    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(requestBody),
    };

    await fetch(
      `${process.env.REACT_APP_API_URL}/category/update/${id.id}`,
      request
    )
      .then((res) => {
        if (res.status === 200) {
          setChanger(!changer);
          handleCategoryUpdateClose();
        }
      })
      .catch((err) => console.log(err));
  };
  // Delete

  // Get
  useEffect(() => {
    (async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      await fetch(
        `${process.env.REACT_APP_API_URL}/category`,
        requestOptions
      ).then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setData(data);
        }
      });
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changer]);
  // Edit Modal

  const handleCategoryClose = () => {
    setCategoryShow(false);
  };

  const handleCategoryUpdateClose = () => {
    setCategoryUpdateShow(false);
  };

  const handleCategoryUpdateShow = (item) => {
    setUpdateCategory((prevState) => ({
      ...prevState,
      title: item.name,
    }));
    setUpdateId(item);
    setCategoryUpdateShow(true);
  };

  const handleCategoryShow = () => {
    setCategoryShow(true);
  };

  return (
    <div className='home department'>
      <ModalDelete
        title='Ogohlantirish!'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Shu yo‘nalishga tegishli barcha sohalar ham o‘chib ketadi!</p>
      </ModalDelete>
      <div className='asid'>
        <Aside />
      </div>
      <div className='articles-page'>
        <div className='filter d-flex'>
          <form className='search-card d-flex'>
            <label htmlFor=''>
              <input
                placeholder='Qidiruv'
                value={searchTerm}
                className='search'
                type='text'
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <Button
              size='large'
              onClick={() => setSearchTerm("")}
              className='search-btn edit-btn'
            >
              Tozalash
            </Button>
          </form>
          <div className='add-article'>
            <button
              className='add-btn department-add__btn edit-btn flex justify-center items-center'
              onClick={handleCategoryShow}
            >
              Yo‘nalish yaratish
              <TiPlus className='ml-2' />
            </button>
          </div>
        </div>
        <Col style={{ maxWidth: "calc(100vw - 380px)" }}>
          <div>
            <div>
              <table className='table-wrapper' responsive='lg'>
                <thead>
                  <tr>
                    <th className='text-center'>№</th>
                    <th>Rasm</th>
                    <th>Yo‘nalish nomi</th>
                    <th className='text-center'>Tahrirlash</th>
                    <th className='text-center'>O‘chirish</th>
                  </tr>
                </thead>
                <tbody className='articles-table__body'>
                  {filteredData &&
                    filteredData.map((item, index) => (
                      <tr key={item.id} className='cursor-pointer'>
                        <td
                          className='text-center'
                          onClick={() =>
                            navigate(`/category/subarticle/${item.id}`)
                          }
                        >
                          {index + 1}
                        </td>
                        <td
                          onClick={() =>
                            navigate(`/category/subarticle/${item.id}`)
                          }
                        >
                          {item.file ? (
                            <img
                              style={{ width: "50px", height: "50px" }}
                              src={`${process.env.REACT_APP_API_URL}${item.file.file_path}`}
                            />
                          ) : (
                            <div style={{ width: "50px", textAlign: "center" }}>
                              -
                            </div>
                          )}
                        </td>
                        <td
                          onClick={() =>
                            navigate(`/category/subarticle/${item.id}`)
                          }
                        >
                          {item.name}
                        </td>
                        <td className='text-center'>
                          <GrUpdate
                            onClick={() => handleCategoryUpdateShow(item)}
                            className='m-auto block'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width={"24px"}
                              height={"24px"}
                              viewBox='0 0 448 512'
                              fill='rgb(42, 119, 51)'
                            >
                              <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                            </svg>
                          </GrUpdate>
                        </td>
                        <td className='text-center'>
                          <button onClick={() => showModal(item.id)}>
                            <svg
                              width={"24px"}
                              height={"24px"}
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              fill='rgba(236,26,26,1)'
                            >
                              <path d='M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z' />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </div>

      <Modal show={categoryShow} onHide={handleCategoryClose}>
        <Modal.Header closeButton>
          <h2 className='modal-title'>Yo‘nalish yaratish</h2>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCategoryAdd}>
            <Form.Group controlId='exampleForm.ControlInput2' className='mb-5'>
              <Form.Label>Yo‘nalish nomi</Form.Label>
              <Form.Control ref={title} required type='text' />
            </Form.Group>
            <Form.Group controlId='formFileLg' className='mb-3'>
              <Form.Label>Yo‘nalish muqovasi uchun rasm yuklash</Form.Label>
              <Form.Control
                ref={image}
                onChange={(e) => handleUploadImage(e)}
                accept='image/jpg,image/jpeg,image/png'
                required
                type='file'
                size='md'
              />
            </Form.Group>
            <Button
              type='primary'
              size='large'
              className='m-auto w-full mt-5'
              htmlType='submit'
            >
              Yaratish
            </Button>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={categoryUpdateShow} onHide={handleCategoryUpdateClose}>
        <Modal.Header closeButton>
          <h2 className='modal-title'>Yo‘nalishni tahrirlash</h2>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => handleCategoryUpdate(e, updateId)}>
            <Form.Group controlId='exampleForm.ControlInput2' className='mb-5'>
              <Form.Label>Yo‘nalish nomi</Form.Label>
              <Form.Control
                value={updateCategory.title}
                onChange={(e) =>
                  setUpdateCategory((prevState) => ({
                    ...prevState,
                    title: e.target.value,
                  }))
                }
                required
                type='text'
              />
            </Form.Group>

            <Form.Group controlId='formFileLg' className='mb-3'>
              <Form.Label>Yo‘nalish muqovasi uchun rasm yuklash</Form.Label>
              <Form.Control
                onChange={(e) => handleUpdateImage(e)}
                accept='image/jpg,image/jpeg,image/png'
                aria-label='file example'
                type='file'
                size='md'
              />
            </Form.Group>
            <Button
              type='primary'
              size='large'
              className='m-auto w-full mt-5'
              htmlType='submit'
            >
              Tahrirlash
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default Category;
