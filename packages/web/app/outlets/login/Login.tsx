import { useCallback } from "react";
import { post } from "../../utils/post";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

export const Login = () => {
  const navigate = useNavigate();

  const login = useCallback(async (userId: string) => {
    const response = await post("/login", JSON.stringify({ userId }));
    response.ok && navigate("/song");
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 mt-8 font-bold text-lg">
      <div>Select User</div>
      <div className="flex gap-6 w-fit">
        <Button color="primary" onClick={() => login("jason")}>
          Jason
        </Button>
        <Button color="error" onClick={() => login("cole")}>
          Cole
        </Button>
      </div>
    </div>
  );
};

export default Login;
