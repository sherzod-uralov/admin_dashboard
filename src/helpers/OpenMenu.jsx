/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  message,
  Input,
  Select,
  Space,
  Upload,
  Tag,
  theme,
} from "antd";
import { MyState } from "../state/Context.store";
import axios from "axios";
import api_url from "../api";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TweenOneGroup } from "rc-tween-one";

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

const OpenSide = () => {
  const { open, setOpen, setAdd } = useContext(MyState);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [author, setAuthor] = useState([]);
  const { token } = theme.useToken();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [volume, setVolume] = useState(null);
  const inputRef = useRef(null);
  const [disable, setDisable] = useState("");
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  const handleClose = (removedTag, setField) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = (setField) => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
      setField("keyword", newTags.join(","));
    }
    setInputVisible(false);
    setInputValue("");
  };
  const forMap = (tag) => (
    <span
      key={tag}
      style={{
        display: "inline-block",
      }}
    >
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    </span>
  );
  const tagChild = tags.map(forMap);
  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Sarlavha matni kiritilishi shart"),
    abstract: Yup.string().required("Abstrakt kiritilishi shart"),
    keyword: Yup.string().required("Kalit so‘z kiritilishi shart"),
    doi: Yup.string().required("DOI kiritilishi shart"),
    categoryId: Yup.string().required("Yo‘nalish tanlanishi shart"),
    subCategoryId: Yup.string().required("Y‘nalish sohasini tanlanishi shart"),
    author_id: Yup.string().required("Muallif tanlanishi shart"),
    description: Yup.string().required("Tavsif kiritilishi shart"),
    volume_id: Yup.string().required("Nashrni tanlanishi shart"),
  });

  const getData = async (url, set) => {
    try {
      const response = await axios.get(`${api_url}${url}`);
      set(response.data);
    } catch (e) {
      console.log(e);
    }
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

  const valueAndLabel = (arr, value, label) => {
    const newArray = [];
    arr?.forEach((e) => {
      newArray.push({ value: e[value], label: e[label] });
    });

    return newArray;
  };

  const UploadProps = (field) => {
    const props = {
      name: "file",
      action: "https://journal2.nordicun.uz/file/upload",
      headers: {
        authorization: localStorage.getItem("accessToken"), // Adjust this as needed
      },
      onChange(info) {
        if (info.file.status === "done") {
          message.success(`${info.file.name} muvaffaqiyatli yuklandi!`);
          field("image_id", info.file.response.link.id); // Assuming the response contains an 'id' field
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} yuklashda xatolik!`);
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
          message.success(`${info.file.name} muvaffaqiyatli yuklandi!`);
          field("source_id", info.file.response.link.id);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} yuklashda xatolik!`);
        }
      },
    };

    return props;
  };

  useEffect(() => {
    getData("/category", setCategories);
    getDataAuthor();
    getData("/volume", setVolume);
  }, []);

  useEffect(() => {
    if (disable) {
      getData(`/subcategory/sub/${disable}`, setSubCategories);
    }
  }, [disable]);

  const initialValues = {
    title: "",
    abstract: "",
    description: "",
    keyword: tags.join(","),
    doi: "",
    categoryId: "",
    SubCategoryId: "",
    image_id: "",
    source_id: "",
    author_id: "",
    volume_id: "",
  };

  return (
    <>
      <Drawer
        title="Maqola yaratish"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={initialValues}
          validate={(values) => {
            const errors = {};
            for (const key in values) {
              if (key !== "doi" && !values[key]) {
                errors[key] = "Required";
              }
            }
            if (Object.keys(errors).length > 0) {
              scrollToFirstError(errors);
              message?.info("Barcha maydonlarni to‘ldiring!");
            } else {
              scrollToFirstError(errors);
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            console.log(values);
            setSubmitting(true);
            try {
              const res = await axios.post(
                `${api_url}/article/create`,
                {
                  ...values,
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("accessToken"),
                  },
                },
              );
              message.success("Maqola muvaffaqiyatli yartildi!");
              onClose();
              resetForm();
              setAdd(true);
            } catch (e) {
              if (e.response?.status === 409) {
                message.error("Bunday sarlavhali maqola allaqachon mavjud!");
              }
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form layout="vertical" className="m-auto max-w-full">
              <Space className="flex justify-end top-4 right-14 absolute">
                <button
                  className="bg-blue-500 text-white py-1.5 px-5 rounded-md"
                  type="submit"
                >
                  Yaratish
                </button>
              </Space>
              <div className="space-y-4">
                <div className="col-span-full">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Sarlavha
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
                    Abstrakt
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
                    Kalit so‘z
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
                      {tagChild}
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
                      <PlusOutlined /> Yangi kalit so‘z
                    </Tag>
                  )}
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="doi"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    DOI
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
                    Yo‘nalishlar
                    <strong className="text-md text-red-800">*</strong>
                  </label>
                  <div className="mt-2">
                    <Select
                      size="large"
                      className="w-full"
                      onChange={(e) => {
                        setDisable(e);
                        setFieldValue("categoryId", e);
                      }}
                      options={valueAndLabel(categories, "id", "name")}
                      placeholder="Tanlang"
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
                    Yo‘nalish sohalari
                    <strong className="text-md text-red-800">*</strong>
                  </label>
                  <div className="mt-2">
                    <Select
                      size="large"
                      className="w-full"
                      disabled={!disable}
                      onChange={(e) => setFieldValue("SubCategoryId", e)}
                      options={valueAndLabel(subCategories, "id", "name")}
                      placeholder="Tanlang"
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
                    Maqola muqovasi uchun rasm yuklang
                    <strong className="text-md text-red-800">*</strong>
                  </label>
                  <div className="mt-2">
                    <Upload {...UploadProps(setFieldValue)}>
                      <Button
                        size="large"
                        style={{ width: 640 }}
                        icon={<UploadOutlined />}
                      >
                        Yuklash uchun bosing
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
                    Maqola manbaasini yuklang
                    <strong className="text-md text-red-800">*</strong>
                  </label>
                  <div className="mt-2">
                    <Upload {...UploadPropsPdf(setFieldValue)}>
                      <Button
                        size="large"
                        style={{ width: 640 }}
                        icon={<UploadOutlined />}
                      >
                        Yuklash uchun bosing
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
                      onChange={(e) => setFieldValue("author_id", e)}
                      options={valueAndLabel(author, "id", "full_name")}
                      placeholder="Tanlang"
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
                    htmlFor="volume_id"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nashrni tanlang
                    <strong className="text-md text-red-800">*</strong>
                  </label>
                  <div className="mt-2">
                    <Select
                      className="w-full"
                      size="large"
                      onChange={(e) => setFieldValue("volume_id", e)}
                      options={valueAndLabel(volume, "id", "title")}
                      placeholder="Tanlang"
                    />
                    <ErrorMessage
                      className="text-red-700 text-[13px]"
                      name="volume_id"
                      component="div"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Tavsif
                    <strong className="text-md text-red-800">*</strong>
                  </label>
                  <div className="mt-2">
                    <Input.TextArea
                      onChange={(e) =>
                        setFieldValue("description", e.target.value)
                      }
                      rows={6}
                      placeholder="Tavsif yozing"
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
    </>
  );
};

export default OpenSide;
