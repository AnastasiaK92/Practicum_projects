import { ActiveFilterChip } from '../../shared/ui/ActiveFilterChip';
import styles from './AppliedFiltersBar.module.css'

export interface Filter {
  id: string;
  label: string;
}

export interface AppliedFiltersBarProps {
  filters: Filter[];
  onRemove: (id: string) => void;
}

export const AppliedFiltersBar = ({ filters, onRemove }: AppliedFiltersBarProps) => {
  return(
    <div className={styles.filtersBar}>
      {filters.map((filter) => (
        <ActiveFilterChip
          key={filter.id}
          label={filter.label}
          onRemove={() => onRemove(filter.id)}
        />
      ))}
    </div>
  )
}
