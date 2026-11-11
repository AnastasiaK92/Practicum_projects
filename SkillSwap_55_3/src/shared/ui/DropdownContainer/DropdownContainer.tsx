import React, { PropsWithChildren } from 'react'
import styles from './DropdownContainer.module.css'

interface DropdownContainerProps extends PropsWithChildren {
  className?: string
  style?: React.CSSProperties
}

export const DropdownContainer: React.FC<DropdownContainerProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`} style={style}>
      {children}
    </div>
  )
}
