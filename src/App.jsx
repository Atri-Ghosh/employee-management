import { useState, useEffect } from 'react';
import { INITIAL_EMPLOYEES } from './data/initialData';
import KPICards from './components/KPICards';
import CSVExport from './components/CSVExport';
import EmployeeModal from './components/EmployeeModal';

export default function App() {
  // 1. Initialize state by checking localStorage first, falling back to INITIAL_EMPLOYEES
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem('employee_management_data');
    if (savedEmployees) {
      try {
        return JSON.parse(savedEmployees);
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
    }
    return INITIAL_EMPLOYEES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // 2. Save to localStorage whenever the employees array changes
  useEffect(() => {
    localStorage.setItem('employee_management_data', JSON.stringify(employees));
  }, [employees]);

  // Derived filter state
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // CREATE / UPDATE Handler
  const handleSaveEmployee = (employeeData) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...employeeData, id: emp.id } : emp));
    } else {
      const newEmp = { ...employeeData, id: Date.now() };
      setEmployees([newEmp, ...employees]);
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  // DELETE Handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee record?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Employee Management System</h1>
            <p className="text-gray-500 text-sm mt-1">Manage organization personnel records, KPIs, and departments.</p>
          </div>
          <div className="flex items-center gap-3">
            <CSVExport employees={filteredEmployees} />
            <button 
              onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
              + Add Employee
            </button>
          </div>
        </div>

        {/* KPI Summary Stats */}
        <KPICards employees={employees} />

        {/* Filters & Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Department Filter Tags */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['All', 'Engineering', 'Design', 'HR', 'Marketing'].map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedDept === dept 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Table Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Salary</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{emp.name}</div>
                        <div className="text-xs text-gray-500">{emp.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium">
                          {emp.department}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700">{emp.role}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-900">₹{Number(emp.salary).toLocaleString()}</td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => { setEditingEmployee(emp); setIsModalOpen(true); }}
                          className="text-indigo-600 hover:text-indigo-900 text-xs font-semibold bg-indigo-50 px-2.5 py-1.5 rounded"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(emp.id)}
                          className="text-rose-600 hover:text-rose-900 text-xs font-semibold bg-rose-50 px-2.5 py-1.5 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400">
                      No matching employee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form Component */}
        {isModalOpen && (
          <EmployeeModal 
            employee={editingEmployee} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSaveEmployee} 
          />
        )}

      </div>
    </div>
  );
}