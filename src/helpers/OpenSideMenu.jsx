// SideUpdateMenu.js
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Drawer,
  Input,
  Button,
  message,
  Space,
  Tag,
  Select,
  Upload,
  theme,
} from "antd";
import axios from "axios";
import api_url from "../api";
import { ErrorMessage, Field,Form, Formik } from "formik";
import { TweenOneGroup } from "rc-tween-one";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { MyState } from "../state/Context.store";
import * as Yup from "yup";

const scrollToFirstError = (errors) => {
  for (const errorField in errors) {
    const errorElement = document.getElementById(errorField);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        errorElement.focus();
      }, 600);
      break;
    }
  }
};

const SideUpdateMenu = ({ id, visible, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { open, setOpen, setAdd,setUpdate } = useContext(MyState);
  const [categoies, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [author, setAuthor] = useState([]);
  const [adminData, setAdminData] = useState({});
  const { token } = theme.useToken();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const getData = async (url, set) => {
    try {
      const response = await axios.get(`${api_url}${url}`,{
          headers:{
              Authorization:localStorage.getItem("accessToken"),
          }
      });
      set(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (formData.keyword) {
      setTags(formData.keyword.split(","));
    }
  }, [formData.keyword]);

  useEffect(() => {
    if (id && visible) {
      setLoading(true);
      axios
        .get(`${api_url}/article/${id}`, {
          headers: { Authorization: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          const { data } = response;
          setFormData({
            title: data.title,
            abstract: data.abstract,
            description: data.description,
            keyword: data.keyword,
            doi: data.doi,
            categoryId: data.categoryId,
            SubCategoryId: data.SubCategoryId,
            author_id: data.author_id,
            image_id: data.image_id,
            source_id: data.source_id,
          });
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          message.error("Failed to fetch article details");
          setLoading(false);
        });
    }
  }, [id, visible]);


  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = (setField) => {
      console.log(tags)
    if (inputValue && tags.indexOf(inputValue) === -1) {
        const newTags = [...tags, inputValue];
        setTags(newTags);
        setField('keyword', newTags.join(','));
    }
    setInputVisible(false);
    setInputValue("");
  };


  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  const getDataAuthor = async () => {
    try {
      const response = await axios.get(`${api_url}/author/list`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      setAuthor(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${api_url}/article/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("accessToken"),
          },
        },
      );
      if (response.status === 200) {
        message.success("Article updated successfully");
        onUpdate();
        onClose();
      } else {
        message.error("Failed to update the article");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error updating the article:", error);
      message.error("Failed to update the article due to an error");
      setLoading(false);
    }
  };

  const initialValues = {
    title: "",
    abstract: "",
    description: "",
    keyword: tags.join(","),
    doi: "",
    image_id: "",
    source_id: "",
  };

  const UploadProps = (field) => {
    const props = {
      name: "file",
      action: "https://journal2.nordicun.uz/file/upload",
      headers: {
        authorization: localStorage.getItem("accessToken"),
      },
      onChange(info) {
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
          console.log(info.file.response);
          field("image_id", info.file.response.link.id);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return props;
  };

  const UploadPropsPdf = (field) => {
    const props = {
      name: "file",
      action: "https://journal2.nordicun.uz/file/upload",
      headers: {
        authorization: localStorage.getItem("accessToken"),
      },
      onChange(info) {
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
          console.log(info.file.response);
          field("source_id", info.file.response.link.id);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return props;
  };

  const valueAndLabel = (arr, value, label) => {
    const newArray = [];
    arr?.forEach((e) => {
      newArray.push({ value: e[value], label: e[label] });
    });

    return newArray;
  };

  useEffect(() => {
    getData("/category", setCategories);
    getData("/subcategory", setSubCategories);
    getData("/admin/profile", setAdminData);
    getDataAuthor();
  }, []);
  return (
    <Drawer
      title="Update Article"
      width={700}
      onClose={onClose}
      visible={visible}
    >
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize={true}
        initialValues={formData}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          console.log(values);
          try {
            const res = await axios.post(
              `${api_url}/article/update/${id}`,
              {
                ...values,
              },
              {
                headers: {
                  Authorization: localStorage.getItem("accessToken"),
                },
              },
            );
              console.log(res)
            message.success("Maqola muvafaqiyatli yangilandi!");
            onClose();
            resetForm();
            setAdd(true);
            setUpdate(true)
          } catch (e) {
            if (e.response?.status === 409) {
              message.error("bu malumot allaqachon qoshilgan");
            }
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, isSubmitting, values }) => (
          <Form layout="vertical" className="px-4 m-auto max-w-full">
            <Space className="flex justify-end top-4 right-14 absolute">
              <button
                className="bg-blue-500 text-white py-1.5 px-5 rounded-md"
                type="submit"
              >
                Yaratish
              </button>
            </Space>
            <div className="space-y-12 mt-5 mb-3">
              <div className="col-span-full">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Sarlavfha matni
                  <strong className="text-md text-red-800">*</strong>
                </label>
                <div className="mt-2">
                  <Field
                    type="text"
                    name="title"
                    id="title"
                    autoComplete="title"
                    className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    className="text-red-700 text-[13px]"
                    name="title"
                    component="div"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="abstract"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  abstract
                  <strong className="text-md text-red-800">*</strong>
                </label>
                <div className="mt-2">
                  <Field
                    type="text"
                    name="abstract"
                    id="abstract"
                    autoComplete="abstract"
                    className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    className="text-red-700 text-[13px]"
                    name="abstract"
                    component="div"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="keyword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Kalit so'z
                  <strong className="text-md text-red-800">*</strong>
                </label>
                <div
                  className="w-full"
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <TweenOneGroup
                    appear={false}
                    enter={{
                      scale: 0.8,
                      opacity: 0,
                      type: "from",
                      duration: 100,
                    }}
                    leave={{
                      opacity: 0,
                      width: 0,
                      scale: 0,
                      duration: 200,
                    }}
                    onEnd={(e) => {
                      if (e.type === "appear" || e.type === "enter") {
                        e.target.style = "display: inline-block";
                      }
                    }}
                  >
                    {tags.map((tag) => (
                      <span key={tag} style={{ display: "inline-block" }}>
                        <Tag
                          closable
                          onClose={(e) => {
                            e.preventDefault();
                            const newTags = tags.filter((t) => t !== tag);
                            setFieldValue("keyword", newTags.join(","));
                            setTags(newTags);
                          }}
                        >
                          {tag}
                        </Tag>
                      </span>
                    ))}
                  </TweenOneGroup>
                </div>
                {inputVisible ? (
                  <Input
                    ref={inputRef}
                    type="text"
                    size="large"
                    rootClassName="py-2"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={() => handleInputConfirm(setFieldValue)}
                    onPressEnter={() => handleInputConfirm(setFieldValue)}
                  />
                ) : (
                  <Tag
                    className="w-full py-2"
                    onClick={showInput}
                    style={tagPlusStyle}
                  >
                    <PlusOutlined /> New Tag
                  </Tag>
                )}
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="doi"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Doini kiriting
                  <strong className="text-md text-red-800">*</strong>
                </label>
                <div className="mt-2">
                  <Field
                    type="text"
                    name="doi"
                    id="doi"
                    autoComplete="doi"
                    className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    className="text-red-700 text-[13px]"
                    name="doi"
                    component="div"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Yo'nalishlar
                  <strong className="text-md text-red-800">*</strong>
                </label>
                <div className="mt-2">
                  <Select
                    size="large"
                    className="w-full"
                    value={values.categoryId}
                    onChange={(e) => setFieldValue("categoryId", e)}
                    options={categoies.map((cat) => ({
                      label: cat.name,
                      value: cat.id,
                    }))}
                    placeholder="tanlang"
                  />
                  <ErrorMessage
                    className="text-red-700 text-[13px]"
                    name="category"
                    component="div"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="SubCategoryId"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  ichki Yo'nalishlar
                  <strong className="text-md text-red-800">*</strong>
                </label>
                <div className="mt-2">
                  <Select
                    size="large"
                    className="w-full"
                    value={values.SubCategoryId}
                    onChange={(e) => setFieldValue("SubCategoryId", e)}
                    options={valueAndLabel(subCategories, "id", "name")}
                    placeholder="tanlang"
                  />
                  <ErrorMessage
                    className="text-red-700 text-[13px]"
                    name="SubCategoryId"
                    component="div"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  rasm yuklash
                  <strong className="text-md text-red-800">*</strong>
                </label>
                <div className="mt-2">
                  <Upload {...UploadProps(setFieldValue)}>
                    <Button
                      size="large"
                      style={{ width: 605 }}
                      icon={<UploadOutlined />}
                    >
                      Click to Upload
                    </Button>
                  </Upload>
                  <ErrorMessage
                    className="text-red-700 text-[13px]"
                    name="image"
                    component="div"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  maqola uchun file yuklash
                  <strong className="text-md text-red-800">*</strong>
                </label>
                <div className="mt-2">
                  <Upload {...UploadPropsPdf(setFieldValue)}>
                    <Button
                      size="large"
                      style={{ width: 605 }}
                      icon={<UploadOutlined />}
                    >
                      Click to Upload
                    </Button>
                  </Upload>
                  <ErrorMessage
                    className="text-red-700 text-[13px]"
                    name="image"
                    component="div"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="author"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Muallifni tanlang
                  <strong className="text-md text-red-800">*</strong>
                </label>
                <div className="mt-2">
                  <Select
                    className="w-full"
                    size="large"
                    value={values.author_id}
                    onChange={(e) => setFieldValue("author_id", e)}
                    options={valueAndLabel(author, "id", "full_name")}
                    placeholder="tanlang"
                  />
                  <ErrorMessage
                    className="text-red-700 text-[13px]"
                    name="author"
                    component="div"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  tavfsif
                  <strong className="text-md text-red-800">*</strong>
                </label>
                <div className="mt-2">
                  <Input.TextArea
                      value={values.description}
                    onChange={(e) =>
                      setFieldValue("description", e.target.value)
                    }
                    rows={6}
                    placeholder="tavfsif yozing"
                  />
                  <ErrorMessage
                    className="text-red-700 text-[13px]"
                    name="description"
                    component="div"
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};

export default SideUpdateMenu;
