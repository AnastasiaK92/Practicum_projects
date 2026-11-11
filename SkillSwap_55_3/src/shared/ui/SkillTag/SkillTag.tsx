import React from 'react'
import clsx from 'clsx'
import styles from './SkillTag.module.css'

export type SkillTagVariant =
  | 'languages'
  | 'education'
  | 'health'
  | 'business'
  | 'creative'
  | 'home'
  | 'more'

interface SkillTagProps {
  variant: SkillTagVariant
  label: string
}

export const SkillTag: React.FC<SkillTagProps> = ({ variant, label }) => {
  return <span className={clsx(styles.tag, styles[variant])}>{label}</span>
}
