import { forwardRef, useEffect, useId, useRef, useState, type InputHTMLAttributes } from 'react'
import DatePickerLibrary from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import { ru } from 'date-fns/locale'

import clsx from 'clsx'

import CalendarIcon from '../../assets/icons/icon-calendar.svg?react'
import ChevronDownIcon from '../../assets/icons/icon-chevron-down.svg?react'

import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'

import styles from './DatePicker.module.css'

// Подключает русские названия месяцев и дней недели в react-datepicker.
registerLocale('ru', ru)

// Описывает props поля, которое react-datepicker использует вместо стандартного input.
interface CustomInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: string
  onClick?: () => void
}

// Отрисовывает поле даты и отдельную кнопку с иконкой календаря.
const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, className, ...props }, ref) => (
    <div className={styles['input-wrapper']}>
      <input
        {...props}
        ref={ref}
        value={value ?? ''}
        onClick={onClick}
        className={clsx(styles.input, className)}
      />

      <IconButton
        icon={<CalendarIcon />}
        onClick={onClick}
        aria-label="Открыть календарь"
        className={styles['calendar-button']}
      />
    </div>
  ),
)

CustomInput.displayName = 'CustomInput'

// Описывает публичный API компонента DatePicker.
export interface DatePickerProps {
  label?: string
  placeholder?: string
  selected?: Date | null
  onChange?: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  error?: string
  helperText?: string
  className?: string
  open?: boolean
}

// Содержит названия месяцев для кастомного переключателя месяца.
const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

// Сопоставляет полные названия дней недели с короткими обозначениями.
const WEEKDAYS: Record<string, string> = {
  понедельник: 'Пн',
  вторник: 'Вт',
  среда: 'Ср',
  четверг: 'Чт',
  пятница: 'Пт',
  суббота: 'Сб',
  воскресенье: 'Вс',
}

// Возвращает короткое русское обозначение дня недели.
const formatWeekDay = (day: string) => WEEKDAYS[day.toLowerCase()] ?? day

