import Card from "../components/Card";

export default function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-3 gap-6 md:grid-cols-1 md:gap-12">
      <Card title="Total Users" value="123" />
      <Card title="Games" value="58" />
      <Card title="Reviews" value="214" />
    </div>
  );
}

