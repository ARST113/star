Lampa.Platform.tv();

(function () {
    'use strict';

    // Стили для адаптивного отображения кнопок
    const style = document.createElement('style');
    style.innerHTML = `
        .full-start-new__buttons {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 6px !important;
            justify-content: flex-start;
        }

        .full-start-new__buttons .full-start__button {
            max-width: 180px;
            flex: 1 1 auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `;
    document.head.appendChild(style);

    console.log('[SorterPlugin] плагин загружен');

    function startPlugin() {
        try {
            if (Lampa.Storage.get('full_btn_priority') !== undefined) {
                Lampa.Storage.set('full_btn_priority', '{}');
            }

            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    setTimeout(function () {
                        try {
                            const fullContainer = e.object.activity.render();
                            const targetContainer = fullContainer.find('.full-start-new__buttons');
                            console.log('[SorterPlugin] Контейнер найден:', targetContainer);

                            const allButtons = fullContainer.find('.buttons--container .full-start__button')
                                .add(targetContainer.find('.full-start__button'));

                            function hasClass(el, name) {
                                return $(el).attr('class').toLowerCase().includes(name);
                            }

                            const cinema = allButtons.filter(function () { return hasClass(this, 'cinema'); });
                            const online = allButtons.filter(function () { return hasClass(this, 'online'); });
                            const torrent = allButtons.filter(function () { return hasClass(this, 'torrent'); });
                            const trailer = allButtons.filter(function () { return hasClass(this, 'trailer'); });
                            const rest = allButtons.not(cinema).not(online).not(torrent).not(trailer);

                            cinema.detach();
                            online.detach();
                            torrent.detach();
                            trailer.detach();
                            rest.detach();

                            const newOrder = []
                                .concat(cinema.get())
                                .concat(online.get())
                                .concat(torrent.get())
                                .concat(trailer.get())
                                .concat(rest.get());

                            targetContainer.empty();
                            newOrder.forEach(btn => targetContainer.append(btn));

                            // Удаляем встроенные трейлеры от Лампы по классу
                            fullContainer.find('.view--trailer').remove();

                            console.log('[SorterPlugin] Удалена оригинальная кнопка трейлера');

                            Lampa.Controller.toggle("full_start");
                            console.log('[SorterPlugin] Новый порядок кнопок применён');
                        } catch (err) {
                            console.error('[SorterPlugin] Ошибка сортировки:', err);
                        }
                    }, 100);
                }
            });

            if (typeof module !== 'undefined' && module.exports) {
                module.exports = {};
            }
        } catch (err) {
            console.error('[SorterPlugin] Ошибка инициализации плагина:', err);
        }
    }

    startPlugin();
})();
