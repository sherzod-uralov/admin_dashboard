import { Button, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const logIn = async (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: e.target[0].value,
        password: e.target[1].value,
      }),
    };

    setError(false);
    setLoading(true);

    await fetch(
      `${process.env.REACT_APP_API_URL}/admin/login`,
      requestOptions
    ).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        setError(true);
      } else {
        localStorage.setItem("accessToken", data.access_token);
        navigate("/home");
      }
    });

    setLoading(false);
  };

  useEffect(() => {
    if (localStorage && localStorage.accessToken) {
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container>
        <div className="login">
          <form className="login-form" onSubmit={logIn}>
            <label htmlFor="">
              Login
              <input
                required
                name="login"
                type="text"
                placeholder="Login kiriting"
                className="mb-2"
              />
            </label>

            <label htmlFor="">
              Password
              <input
                required
                name="password"
                type="password"
                placeholder="Parol kiriting"
                className="mb-4"
              />
            </label>
            <Button disabled={loading} type="submit" variant="success">
              Kirish
            </Button>
            {error && <span className="text-danger">Malumot xato</span>}
          </form>
        </div>
      </Container>
    </>
  );
};

export default Login;
