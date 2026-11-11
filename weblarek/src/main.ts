import "./scss/styles.scss";
import { ProductCatalog } from "./components/Models.ts/ProductCatalog";
import { ShoppingCart } from "./components/Models.ts/ShoppingCart";
import { Buyer } from "./components/Models.ts/Buyer";
import { ShopApi } from "./components/ShopApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { Header } from "./components/View.ts/Header";
import { CardCatalog } from "./components/View.ts/Card/CardCatalog";
import { cloneTemplate } from "./utils/utils";
import { Category } from "./components/View.ts/Card/CardCatalog";
import { IBuyer, IProduct } from "./types";
import { Modal } from "./components/View.ts/Modal";
import { CardBasket } from "./components/View.ts/Card/CardBasket";
import { Basket } from "./components/View.ts/Basket";
import { CDN_URL } from "./utils/constants";
import { CardPreview } from "./components/View.ts/Card/CardPreview";
import { Contacts } from "./components/View.ts/Forms/Contacts";
import { Order } from "./components/View.ts/Forms/Order";
import { Succes } from "./components/View.ts/Succes";
import { BuyerUpdateData } from "./types";

const eventEmitter = new EventEmitter();
const catalog = new ProductCatalog(eventEmitter);
const cart = new ShoppingCart(eventEmitter);
const buyer = new Buyer(eventEmitter);
const headerContainer = document.querySelector(".header") as HTMLElement;
const catalogContainer = document.querySelector(".gallery") as HTMLElement;
const сardCatalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;

const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);

shopApi
  .getProducts()
  .then((data) => {
    const products = data.items; //берем массив товаров
    catalog.setProducts(products); //сохраняем в модель
  })
  .catch((err) => {
    console.log(err);
  });
//header
const header = new Header(headerContainer, {
  onBasketClick: () => {
    eventEmitter.emit("basket:open");
  },
});
//обновление счетчика
cart.events.on("cart:changed", () => {
  header.counter = cart.getProducts().length;
  //формируем список товаров
  const items = cart.getProducts();
  basket.buttonDisabled = items.length === 0;
  const basketItems = items.map((item, index) => {
    const basketCard = new CardBasket(
      cloneTemplate(
        document.querySelector("#card-basket") as HTMLTemplateElement,
      ),
      {
        onBasketClick: () => {
          eventEmitter.emit("basket:remove", item);
        },
      },
    );
    basketCard.index = index + 1;
    basketCard.title = item.title;
    basketCard.price = item.price ?? 0;
    return basketCard.render();
  });
  basket.list = basketItems;
  //считаем сумму
  basket.total = cart.getTotalPrice();
});

eventEmitter.on("basket:remove", (item: IProduct) => {
  cart.removeProduct(item.id);
});
//рендер каталога
catalog.events.on("products:changed", () => {
  const items = catalog.getProducts();

  const cards = items.map((item) => {
    const card = new CardCatalog(cloneTemplate(сardCatalogTemplate), {
      onClick: () => {
        eventEmitter.emit("card:preview", item);
      },
    });
    card.category = item.category as Category;
    card.title = item.title;
    card.image = `${CDN_URL}${item.image}`;
    card.price = item.price;

    return card.render();
  });
  catalogContainer.replaceChildren(...cards);
});
//модальное окно
//контейнер
const modalContainer = document.querySelector(".modal") as HTMLElement;
//создаем view
const modal = new Modal(modalContainer);
//корзина
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basketElement = basketTemplate.content
  .querySelector(".basket")!
  .cloneNode(true) as HTMLElement;
const basket = new Basket(basketElement, {
  onClick: () => {
    eventEmitter.emit("order:open");
  },
});
//!!!!открытие корзины
eventEmitter.on("basket:open", () => {
  //вставляем в модалку
  modal.content = basketElement;
  //открываем
  modal.open();
});
//карточка превью
const сardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;

const preview = new CardPreview(cloneTemplate(сardPreviewTemplate), {
  onCardClick: () => {
    eventEmitter.emit("card:add");
  },
});

