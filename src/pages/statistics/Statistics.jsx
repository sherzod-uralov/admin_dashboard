import React from "react";
import Aside from "../../components/aside";
import { IoIosSettings } from "react-icons/io";
import { useQuery } from "react-query";
import {
  fetchSearchAnalytics,
  getData,
  getPostMethodData,
} from "./statistics.query";
import { Button, Dropdown, Statistic, Table, Tooltip } from "antd";
import { MdArticle } from "react-icons/md";
import CountUp from "react-countup";
import { FaRegUser } from "react-icons/fa";
import { IoDocumentAttachSharp } from "react-icons/io5";
import { ImNewspaper } from "react-icons/im";
import { Chart } from "react-google-charts";
import { BiCheck, BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
const formatter = (value) => <CountUp end={value} separator="," />;

const Statistics = () => {
  const navigate = useNavigate();
  const today = dayjs();
  const { data: viewsInDay } = useQuery({
    queryKey: ["statistics"],
    queryFn: () =>
      getPostMethodData({
        url: "statistics/views",
        data: {
          startTime: today.format("YYYY-MM-DD"),
          endTime: today.add(1, "day").format("YYYY-MM-DD"),
        },
      }),
    keepPreviousData: true,
  });

  const { data: allStatistics } = useQuery({
    queryKey: ["statisticsAll"],
    queryFn: () => getData("statistics"),
    keepPreviousData: true,
  });

  const author = allStatistics?.data?.authors?.authorsCount;
  const articles = allStatistics?.data?.articles?.articlesCount?.articlesCount;
  const newVolumes = allStatistics?.data?.volumes || [];

  const colors = ["#b87333", "silver", "gold", "#e5e4e2"];

  const volumes = newVolumes
    .map((volume, index) => {
      return [
        volume.title,
        volume.articlesCount,
        colors[index % colors.length],
      ];
    })
    .reverse();

  const formattedAuthors = allStatistics?.data?.authors?.mostActiveAuthors?.map(
    (author, index) => {
      return [
        author.full_name,
        parseInt(author.acceptedArticlesCount, 10),
        parseInt(author.totalViewsCount, 10),
      ];
    },
  );

  const views = [["Time", "Ko'rishlar soni"], ...(viewsInDay?.data || [])];
  const viewsUser = [
    ["Author", "Maqolalari", "ko'rishlar soni"],
    ...(formattedAuthors || []),
  ];

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            localStorage.removeItem("accessToken");
            navigate("/login");
          }}
          className="flex items-center gap-2"
        >
          <BiLogOut />
          <h1>Log out</h1>
        </div>
      ),
    },
  ];

  const mostViewedArticles =
    allStatistics?.data?.articles?.mostViewedArticles || [];
  const articleColumns = [
    {
      title: "№",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Muallif",
      dataIndex: ["author", "full_name"],
      key: "author",
      render: (text, record) => {
        if (record.author && record.author.full_name) {
          return record.author.full_name;
        }
        return "No Author";
      },
    },
    {
      title: "Sarlavha",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Umumiy ko'rishlar soni",
      dataIndex: "viewsCount",
      key: "viewsCount",
    },
    {
      title: "Nashr",
      dataIndex: ["volume", "title"],
      key: "volume",
      render: (text, record) => {
        if (record.volume && record.volume.title) {
          return record.volume.title;
        }
        return "No Volume";
      },
    },
  ];

  const articleData = mostViewedArticles.map((article, index) => ({
    key: index + 1,
    title: article.title,
    author: article.author,
    viewsCount: article.viewsCount,
    volume: article.volume,
  }));

  console.log(allStatistics);

  return (
    <>
      <div className="articles">
        <div className="asid">
          <Aside />
        </div>
        <div className="w-full">
          <nav className="w-full sticky-top flex items-center justify-between px-3 py-6 bg-gray-50">
            <h2 className="font-medium font-sans">
              Nordik e-journal statistikasi
            </h2>
            <Dropdown
              menu={{
                items,
              }}
              placement="topRight"
              arrow
            >
              <IoIosSettings className="text-2xl" />
            </Dropdown>
          </nav>
          <div className="bg-[#E9EEF1]">
            <div
              style={{ height: "calc(100vh - 73px)" }}
              className="max-w-full block m-auto py-5 overflow-auto px-3"
            >
              <div className="shrink-[1] flex gap-4">
                <div className="bg-white flex-grow-1 rounded-xl w-full py-8 flex justify-center items-center gap-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#E7EDFF]">
                    <FaRegUser className="text-3xl text-[#396AFF]" />
                  </div>
                  <div>
                    <h2 className="font-sans font-medium text-gray-500">
                      Barcha Maqolalar
                    </h2>
                    <div className="flex font-semibold items-center gap-1">
                      <Statistic value={articles} formatter={formatter} />
                      <p className="text-xl">ta</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white flex-grow-1 rounded-xl w-full py-8 flex justify-center items-center gap-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#E7EDFF]">
                    <FaRegUser className="text-3xl text-[#396AFF]" />
                  </div>
                  <div>
                    <h2 className="font-sans font-medium text-gray-500">
                      Barcha mualliflar
                    </h2>
                    <div className="flex font-semibold items-center gap-1">
                      <Statistic value={author} formatter={formatter} />
                      <p className="text-xl">ta</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white flex-grow-1 rounded-xl w-full py-8 flex justify-center items-center gap-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#FFE0EB]">
                    <IoDocumentAttachSharp className="text-3xl text-[#FF82AC]" />
                  </div>
                  <div>
                    <h2 className="font-sans font-medium text-gray-500">
                      Barcha nashrlar
                    </h2>
                    <div className="flex font-semibold items-center gap-1">
                      <Statistic
                        value={newVolumes.length}
                        formatter={formatter}
                      />
                      <p className="text-xl">ta</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white flex-grow-1 rounded-xl w-full py-8 flex justify-center items-center gap-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#DCFAF8]">
                    <ImNewspaper className="text-3xl text-[#16DBCC]" />
                  </div>
                  <div>
                    <h2 className="font-sans font-medium text-gray-500">
                      Barcha yangiliklar
                    </h2>
                    <div className="flex font-semibold items-center gap-1">
                      <Statistic
                        value={allStatistics?.data?.news?.newsCount || 0}
                        formatter={formatter}
                      />
                      <p className="text-xl">ta</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-full pt-5">
                <div className="w-full">
                  <h3 className="text-[#333B69] text-2xl pl-1 font-sans font-medium pb-2">
                    Nashrlar statisktikasi
                  </h3>
                  <div className="rounded-2xl w-full overflow-hidden">
                    <Chart
                      className="rounded-2xl"
                      chartType="ColumnChart"
                      width="100%"
                      height="400px"
                      data={[
                        ["Element", "nashrlar", { role: "style" }],
                        ...volumes,
                      ]}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <h3 className="text-[#333B69] text-2xl pl-1 font-sans font-medium pb-2">
                    Kunlik ko'rishlar soni (24 soat)
                  </h3>
                  <div className="rounded-2xl w-full overflow-hidden">
                    <Chart
                      className="rounded-2xl"
                      chartType="LineChart"
                      width="100%"
                      scroll={{
                        x: 1300,
                      }}
                      height="400px"
                      data={views}
                    />
                  </div>
                </div>
              </div>
              <hr className="bg-[#1814F3] rounded-lg w-full text-white h-1 mt-3 px-1" />
              <div className="mt-3">
                <h2 className="text-[#333B69] text-2xl pl-1 font-sans font-medium pb-2">
                  Eng ko'p ko'rilgan maqolalar
                </h2>
                <Table
                  className="mt-1"
                  pagination={false}
                  columns={articleColumns}
                  dataSource={articleData}
                />
              </div>
              <div className="flex gap-4 w-full pt-5">
                <div className="w-full">
                  <h3 className="text-[#333B69] text-2xl pl-1 font-sans font-medium pb-2">
                    Foydalauvchilar faolligi
                  </h3>
                  <div className="rounded-2xl w-full overflow-hidden">
                    <Chart
                      className="rounded-2xl"
                      chartType="AreaChart"
                      width="100%"
                      height="400px"
                      data={viewsUser}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;
