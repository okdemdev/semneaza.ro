import { DocumentTextIcon, FolderIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  totalDocuments: number;
  signedDocuments: number;
  totalFolders: number;
}

export default function DashboardStats({
  totalDocuments,
  signedDocuments,
  totalFolders,
}: DashboardStatsProps) {
  const stats = [
    {
      name: 'Total documente',
      value: totalDocuments,
      icon: DocumentTextIcon,
    },
    {
      name: 'Documente semnate',
      value: signedDocuments,
      icon: CheckCircleIcon,
    },
    {
      name: 'Foldere',
      value: totalFolders,
      icon: FolderIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
        >
          <dt>
            <div className="absolute rounded-md bg-blue-500 p-3">
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
          </dt>
          <dd className="ml-16">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </dd>
        </div>
      ))}
    </div>
  );
}
