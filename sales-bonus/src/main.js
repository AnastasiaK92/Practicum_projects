/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
//функция расчета выручки 1 товара с учетом скидки
function calculateSimpleRevenue(purchase, _product) {
  // @TODO: Расчет выручки от операции
  const { discount, sale_price, quantity } = purchase; //деструктурируем обьект покупки-достаем данные
  const discountCoefficient = 1 - discount / 100; //коэфициент скидки ( если discount 10 то коэфициент 0.9)
  return sale_price * quantity * discountCoefficient; //возвращаем выручку : цена * количество * коэфициент скидки
  return Math.round(revenue * 100) / 100;//округление,чтобы не накапливался баг в конце и не округлялся неправильно
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
  // @TODO: Расчет бонуса от позиции в рейтинге
  const { profit } = seller;
  if (index == 0) {
    //первый по прибыли
    return profit * 0.15;
  } else if (index == 1 || index == 2) {
    //второй и третий
    return profit * 0.1;
  } else if (index === total - 1) {
    //последний
    return 0;
  } else {
    // Для всех остальных //остальные
    return profit * 0.05;
  }
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
  // @TODO: Проверка входных данных
  if (
    !data ||
    !Array.isArray(data.sellers) ||
    !Array.isArray(data.products) ||
    !Array.isArray(data.purchase_records) ||
    data.sellers.length === 0 ||
    data.products.length === 0 ||
    data.purchase_records.length === 0
  )
    throw new Error("Некорректные входные данные");

  

  // @TODO: Проверка наличия опций
  if (!options || typeof options !== "object") {
    throw new Error("некоректные опции");
  }
  const { calculateRevenue, calculateBonus } = options;

  if (!calculateRevenue || 
    !calculateBonus ||
    typeof calculateRevenue !== "function" ||
    typeof calculateBonus !== "function"
) {
    throw new Error("не функции");
  }

  // @TODO: Подготовка промежуточных данных для сбора статистики
  const sellerStats = data.sellers.map((seller) => ({
    id: seller.id,
    name: `${seller.first_name} ${seller.last_name}`,
    revenue: 0,
    profit: 0,
    sales_count: 0,
    products_sold: {},
  }));
  const total = sellerStats.length; //количество всех продавцов

  // @TODO: Индексация продавцов и товаров для быстрого доступа
  const sellerIndex = Object.fromEntries(
    sellerStats.map((seller) => [seller.id, seller]),
  ); // Ключом будет id, значением — запись из sellerStats

  const productIndex = Object.fromEntries(
    data.products.map((product) => [product.sku, product]),
  ); // Ключом будет sku, значением — запись из data.products

  //--Основной цикл по чекам--
  data.purchase_records.forEach((record) => {// Чек
    const seller = sellerIndex[record.seller_id]; // Продавец
    seller.revenue = seller.revenue + record.total_amount//добавляем сразу всю выручку за чек
    seller.sales_count = seller.sales_count + 1; //увеличиваем количество продаж продавца на 1

    //внутренний цикл по товарам в чеке
    record.items.forEach((item) => {
      const product = productIndex[item.sku]; // Товар
      const cost = product.purchase_price * item.quantity; // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
      const revenue = calculateSimpleRevenue(item); // считаем выручку по товару с учетом скидки
      const profit = revenue - cost; // Посчитать прибыль: выручка минус себестоимость
      seller.profit = seller.profit + profit; //увеличиваем общую прибыль продавца

      if (!seller.products_sold[item.sku]) {
        //«Если для товара с SKU item.sku ещё нет записи в статистике продаж продавца, создать такую запись со значением 0».
        seller.products_sold[item.sku] = 0; //инициализация счетчика продаж товара
      }
      seller.products_sold[item.sku] =
        seller.products_sold[item.sku] + item.quantity;
    }); //увеличиваем количество проданных товаров на количество в чек
});
  //сортировка по убыванию прибыли
  sellerStats.sort((a, b) => b.profit - a. profit);

  //цикл перебора продавцов
  sellerStats.forEach((seller, index) => {
    seller.bonus = calculateBonusByProfit(index, total, seller);
     // Считаем бонус
    seller.top_products = Object.entries(seller.products_sold)
      .map(([sku, quantity]) => ({ sku, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10); // Формируем топ-10 товаров
  });

  return sellerStats.map((seller) => ({
    seller_id: seller.id, // Строка, идентификатор продавца
    name: seller.name, // Строка, имя продавца
    revenue: +seller.revenue.toFixed(2), // Число с двумя знаками после точки, выручка продавца
    profit: +seller.profit.toFixed(2), // Число с двумя знаками после точки, прибыль продавца
    sales_count: seller.sales_count, // Целое число, количество продаж продавца
    top_products: seller.top_products, // Массив объектов вида: { "sku": "SKU_008","quantity": 10}, топ-10 товаров продавца
    bonus: +seller.bonus.toFixed(2), // Число с двумя знаками после точки, бонус продавца
  }));
}
