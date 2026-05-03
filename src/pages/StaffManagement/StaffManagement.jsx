import React, { useEffect } from 'react'
import Swal from 'sweetalert2'
import { FaCheck, FaSyncAlt, FaUsers } from 'react-icons/fa'
import useStaffManagement from '../../hooks/useStaffManagement'

const StaffManagement = () => {
  const {
    staff,
    pendingAttendance,
    loading,
    error,
    refetch,
    approveAttendance,
  } = useStaffManagement()

  useEffect(() => {
    document.title = 'Rassporium | Staff Management'
  }, [])

  const handleApprove = async (attendance) => {
    const result = await Swal.fire({
      title: 'Approve attendance?',
      text: `${attendance.staffName} • ${attendance.date}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
    })

    if (!result.isConfirmed) return

    await approveAttendance(attendance.id)

    Swal.fire({
      title: 'Approved',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false,
    })
  }

  const StatCard = ({ title, value, hint, color }) => (
    <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )

  const Badge = ({ children, type }) => {
    const map = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-600',
      pending: 'bg-yellow-100 text-yellow-700',
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${map[type] || map.inactive}`}
      >
        {children}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Staff Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage employees, track attendance, and approve work logs
          </p>
        </div>

        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <FaSyncAlt />
          Refresh Data
        </button>

      </div>

      {/* LOADING / ERROR */}
      {loading && (
        <div className="bg-blue-50 border text-blue-700 p-3 rounded-lg mb-4 text-sm">
          Loading staff and attendance records...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <StatCard
          title="Total Employees"
          value={staff.length}
          hint="All registered staff"
          color="text-gray-800"
        />

        <StatCard
          title="Active Employees"
          value={staff.filter((s) => s.status === 'active').length}
          hint="Currently working"
          color="text-green-600"
        />

        <StatCard
          title="Pending Attendance"
          value={pendingAttendance.length}
          hint="Needs approval"
          color="text-amber-600"
        />

      </div>

      {/* STAFF TABLE */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-10">

        <div className="px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <FaUsers className="text-gray-600" />
            <h2 className="font-semibold text-gray-700">
              Employee Directory
            </h2>
          </div>
        </div>

        <div className="overflow-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Salary</th>
                <th className="p-3 text-left">Work Days</th>
                <th className="p-3 text-left">Last Active</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {staff.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No staff records found
                  </td>
                </tr>
              )}

              {staff.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">

                  <td className="p-3">
                    <p className="font-semibold text-gray-800">{person.name}</p>
                    <p className="text-xs text-gray-400">ID: {person.id}</p>
                  </td>

                  <td className="p-3 text-gray-600">
                    <p>{person.email}</p>
                    <p className="text-xs">{person.phone || 'Not provided'}</p>
                  </td>

                  <td className="p-3 text-gray-700">
                    {person.position || 'Staff'}
                  </td>

                  <td className="p-3 font-medium text-gray-800">
                    ৳ {person.salary}
                  </td>

                  <td className="p-3 font-semibold text-gray-700">
                    {person.workingDays} days
                  </td>

                  <td className="p-3 text-gray-500 text-sm">
                    {person.lastWorkedDate || 'N/A'}
                  </td>

                  <td className="p-3">
                    <Badge type={person.status}>
                      {person.status}
                    </Badge>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* ATTENDANCE TABLE */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-gray-700">
            Pending Attendance Approvals
          </h2>
        </div>

        <div className="overflow-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Check-in</th>
                <th className="p-3 text-left">Check-out</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {pendingAttendance.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No pending approvals
                  </td>
                </tr>
              )}

              {pendingAttendance.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">

                  <td className="p-3 font-semibold text-gray-800">
                    {a.staffName}
                  </td>

                  <td className="p-3 text-gray-600">{a.date}</td>
                  <td className="p-3 text-gray-600">{a.checkIn || '-'}</td>
                  <td className="p-3 text-gray-600">{a.checkOut || '-'}</td>

                  <td className="p-3">
                    <Badge type="pending">{a.status}</Badge>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleApprove(a)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
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
      </div>

    </div>
  )
}

export default StaffManagement