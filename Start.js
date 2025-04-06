(function() {
    "use strict";
    
    // Инициализация для телевизионных платформ
    Lampa.Platform.tv();
    
    // Инициализация модуля TMDB, если он ещё не создан
    Lampa.TMDB = Lampa.TMDB || {};
    
    // Функция для формирования URL для запросов к TMDB API через прокси-сервер
    Lampa.TMDB.api = function(query) {
        var formattedQuery = Lampa.Utils.addUrlComponent(query);
        if (Lampa.Storage.get("tmdb_proxy")) {
            return "http://212.113.103.137:9118/proxy" + formattedQuery;
        }
        return formattedQuery;
    };
    
    // Функция для формирования URL для получения изображений TMDB через прокси-сервер
    Lampa.TMDB.image = function(path) {
        var url = Lampa.Utils.addUrlComponent(path);
        if (Lampa.Storage.get("tmdb_proxy")) {
            return "http://212.113.103.137:9118/proxyimg/" + Lampa.Utils.addUrlComponent(url);
        }
        return url;
    };
    
    // Функция обновления параметра "source" – если в DOM есть элементы с классом "proxy",
    // обновляется значение "source" в хранилище (это необходимо для корректного формирования URL постеров)
    function updateSource() {
        var proxyElements = document.getElementsByClassName("proxy");
        var source = Lampa.Storage.get("source");
        if (proxyElements.length > 0) {
            Lampa.Storage.set("source", source);
        }
    }
    
    // Создаём MutationObserver для отслеживания изменений в DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "childList") {
                updateSource();
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Отключаем DMCA-защиту: если в настройках приложения включена опция dcma, периодически сбрасываем её в false
    setInterval(function() {
        if (window.lampa_settings && window.lampa_settings.dcma) {
            window.lampa_settings.dcma = false;
        }
    }, 100);
    
    // Здесь можно добавить дополнительные переопределения и настройки, если это необходимо
})();
