import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import styles from './SectionHeader.module.css'
import { SectionHeader } from './SectionHeader'

describe('SectionHeader — состояние раскрытия', () => {
  it('передаёт состояние раскрытия и поворачивает стрелку', () => {
    const { container, rerender } = render(
      <SectionHeader
        title="Популярное"
        showViewAllButton
        viewAllLabel="Смотреть все"
        isExpanded={false}
      />,
    )

    const collapsedButton = screen.getByRole('button', {
      name: 'Смотреть все',
    })
    const collapsedChevron = container.querySelector('svg')

    expect(collapsedButton).toHaveAttribute('aria-expanded', 'false')
    expect(collapsedChevron).toHaveClass(styles.chevron)
    expect(collapsedChevron).not.toHaveClass(styles.chevronExpanded)

    rerender(
      <SectionHeader title="Популярное" showViewAllButton viewAllLabel="Свернуть" isExpanded />,
    )

    const expandedButton = screen.getByRole('button', {
      name: 'Свернуть',
    })
    const expandedChevron = container.querySelector('svg')

    expect(expandedButton).toHaveAttribute('aria-expanded', 'true')
    expect(expandedChevron).toHaveClass(styles.chevron, styles.chevronExpanded)
  })
})
