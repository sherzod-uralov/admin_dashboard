import React, { useEffect, useRef, useState } from "react";
import {
  Drawer,
  Tabs,
  Space,
  Flex,
  Button,
  DatePicker,
  Tag,
  Input,
  theme,
  Upload,
  message,
} from "antd";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import "./SideMenuNews.css";
import moment from "moment";
import { TweenOneGroup } from "rc-tween-one";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateNews, getNewsById } from "./news.query";
import dayjs from "dayjs";
const { TabPane } = Tabs;

const UpdateNews = ({ open, setOpen, newsId }) => {
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const inputRef = useRef(null);
  const { token } = theme.useToken();
  const queryClient = useQueryClient();
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({});
  const { data: newsData, isLoading } = useQuery(
    ["news", newsId],
    () => getNewsById(newsId),
    {
      enabled: !!newsId,
    },
  );

  useEffect(() => {
    if (newsData) {
      const { data } = newsData;
      setTags(data.news_hashtags.split(","));
      setFormData({
        news_title_uz: data.news_title_uz || "",
        news_title_ru: data.news_title_ru || "",
        news_title_en: data.news_title_en || "",
        news_time: dayjs(data.news_time),
        news_hashtags: tags.join(",") || "",
        news_description_uz: data.news_description_uz || "",
        news_description_ru: data.news_description_ru || "",
        news_description_en: data.news_description_en || "",
        news_body_uz: data.news_body_uz || "",
        news_body_ru: data.news_body_ru || "",
        news_body_en: data.news_body_en || "",
        source_id: data.source_id || "",
      });
    }
  }, [newsData]);

  const mutation = useMutation(updateNews, {
    onSuccess: () => {
      setOpen(false);
      setLoader(false);
      queryClient.invalidateQueries("news");
      message?.success("Yangilik muvaffaqiyatli yangilandi");
    },
    onError: () => {
      setLoader(false);
      message?.error("Yangilikni yangilashda xatolik ketti!");
    },
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = (setField) => {
    console.log(tags);
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
      setField("news_hashtags", newTags.join(","));
    }
    setInputVisible(false);
    setInputValue("");
  };

  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  console.log(formData);
  const validationSchema = Yup.object().shape({
    news_title_uz: Yup.string().required("Bu maydon majburiy"),
    news_title_ru: Yup.string().required("Bu maydon majburiy"),
    news_title_en: Yup.string().required("Bu maydon majburiy"),
    news_time: Yup.string().required("Bu maydon majburiy"),
    news_description_uz: Yup.string().required("Bu maydon majburiy"),
    news_description_ru: Yup.string().required("Bu maydon majburiy"),
    news_description_en: Yup.string().required("Bu maydon majburiy"),
    news_body_uz: Yup.string().required("Bu maydon majburiy"),
    news_body_ru: Yup.string().required("Bu maydon majburiy"),
    news_body_en: Yup.string().required("Bu maydon majburiy"),
    source_id: Yup.mixed().required("rasm yuklash majburiy"),
  });

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
          field("source_id", info.file.response.link.id);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return props;
  };

  return (
    <>
      <Drawer
        title="Yangilikni tahrirlash"
        width={700}
        onClose={onClose}
        open={open}
      >
        <Formik
          initialValues={formData}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setLoader(true);
            mutation.mutate({ id: newsId, newsData: values });
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, validateForm, handleSubmit }) => (
            <Form layout="vertical" className="w-full">
              <Flex
                className="flex-col"
                style={{ height: "calc(100vh - 105px)" }}
                justify="space-between"
              >
                <Tabs
                  defaultActiveKey="1"
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  className="animated-tabs"
                >
                  <TabPane tab="Asosiy" key="1">
                    <Space direction="vertical" className="w-full">
                      <label
                        htmlFor="news_time"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Yangilik vaqti
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <DatePicker
                        value={formData.news_time}
                        className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(date, dateString) =>
                          setFieldValue("news_time", JSON.stringify(date))
                        }
                      />
                      <ErrorMessage
                        name="news_time"
                        className="text-red-500"
                        component="div"
                      />
                    </Space>
                    <Space direction="vertical" className="w-full">
                      <div className="pt-4">
                        <label
                          htmlFor="hashtags"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          yangilik hashtaglari
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
                              <span
                                key={tag}
                                style={{
                                  display: "inline-block",
                                  marginBottom: "5px",
                                }}
                              >
                                <Tag
                                  closable
                                  onClose={(e) => {
                                    e.preventDefault();
                                    const newTags = tags.filter(
                                      (t) => t !== tag,
                                    );
                                    setFieldValue(
                                      "news_hashtags",
                                      newTags.join(","),
                                    );
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
                            onPressEnter={() =>
                              handleInputConfirm(setFieldValue)
                            }
                          />
                        ) : (
                          <Tag
                            className="w-full py-2"
                            onClick={showInput}
                            style={tagPlusStyle}
                          >
                            <PlusOutlined /> Yangi hashtag
                          </Tag>
                        )}
                      </div>
                    </Space>
                    <Space direction="vertical" className="w-full pt-4">
                      <label
                        htmlFor="source_id"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Yangilik rasmi
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <Upload
                        {...UploadProps(setFieldValue)}
                        className="w-full"
                      >
                        <Button
                          size="large"
                          icon={<UploadOutlined />}
                          className={"w-[653px]"}
                        >
                          Yuklash uchun bosing
                        </Button>
                      </Upload>
                      <ErrorMessage
                        name="source_id"
                        className="text-red-500"
                        component="div"
                      />
                    </Space>
                  </TabPane>
                  <TabPane tab="O'zbekcha" key="2">
                    <Space direction="vertical" className="w-full">
                      <label
                        htmlFor="news_title_uz"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Yangilik sarlavhasi
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <Field
                        type="text"
                        name="news_title_uz"
                        id="news_title_uz"
                        autoComplete="off"
                        className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="news_title_uz"
                        className="text-red-500"
                        component="div"
                      />
                      <label
                        htmlFor="news_description_uz"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Yangilik ta'rifi
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <Field
                        type="text"
                        name="news_description_uz"
                        id="news_description_uz"
                        autoComplete="off"
                        className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="news_description_uz"
                        className="text-red-500"
                        component="div"
                      />
                      <label
                        htmlFor="news_body_uz"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Yangilik matni
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <Field
                        as="textarea"
                        name="news_body_uz"
                        id="news_body_uz"
                        autoComplete="off"
                        className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="news_body_uz"
                        className="text-red-500"
                        component="div"
                      />
                    </Space>
                  </TabPane>
                  <TabPane tab="Русский" key="3">
                    <Space direction="vertical" className="w-full">
                      <label
                        htmlFor="news_title_ru"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Заголовок новости
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <Field
                        type="text"
                        name="news_title_ru"
                        id="news_title_ru"
                        autoComplete="off"
                        className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="news_title_ru"
                        className="text-red-500"
                        component="div"
                      />
                      <label
                        htmlFor="news_description_ru"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Описание новости
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <Field
                        type="text"
                        name="news_description_ru"
                        id="news_description_ru"
                        autoComplete="off"
                        className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="news_description_ru"
                        className="text-red-500"
                        component="div"
                      />
                      <label
                        htmlFor="news_body_ru"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Текст новости
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <Field
                        as="textarea"
                        name="news_body_ru"
                        id="news_body_ru"
                        autoComplete="off"
                        className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="news_body_ru"
                        className="text-red-500"
                        component="div"
                      />
                    </Space>
                  </TabPane>
                  <TabPane tab="English" key="4">
                    <Space direction="vertical" className="w-full">
                      <label
                        htmlFor="news_title_en"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        News Title
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <Field
                        type="text"
                        name="news_title_en"
                        id="news_title_en"
                        autoComplete="off"
                        className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="news_title_en"
                        className="text-red-500"
                        component="div"
                      />
                      <label
                        htmlFor="news_description_en"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        News Description
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <Field
                        type="text"
                        name="news_description_en"
                        id="news_description_en"
                        autoComplete="off"
                        className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="news_description_en"
                        className="text-red-500"
                        component="div"
                      />
                      <label
                        htmlFor="news_body_en"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        News Body
                        <strong className="text-md text-red-800">*</strong>
                      </label>
                      <Field
                        as="textarea"
                        name="news_body_en"
                        id="news_body_en"
                        autoComplete="off"
                        className="block w-full pl-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        name="news_body_en"
                        className="text-red-500"
                        component="div"
                      />
                    </Space>
                  </TabPane>
                </Tabs>
                <Flex className="w-full">
                  <Button
                    loading={loader}
                    type="primary"
                    onClick={async (e) => {
                      e.preventDefault();
                      const errors = await validateForm();
                      if (Object.keys(errors).length > 0) {
                        if (
                          errors.news_title_uz ||
                          errors.news_description_uz ||
                          errors.news_body_uz
                        ) {
                          setActiveTab("2");
                          setTimeout(() => {
                            if (errors.news_title_uz) {
                              document
                                .getElementsByName("news_title_uz")[0]
                                .focus();
                            } else if (errors.news_description_uz) {
                              document
                                .getElementsByName("news_description_uz")[0]
                                .focus();
                            } else if (errors.news_body_uz) {
                              document
                                .getElementsByName("news_body_uz")[0]
                                .focus();
                            }
                          }, 100);
                        } else if (
                          errors.news_title_ru ||
                          errors.news_description_ru ||
                          errors.news_body_ru
                        ) {
                          setActiveTab("3");
                          setTimeout(() => {
                            if (errors.news_title_ru) {
                              document
                                ?.getElementsByName("news_title_ru")[0]
                                ?.focus();
                            } else if (errors.news_description_ru) {
                              document
                                ?.getElementsByName("news_description_ru")[0]
                                ?.focus();
                            } else if (errors.news_body_ru) {
                              document
                                ?.getElementsByName("news_body_ru")[0]
                                ?.focus();
                            }
                          }, 100);
                        } else if (
                          errors.news_title_en ||
                          errors.news_description_en ||
                          errors.news_body_en
                        ) {
                          setActiveTab("4");
                          setTimeout(() => {
                            if (errors.news_title_en) {
                              document
                                ?.getElementsByName("news_title_en")[0]
                                ?.focus();
                            } else if (errors.news_description_en) {
                              document
                                ?.getElementsByName("news_description_en")[0]
                                ?.focus();
                            } else if (errors.news_body_en) {
                              document
                                ?.getElementsByName("news_body_en")[0]
                                ?.focus();
                            }
                          }, 100);
                        } else {
                          setActiveTab("1");
                          setTimeout(() => {
                            if (errors.news_time) {
                              document
                                ?.getElementsByName("news_time")[0]
                                ?.focus();
                            } else if (errors.news_hashtags) {
                              document
                                ?.getElementsByName("news_hashtags")[0]
                                ?.focus();
                            } else if (errors.source_id) {
                              document
                                ?.getElementsByName("source_id")[0]
                                ?.focus();
                            }
                          }, 100);
                        }
                      } else {
                        handleSubmit();
                      }
                    }}
                    htmlType="submit"
                    className="w-full"
                  >
                    Yangilikni yangilash
                  </Button>
                </Flex>
              </Flex>
            </Form>
          )}
        </Formik>
      </Drawer>
    </>
  );
};

export default UpdateNews;
