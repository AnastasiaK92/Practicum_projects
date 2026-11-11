import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioButton } from './RadioButton';

const meta: Meta<typeof RadioButton> = {
    title: 'shared/ui/RadioButton',
    component: RadioButton,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

// 1. Default (unchecked)
export const Default: Story = {
    args: {
        label: 'Хочу научиться',
        name: 'role-default',  
        value: 'learn',
    },
};

// 2. Checked
export const Checked: Story = {
    args: {
        label: 'Всё',
        name: 'role-checked',  
        value: 'all',
        checked: true,
    },
};

// 3. Disabled
export const Disabled: Story = {
    args: {
        label: 'Могу научить',
        name: 'role-disabled',  
        value: 'teach',
        disabled: true,
    },
};

// 4. Disabled + Checked
export const DisabledChecked: Story = {
    args: {
        label: 'Отключено, но выбрано',
        name: 'role-disabled-checked',  
        value: 'disabled-checked',
        checked: true,
        disabled: true,
    },
};

// 5. Группа радио-кнопок (здесь name одинаковый — это ПРАВИЛЬНО!)
export const RadioGroup: Story = {
    render: () => {
        const [value, setValue] = useState('all');
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <RadioButton 
                    label="Всё" 
                    name="role-group"  
                    value="all" 
                    checked={value === 'all'}
                    onChange={() => setValue('all')}
                />
                <RadioButton 
                    label="Хочу научиться" 
                    name="role-group"  
                    value="learn" 
                    checked={value === 'learn'}
                    onChange={() => setValue('learn')}
                />
                <RadioButton 
                    label="Могу научить" 
                    name="role-group"  
                    value="teach" 
                    checked={value === 'teach'}
                    onChange={() => setValue('teach')}
                />
            </div>
        );
    },
};