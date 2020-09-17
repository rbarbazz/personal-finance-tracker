import React from 'react'

import './SectionHeader.scss'

export const SectionHeader: React.FC<{
  subtitle: string
  title: string
}> = ({ subtitle, title }) => (
  <div className="section-header">
    <h2 className="section-title">{title}</h2>
    <p className="section-subtitle">{subtitle}</p>
  </div>
)
