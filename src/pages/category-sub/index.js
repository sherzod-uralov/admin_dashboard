import { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import Aside from "../../components/aside";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./department-sub.css";

const CategorySub = () => {
  const [data, setData] = useState(null);
  const [changer, setChanger] = useState(true);
  const title = useRef("");
  const { id } = useParams();

  console.log(id);

  // Add Sub Category
  const handleCategoryAdd = async (event) => {
    event.preventDefault();
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        name: title.current.value,
        categoryId: id,
      }),
    };

    await fetch(`${process.env.REACT_APP_API_URL}/subcategory/create`, request)
      .then((res) => {
        if (res.status === 201) {
          setChanger(!changer);
          handleCategoryClose();
        }
      })
      .catch((err) => console.log(err));
  };

  // Delete
  const handleCategoryDelete = async (event, id) => {
    event.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL}/subcategory/delete/${id}`, {
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

  // GET
  useEffect(() => {
    (async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      await fetch(
        `${process.env.REACT_APP_API_URL}/subcategory/sub/${id}`,
        requestOptions
      ).then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          setData(data);
        }
      });
    })();
  }, [id]);

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

  return (
    <div className="home department">
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
              onClick={handleCategoryShow}
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
                    <th>IMAGE</th>
                    <th>NAME</th>
                    <th className="delete-title">DELETE</th>
                  </tr>
                </thead>
                <tbody className="articles-table__body">
                  {data &&
                    data.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            style={{ width: "50px", height: "50px" }}
                            src={`https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg`}
                            alt=""
                          />
                        </td>
                        <td>
                          <h2>{item.name}</h2>
                        </td>
                        <td className="delete-wrapper">
                          <button
                            className="category-btn delete-btn"
                            onClick={(event) =>
                              handleCategoryDelete(event, item.id)
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
      className="sub-modal"
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
          <form className="add-category add-sub">
            {/* Title */}
            <div className="title-wrapper">
              <h3 className="first-component">Ismi</h3>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Title</Form.Label>
                <Form.Control ref={title} required type="text" />
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
export default CategorySub;
