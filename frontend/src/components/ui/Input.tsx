interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string; // Added className prop
}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  const baseClasses =
    'w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500';
  const combinedClasses = `${baseClasses} ${className || ''}`;
  return <input {...props} className={combinedClasses} />;
};

export default Input;
