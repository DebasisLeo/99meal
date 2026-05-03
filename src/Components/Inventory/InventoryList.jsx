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

  const setField = (field) => (e) =>
    setDraft((prev) => ({ ...prev, [field]: e.target.value }))

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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Raw Ingredients
          </h3>
          <p className="text-sm text-gray-500">
            Manage stock levels and inventory status
          </p>
        </div>

        <button
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Close' : '+ Add Ingredient'}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-4 gap-4">

              <input
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={draft.name}
                onChange={setField('name')}
                placeholder="Ingredient name"
              />

              <input
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={draft.unit}
                onChange={setField('unit')}
                placeholder="Unit (kg, gm, pcs)"
              />

              <input
                type="number"
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={draft.stock}
                onChange={setField('stock')}
                placeholder="Stock"
              />

              <input
                type="number"
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={draft.min}
                onChange={setField('min')}
                placeholder="Min stock"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Save
              </button>

              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setDraft(initialDraft)}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STATES */}
      {loading && (
        <p className="text-gray-500 text-sm">Loading inventory...</p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200">

        {/* HEADER */}
        <div className="grid grid-cols-6 bg-gray-100 text-gray-600 text-sm font-semibold p-3">
          <div>Name</div>
          <div>Unit</div>
          <div>Stock</div>
          <div>Min</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* ROWS */}
        <div className="divide-y">

          {items.map((it) => {

            const status =
              it.stock <= 0
                ? { label: 'Out', color: 'bg-red-100 text-red-700' }
                : it.stock < it.min
                ? { label: 'Low', color: 'bg-yellow-100 text-yellow-700' }
                : { label: 'OK', color: 'bg-green-100 text-green-700' }

            return (
              <div
                key={it.id}
                className="grid grid-cols-6 items-center p-3 hover:bg-gray-50 transition text-sm text-gray-700"
              >

                <div className="font-medium text-gray-900">{it.name}</div>
                <div>{it.unit}</div>
                <div>{it.stock}</div>
                <div>{it.min}</div>

                {/* STATUS */}
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2">

                  <button
                    className="w-8 h-8 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                    onClick={() => onAdjust(it.id, -1)}
                  >
                    -
                  </button>

                  <button
                    className="w-8 h-8 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                    onClick={() => onAdjust(it.id, 1)}
                  >
                    +
                  </button>

                  <button
                    className="w-8 h-8 rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                    onClick={() => onDelete(it.id)}
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>

                </div>

              </div>
            )
          })}

        </div>
      </div>

      {/* LOW STOCK */}
      {lowStock.length > 0 && (
        <div className="mt-5 p-4 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
          ⚠ Low stock items: {lowStock.map((i) => i.name).join(', ')}
        </div>
      )}

    </div>
  )
}

export default InventoryList