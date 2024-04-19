import { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import Aside from "../../components/aside";
import "./sub-category.css";
import { Link } from "react-router-dom";

const SubCategory = () => {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState(null);
  const [changer, setChanger] = useState(true);

  const title = useRef("");
  const category = useRef("");

  // Get Category
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
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        name: title.current.value,
        categoryId: category.current.value,
      }),
    };

    await fetch(`${process.env.REACT_APP_API_URL}/subcategory/create`, request)
      .then((res) => {
        if (res.status === 201) {
          console.log(res.status);
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
      method: "POST",
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
                            src={`${process.env.REACT_APP_API_URL}/${item.image}`}
                            alt=""
                          />
                        </td>
                        <td>
                          <Link>{item.name}</Link>
                        </td>
                        <td className="delete-wrapper">
                          <button
                            className="category-btn delete-btn"
                            onClick={(event) =>
                              handleCategoryDelete(event, item.id)
                            }
                          >
                      <svg
                              width={"24px"}
                              height={"24px"}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="rgba(236,26,26,1)"
                              >
                                <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" />
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
                <Form.Control ref={title} required type="text" />
              </Form.Group>

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
export default SubCategory;