eventEmitter.on("card:add", () => {
  const item = catalog.getSelectedProduct();

  if (!item) return;

  if (cart.hasProduct(item.id)) {
    cart.removeProduct(item.id);
  } else {
    if (item.price != null) {
      cart.addProduct(item);
    }
  }
  modal.close();
});
//клик
eventEmitter.on("card:preview", (item: IProduct) => {
  catalog.setSelectedProduct(item);
});
//реакция на изменение модели
eventEmitter.on("product:selected", (item: IProduct) => {
  preview.category = item.category;
  preview.title = item.title;
  preview.text = item.description;
  preview.price = item.price;
  preview.image = `${CDN_URL}${item.image}`;
  //состояние кнопки
  const isInCart = cart.hasProduct(item.id);
  preview.buttonDisabled = !item.price;

  if (!item.price) {
    preview.buttonText = "Недоступно";
  } else { 
    preview.buttonText = isInCart ? "Удалить из корзины" : "Купить";
  }
  modal.content = preview.render();
  modal.open();
});
//событие открытие формы заказа
eventEmitter.on("buyer:update", (data: BuyerUpdateData) => {
  const update: Partial<IBuyer> = {};

  if (data.address !== undefined) {
    update.address = data.address;
  }

  if (data.email !== undefined) {
    update.email = data.email;
  }

  if (data.phone !== undefined) {
    update.phone = data.phone;
  }

  if (data.payment !== undefined) {
    update.payment = data.payment ?? "";
  }
  buyer.setData(update);
});
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;

const order = new Order(cloneTemplate(orderTemplate), {
  onInput: (data) => {
    eventEmitter.emit("buyer:update", data);
  },
  onSubmit: () => {
    eventEmitter.emit("order:submit");
  },
});

const contacts = new Contacts(cloneTemplate(contactsTemplate), {
  onInput: (data) => {
   eventEmitter.emit("buyer:update", data);
  },
  onSubmit: () => {
    eventEmitter.emit("contacts:submit");
  },
});
eventEmitter.on("order:open", () => {
  modal.content = order.render();
  modal.open();
});
// открытие контакт
eventEmitter.on("order:submit", () => {
  modal.content = contacts.render();
  modal.open();
});
//валидация формы
buyer.events.on("buyer:changed", () => {
  if (!order || !contacts) return;

  const buyerData = buyer.getBuyer(); // получаем данные покупателя из модели
  const errors = buyer.validate(); // получаем результат валидации
  // далее через сеттеры форм обновляем значения в полях ввода, устанавливаем ошибки и управляем кнопками
  order.address = buyerData.address;
 
  order.payment = buyerData.payment as "cash" | "card";
  
  order.errors = [errors.address, errors.payment].filter(Boolean).join(", "); // устанавливаем ошибку на первой форме
  order.valid = !errors.address && !errors.payment; // управляем кнопкой отправки формы
  //контакты
  contacts.email = buyerData.email;
  contacts.phone = buyerData.phone;

  contacts.errors = [errors.email, errors.phone].filter(Boolean).join(", ");
  contacts.valid = !errors.email && !errors.phone;
});
eventEmitter.on("contacts:submit", () => {
  const buyerData = buyer.getBuyer();
  const items = cart.getProducts();
  //считаем сумму до очистки
  const total = cart.getTotalPrice();

  const orderData = {
    items: items.map((item) => item.id),
    total,
    ...buyerData,
  };
  //отправка на сервер
  shopApi
    .createOrder(orderData)
    .then((res) => {
      //очиска корзины
      cart.clearCart();
      //очищаем форму
      buyer.clearBuyerData();
      //закрываем текущую модалку
      modal.close();
      //открываем  succes
      eventEmitter.emit("order:success", {
        total: res.total,
      });
    })
    .catch((err) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        err?.error ||
        "ошибка оплаты";

      contacts.errors = message;
    });
});
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

const success = new Succes(cloneTemplate(successTemplate), {
    onBasketClick: () => {
      modal.close();
    },
  });
 
eventEmitter.on("order:success", (data: { total: number }) => {
  success.total = data.total;
  modal.content = success.render();
  modal.open();
});
