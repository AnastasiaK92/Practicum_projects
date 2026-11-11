export function initFiltering(elements) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes) // Получаем ключи из объекта
      .forEach((elementName) => {
        // Перебираем по именам
        elements[elementName].append(
          // в каждый элемент добавляем опции
          ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
            .map((name) => {
              const el = document.createElement("option");
              el.value = name;
              el.textContent = name;

              return el;
            }),
        );
      });
  };

  const applyFiltering = (query, state, action) => {
    // @todo: #4.2 — обработать очистку поля

    if (action && action.name === "clear") {
      const button = action; //находим кнопку clear  в dom
      if (button) {
        const parent = button?.parentElement;
        const input = parent?.querySelector("input");

        if (input) input.value = "";

        const fieldName = button?.dataset.field;
        if (fieldName) {
          state[fieldName] = "";
        }
      }
    }

    // --- Формируем диапазон total для arrayAsRange ---
    state.total = [
      state.totalFrom ? Number(state.totalFrom.replace(/\s/g, "")) : undefined,
      state.totalTo ? Number(state.totalTo.replace(/\s/g, "")) : undefined,
    ];

    // @todo: #4.5 — отфильтровать данные используя компаратор
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          // ищем поля ввода в фильтре с непустыми данными
          filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
        }
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query; // если в фильтре что-то добавилось, применим к запросу
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
