var money_type = ['1,any', '2,white', '3,black'];
var moneyHard_type = ['1,white', '2,black'];
var workman_type = ['1,low', '2,med', '3,hight'];
var fish_type = ['1,any', '2,fresh'];

class tl {
    static Count(onChengeFunc) {
        var input = InputFactory.Number(1, 1);
        input.onchange = function (event) {
            if (input.value < 1) input.value = 1;
            onChengeFunc(event);
        };

        var td = document.createElement('td');
        td.innerText = 'Кол-во(+):'
        td.appendChild(input);
        return td;
    } //>0
    static CountExt(onChengeFunc) {
        var input = InputFactory.Number(100);
        input.onchange = function (event) {
            onChengeFunc(event);
        };

        var td = document.createElement('td');
        td.innerText = 'Кол-во(±):'
        td.appendChild(input);
        return td;
    } //>0
    static Percent(onChengeFunc) {
        var input = InputFactory.Number(1, -100, 100);
        input.onchange = function (event) {
            if (input.value < -100) input.value = -100;
            if (input.value > 100) input.value = 100;
            onChengeFunc(event);
        };

        var td = document.createElement('td');
        td.innerText = 'Кол-во (%):'
        td.appendChild(input);
        return td;
    }

    static Time(onChengeFunc) {
        var div = InputFactory.Date(onChengeFunc);

        var td = document.createElement('td');
        td.appendChild(div);
        return td;
    }

    static FishID(onChengeFunc) {
        var valuesList = [];

        var i = 0;
        items_list.forEach(item => {
            if (inclideInRange(fishRange, i)) valuesList.push(item);
            i++;
        });

        return InputFactory.ParamDatalist(valuesList, onChengeFunc);
    }
    static BuildID(onChengeFunc) {
        var valuesList = [];

        var i = 0;
        items_list.forEach(item => {
            if (inclideInRange(buildRange, i)) valuesList.push(item);
            i++;
        });

        return InputFactory.ParamDatalist(valuesList, onChengeFunc);
    }
    static WorkmanID(onChengeFunc) {
        var valuesList = [];

        var i = 0;
        items_list.forEach(item => {
            if (inclideInRange(workmanRange, i)) valuesList.push(item);
            i++;
        });

        return InputFactory.ParamDatalist(valuesList, onChengeFunc);
    }
    static ItemID(onChengeFunc) {
        var valuesList = [];
        var i = -1;
        items_list.forEach(item => {
            i++;
            if (!inclideInRange(workmanRange, i) &
                !inclideInRange(buildRange, i) &
                !inclideInRange(fishRange, i)) {
                valuesList.push(item);
            }
        });

        return InputFactory.ParamDatalist(valuesList, onChengeFunc);
    }

    static FishType(onChengeFunc) {
        var select = InputFactory.SelectWT(fish_type);
        select.onchange = onChengeFunc;

        var td = document.createElement('td');
        td.appendChild(select);
        return td;
    }
    static MoneyType(onChengeFunc) {
        var select = InputFactory.SelectWT(money_type);
        select.onchange = onChengeFunc;

        var td = document.createElement('td');
        td.appendChild(select);
        return td;
    }
    static MoneyHardType(onChengeFunc) {
        var select = InputFactory.SelectWT(moneyHard_type);
        select.onchange = onChengeFunc;

        var td = document.createElement('td');
        td.appendChild(select);
        return td;
    }
    static WorkmanType(onChengeFunc) {
        var select = InputFactory.SelectWT(workman_type);
        select.onchange = onChengeFunc;

        var td = document.createElement('td');
        td.appendChild(select);
        return td;
    }

    static QuestGiver(onChengeFunc) {
        var select = InputFactory.SelectWT(char_list);
        select.value = document.getElementById('questgiver').value;
        select.onchange = onChengeFunc;

        var td = document.createElement('td');
        td.appendChild(select);
        return td;
    }

    static Flag(onChengeFunc) {
        var input = document.createElement('input');
        input.onchange = onChengeFunc;

        var td = document.createElement('td');
        td.innerText = 'Флаг:'
        td.appendChild(input);
        return td;
    }
}

var task_list = [
    { name: 'error', uName: 'Ошибка данных', params: [] },
    { name: 'empty', uName: 'Автоквест', params: [] },

    { name: 'fish_catch', uName: 'Поймать рыбу', params: [tl.FishID, tl.Count, tl.FishType] },
    { name: 'fish_give', uName: 'Отдай рыбу', params: [tl.FishID, tl.Count, tl.FishType] },
    { name: 'fish_catchgive', uName: 'Поймай и Отдай рыбу', params: [tl.FishID, tl.Count, tl.FishType] },
    { name: 'fish_accum', uName: 'Накопи рыбу', params: [tl.FishID, tl.Count, tl.FishType] },

    { name: 'money_accum', uName: 'Накопить денег', params: [tl.MoneyType, tl.Count] },
    { name: 'money_give', uName: 'Отдать денег', params: [tl.MoneyType, tl.Count] },
    { name: 'money_borrow', uName: 'Одолжить денег', params: [tl.MoneyType, tl.Count] },
    { name: 'money_earn', uName: 'Заработать денег', params: [tl.MoneyType, tl.Count] },

    { name: 'workman_hire', uName: 'Нанять сотрудника', params: [tl.WorkmanType, tl.Count] },
    { name: 'workman_fire', uName: 'Уволить сотрудника', params: [tl.WorkmanType, tl.Count] },
    { name: 'workman_borrow', uName: 'Одолжить сотрудника', params: [tl.WorkmanType, tl.Count] },
    { name: 'workman_accum', uName: 'Накопить сотрудников', params: [tl.WorkmanType, tl.Count] },

    { name: 'item_buy', uName: 'Купить предмет на рынке', params: [tl.ItemID, tl.Count] },
    { name: 'item_sell', uName: 'Продать предмет на рынке', params: [tl.ItemID, tl.Count] },
    { name: 'item_give', uName: 'Отдать предмет', params: [tl.ItemID, tl.Count] },
    { name: 'item_accum', uName: 'Накопить объекты', params: [tl.ItemID, tl.Count] }
];

var reward_list = [
    { name: 'error', uName: 'Ошибка данных', params: [] },

    { name: 'money', uName: 'деньги', params: [tl.MoneyHardType, tl.Count] },
    { name: 'loyality', uName: 'лояльность', params: [tl.QuestGiver, tl.CountExt] },
    { name: 'building', uName: 'постройка', params: [tl.BuildID] },
    { name: 'workman', uName: 'рабочий', params: [tl.WorkmanType, tl.Count] },

    { name: 'item', uName: 'предмет', params: [tl.ItemID, tl.Count] },
    { name: 'fish', uName: 'рыба', params: [tl.FishID, tl.Count, tl.FishType] },

    { name: 'sale_item_buy', uName: 'цена на покупку товары', params: [tl.Percent, tl.Time] },
    { name: 'sale_item_sell', uName: 'цена на продажу товары', params: [tl.Percent, tl.Time] },
    { name: 'sale_fish_buy', uName: 'цена на покупку рыбы', params: [tl.Percent, tl.Time] },
    { name: 'sale_fish_sell', uName: 'цена на продажу рыбы', params: [tl.Percent, tl.Time] },
    { name: 'productivity', uName: 'глобальный КПД', params: [tl.Percent, tl.Time] },
    { name: 'flag', uName: 'создание флага', params: [tl.Flag] }
];