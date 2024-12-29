import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../utils/post";
import { Button } from "@mui/material";
import { Controls, Layout } from "./Login.styles";

export const Login = () => {
  const navigate = useNavigate();

  const login = useCallback(async (userId: string) => {
    const response = await post("/login", JSON.stringify({ userId }));
    response.ok && navigate("/song");
  }, []);

  return (
    <Layout>
      <div>Select User</div>
      <Controls>
        <Button
          variant="contained"
          color="primary"
          onClick={() => login("jason")}
        >
          Jason
        </Button>
        <Button variant="contained" color="error" onClick={() => login("cole")}>
          Cole
        </Button>
      </Controls>
    </Layout>
  );
};
