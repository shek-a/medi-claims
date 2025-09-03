"use client";

import React from 'react'

export type FilterValues = {
  hospital?: string[]
  status?: string[]
  claim_type?: string[]
  episode_id?: number
}

export type FilterPanelProps = {
  value: FilterValues
  onChange: (next: FilterValues) => void
}

export default function FilterPanel({ value, onChange }: FilterPanelProps) {
  const update = (patch: Partial<FilterValues>) => onChange({ ...value, ...patch })

  return (
    <aside>
      <fieldset aria-label="Provider Filters" className="mb-3">
        <label className="mr-2" htmlFor="hospital">Hospital</label>
        <select id="hospital" aria-label="Hospital" className="border rounded px-2 py-1"
          onChange={(e) => update({ hospital: [(e.target as HTMLSelectElement).value] })}
        >
          <option value="">All</option>
          <option value="Calvary">Calvary</option>
          <option value="SJOG">SJOG</option>
        </select>
      </fieldset>

      <fieldset aria-label="Process Filters" className="mb-3">
        <label className="mr-2" htmlFor="claim-status">Claim Status</label>
        <select id="claim-status" aria-label="Claim Status" className="border rounded px-2 py-1"
          onChange={(e) => update({ status: [(e.target as HTMLSelectElement).value] })}
        >
          <option value="Verified">Verified</option>
          <option value="Paid">Paid</option>
        </select>
      </fieldset>

      <fieldset aria-label="Episode Filters" className="mb-3">
        <label className="mr-2" htmlFor="episode-id">Episode ID</label>
        <input id="episode-id" aria-label="Episode ID" className="border rounded px-2 py-1"
          onChange={(e) => update({ episode_id: Number((e.target as HTMLInputElement).value) })}
        />
      </fieldset>
    </aside>
  )
}


