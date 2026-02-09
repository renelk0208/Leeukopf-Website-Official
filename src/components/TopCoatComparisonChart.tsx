import { Check, X } from 'lucide-react';

interface ComparisonFeature {
  feature: string;
  standard: boolean | string;
  effects: boolean | string;
}

const comparisonData: ComparisonFeature[] = [
  { feature: 'High Gloss Finish', standard: true, effects: 'Varies by Effect' },
  { feature: 'Chip-Resistant Protection', standard: true, effects: true },
  { feature: 'HEMA-Free Formulation', standard: true, effects: true },
  { feature: 'TPO-Free Formulation', standard: true, effects: true },
  { feature: 'Non-Wipe Option Available', standard: true, effects: false },
  { feature: 'Wipe-Off Option Available', standard: true, effects: true },
  { feature: 'UV/LED Curing', standard: true, effects: true },
  { feature: 'Matte Finish', standard: false, effects: true },
  { feature: 'Shimmer/Glitter Effects', standard: false, effects: true },
  { feature: 'Textured Finishes', standard: false, effects: true },
  { feature: 'Ideal For Nail Art', standard: 'Good', effects: 'Excellent' },
  { feature: 'Fast Salon Service', standard: 'Excellent', effects: 'Good' },
];

export default function TopCoatComparisonChart() {
  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-sm text-gray-700 font-medium">{value}</span>;
  };

  return (
    <div className="mb-10 sm:mb-12 md:mb-16">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
        Top Coat Comparison
      </h2>
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 min-w-[200px]">
                  Feature
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900 w-[180px]">
                  Standard Top Coats
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900 w-[180px]">
                  Effects Top Coats
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-4 px-6 text-sm text-gray-700 font-light">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {renderCell(row.standard)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {renderCell(row.effects)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Standard Top Coats
          </h3>
          <div className="space-y-3">
            {comparisonData.map((row, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm text-gray-700 font-light flex-1">
                  {row.feature}
                </span>
                <div className="ml-4">
                  {renderCell(row.standard)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Effects Top Coats
          </h3>
          <div className="space-y-3">
            {comparisonData.map((row, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm text-gray-700 font-light flex-1">
                  {row.feature}
                </span>
                <div className="ml-4">
                  {renderCell(row.effects)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span className="font-light">Available/Yes</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="w-4 h-4 text-gray-300" />
          <span className="font-light">Not Available</span>
        </div>
      </div>
    </div>
  );
}
