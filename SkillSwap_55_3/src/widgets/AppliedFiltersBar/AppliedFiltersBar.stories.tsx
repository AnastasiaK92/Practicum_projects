import { AppliedFiltersBar } from "./AppliedFiltersBar";

export default {
  title: 'Widgets/AppliedFiltersBar',
  component: AppliedFiltersBar,
};

export const Default = {
  args: {
    filters: [
      {id: '1' , label: "Хочу научиться"},
      { id: '2', label: 'Английский' },
    ],
    onRemove: (id: string) => console.log('Удалён фильтр:', id),
  },
};
