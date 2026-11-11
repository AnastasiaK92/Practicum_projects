import styles from './RegistrationProgress.module.css'

type RegistrationProgressProps = {
  currentStep: 1 | 2 | 3
}

const TOTAL_STEPS = 3

export const RegistrationProgress = ({
  currentStep,
}: RegistrationProgressProps) => {
  return (
    <div className={styles.progress}>
      <p className={styles.text}>
        Шаг {currentStep} из {TOTAL_STEPS}
      </p>

      <div className={styles.indicators}>
        {Array.from({ length: TOTAL_STEPS }, (_, index) => {
          const step = index + 1
          const isActive = step <= currentStep

          return (
            <span
              className={`${styles.indicator} ${
                isActive ? styles.active : ''
              }`}
              key={step}
            />
          )
        })}
      </div>
    </div>
  )
}
