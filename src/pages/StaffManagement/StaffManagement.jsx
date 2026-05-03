import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { FaCheck, FaSyncAlt, FaUsers } from 'react-icons/fa'
import useStaffManagement from '../../hooks/useStaffManagement'

const StaffManagement = () => {
  const { staff, pendingAttendance, loading, error, refetch, approveAttendance } = useStaffManagement()
  const [approvingId, setApprovingId] = useState(null)

  useEffect(() => {
    document.title = 'Rassporium | Staff Management'
  }, [])

  const handleApprove = async (attendance) => {
    const result = await Swal.fire({
      title: 'Approve attendance?',
      text: `${attendance.staffName} on ${attendance.date}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
    })

    if (!result.isConfirmed) return

    try {
      setApprovingId(attendance.id)
      await approveAttendance(attendance.id)
      Swal.fire({
        title: 'Approved',
        text: 'Attendance has been approved.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (err) {
      Swal.fire({
        title: 'Approval failed',
        text: err.message || 'Could not approve attendance.',
        icon: 'error',
      })
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div className="p-6">
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-sm text-gray-400">View staff records and approve pending attendance</p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={refetch}
        >
          <FaSyncAlt />
          Refresh
        </button>
      </header>

      {loading && (
        <div className="alert alert-info mb-4">
          <span>Loading staff records...</span>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-slate-900 p-4 text-slate-100">
          <p className="text-sm text-slate-400">Total Staff</p>
          <p className="mt-2 text-3xl font-bold">{staff.length}</p>
        </div>
        <div className="rounded border bg-slate-900 p-4 text-slate-100">
          <p className="text-sm text-slate-400">Active Staff</p>
          <p className="mt-2 text-3xl font-bold text-cyan-300">
            {staff.filter((person) => person.status === 'active').length}
          </p>
        </div>
        <div className="rounded border bg-slate-900 p-4 text-slate-100">
          <p className="text-sm text-slate-400">Pending Attendance</p>
          <p className="mt-2 text-3xl font-bold text-yellow-300">{pendingAttendance.length}</p>
        </div>
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <FaUsers />
          <h3 className="text-lg font-semibold">Staff Records</h3>
        </div>
        <div className="overflow-auto rounded border">
          <table className="min-w-full text-left">
            <thead className="bg-slate-800 text-slate-200">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Salary</th>
                <th className="px-4 py-2">Working Days</th>
                <th className="px-4 py-2">Last Worked</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {!loading && staff.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan="8">
                    No staff records found.
                  </td>
                </tr>
              )}
              {staff.map((person) => (
                <tr key={person.id} className="odd:bg-slate-900 even:bg-slate-800/40 text-slate-100">
                  <td className="px-4 py-3 font-semibold">{person.name}</td>
                  <td className="px-4 py-3 text-sm">{person.email}</td>
                  <td className="px-4 py-3 text-sm">{person.phone || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{person.position || 'Staff'}</td>
                  <td className="px-4 py-3 text-sm">{person.salary}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{person.workingDays}</td>
                  <td className="px-4 py-3 text-sm">{person.lastWorkedDate || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge border-0 ${person.status === 'active' ? 'bg-cyan-900 text-cyan-100' : 'bg-slate-700 text-slate-200'}`}>
                      {person.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Pending Attendance Approval</h3>
        <div className="overflow-auto rounded border">
          <table className="min-w-full text-left">
            <thead className="bg-slate-800 text-slate-200">
              <tr>
                <th className="px-4 py-2">Staff</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Check In</th>
                <th className="px-4 py-2">Check Out</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && pendingAttendance.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan="6">
                    No pending attendance.
                  </td>
                </tr>
              )}
              {pendingAttendance.map((attendance) => (
                <tr key={attendance.id} className="odd:bg-slate-900 even:bg-slate-800/40 text-slate-100">
                  <td className="px-4 py-3 font-semibold">{attendance.staffName}</td>
                  <td className="px-4 py-3 text-sm">{attendance.date}</td>
                  <td className="px-4 py-3 text-sm">{attendance.checkIn || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{attendance.checkOut || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className="badge border-0 bg-yellow-900 text-yellow-100">{attendance.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      disabled={approvingId === attendance.id}
                      onClick={() => handleApprove(attendance)}
                    >
                      <FaCheck />
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default StaffManagement
