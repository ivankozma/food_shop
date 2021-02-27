window.addEventListener("DOMContentLoaded", () => {
// Tabs
    const tabs = document.querySelectorAll(".tabheader__item");   //выбираем все элементы с эти классом
    const tabsContent = document.querySelectorAll(".tabcontent");  //выбираем все элементы с этим классом
    const tabsParent = document.querySelector(".tabheader__items"); //выбираем элемент родитель для предыдущих



    function hideTabContent() {
        tabsContent.forEach(item => {                  //эта функция скрывает весь контент на сайте
            item.classList.add("hide");
            item.classList.remove("show", "fade");
            // item.style.display="none";                // инлайн прописаваем стиль display: none; это второй способ
        });

        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active");            //удаляем класс у tab. При этом "." 
                                                                       // у каласса не ставим 
        });
    }

    function showTabContent(i=0) {                        //эта функция показывает контент.
                                                          //  i=0 ставим дефолтное значение 
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");
        // tabsContent[i].style.display = "block"; //второй способ
        tabs[i].classList.add("tabheader__item_active");   //добавляем класс к элементу.
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (event)=> {
        // создаем событие по клику
        const target = event.target;
        // задаем переменную для удобства
        if (target && target.classList.contains("tabheader__item")) {//задаем условие на содержание указанного класса
            tabs.forEach((item, i) => {
            //перебираем все элементы псевдомассива и сравниваем,что если элемент из псевдамассива совпадает
            //c тем элементом на который кликнули, то его и показывает на странице
                if (target==item) {
                    hideTabContent();
                    showTabContent(i); //номер элемента в функции который совпал в условии
                }
            });
        }
    });

//Timer
    const deadLine = "2021-12-31";

    //функция между дедлайном и текущим временем
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date());
        const days = Math.floor(t/(1000*60*60*24));
        const hours = Math.floor((t/(1000*60*60)%24));
        const minutes = Math.floor((t/1000/60)%60);
        const seconds = Math.floor((t/1000)%60);

        return {
            "total": t,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        };
    }

    //вспомогательная функция для получения 0
    function getZero(num) {
        if(num>0 && num<10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    //функция установки таймера на страницу
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector);
        const days = timer.querySelector("#days");
        const hours = timer.querySelector("#hours");
        const minutes = timer.querySelector("#minutes");
        const seconds = timer.querySelector("#seconds");
        const timeInterval = setInterval(updateClock, 1000);  //задает интервал запуска функции

        updateClock();  //чтобы не было запаздываний

        //фкнкция обновления таймера каждую секунду
        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total<=0){
                clearInterval (timeInterval);
            }
        }
    }
    setClock(".timer", deadLine);

// Modal
    const modalTrigger = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector(".modal");
    const modalCloseBtn = document.querySelector('[data-close]');
    //открытие модального окна
    function openModal() {
        modal.classList.add("show");
        modal.classList.remove("hide");
        document.body.style.overflow = "hidden";//убирает прокрутку со страницы
        clearInterval(modalTimeId); // если пользователь сам открыл модальное окно - 
                                    //оно не открывается черех заданный интервал в переменной modalTimerId
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener("click", openModal);
    });

    //закрытие модального окна 
    function closeModal() {
        modal.classList.add("hide");
        modal.classList.remove("show");
        document.body.style.overflow = ""; //восстановление прокрутки на странице
    }

    modalCloseBtn.addEventListener("click", closeModal);
    //закрытие модального окна по подложке 
    modal.addEventListener("click", (e) =>{
        if(e.target===modal){
            closeModal();
        }
    });
    //закрытие модального окна нажатием клавишы Esc
    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });

    // открытие маодального окна через определенный промежуток времени
    const modalTimeId = setTimeout(openModal, 3000);

    //появление модального окна при долистывании до конца страницы 
    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener("scroll", showModalByScroll);//удаление обработчика события после однократного применения
        }
    //в условии прокрученная часть страницы + видимая часть страницы >= полной прокрутке
    }
    window.addEventListener("scroll", showModalByScroll);

//Классы для карточек товаров
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {   //... classes - rest оператор и его значений может быть много
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);  //селектор в котрый добавляется инфо о товаре
            this.transfer = 1;
            this.changeToBYN();
        }
        changeToBYN() {
            this.price = this.price * this.transfer;
        }

        //данным методом создаеттся структура, которая помещается в "div"
        render() {
            const element = document.createElement('div');

            if(this.classes.length===0) {
                this.class = "menu__item";
                element.classList.add(this.class);
            } else {
                this.classes.forEach(className=>element.classList.add(className));
            }
         
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            //динамичеcки сформировывается стуктура
            this.parent.append(element); // помещает созданный элемент 
        }
    }

    new MenuCard( //строки через "" прописывать
        "img/tabs/vegy.jpg",
        "vegy",
        "Меню 'Фитнес'", //если нужно 2 кавычек- использовать разные виды кавычек
        "Меню 'Фитнес' - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей.Это абсолютно новый продукт с оптимальной ценой и высоким качеством!",
        3,
        ".menu .container",
    ).render();

    new MenuCard( 
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”', 
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты -ресторанное меню без похода в ресторан!',
        5,
        ".menu .container",
        "menu__item"
    ).render();

    new MenuCard( 
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"', 
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        7,
        ".menu .container",
        "menu__item"
    ).render();
});
