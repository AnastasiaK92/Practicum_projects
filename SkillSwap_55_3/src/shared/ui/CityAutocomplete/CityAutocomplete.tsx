import { useState, type ChangeEvent } from 'react'
import { clsx } from 'clsx'
import { Input } from '../Input'
import { IconButton } from '../IconButton'
import { DropdownContainer } from '../DropdownContainer'
import { cities } from '../../config/referenceData'
import crossIcon from '../../assets/icons/icon-cross.svg'
import styles from './CityAutocomplete.module.css'

interface CityAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const CityAutocomplete = ({
  value,
  onChange,
  placeholder = 'Введите город',
  className,
}: CityAutocompleteProps) => {
  // При первом отображении список должен быть закрыт даже при заполненном поле.
  const [isOpen, setIsOpen] = useState(false)

  // Оставляет в списке только города, соответствующие введённому тексту.
  const normalizedValue = value.trim().toLowerCase()
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(normalizedValue),
  )

  // Передаёт введённое значение родителю и открывает список при наличии текста.
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value

    onChange(nextValue)
    setIsOpen(nextValue.trim().length > 0)
  }

  // Передаёт выбранный город родителю и закрывает список.
  const handleCitySelect = (city: string) => {
    onChange(city)
    setIsOpen(false)
  }

  // Очищает поле и закрывает список.
  const handleClear = () => {
    onChange('')
    setIsOpen(false)
  }

  return (
    <div className={clsx(styles.wrapper, isOpen && styles.wrapperOpen, className)}>
      <div className={styles.inputWrapper}>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          borderless
          trailingIcon={
            value ? (
              <IconButton
                icon={<img src={crossIcon} alt="" />}
                onClick={handleClear}
                aria-label="Очистить поле"
              />
            ) : null
          }
        />
      </div>

      {isOpen && (
        <DropdownContainer className={styles.dropdown}>
          <ul className={styles.cityList}>
            {filteredCities.map((city) => (
              <li key={city.id}>
                <button
                  className={styles.cityItem}
                  type="button"
                  onClick={() => handleCitySelect(city.name)}
                >
                  {city.name}
                </button>
              </li>
            ))}
          </ul>
        </DropdownContainer>
      )}
    </div>
  )
}
