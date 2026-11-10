export default function CSVExport({ employees }) {
  const handleExport = () => {
    const headers = ["ID", "Name", "Email", "Department", "Role", "Status", "Salary", "Join Date"];
    const rows = employees.map(e => [
      e.id, `"${e.name}"`, e.email, e.department, `"${e.role}"`, e.status, e.salary, e.joinDate
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_directory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
    >
      📥 Export CSV
    </button>
  );
}