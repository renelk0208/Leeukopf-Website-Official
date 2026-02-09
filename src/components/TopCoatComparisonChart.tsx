import { Check, X } from 'lucide-react';

// Mapping for star ratings to visual representation
const StarRating = ({ count }: { count: number }) => {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-yellow-500">★</span>
      ))}
    </div>
  );
};

interface ProductColumn {
  code: string;
  name: string;
  type: 'Standard' | 'Effects';
}

const products: ProductColumn[] = [
  { code: 'TC001', name: 'TC001', type: 'Standard' },
  { code: 'TC002', name: 'TC002', type: 'Standard' },
  { code: 'TC003', name: 'TC003', type: 'Standard' },
  { code: 'TC004', name: 'TC004', type: 'Standard' },
  { code: 'VTC001/VTC002', name: 'VTC001/VTC002', type: 'Effects' },
  { code: 'VTC003', name: 'VTC003', type: 'Effects' },
];

interface ComparisonRow {
  category: string;
  testType: string;
  whenTested?: string;
  TC001: string | JSX.Element;
  TC002: string | JSX.Element;
  TC003: string | JSX.Element;
  TC004: string | JSX.Element;
  'VTC001/VTC002': string | JSX.Element;
  VTC003: string | JSX.Element;
}

const comparisonData: ComparisonRow[] = [
  // Products Appearance
  {
    category: 'Product Appearance',
    testType: 'Before curing',
    whenTested: 'Colloidal Transparency',
    TC001: 'Transparent',
    TC002: 'Transparent',
    TC003: 'Transparent',
    TC004: 'Transparent',
    'VTC001/VTC002': 'Slight yellow',
    VTC003: 'Pale purple',
  },
  {
    category: 'Product Appearance',
    testType: 'While curing',
    TC001: '-',
    TC002: '-',
    TC003: '-',
    TC004: 'Blue light',
    'VTC001/VTC002': '-',
    VTC003: '-',
  },
  {
    category: 'Product Appearance',
    testType: 'After curing',
    TC001: 'Glossy-Transparent',
    TC002: 'Glossy-Transparent',
    TC003: 'Glossy-Transparent',
    TC004: 'Glossy-Transparent',
    'VTC001/VTC002': 'Matte-Slight Yellow',
    VTC003: 'Matte-Transparent',
  },
  {
    category: 'Product Appearance',
    testType: 'Smell',
    TC001: 'Acceptable',
    TC002: 'Acceptable',
    TC003: 'Acceptable',
    TC004: 'Acceptable',
    'VTC001/VTC002': 'Acceptable',
    VTC003: 'Little',
  },
  {
    category: 'Product Appearance',
    testType: 'Visual inspection - Consistency',
    TC001: <StarRating count={3} />,
    TC002: <StarRating count={3} />,
    TC003: <StarRating count={4} />,
    TC004: <StarRating count={4} />,
    'VTC001/VTC002': <StarRating count={3} />,
    VTC003: <StarRating count={2} />,
  },
  // Product Features
  {
    category: 'Product Features',
    testType: 'Brightness',
    TC001: <StarRating count={4} />,
    TC002: <StarRating count={3} />,
    TC003: <StarRating count={3} />,
    TC004: <StarRating count={4} />,
    'VTC001/VTC002': 'Matte Velvet',
    VTC003: 'Matte Velvet',
  },
  {
    category: 'Product Features',
    testType: 'Yellowing',
    TC001: 'No',
    TC002: 'No',
    TC003: 'No',
    TC004: 'No',
    'VTC001/VTC002': 'Little',
    VTC003: 'No',
  },
  {
    category: 'Product Features',
    testType: 'Abrasion resistance',
    TC001: <StarRating count={3} />,
    TC002: <StarRating count={3} />,
    TC003: <StarRating count={4} />,
    TC004: <StarRating count={4} />,
    'VTC001/VTC002': <StarRating count={3} />,
    VTC003: <StarRating count={4} />,
  },
  {
    category: 'Product Features',
    testType: 'Oil resistance',
    TC001: <StarRating count={3} />,
    TC002: <StarRating count={3} />,
    TC003: <StarRating count={4} />,
    TC004: <StarRating count={4} />,
    'VTC001/VTC002': <StarRating count={1} />,
    VTC003: <StarRating count={2} />,
  },
  {
    category: 'Product Features',
    testType: 'Durability (Nail Test)',
    TC001: <StarRating count={3} />,
    TC002: <StarRating count={3} />,
    TC003: <StarRating count={2} />,
    TC004: <StarRating count={4} />,
    'VTC001/VTC002': <StarRating count={4} />,
    VTC003: <StarRating count={5} />,
  },
  {
    category: 'Product Features',
    testType: 'Hardness (PVC Testing)',
    TC001: <StarRating count={2} />,
    TC002: <StarRating count={3} />,
    TC003: <StarRating count={4} />,
    TC004: <StarRating count={1} />,
    'VTC001/VTC002': <StarRating count={1} />,
    VTC003: 'no',
  },
  // Product Usage Performance
  {
    category: 'Product Usage',
    testType: 'Burn while curing',
    TC001: 'No',
    TC002: 'No',
    TC003: 'No',
    TC004: 'No',
    'VTC001/VTC002': <StarRating count={3} />,
    VTC003: <StarRating count={3} />,
  },
  {
    category: 'Product Usage',
    testType: 'Duration',
    TC001: '25-30 days',
    TC002: '25-30 days',
    TC003: '25-30 days',
    TC004: '25-30 days',
    'VTC001/VTC002': '25-30 days',
    VTC003: '25-30 days',
  },
];

