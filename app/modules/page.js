export default async function ModulesPage() {
  const res = await fetch(`http://localhost:3000/api/modules`, {
    cache: "no-store",
  });
  const data = await res.json();

  if (!data.success) {
    return <div>Error: {data.error}</div>;
  }

  return (
    <div>
      <h1>Modules</h1>
      <ul>
        {data.modules.map((module) => (
          <li key={module.id}>
            <strong>{module.name}</strong> - {module.language} (Added on:{" "}
            {new Date(module.addedOn).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
