import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Aside from "../../components/aside";
import "./add-volume.css";
import api_url from "../../api";

const AddVolume = () => {
  const [data, setData] = useState(null);
  const [volume, setVolume] = useState(null);
  const [image, setImage] = useState(null);
  const [changer, setChanger] = useState(true);

  // UseRef
  const imageInputRef = useRef(null);
  const title = useRef("");
  const publicationdate = useRef("");
  const publicationnumber = useRef("");
  console.log(data)
  // GET Volumes
  useEffect(() => {
    axios
      .get(`${api_url}/volume`, {
        headers: { "Content-Type": "application/json"
        , Authorization:localStorage.getItem('accessToken')},
      })
      .then((response) => {
        setVolume(response.data);
        console.log(response)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data, changer]);

  const [volumeShow, setVolumeShow] = useState(false);
  const handleVolumeClose = () => {
    setVolumeShow(false);
  };

  const handleVolumeShow = () => {
    setVolumeShow(true);
  };

  // Image Upload
  const handleImageCertificate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/files/upload`,
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
        const imageId = data.link.fulnamefile; // Get the FullName from the response
        setImage(imageId);
        toast.success("Muvaffaqiyatli yuklandi 👌");
        // Use the fileId as needed (e.g., store it in state or send it to the server)
      } else {
        toast.error("Xatolik yuz berdi! 🤯");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Xatolik yuz berdi! 🤯");
    }
  };
  // POST Volume
  const handleArticleAdd = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      window.scrollTo(1000, 1000);
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        title: title.current.value,
        publicationnumber: publicationnumber.current.value,
        publicationdate: publicationdate.current.value,
        imageVolume: image,
      }),
    };

    await fetch(
      `${process.env.REACT_APP_API_URL}/volumes/create`,
      requestOptions
    )
      .then((response) => {
        if (response.status === 201) {
          setData(!data);
          setVolumeShow(false);
        }
      })
      .catch((err) => console.log(err));
  };

  // Delete
  const handleCategoryDelete = async (event, id) => {
    event.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL}/volumes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setChanger(!changer);
        }
      })
      .catch((err) => console.log(err));
  };

  const departmentStyle = {
    width: "100%",
    margin: "0px auto",
  };

  return (
    <div className="home volume">
      <div className="asid">
        <Aside />
      </div>
      <div className="articles-wrapper">
        <div className="filter d-flex">
          <form className="search-card d-flex">
            <label htmlFor="">
              <input placeholder="Search" className="search" type="text" />
            </label>
            <button className="search-btn  edit-btn">Search</button>
          </form>
          <div className="add-article">
            <button
              className="add-btn department-add__btn edit-btn"
              onClick={handleVolumeShow}
            >
              Article Add
            </button>
          </div>
        </div>
        <Col lg={11}>
          <div>
            <div>
              <table className="table-wrapper" responsive="lg">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Название</th>
                    <th>Выключать</th>
                    <th>DELETE</th>
                  </tr>
                </thead>
                <tbody className="articles-table__body">
                  {volume &&
                    volume.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            style={{ width: "50px", height: "50px" }}
                            src={`${api_url}${item.image.file_path}`}
                            alt=""
                          />
                        </td>
                        <td>{item.title}</td>
                        <td>
                          <button
                            className="category-btn btn btn-danger"
                            onClick={(event) =>
                              handleCategoryDelete(event, item._id)
                            }
                          >
                            Удалить
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
        show={volumeShow}
        onHide={handleVolumeClose}
      >
        <Modal.Header closeButton>
          <h2 className="modal-title">Add Category</h2>
        </Modal.Header>
        <Modal.Body>
          <form className="add-category volume-add">
            {/* Title */}
            <div className="title-wrapper volume-title__wrapper">
              <h3 className="first-component">Name</h3>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control ref={title} required type="text" />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Publication Date</Form.Label>
                <Form.Control
                  ref={publicationdate}
                  required
                  type="date"
                />
              </Form.Group>
            </div>

            <div className="category-file__upload volume-file__upload">
              <h3 className="file-upload__component">File Upload</h3>
              <Form.Group controlId="exampleForm.ControlInput3">
                <Form.Label>Download Image</Form.Label>
                <Form.Control
                  ref={imageInputRef}
                  onChange={(e) => handleImageCertificate(e)}
                  accept="image/jpg,image/jpeg,image/png"
                  required
                  aria-label="file example"
                  type="file"
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput4">
                <Form.Label>Publication Number</Form.Label>
                <Form.Control ref={publicationnumber} required type="number" />
              </Form.Group>
            </div>
          </form>
        </Modal.Body>
        <div className="footer-modal">
          <button className="delete-btn" onClick={handleVolumeClose}>
            Close
          </button>
          <button className="edit-btn" onClick={handleArticleAdd} type="submit">
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AddVolume;
