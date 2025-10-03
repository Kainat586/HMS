"use client";

import { useState, useEffect } from "react";
import { FaUsers, FaUserMd, FaCalendarAlt, FaChartLine, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    activeDoctors: 0,
    assignedPatients: 0,
    unassignedPatients: 0
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls - replace with actual API endpoints
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockStats = {
        totalDoctors: 25,
        totalPatients: 150,
        totalAppointments: 89,
        pendingAppointments: 12,
        approvedAppointments: 45,
        completedAppointments: 28,
        cancelledAppointments: 4,
        activeDoctors: 22,
        assignedPatients: 135,
        unassignedPatients: 15
      };

      const mockAppointments = [
        {
          id: 1,
          patientName: "John Smith",
          doctorName: "Dr. Sarah Johnson",
          date: "2024-01-25",
          time: "10:00 AM",
          status: "pending",
          reason: "Regular checkup"
        },
        {
          id: 2,
          patientName: "Emily Davis",
          doctorName: "Dr. Michael Chen",
          date: "2024-01-25",
          time: "2:30 PM",
          status: "approved",
          reason: "Follow-up consultation"
        },
        {
          id: 3,
          patientName: "Robert Wilson",
          doctorName: "Dr. Sarah Johnson",
          date: "2024-01-26",
          time: "9:15 AM",
          status: "completed",
          reason: "Blood pressure check"
        }
      ];

      const mockPatients = [
        {
          id: 1,
          name: "Alice Johnson",
          email: "alice@email.com",
          phone: "+1-555-0123",
          assignedDoctor: "Dr. Sarah Johnson",
          lastVisit: "2024-01-20"
        },
        {
          id: 2,
          name: "Mark Thompson",
          email: "mark@email.com",
          phone: "+1-555-0124",
          assignedDoctor: null,
          lastVisit: "2024-01-18"
        }
      ];

      setStats(mockStats);
      setRecentAppointments(mockAppointments);
      setRecentPatients(mockPatients);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.positive ? '↗' : '↘'} {trend.value}%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`h-16 w-16 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your hospital.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
            <FaUserMd className="h-4 w-4" />
            Add Doctor
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
            <FaUsers className="h-4 w-4" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={FaUserMd}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={{ value: 12, positive: true }}
          subtitle={`${stats.activeDoctors} active`}
        />
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={FaUsers}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          trend={{ value: 8, positive: true }}
          subtitle={`${stats.assignedPatients} assigned`}
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={FaCalendarAlt}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={{ value: 15, positive: true }}
          subtitle="This month"
        />
        <StatCard
          title="Hospital Activity"
          value={`${Math.round((stats.approvedAppointments / stats.totalAppointments) * 100)}%`}
          icon={FaChartLine}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          subtitle="Approval rate"
        />
      </div>

      {/* Appointment Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Appointments"
          value={stats.pendingAppointments}
          icon={FaClock}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Approved Appointments"
          value={stats.approvedAppointments}
          icon={FaCheckCircle}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Completed Appointments"
          value={stats.completedAppointments}
          icon={FaCheckCircle}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Unassigned Patients"
          value={stats.unassignedPatients}
          icon={FaExclamationTriangle}
          color="bg-gradient-to-r from-red-500 to-red-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Recent Appointments</h3>
                <p className="text-gray-600 text-sm">Latest appointment requests and updates</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full flex items-center justify-center">
                        <FaCalendarAlt className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                        <p className="text-xs text-gray-500">
                          {appointment.date} at {appointment.time} • {appointment.reason}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaCalendarAlt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No appointments found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Management Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Quick Management</h3>
            <p className="text-gray-600 text-sm">Common administrative tasks and system overview</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaUserMd className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Manage Doctors</p>
                      <p className="text-sm text-gray-600">Add, edit, or remove doctors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{stats.totalDoctors}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaUsers className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-gray-900">Manage Patients</p>
                      <p className="text-sm text-gray-600">View and edit patient records</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">{stats.totalPatients}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaUsers className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Assign Doctors</p>
                      <p className="text-sm text-gray-600">Assign patients to doctors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">{stats.unassignedPatients}</p>
                    <p className="text-xs text-gray-500">Unassigned</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Review Appointments</p>
                      <p className="text-sm text-gray-600">Approve or manage appointments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{stats.pendingAppointments}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">System Health Overview</h3>
          <p className="text-gray-600 text-sm">Key metrics and system status indicators</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round((stats.activeDoctors / stats.totalDoctors) * 100)}%
              </div>
              <p className="text-sm text-gray-700 font-medium">Active Doctors</p>
              <p className="text-xs text-gray-500">{stats.activeDoctors} of {stats.totalDoctors}</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.round((stats.assignedPatients / stats.totalPatients) * 100)}%
              </div>
              <p className="text-sm text-gray-700 font-medium">Assigned Patients</p>
              <p className="text-xs text-gray-500">{stats.assignedPatients} of {stats.totalPatients}</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {Math.round((stats.pendingAppointments / stats.totalAppointments) * 100)}%
              </div>
              <p className="text-sm text-gray-700 font-medium">Pending Approval</p>
              <p className="text-xs text-gray-500">{stats.pendingAppointments} appointments</p>
            </div>
            
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {Math.round((stats.completedAppointments / stats.totalAppointments) * 100)}%
              </div>
              <p className="text-sm text-gray-700 font-medium">Completed</p>
              <p className="text-xs text-gray-500">{stats.completedAppointments} appointments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}