import { Users, Heart, Map as MapIcon } from 'lucide-react';

export function BusinessDashboard() {
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black mb-8 text-zelda-dark drop-shadow-md">
        Кабинет Владельца
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="diorama-card p-6 flex flex-col items-center text-center gap-2">
          <Users className="w-12 h-12 text-zelda-blue" />
          <span className="text-5xl font-black">142</span>
          <span className="font-bold text-gray-600">Гостей в маршрутах</span>
        </div>
        <div className="diorama-card p-6 flex flex-col items-center text-center gap-2">
          <Heart className="w-12 h-12 text-red-500 fill-current" />
          <span className="text-5xl font-black">89</span>
          <span className="font-bold text-gray-600">Добавили в избранное</span>
        </div>
        <div className="diorama-card p-6 flex flex-col items-center text-center gap-2">
          <MapIcon className="w-12 h-12 text-zelda-green" />
          <span className="text-5xl font-black">12</span>
          <span className="font-bold text-gray-600">Сгенерировано маршрутов</span>
        </div>
      </div>
      <div className="diorama-card p-8">
        <h2 className="text-2xl font-black mb-6">Управление</h2>
        <button className="zelda-btn py-4 px-8 text-lg">
          Добавить спецпредложение
        </button>
      </div>
    </div>
  );
}
