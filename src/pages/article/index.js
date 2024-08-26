import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  UserOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  TagsOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, message, Upload, Modal } from "antd";
import Aside from "../../components/aside";

import "./article.css";

const Article = () => {
  const [article, setArticle] = useState(null);
  const [plugiatFile, setPlugiatFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/article/${id}`,
          {
            headers: { Authorization: localStorage.getItem("accessToken") },
          }
      );
      if (response.status === 200) {
        setArticle(response.data);
      }
    };
    fetchArticle();
  }, [id]);

  const UploadProps = () => {
    const props = {
      name: "file",
      action: "https://journal2.nordicun.uz/file/upload",
      headers: {
        authorization: localStorage.getItem("accessToken"),
      },
      beforeUpload: (file) => {
        const isPdf = file.type === "application/pdf";
        if (!isPdf) {
          message.info("Faqat PDF formatidagi fayllarni yuklashingiz mumkin!");
        }
        return isPdf || Upload.LIST_IGNORE;
      },
      onChange(info) {
        if (info.file.status === "done") {
          setPlugiatFile(info.file.response.link.id);
          showModal(); // Show modal for confirmation
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} yuklashda xatolik!`);
        }
      },
    };

    return props;
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    await addPlugiatFile(id, plugiatFile);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    message.info("Amal bekor qilindi.");
  };
  console.log(plugiatFile)
  const addPlugiatFile = async (id, fileId) => {
    try {
      const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/article/update/${id}`,
          {
            plagiarist_file_id: fileId,
          },
          { headers: { Authorization: localStorage.getItem("accessToken") } }
      );
      console.log(response)
      if (response.status === 200) {
        message.success("Muvaffaqiyatli plugiat file qo'shildi!");
      }
    } catch (error) {
      message.error("Plugiat file qo'shishda xatolik yuz berdi!");
      console.log(error);
    }
  };

  return (
      <div className="articles">
        <div className="asid">
          <Aside />
        </div>
        <div className="container mx-auto p-5">
          {article && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                {article?.image?.file_path ? (
                    <img
                        src={`${process.env.REACT_APP_API_URL}${article?.image?.file_path}`}
                        alt={article.title}
                        className="h-[200px] rounded-lg mb-4"
                    />
                ) : (
                    <img
                        className="h-[200px] rounded-lg mt-3 mb-4"
                        src={`https://smart.mag-river.ru/uploads/goods/img/445-360/fit/no-image.png`}
                        alt="No image"
                    />
                )}
                <div className="text-gray-700 text-base">
                  <UserOutlined style={{ marginRight: 8 }} />
                  {article.author.full_name}
                </div>
                <div className="text-gray-700 text-sm">
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  {dayjs(article.createdAt).format("DD.MM.YYYY")}
                </div>
                <div className="text-gray-700 text-sm">
                  <AppstoreOutlined style={{ marginRight: 8 }} />
                  {article.category.name}
                </div>
                <div className="text-gray-700 text-sm">
                  <TagsOutlined style={{ marginRight: 8 }} />
                  {article.SubCategory.name}
                </div>
                <div className="space-y-2 space-x-1 mt-4">
                  {article.keyword.split(",").map((keyword, index) => (
                      <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold rounded-full px-2.5 py-1"
                      >
                  {keyword.trim()}
                </span>
                  ))}
                </div>
                <p className="mt-4">{article.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                      to={`${process.env.REACT_APP_API_URL}${article.file.file_path}`}
                      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Maqola manbaasi
                  </Link>
                  <Upload {...UploadProps()}  showUploadList={false}>
                    <Button
                        className=""
                        size="large"
                        style={{ width: 340 }}
                        icon={<UploadOutlined />}
                    >
                      Plugiat faylni yuklash
                    </Button>
                  </Upload>
                </div>
              </div>
          )}
          {/* Modal for confirmation */}
          <Modal
              title="Fayl yuklashni tasdiqlang"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="Roziman"
              cancelText="Bekor qilish"
          >
            <p>Faylni yuklashga rozimisiz?</p>
          </Modal>
        </div>
      </div>
  );
};

export default Article;
