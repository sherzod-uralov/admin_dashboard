import Aside from "../../components/aside";
import "./home.css"
const Home = () => {
  return (
    <>
     <div className="articles">
        <div className="asid">
          <Aside />
        </div>
        <div className="articles-wrapper flex justify-center items-center">
            <h1>Loading^) </h1>
        </div>
        </div>
    </>
  )
}
export default Home;