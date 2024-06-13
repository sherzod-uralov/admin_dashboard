import { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import Aside from "../../components/aside";
import { toast } from "react-toastify";
import "./department.css";
import { Link } from "react-router-dom";
import api_url from "../../api";
import {Button, message} from "antd";
import axios from "axios";
import {GrUpdate} from "react-icons/gr";
import { TiPlus } from "react-icons/ti";
import { BsPencilFill } from "react-icons/bs";
const Category = () => {
  const [data, setData] = useState(null);
  const [changer, setChanger] = useState(true);
  const [img, setImg] = useState(null);
  const title = useRef("");
  const image = useRef("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Image
  const handleImageCertificate = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const response = await fetch(
        `${api_url}/file/upload`,
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
        const imageId = data.link.id; // Get the FullName from the response
        setImg(imageId);
        message.success("Muvaffaqiyatli yuklandi");
        // Use the fileId as needed (e.g., store it in state or send it to the server)
      } else {
        message.error("Xatolik yuz berdi!");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      message.error("Xatolik yuz berdi!");
    }
  };

  const filteredData = data ? data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];


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
  // Delete
  const handleCategoryDelete = async (event, id) => {
    event.preventDefault();
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/category/delete/${id}`,
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        }
      });
      if (response.status === 200) {
        setChanger(prev => !prev);
        message.success('Category deleted successfully');
      } else {
        message.error('Failed to delete category');
      }
    } catch (err) {
      if(err.response.status === 500){
      message.warning("Bu yo'nalishga tegishli yo'nalish sohalarini o'chirmaganingizcha ushbu yo'nalishni o'chira olmaysiz!",5);
      }
    }
  };


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

  console.log(data)


  return (
    <div className="home department">
      <div className="asid">
        <Aside />
      </div>
      <div className="articles-wrapper">
        <div className="filter d-flex">
          <form className="search-card d-flex">
            <label htmlFor="">
              <input placeholder="Qidirish..." value={searchTerm} className="search" type="text"
                     onChange={e => setSearchTerm(e.target.value)}/>
            </label>
            <Button size="large" onClick={() => setSearchTerm("")} className="search-btn edit-btn">Qidiruv</Button>
          </form>
          <div className="add-article">
            <button
                className="add-btn department-add__btn edit-btn flex justify-center items-center"
                onClick={handleCategoryShow}
            >
              Yo'nalish
              <TiPlus className="ml-2 "/>
            </button>
          </div>
        </div>
        <Col lg={11}>
          <div>
            <div>
              <table className="table-wrapper" responsive="lg">
                <thead>
                <tr>
                  <th>№</th>
                  <th>SUR'AT</th>
                  <th>ISM</th>
                  <th>YANGILASH</th>
                  <th className="delete-title">O'CHIRISH</th>
                </tr>
                </thead>
                <tbody className="articles-table__body">
                  {filteredData &&
                      filteredData.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                  style={{width: "50px", height: "50px"}}
                                  src={`${api_url}${item?.file?.file_path}`}
                                  alt=""/>
                            </td>
                            <td><Link to={`subarticle/${item.id}`}>{item.name}</Link></td>
                            <td className="cursor-pointer">
                              <BsPencilFill className="text-indigo-600" />
                            </td>
                            <td className="delete-wrapper">
                              <button
                                  className="category-btn delete-btn"
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
          <h2 className="modal-title">Add Category</h2>
        </Modal.Header>
        <Modal.Body>
          <form className="add-category">
            {/* Title */}
            <div className="title-wrapper">
              <h3 className="first-component">Name</h3>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Title</Form.Label>
                <Form.Control ref={title} required type="text"/>
              </Form.Group>
            </div>

            <div className="category-file__upload">
              <h3 className="file-upload__component">File Upload</h3>
              <Form.Group controlId="formFileLg" className="mb-3">
                <Form.Label>Download Image</Form.Label>
                <Form.Control
                  ref={image}
                  onChange={(e) => handleImageCertificate(e)}
                  accept="image/jpg,image/jpeg,image/png"
                  required
                  aria-label="file example"
                  type="file"
                  size="md"
                />
              </Form.Group>
            </div>
          </form>
        </Modal.Body>
        <div className="footer-modal">
          <button className="delete-btn close-btn" onClick={handleCategoryClose}>
            Close
          </button>
          <button
            className="edit-btn save-btn"
            onClick={handleCategoryAdd}
            type="submit"
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
};
export default Category;
