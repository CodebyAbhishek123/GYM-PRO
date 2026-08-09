import RegisterForm from "../../components/forms/RegisterForm";
import { motion } from "framer-motion";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          GymPro
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Create a New Account
        </p>

        <RegisterForm />

      </motion.div>

    </div>
  );
};

export default Register;