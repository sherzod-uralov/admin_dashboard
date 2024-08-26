import { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import Aside from "../../components/aside";
import "./sub-category.css";
import {Button, message, Modal as ModalDelete} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import api_url from "../../api";
import api from "../../api";
import {GrUpdate} from "react-icons/gr";
import {TiPlus} from "react-icons/ti";

const initialState = {
  title: "",
  categoryId: "",
}

const SubCategory = () => {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState(null);
  const [changer, setChanger] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const title = useRef();
  const category = useRef();
  const [isCompleted,setIsCompleted] = useState(false)
  const [selectedId, setSelectedId] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [categoryUpdateShow, setCategoryUpdateShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateCategory, setUpdateCategory] = useState({
    name: "",
  });


  const handleCategoryUpdate = async (e, id) => {
    e.preventDefault();
    console.log(id.categoryId)

    let requestBody = {
      name: updateCategory.name,
    };

    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(requestBody),
    };

    await fetch(
        `${process.env.REACT_APP_API_URL}/subcategory/update/${id.id}`,
        request
    )
        .then((res) => {
          if (res.status === 200) {
            setChanger(!changer);
            handleCategoryUpdateClose();
            message.success("Muvaffaqiyatli tahrirlandi!")
          }
        })
        .catch((err) => console.log(err));
    message.error("Tahrirlashda qadnaydir xatolik ketdi")
  };

  const handleCategoryUpdateClose = () => {
    setCategoryUpdateShow(false);
  };


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
          setCategories(data);
        }
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changer]);

  // Add Sub Category
  const handleCategoryAdd = async (event) => {
    event.preventDefault();
    const requestData = {
      name: title.current.value,
      categoryId: category.current.value,
    };

    try {
      const response = await axios.post(`${api_url}/subcategory/create`, requestData, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        }
      });

      console.log(response);
      if (response.status === 200) {
        console.log('Status:', response.status);
        setCategoryShow(false)
        setChanger(prev => !prev);  // Use a function to toggle for more reliable state updates
        handleCategoryClose();
        message.success("Yo'nalish sohasi muvaffaqiyatli qo'shildi!");
      }
    } catch (err) {
      message.info("hamma maydonlarni to'ldiring!");
    }
  };


  // Delete
  const handleCategoryDelete = async (id) => {
    try {
      const response = await  axios.delete(
          `${api_url}/subcategory/delete/${id}`,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("accessToken"),
            }
          }
      );

      if (response.status === 200) {
        setChanger(prev => !prev); // Holatni yangilash
        message.success('Subcategory deleted successfully');
      } else {
        message.error('Failed to delete subcategory');
      }
    } catch (err) {
      console.log(err)
      console.error('Error deleting the subcategory:', err);
      message.error('Failed to delete the subcategory due to an error');
    }
  };

  const filteredData = data ? data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  useEffect(() => {
    (async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      await fetch(
        `${process.env.REACT_APP_API_URL}/subcategory`,
        requestOptions
      ).then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setData(data);
        }
      });
    })();
    console.log(data);
  }, [changer]);


  const [categoryShow, setCategoryShow] = useState(false);
  const handleCategoryClose = () => {
    setCategoryShow(false);
  };

  const handleCategoryShow = () => {
    setCategoryShow(true);
  };
  const departmentStyle = {
    width: "100%",
    margin: "0px auto",
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

  const handleCategoryUpdateShow = (item) => {
    setUpdateCategory((prevState) => ({
      ...prevState,
      name: item.name,
    }));
    setUpdateId(item);
    setCategoryUpdateShow(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="home department">
      <ModalDelete
          title='Ogohlantirish!'
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
      >
        <p>Yo'nalish sohasi o'chirilgandan so'ng qayta tiklab bo'lmaydi!</p>
      </ModalDelete>
      <div className="asid">
        <Aside />
      </div>
      <div className="articles-page">
        <div className="filter d-flex">
          <form className="search-card d-flex">
            <label htmlFor="">
              <input placeholder="Qidiruv" value={searchTerm} className="search" type="text" onChange={e => setSearchTerm(e.target.value)} />
            </label>
            <Button size="large" onClick={() => setSearchTerm("")} className="search-btn edit-btn">Tozalash</Button>
          </form>
          <div className="add-article">
            <Button
                icon={<TiPlus className='ml-2' />}
                iconPosition="end"
              className="add-btn py-6 px-7 department-add__btn edit-btn"
              onClick={handleCategoryShow}
            >
              Qo'shish
            </Button>
          </div>
        </div>
        <Col style={{height:'calc(100vh - 140px)'}} className="overflow-x-hidden pr-[55px] overflow-auto">
          <div>
            <div>
              <table className="table-wrapper overflow-auto">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Nomi</th>
                  <th className="text-center">Taxrirlash</th>
                  <th className="delete-title">O'chirish</th>
                </tr>
                </thead>
                <tbody className="articles-table__body">
                  {filteredData &&
                      filteredData.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              <h2>{item.name}</h2>
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
                                  <path
                                      d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'/>
                                </svg>
                              </GrUpdate>
                            </td>
                            <td className="delete-wrapper">
                              <button
                                  className="category-btn delete-btn"
                                  onClick={(event) =>
                                      showModal(item.id)
                                  }
                              >
                                <svg
                                    width={"24px"}
                                    height={"24px"}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="rgba(236,26,26,1)"
                                >
                                  <path
                                      d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"/>
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
      {/* Bootstrap Modal */}
      <Modal
          aria-labelledby="example-modal-sizes-title-sm"
          style={departmentStyle}
          size="sm"
          show={categoryShow}
          onHide={handleCategoryClose}
      >
        <Modal.Header closeButton>
          <h2 className="modal-title">Yo'nalish sohasini qo'shish</h2>
        </Modal.Header>
        <Modal.Body>
          <form className="add-category">
            {/* Title */}
            <div className="title-wrapper">
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Sahifa</Form.Label>
                <Form.Control ref={title} required type="text"/>
              </Form.Group>
            </div>
            <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Yo'nalish</Form.Label>
                <Form.Select
                    required
                    ref={category}
                    aria-label="Default select example"
                >
                  <option>Category</option>
                  {categories &&
                      categories.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                      ))}
                </Form.Select>
              </Form.Group>
          </form>
        </Modal.Body>
        <div className="footer-modal -mr-20">
          <button className="delete-btn close-btn" onClick={handleCategoryClose}>
            Yopish
          </button>
          <button
            className="edit-btn save-btn"
            onClick={(e) => {
              setCategoryShow(false);
              handleCategoryAdd(e)
            }}
            type="submit"
          >
            qo'shish
          </button>
        </div>
      </Modal>
      <Modal show={categoryUpdateShow} onHide={handleCategoryUpdateClose}>
        <Modal.Header closeButton>
          <h2 className='modal-title'>Yo‘nalish sohasini tahrirlash</h2>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => handleCategoryUpdate(e, updateId)}>
            <Form.Group controlId='exampleForm.ControlInput2' className='mb-5'>
              <Form.Label>Yo‘nalish nomi</Form.Label>
              <Form.Control
                  value={updateCategory.name}
                  onChange={(e) =>
                      setUpdateCategory((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }))
                  }
                  required
                  type='text'
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
export default SubCategory;