export const DatePicker = ({
  label,
  placeholder = 'дд.мм.гггг',
  selected = null,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  error,
  helperText,
  className,
  open = false,
}: DatePickerProps) => {
  // Хранит выбранную, но ещё не подтверждённую дату и состояние календаря.
  const [draftDate, setDraftDate] = useState<Date | null>(selected)
  const [isOpen, setIsOpen] = useState(open)

  // Управляет отображением выпадающих списков месяца и года.
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false)

  // Связывает label с input и хранит ссылку на выбранный год.
  const inputId = useId()
  const selectedYearRef = useRef<HTMLButtonElement>(null)

  // Формирует полный диапазон годов с учётом minDate и maxDate.
  const currentYear = new Date().getFullYear()
  const minYear = minDate?.getFullYear() ?? currentYear - 120
  const maxYear = maxDate?.getFullYear() ?? currentYear
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index)

  // Синхронизирует черновую дату с изменениями selected снаружи.
  useEffect(() => {
    setDraftDate(selected)
  }, [selected])

  // Синхронизирует открытое состояние календаря с prop open.
  useEffect(() => {
    setIsOpen(open)
  }, [open])

  // При открытии списка прокручивает его к выбранному году.
  useEffect(() => {
    if (isYearPickerOpen) {
      selectedYearRef.current?.scrollIntoView({
        block: 'center',
        inline: 'nearest',
      })
    }
  }, [isYearPickerOpen])

  // Сохраняет выбранную в календаре дату как черновую.
  const handleChange = (date: Date | null) => {
    setDraftDate(date)
  }

  // Отменяет изменения, возвращает исходную дату и закрывает календарь.
  const handleCancel = () => {
    setDraftDate(selected)
    setIsMonthPickerOpen(false)
    setIsYearPickerOpen(false)
    setIsOpen(false)
  }

  // Передаёт подтверждённую дату наружу и закрывает календарь.
  const handleConfirm = () => {
    onChange?.(draftDate)
    setIsMonthPickerOpen(false)
    setIsYearPickerOpen(false)
    setIsOpen(false)
  }

  // Закрывает только вспомогательные списки месяца и года.
  const closePickers = () => {
    setIsMonthPickerOpen(false)
    setIsYearPickerOpen(false)
  }

  return (
    <div className={clsx(styles['date-picker'], className)}>
      {/* Подпись поля, связанная с input через общий id. */}
      {label && (
        <label htmlFor={inputId} className={styles['input-label']}>
          {label}
        </label>
      )}

      <div
        className={clsx(
          styles['input-container'],
          error && styles.error,
          disabled && styles.disabled,
        )}
      >
        {/* Основной календарь с кастомным полем, заголовком и footer. */}
        <DatePickerLibrary
          id={inputId}
          selected={draftDate}
          onChange={handleChange}
          locale="ru"
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          placeholderText={placeholder}
          dateFormat="dd.MM.yyyy"
          customInput={<CustomInput />}
          open={isOpen}
          onCalendarOpen={() => setIsOpen(true)}
          onClickOutside={handleCancel}
          calendarClassName={styles.calendar}
          popperClassName={styles.popper}
          popperPlacement="bottom-start"
          renderCustomHeader={({ date, changeMonth, changeYear }) => (
            <div className={styles.header}>
              {/* Открывает список месяцев и показывает текущий месяц. */}
              <button
                type="button"
                className={styles['month-selector']}
                onClick={() => {
                  setIsMonthPickerOpen((prev) => !prev)
                  setIsYearPickerOpen(false)
                }}
                aria-label="Выбрать месяц"
              >
                <span>{MONTHS[date.getMonth()]}</span>
                <ChevronDownIcon />
              </button>

              {/* Открывает список годов и показывает текущий год. */}
              <button
                type="button"
                className={styles['year-selector']}
                onClick={() => {
                  setIsYearPickerOpen((prev) => !prev)
                  setIsMonthPickerOpen(false)
                }}
                aria-label="Выбрать год"
              >
                <span>{date.getFullYear()}</span>
                <ChevronDownIcon />
              </button>

              {/* Позволяет выбрать один из двенадцати месяцев. */}
              {isMonthPickerOpen && (
                <div className={styles['month-dropdown']}>
                  {MONTHS.map((month, index) => {
                    const isCurrentMonth = index === date.getMonth()

                    return (
                      <button
                        key={month}
                        type="button"
                        className={clsx(styles['dropdown-item'], isCurrentMonth && styles.selected)}
                        onClick={() => {
                          changeMonth(index)
                          closePickers()
                        }}
                      >
                        {month}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Позволяет выбрать год из полного допустимого диапазона. */}
              {isYearPickerOpen && (
                <div className={styles['year-dropdown']}>
                  {years.map((year) => {
                    const isCurrentYear = year === date.getFullYear()

                    return (
                      <button
                        key={year}
                        ref={isCurrentYear ? selectedYearRef : undefined}
                        type="button"
                        className={clsx(styles['dropdown-item'], isCurrentYear && styles.selected)}
                        onClick={() => {
                          changeYear(year)
                          closePickers()
                        }}
                      >
                        {year}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
          formatWeekDay={formatWeekDay}
          calendarStartDay={1}
        >
          {/* Кнопки отмены и подтверждения выбранной даты. */}
          <div className={styles.footer}>
            <Button
              variant="secondary"
              size="md"
              onClick={handleCancel}
              className={styles['footer-button']}
            >
              Отменить
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              className={styles['footer-button']}
            >
              Выбрать
            </Button>
          </div>
        </DatePickerLibrary>
      </div>

      {/* Показывает ошибку или вспомогательный текст под полем. */}
      {error ? (
        <span className={styles['error-text']}>{error}</span>
      ) : (
        helperText && <span className={styles['helper-text']}>{helperText}</span>
      )}
    </div>
  )
}
