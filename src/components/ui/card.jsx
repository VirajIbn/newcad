import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Card = React.forwardRef(({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  shadow = 'soft',
  hover = false,
  onClick,
  ...props
}, ref) => {
  const baseClasses = 'rounded-xl border transition-all duration-200';
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md',
    outlined: 'bg-transparent border-gray-300 dark:border-gray-600',
  };
  
  const shadows = {
    none: '',
    soft: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
  };
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const hoverClasses = hover ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer' : '';
  
  const classes = clsx(
    baseClasses,
    variants[variant],
    shadows[shadow],
    paddings[padding],
    hoverClasses,
    className
  );
  
  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick && hover ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    onClick,
  } : onClick ? {
    onClick,
  } : {};
  
  return (
    <Component
      ref={ref}
      className={classes}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={clsx('flex items-center justify-between mb-4', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900 dark:text-gray-100', className)} {...props}>
    {children}
  </h3>
);

const CardSubtitle = ({ children, className = '', ...props }) => (
  <p className={clsx('text-sm text-gray-600 dark:text-gray-400', className)} {...props}>
    {children}
  </p>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={clsx('text-sm text-gray-500 dark:text-gray-400', className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={clsx('flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700', className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

Card.displayName = 'Card';

// Export named components for convenience
export { Card, CardHeader, CardTitle, CardSubtitle, CardDescription, CardContent, CardFooter };

export default Card; 
