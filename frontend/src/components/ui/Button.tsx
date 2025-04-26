interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'; // Added variant prop
  className?: string; // Added className prop for custom styles
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', className, children, ...props }) => {
  let baseClasses = 'px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';

  // Apply variant-specific styles
  switch (variant) {
    case 'default':
      baseClasses += ' bg-blue-500 hover:bg-blue-600 text-white';
      break;
    case 'outline':
      baseClasses += ' bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300';
      break;
    case 'ghost':
      baseClasses += ' bg-transparent hover:bg-gray-100 text-gray-700'; // Corrected class name
      break;
    default:
      baseClasses += ' bg-blue-500 hover:bg-blue-600 text-white';
  }

  // Combine base classes with any additional class names
  const combinedClasses = `${baseClasses} ${className || ''}`;

  return (
    <button {...props} className={combinedClasses}>
      {children}
    </button>
  );
};

export default Button;
