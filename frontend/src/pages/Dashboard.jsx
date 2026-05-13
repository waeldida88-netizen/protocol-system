import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E293B] mb-6">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-r-4 border-amber-500">
          <h3 className="text-gray-500">{t('events')}</h3>
          <p className="text-3xl font-bold text-[#1E293B]">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-r-4 border-blue-500">
          <h3 className="text-gray-500">{t('guests')}</h3>
          <p className="text-3xl font-bold text-[#1E293B]">120</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-r-4 border-green-500">
          <h3 className="text-gray-500">{t('team')}</h3>
          <p className="text-3xl font-bold text-[#1E293B]">8</p>
        </div>
      </div>
    </div>
  );
}