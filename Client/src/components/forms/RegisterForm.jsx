import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../ui/Input";
import Button from "../ui/Button";

import { registerUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "member",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await registerUser(data);

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
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <Input
        label="Full Name"
        name="name"
        placeholder="Enter your name"
        register={register}
        error={errors.name}
      />

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

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Role
        </label>

        <select
          {...register("role")}
          className="w-full border rounded-lg p-3"
        >
          <option value="member">Member</option>
          <option value="trainer">Trainer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Button loading={loading}>
        Register
      </Button>

      <p className="text-center mt-5">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-blue-600 font-semibold"
        >
          Login
        </Link>
      </p>

    </form>
  );
};

export default RegisterForm;