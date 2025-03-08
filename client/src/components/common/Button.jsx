// components/common/Button.jsx
const Button = ({ variant = 'primary', size = 'base', ...props }) => {
  const base = "rounded-full font-bold transition-all duration-300";
  
  const variants = {
    primary: "bg-white text-indigo-900 hover:bg-gray-100 px-8 py-3",
    secondary: "bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3",
    "outline-white": "border-2 border-white text-white hover:bg-white/10"
  };

  const sizes = {
    lg: "text-lg py-3 px-8",
    md: "text-base py-2 px-6",
    sm: "text-sm py-1.5 px-4"
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]}`}
      {...props}
    />
  );
};

export default Button;