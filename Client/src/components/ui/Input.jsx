const Input = ({
  label,
  type = "text",
  placeholder,
  register,
  name,
  error,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;