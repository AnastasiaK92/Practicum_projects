import { test, expect } from '@playwright/test';

test.describe('работа конструткора бургеров', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
      notFound: 'abort'
    });
  });

  test('Добавление ингридиентов конструктор', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('burger-ingredients')).toBeVisible();

    const ingredient = page.getByTestId('ingredient-main').first();
    const ingredientName = await ingredient
      .getByTestId('ingredient-name')
      .textContent();

    await ingredient.getByRole('button', { name: 'Добавить' }).click();
    const constructorIngredient = page.getByTestId('constructor-ingredient');
    await expect(constructorIngredient).toHaveCount(1);
    await expect(constructorIngredient).toContainText(ingredientName!);
  });

  test('открытие модального окна и отображение выбранного ингредиента', async ({
    page
  }) => {
    await page.goto('/');
    await expect(page.getByTestId('burger-ingredients')).toBeVisible();
    const ingredient = page.getByTestId('ingredient-main').first();
    const ingredientName = await ingredient
      .getByTestId('ingredient-name')
      .textContent();

    await ingredient.click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText(ingredientName!);
  });

  test('закрытие модального окна кликом на крестик', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('burger-ingredients')).toBeVisible();
    //кликаем по карточке товара
    await page.getByTestId('ingredient-main').first().click();
    //проверяем что модальное окно открыто
    await expect(page.getByTestId('modal')).toBeVisible();
    //закрытие модальногоо окна нажатием на крестик
    await page.getByTestId('modal-close').click();
    //проверяем что модальное окно закрыто
    await expect(page.getByTestId('modal')).toHaveCount(0);
  });

  test('закрытие модального окна кликом по оверлай', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('burger-ingredients')).toBeVisible();
    //кликаем по карточке товара
    await page.getByTestId('ingredient-main').first().click();
    //проверяем что модальное окно открыто
    await expect(page.getByTestId('modal')).toBeVisible();
    //закрытие модальногоо окна нажатием на оверлау
    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 10, y: 10 } });
    //проверяем что модальное окно закрыто
    await expect(page.getByTestId('modal')).toHaveCount(0);
  });
  test('оформление заказа', async ({ context, page }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);
    // refreshToken(localStorage)
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
      notFound: 'abort'
    });
    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
      notFound: 'abort'
    });
    await page.goto('/');
    await expect(page.getByTestId('burger-ingredients')).toBeVisible();
    //добавить булку
    await page
      .getByTestId('ingredient-bun')
      .first()
      .getByRole('button', { name: 'Добавить' })
      .click();
    //добавить начинку
    await page
      .getByTestId('ingredient-main')
      .first()
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(page.getByTestId('constructor-ingredient')).toHaveCount(1);
    //оформить заказ
    await page.getByRole('button', { name: /оформить заказ/i }).click();
    //проверить что открылось модалььное окно
    await expect(page.getByTestId('modal')).toBeVisible();
    //проверяем номер заказа
    await expect(page.getByTestId('order-number')).toHaveText('107639');
    //закрываем модалку
    await page.getByTestId('modal-close').click();
    //проверяем что модалка закрыта
    await expect(page.getByTestId('modal')).toHaveCount(0);
    //проверяем что конструктор очищен
    await expect(page.getByTestId('constructor-ingredient')).toHaveCount(0);
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    //очищаем фейковые токены
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
  });
});
