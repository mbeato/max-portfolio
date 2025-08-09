import { forwardRef } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asMotion?: boolean
  motionProps?: MotionProps
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    id,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    asMotion = false,
    motionProps,
    ...props
  }, ref) => {
    const baseClasses = cn(
      // Base styles
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      
      // Variants
      {
        'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl': 
          variant === 'primary',
        'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700': 
          variant === 'secondary',
        'text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800': 
          variant === 'ghost',
        'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800': 
          variant === 'outline'
      },
      
      // Sizes
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg'
      },
      
      className
    )

    const content = (
      <>
        {isLoading ? (
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </>
    )

    if (asMotion) {
      return (
        <motion.button
          ref={ref}
          id={id}
          className={baseClasses}
          disabled={disabled || isLoading}
          whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
          whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
          {...motionProps}
          {...props}
        >
          {content}
        </motion.button>
      )
    }

    return (
      <button
        ref={ref}
        id={id}
        className={baseClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button