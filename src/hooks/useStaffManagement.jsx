import { useCallback, useMemo, useState } from 'react'

const staffSeed = [
  {
    id: 1,
    name: 'Rahim Uddin',
    email: 'rahim.staff@rassporium.com',
    phone: '+8801711000001',
    position: 'Head Chef',
    salary: 42000,
    status: 'active',
    joinedAt: '2025-01-15',
  },
  {
    id: 2,
    name: 'Nusrat Jahan',
    email: 'nusrat.staff@rassporium.com',
    phone: '+8801711000002',
    position: 'Cashier',
    salary: 26000,
    status: 'active',
    joinedAt: '2025-03-02',
  },
  {
    id: 3,
    name: 'Tanvir Ahmed',
    email: 'tanvir.staff@rassporium.com',
    phone: '+8801711000003',
    position: 'Kitchen Assistant',
    salary: 22000,
    status: 'active',
    joinedAt: '2025-05-20',
  },
  {
    id: 4,
    name: 'Sadia Islam',
    email: 'sadia.staff@rassporium.com',
    phone: '+8801711000004',
    position: 'Server',
    salary: 20000,
    status: 'inactive',
    joinedAt: '2024-11-08',
  },
]

const attendanceSeed = [
  {
    id: 91,
    staffId: 1,
    staffName: 'Rahim Uddin',
    date: '2026-04-29',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'approved',
    approvedAt: '2026-04-29T14:00:00.000Z',
  },
  {
    id: 92,
    staffId: 1,
    staffName: 'Rahim Uddin',
    date: '2026-04-30',
    checkIn: '09:05',
    checkOut: '18:10',
    status: 'approved',
    approvedAt: '2026-04-30T14:00:00.000Z',
  },
  {
    id: 93,
    staffId: 2,
    staffName: 'Nusrat Jahan',
    date: '2026-04-30',
    checkIn: '10:00',
    checkOut: '19:00',
    status: 'approved',
    approvedAt: '2026-04-30T14:00:00.000Z',
  },
  {
    id: 94,
    staffId: 3,
    staffName: 'Tanvir Ahmed',
    date: '2026-05-01',
    checkIn: '08:58',
    checkOut: '17:40',
    status: 'approved',
    approvedAt: '2026-05-01T14:00:00.000Z',
  },
  {
    id: 101,
    staffId: 1,
    staffName: 'Rahim Uddin',
    date: '2026-05-03',
    checkIn: '09:02',
    checkOut: '18:08',
    status: 'pending',
  },
  {
    id: 102,
    staffId: 2,
    staffName: 'Nusrat Jahan',
    date: '2026-05-03',
    checkIn: '10:00',
    checkOut: '19:04',
    status: 'pending',
  },
  {
    id: 103,
    staffId: 3,
    staffName: 'Tanvir Ahmed',
    date: '2026-05-02',
    checkIn: '08:55',
    checkOut: '17:35',
    status: 'pending',
  },
]

export default function useStaffManagement() {
  const [attendance, setAttendance] = useState(attendanceSeed)
  const [loading, setLoading] = useState(false)
  const [error] = useState('')

  const staff = useMemo(
    () =>
      staffSeed.map((person) => {
        const approvedDates = new Set(
          attendance
            .filter((item) => item.staffId === person.id && item.status === 'approved')
            .map((item) => item.date)
        )

        return {
          ...person,
          workingDays: approvedDates.size,
          lastWorkedDate: [...approvedDates].sort().at(-1) || null,
        }
      }),
    [attendance]
  )

  const pendingAttendance = useMemo(
    () => attendance.filter((item) => item.status === 'pending'),
    [attendance]
  )
  const approvedAttendance = useMemo(
    () => attendance.filter((item) => item.status === 'approved'),
    [attendance]
  )

  const refetch = useCallback(() => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 300)
  }, [])

  const approveAttendance = async (attendanceId) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.id === attendanceId
          ? { ...item, status: 'approved', approvedAt: new Date().toISOString() }
          : item
      )
    )
  }

  return { staff, pendingAttendance, approvedAttendance, loading, error, refetch, approveAttendance }
}
