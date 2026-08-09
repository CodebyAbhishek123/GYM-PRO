const Button = ({ children, type = "submit", loading }) => {
  return (
    <button
      type={type}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;