export default function TopCoatComparisonChart() {
  const standardProducts = products.filter(p => p.type === 'Standard');
  const effectsProducts = products.filter(p => p.type === 'Effects');

  const renderCellValue = (value: string | JSX.Element) => {
    if (typeof value === 'string') {
      if (value === '-') {
        return <span className="text-gray-300">-</span>;
      }
      if (value.toLowerCase() === 'no') {
        return <X className="w-4 h-4 text-gray-300 mx-auto" />;
      }
      return <span className="text-xs text-gray-700 text-center block">{value}</span>;
    }
    return value;
  };

  return (
    <div className="mb-10 sm:mb-12 md:mb-16">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
        Top Coat Comparison
      </h2>

      {/* Desktop/Tablet View - Horizontal Scrolling Table */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10 min-w-[140px]">
                  Test Type
                </th>
                {products.map((product) => (
                  <th
                    key={product.code}
                    className="text-center py-3 px-3 font-semibold text-gray-900 min-w-[100px]"
                  >
                    <div className="text-sm">{product.name}</div>
                    <div className="text-xs font-normal text-gray-500 mt-1">
                      {product.type}
                    </div>
                  </th>
                ))}
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
                  <td className="py-3 px-4 text-xs text-gray-700 font-medium sticky left-0 bg-inherit">
                    {row.testType}
                    {row.whenTested && (
                      <div className="text-xs text-gray-500 font-normal mt-0.5">
                        {row.whenTested}
                      </div>
                    )}
                  </td>
                  {products.map((product) => (
                    <td key={product.code} className="py-3 px-3 text-center">
                      {renderCellValue(row[product.code as keyof ComparisonRow] as string | JSX.Element)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Accordion Style */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product.code} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{product.type} Top Coat</p>
            </div>
            <div className="divide-y divide-gray-100">
              {comparisonData.map((row, index) => (
                <div key={index} className="px-4 py-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    {row.testType}
                    {row.whenTested && (
                      <span className="text-gray-500 font-normal ml-1">({row.whenTested})</span>
                    )}
                  </div>
                  <div className="text-sm">
                    {renderCellValue(row[product.code as keyof ComparisonRow] as string | JSX.Element)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">★</span>
          <span className="font-light">Rating scale (1-5 stars, higher is better)</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="w-3 h-3 text-gray-300" />
          <span className="font-light">Not applicable / No</span>
        </div>
      </div>
    </div>
  );
}
