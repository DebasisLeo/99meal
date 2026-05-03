import React, { useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'

const initialDraft = { name: '', unit: 'kg', stock: '0', min: '5' }

const InventoryList = ({
  items = [],
  lowStock = [],
  loading = false,
  error = '',
  onAdjust = () => {},
  onAdd = () => {},
  onDelete = () => {},
}) => {
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState(initialDraft)

  const setField = (field) => (e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({
      name: draft.name,
      unit: draft.unit,
      stock: Number(draft.stock),
      min: Number(draft.min),
    })
    setDraft(initialDraft)
    setShowForm(false)
  }

  return (
    <div className="inventory-list">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Raw ingredients</h3>
        <button className="btn btn-success btn-sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Close' : 'Add ingredient'}
        </button>
      </div>

      {showForm && (
        <div className="card bg-base-200 mb-4">
          <form onSubmit={handleSubmit} className="card-body gap-3">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ingredient</span>
                </label>
                <input
                  className="input input-bordered input-sm"
                  value={draft.name}
                  onChange={setField('name')}
                  placeholder="e.g. Fish"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Unit</span>
                </label>
                <input
                  className="input input-bordered input-sm"
                  value={draft.unit}
                  onChange={setField('unit')}
                  placeholder="kg, gm, pcs"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Stock</span>
                </label>
                <input
                  className="input input-bordered input-sm"
                  type="number"
                  min="0"
                  value={draft.stock}
                  onChange={setField('stock')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Min</span>
                </label>
                <input
                  className="input input-bordered input-sm"
                  type="number"
                  min="0"
                  value={draft.min}
                  onChange={setField('min')}
                />
              </div>

            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary btn-sm">
                Save
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDraft(initialDraft)}>
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-auto rounded border">
        <table className="min-w-full text-left">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Min</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan="6">
                  Loading inventory...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td className="px-4 py-6 text-center text-red-500" colSpan="6">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan="6">
                  No raw ingredients found.
                </td>
              </tr>
            )}

            {items.map((it) => (
              <tr key={it.id} className="odd:bg-slate-900 even:bg-slate-800/40 text-slate-100">
                <td className="px-4 py-3">{it.name}</td>
                <td className="px-4 py-3">{it.unit}</td>
                <td className="px-4 py-3">{it.stock}</td>
                <td className="px-4 py-3">{it.min}</td>
                <td className="px-4 py-3">{it.status}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => onAdjust(it.id, -1)}>
                      -
                    </button>
                    <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => onAdjust(it.id, 1)}>
                      +
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-square text-error"
                      onClick={() => onDelete(it.id)}
                      aria-label={`Delete ${it.name}`}
                      title="Delete"
                    >
                    <FaTrashAlt className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lowStock.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-900 rounded text-yellow-100">
          <strong>Low stock:</strong> {lowStock.map((i) => i.name).join(', ')}
        </div>
      )}
    </div>
  )
}

export default InventoryList
