import React from 'react'
import styles from './SkillDetails.module.css'

export interface SkillDetailsProps {
  title: string
  category: string
  subcategory: string
  description: string
}

export const SkillDetails: React.FC<SkillDetailsProps> = ({
  title,
  category,
  subcategory,
  description,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.category}>
          {category} / {subcategory}
        </p>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  )
}
