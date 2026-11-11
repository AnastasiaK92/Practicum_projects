import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { useState, useEffect, useRef } from 'react';
import {
	defaultArticleState,
	fontFamilyOptions,
	ArticleStateType,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';
import { RadioGroup } from 'src/ui/radio-group';
import clsx from 'clsx';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';

type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	setArticleState: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	articleState,
	setArticleState,
}: ArticleParamsFormProps) => {
	const [formState, setFormState] = useState(articleState);
	const [isOpen, setIsOpen] = useState(false);
	type AsideElement = HTMLElementTagNameMap['aside'];
	const sideBarRef = useRef<AsideElement | null>(null);

	//кнопка применить
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setArticleState(formState);
	};

	//кнопка очистить
	const handleReset = () => {
		setFormState(defaultArticleState);
		setArticleState(defaultArticleState);
	};

	//клик вне сандбара
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!isOpen) return;
			const target = event.target as Node;

			if (sideBarRef.current && !sideBarRef.current.contains(target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);
	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
			<aside
				ref={sideBarRef}
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={(option) => {
							setFormState({
								...formState,
								fontFamilyOption: option,
							});
						}}
					/>
					<RadioGroup
						name='fontSize'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(option) => {
							setFormState({
								...formState,
								fontSizeOption: option,
							});
						}}
					/>

					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={formState.fontColor}
						onChange={(option) => {
							setFormState({
								...formState,
								fontColor: option,
							});
						}}
					/>

					<Separator />

					<Select
						title='цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={(option) => {
							setFormState({
								...formState,
								backgroundColor: option,
							});
						}}
					/>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={(option) => {
							setFormState({
								...formState,
								contentWidth: option,
							});
						}}
					/>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
