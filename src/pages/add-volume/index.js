import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Modal, Button, message, Upload, Input } from "antd";
import Aside from "../../components/aside";
import "./add-volume.css";
import api_url from "../../api";
import { TiPlus } from "react-icons/ti";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { GrUpdate } from "react-icons/gr";

const AddVolume = () => {
  const [data, setData] = useState(null);
  const [volume, setVolume] = useState(null);
  const [image, setImage] = useState(null);
  const [changer, setChanger] = useState(true);
  const [volumeShow, setVolumeShow] = useState(false);
  const [file, setFile] = useState(null);
  const [EditVolumeShow, setEditVolumeShow] = useState(false);

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
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [changer]);

  const handleVolumeClose = () => {
    setVolumeShow(false);
  };

  const handleVolumeShow = () => {
    setVolumeShow(true);
  };

  const handleUploadImage = async (file, setImg) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`${api_url}/file/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });

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

  const onSubmitBtn = async (values, { resetForm }) => {
    const completeData = {
      ...values,
      image_id: image,
      source_id: file,
    };

    try {
      const response = await axios.post(
        `${api_url}/volume/create`,
        completeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("accessToken"),
          },
        },
      );

      if (response.status === 200) {
        message.success("Nashr muvaffaqiyatli qo'shildi");
        resetForm();
        setVolumeShow(false);
        setData(null);
        setImage(null);
        setFile(null);
        setChanger((prev) => !prev);
      } else {
        throw new Error("Failed to submit volume");
      }
    } catch (error) {
      message.info("Barcha maydonlarni to'liq to'ldiring!");
    }
  };
  console.log(image);

  const handleCategoryDelete = async (event, id) => {
    event.preventDefault();
    try {
      const response = await axios.delete(`${api_url}/volume/delete/${id}`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });

      if (response.status === 200) {
        setChanger((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitUpdate = async (values, { resetForm }) => {
    const completeData = {
      ...values,
      image_id: image,
      source_id: file,
    };

    try {
      const response = await axios.post(
        `${api_url}/volume/${data.id}`,
        completeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("accessToken"),
          },
        },
      );
      console.log(response);
      if (response.status === 200) {
        message.success("Nashr muvaffaqiyatli yangilandi");
        resetForm();
        setEditVolumeShow(false);
        setData(null);
        setImage(null);
        setFile(null);
        setChanger((prev) => !prev);
      } else {
        throw new Error("Failed to update volume");
      }
    } catch (error) {
      console.log(error);
      message.error("Nash yangilashda qandaydir xatolik yuz berdi!");
    }
  };

  const editHandler = (value) => {
    setData(value);
    setEditVolumeShow(true);
    setImage(value.image_id);
    setFile(value.source_id);
  };

  const editClose = () => {
    setData(null);
    setEditVolumeShow(false);
    setImage(null);
    setImage(null);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Sarlavhani kiritish shart!"),
    text: Yup.string().required("Matnni kiritish shart!"),
    description: Yup.string().required("Tavsifni kiritish shart!"),
  });

  return (
    <div className="home volume">
      <div className="asid">
        <Aside />
      </div>
      <div className="articles-page">
        <div className="filter d-flex">
          <form className="search-card d-flex">
            <label htmlFor="">
              <input placeholder="Search" className="search" type="text" />
            </label>
            <button className="search-btn edit-btn">Search</button>
          </form>
          <div className="add-article">
            <Button
              icon={<TiPlus className="ml-2" />}
              iconPosition="end"
              className="add-btn py-6 px-6 department-add__btn edit-btn"
              onClick={handleVolumeShow}
            >
              Nashr qo'shish
            </Button>
          </div>
        </div>
        <Col className="pr-[75px]">
          <div>
            <div>
              <table className="table-wrapper">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Rasm</th>
                    <th>Nashr</th>
                    <th className="text-center">Tahrirlash</th>
                    <th className="text-center">O'chirish</th>
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
                            src={`${api_url}${item?.image?.file_path}`}
                            alt=""
                          />
                        </td>
                        <td>{item.title}</td>
                        <td>
                          <GrUpdate
                            onClick={() => editHandler(item)}
                            className="m-auto block"
                          />
                        </td>
                        <td>
                          <svg
                            width={"24px"}
                            height={"24px"}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="rgba(236,26,26,1)"
                            className="m-auto cursor-pointer"
                            onClick={(event) =>
                              handleCategoryDelete(event, item.id)
                            }
                          >
                            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" />
                          </svg>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </div>
      <Modal
        title="Nashr qo'shish"
        visible={volumeShow}
        onCancel={handleVolumeClose}
        footer={null}
      >
        <Formik
          initialValues={{ title: "", text: "", description: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmitBtn}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Sarlavha</label>
                <Field name="title" as={Input} />
                {errors.title && touched.title ? (
                  <div className="error text-red-600">{errors.title}</div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="text">Matn</label>
                <Field name="text" as={Input} />
                {errors.text && touched.text ? (
                  <div className="error text-red-600">{errors.text}</div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="description">Tavsif</label>
                <Field name="description" as={Input} />
                {errors.description && touched.description ? (
                  <div className="error text-red-600">{errors.description}</div>
                ) : null}
              </div>
              <div className="form-group flex flex-col">
                <label>Sarlavha rasmi</label>
                <Upload
                  beforeUpload={(file) => {
                    handleUploadImage(file, setImage);
                    return false;
                  }}
                  fileList={
                    image
                      ? [
                          {
                            uid: "-1",
                            name: "uploaded_image.png",
                            status: "done",
                            url: "",
                          },
                        ]
                      : []
                  }
                  onRemove={() => {
                    setImage(null);
                    setFieldValue("image", null);
                  }}
                  accept="image/*"
                >
                  <Button className="w-[473px]">Fayl yuklash</Button>
                </Upload>
              </div>
              <div className="form-group flex flex-col">
                <label>Nashr uchun file yuklang</label>
                <Upload
                  beforeUpload={(file) => {
                    handleUploadImage(file, setFile);
                    return false;
                  }}
                  fileList={
                    file
                      ? [
                          {
                            uid: "-1",
                            name: "uploaded_file.pdf",
                            status: "done",
                            url: "",
                          },
                        ]
                      : []
                  }
                  onRemove={() => {
                    setFile(null);
                    setFieldValue("file", null);
                  }}
                  accept="application/pdf"
                >
                  <Button className="w-[473px]">Fayl yuklash</Button>
                </Upload>
              </div>
              <div className="form-group mt-4">
                <Button type="primary" htmlType="submit" className="w-full">
                  Yaratish
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      <Modal
        title="Nashrni yangilash"
        visible={EditVolumeShow}
        onCancel={editClose}
        footer={null}
      >
        <Formik
          initialValues={{
            title: data?.title || "",
            text: data?.text || "",
            description: data?.description || "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmitUpdate}
          enableReinitialize={true}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Sarlavha</label>
                <Field name="title" as={Input} />
                {errors.title && touched.title ? (
                  <div className="error">{errors.title}</div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="text">Matn</label>
                <Field name="text" as={Input} />
                {errors.text && touched.text ? (
                  <div className="error">{errors.text}</div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="description">Tavsif</label>
                <Field name="description" as={Input} />
                {errors.description && touched.description ? (
                  <div className="error">{errors.description}</div>
                ) : null}
              </div>
              <div className="form-group flex flex-col">
                <label>Sarlavha rasmi</label>
                <Upload
                  beforeUpload={(file) => {
                    handleUploadImage(file, setImage);
                    return false;
                  }}
                  value={data.image_id.source_id ? data.source_id : null}
                  fileList={
                    image
                      ? [
                          {
                            uid: "-1",
                            name: "uploaded_image.png",
                            status: "done",
                            url: "",
                          },
                        ]
                      : []
                  }
                  onRemove={() => {
                    setImage(null);
                    setFieldValue("image", null);
                  }}
                  accept="image/*"
                >
                  <Button className="w-[473px]">Fayl yuklash</Button>
                </Upload>
              </div>
              <div className="form-group flex flex-col">
                <label>Nashr uchun file yuklang</label>
                <Upload
                  beforeUpload={(file) => {
                    handleUploadImage(file, setFile);
                    return false;
                  }}
                  value={data.image_id ? data.image_id : null}
                  fileList={
                    file
                      ? [
                          {
                            uid: "-1",
                            name: "uploaded_file.pdf",
                            status: "done",
                            url: "",
                          },
                        ]
                      : []
                  }
                  onRemove={() => {
                    setFile(null);
                    setFieldValue("file", null);
                  }}
                  accept="application/pdf"
                >
                  <Button className="w-[473px]">Fayl yuklash</Button>
                </Upload>
              </div>
              <div className="form-group mt-4">
                <Button type="primary" htmlType="submit" className="w-full">
                  Tahrirlash
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default AddVolume;
