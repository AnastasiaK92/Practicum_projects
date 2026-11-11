import React from 'react';
import { AvatarUpload } from '@/entities/user/ui/AvatarUpload';
import { Input } from '@/shared/ui/Input';
import { DatePicker } from '@/shared/ui/DatePicker';
import { Select, type SelectOption } from '@/shared/ui/Select';
import { Textarea } from '@/shared/ui/Textarea';
import { Button } from '@/shared/ui/Button';
import styles from './PersonalDataSection.module.css';

export interface PersonalData {
  email: string;
  name: string;
  birthDate: Date | null;
  gender: string;
  city: string;
  about: string;
  avatar?: string;
}

export interface PersonalDataSectionProps {
  data?: PersonalData;
  onChangePassword?: () => void;
  onSave?: (data: PersonalData) => void;
  disabled?: boolean;
}

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'female', label: 'Женский' },
  { value: 'male', label: 'Мужской' },
  { value: 'preferNotToSay', label: 'Не указан' },
];

const CITY_OPTIONS: SelectOption[] = [
  { value: 'moscow', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'kazan', label: 'Казань' },
  { value: 'novosibirsk', label: 'Новосибирск' },
  { value: 'ekaterinburg', label: 'Екатеринбург' },
  { value: 'other', label: 'Другой' },
];

const defaultData: PersonalData = {
  email: 'Mariia@gmail.com',
  name: 'Мария',
  birthDate: new Date(1995, 9, 28),
  gender: 'female',
  city: 'moscow',
  about: 'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
  avatar: undefined,
};

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({
  data = defaultData,
  onChangePassword,
  onSave,
  disabled = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(data);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.form}>
        {/* Поле «Почта» */}
        <div className={styles.fieldWithLink}>
          <Input
            label="Почта"
            type="email"
            value={data.email}
            disabled={disabled}
          />
          <button
            type="button"
            className={styles.changePasswordLink}
            onClick={onChangePassword}
            disabled={disabled}
          >
            Изменить пароль
          </button>
        </div>

        {/* Поле «Имя» */}
          <Input
            label="Имя"
            value={data.name}
            disabled={disabled}
          />

        {/* Строка: Дата рождения + Пол */}
        <div className={styles.row}>
            <DatePicker
              label="Дата рождения"
              selected={data.birthDate}
              onChange={() => {}}
              disabled={disabled}
            />

            <Select
              label='Пол'
              options={GENDER_OPTIONS}
              value={data.gender}
              onChange={() => {}}
              disabled={disabled}
            />
        </div>

        {/* Поле «Город» */}
          <Select
            label='Город'
            options={CITY_OPTIONS}
            value={data.city}
            onChange={() => {}}
            disabled={disabled}
          />

        {/* Поле «О себе» */}
          <Textarea
            label="О себе"
            value={data.about}
            disabled={disabled}
          /> 

        {/* Кнопка «Сохранить» */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={disabled}
          className={styles.saveButton}
        >
          Сохранить
        </Button>
      </div>

      {/* Аватар */}
      <div className={styles.avatarWrapper}>
        <AvatarUpload image={data.avatar} size="large" />
      </div>
    </form>
  );
};