'use client';

import CategoryIcon from '@/components/icons/CategoryIcon';

export default function CategoryCard({ category }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
      {category.image && (
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}
      <h3 className="text-lg font-semibold">{category.name}</h3>
      <p className="text-sm text-gray-600">{category.description}</p>
    </div>
  );
}