import { Equipment } from "@/data/equipment";

interface EquipmentListProps {
  equipment: Equipment[];
}

export default function EquipmentList({ equipment }: EquipmentListProps) {
  const essential = equipment.filter((e) => e.essential);
  const optional = equipment.filter((e) => !e.essential);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-bold mb-4">装备建议</h3>
      {essential.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">必备装备</h4>
          <ul className="space-y-2">
            {essential.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-gray-900 font-medium">{item.name}</span>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {optional.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">可选装备</h4>
          <ul className="space-y-2">
            {optional.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div>
                  <span className="text-gray-900">{item.name}</span>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
