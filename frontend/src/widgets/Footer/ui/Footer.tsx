export function Footer(){
    return(
              <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3D</span>
                </div>
                <span className="text-xl font-bold">3Devor.uz</span>
              </div>
              <p className="text-gray-400">
                Ведущая платформа недвижимости Узбекистана
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Новостройки</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Готовое жилье</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Коммерческая</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Города</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Ташкент</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Самарканд</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Бухара</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Все города</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+998 33 509 48 56</li>
                <li>info@3devor.uz</li>
                <li>Ташкент, ул. Амира Темура, 1</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 3Devor.uz. Все права защищены.</p>
          </div>
        </div>
      </footer>
    )
}