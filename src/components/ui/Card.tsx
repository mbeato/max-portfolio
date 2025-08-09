import { forwardRef } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  variant?: 'default' | 'outlined' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  asMotion?: boolean
  motionProps?: MotionProps
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    id,
    className,
    variant = 'default',
    padding = 'md',
    asMotion = false,
    motionProps,
    hover = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = cn(
      // Base styles
      'rounded-xl transition-all duration-200',
      
      // Variants
      {
        'bg-white dark:bg-gray-900 shadow-sm': variant === 'default',
        'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700': variant === 'outlined',
        'bg-white dark:bg-gray-900 shadow-lg': variant === 'elevated',
        'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/20 dark:border-gray-700/20': variant === 'glass'
      },
      
      // Padding
      {
        'p-0': padding === 'none',
        'p-4': padding === 'sm',
        'p-6': padding === 'md',
        'p-8': padding === 'lg'
      },
      
      // Hover effects
      hover && 'hover:shadow-xl hover:scale-[1.02] cursor-pointer',
      
      className
    )

    if (asMotion) {
      return (
        <motion.div
          ref={ref}
          id={id}
          className={baseClasses}
          whileHover={hover ? { 
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          } : undefined}
          whileTap={hover ? { scale: 0.98 } : undefined}
          {...motionProps}
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        id={id}
        className={baseClasses}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card sub-components
const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { id: string }>(
  ({ id, className, ...props }, ref) => (
    <div
      ref={ref}
      id={id}
      className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement> & { id: string }>(
  ({ id, className, ...props }, ref) => (
    <h3
      ref={ref}
      id={id}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & { id: string }>(
  ({ id, className, ...props }, ref) => (
    <p
      ref={ref}
      id={id}
      className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { id: string }>(
  ({ id, className, ...props }, ref) => (
    <div
      ref={ref}
      id={id}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { id: string }>(
  ({ id, className, ...props }, ref) => (
    <div
      ref={ref}
      id={id}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }