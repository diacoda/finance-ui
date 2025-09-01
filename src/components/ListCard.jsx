import Card from "./Card";

export default function ListCard({ title, items }) {
  return (
    <Card title={title}>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="p-1 rounded hover:bg-gray-50">
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
