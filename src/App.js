import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";

import { ToastContainer } from "react-toastify";
import Category from "./pages/category";
import Home from "./pages/home";
import Banner from "./pages/banner";
import AddVolume from "./pages/add-volume";
import Articles from "./pages/articles";
import SubCategory from "./pages/sub-category";
import "react-toastify/dist/ReactToastify.css";
import "remixicon/fonts/remixicon.css";
import CategorySub from "./pages/category-sub";
import Article from "./pages/article";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/article/:id" element={<Article />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/subarticle/:id" element={<CategorySub />} />
        <Route path="/banner" element={<Banner />} />
        <Route path="/add-volume" element={<AddVolume />} />
        <Route path="/sub-category" element={<SubCategory />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
