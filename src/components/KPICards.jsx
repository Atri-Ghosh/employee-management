export default function KPICards({ employees }) {
  const total = employees.length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const totalSalary = employees.reduce((acc, curr) => acc + Number(curr.salary), 0);
  const avgSalary = total ? Math.round(totalSalary / total) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <p className="text-sm text-gray-500 font-medium">Total Employees</p>
        <h3 className="text-2xl font-bold text-gray-800">{total}</h3>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <p className="text-sm text-gray-500 font-medium">Active Staff</p>
        <h3 className="text-2xl font-bold text-green-600">{activeCount}</h3>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <p className="text-sm text-gray-500 font-medium">Average Salary</p>
        <h3 className="text-2xl font-bold text-blue-600">₹{avgSalary.toLocaleString()}</h3>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <p className="text-sm text-gray-500 font-medium">Departments</p>
        <h3 className="text-2xl font-bold text-purple-600">
          {new Set(employees.map(e => e.department)).size}
        </h3>
      </div>
    </div>
  );
}