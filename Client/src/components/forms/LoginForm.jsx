import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../ui/Input";
import Button from "../ui/Button";

import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await loginUser(data);

      if (response.success) {
        login(response.user, response.token);

        toast.success(response.message);

        switch (response.user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;

          case "trainer":
            navigate("/trainer/dashboard");
            break;

          default:
            navigate("/member/dashboard");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Enter your email"
        register={register}
        error={errors.email}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        register={register}
        error={errors.password}
      />

      <Button loading={loading}>
        Login
      </Button>
      <p className="text-center mt-5">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="text-blue-600 font-semibold"
  >
    Register
  </Link>
</p>
    </form>
  );
};

export default LoginForm;