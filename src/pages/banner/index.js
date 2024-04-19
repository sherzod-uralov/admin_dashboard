import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./banner.css"


const Banner = () => {
  return (
    <>
    <Container>
      <Link className="banner-back" to="/home">Назад</Link>
      <Container>
        <h2 className="information">Slider avtomatik tarzda eng ko`p o`qilgan maqolalarni chiqaradi...</h2>
      </Container>
    </Container>
    </>
  )
}
export default Banner;