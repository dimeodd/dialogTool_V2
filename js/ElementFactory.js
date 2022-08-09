class ElementFactory {
    static QidChanger() {
        var input = document.createElement('input');
        input.id = 'qid';
        input.value = ws.data.QuestID;
        input.type = 'text';
        input.oninput = function (event) {
            if (input.value.length > 5) {
                input.value = input.value.substr(0, 5);
            }
        };
        input.onchange = function (event) {
            if (input.value.length < 1) input.value = '0';
            ws.data.QuestID = input.value;
            mq.Redraw();
        }
        input.classList.add('number');

        var label = document.createElement('label');
        label.innerText = 'Quest ID';
        label.htmlFor = input.id;

        var text = document.createElement('a');
        text.innerText = ' (5 символов)';

        var div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(text);
        return div;
    }

    static CharSelector() {
        var select = InputFactory.SelectWT(char_list);
        select.id = 'questgiver'
        select.value = ws.data.QuestGiver_UE4;
        select.onchange = function (event) {
            ws.data.QuestGiver_UE4 = event.currentTarget.value;
        };

        var label = document.createElement('label');
        label.innerText = 'Квестгивер';
        label.htmlFor = select.id;

        var div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(select);
        return div;
    }

    static AutoTaker() {
        var checker = document.createElement('input');
        checker.id = 'autotake';
        checker.type = 'checkbox';
        checker.checked = ws.data.IsAutoTake_bool;
        checker.onchange = function (event) {
            ws.data.IsAutoTake_bool = event.target.checked;
        };

        var label = document.createElement('label');
        label.innerText = 'Авто-принятие';
        label.htmlFor = checker.id;

        var div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(checker);
        return div;
    }

    static TasksOrder() {
        var select = document.createElement('select');
        select.id = 'order'

        let option1 = document.createElement('option');
        option1.value = 0;
        option1.innerText = 'Цепочка'
        let option2 = document.createElement('option');
        option2.value = 1;
        option2.innerText = 'нет'

        select.appendChild(option1);
        select.appendChild(option2);
        select.selectedIndex = ws.data.IsParallel_bool;

        select.onchange = function (event) {
            ws.data.IsParallel_bool = event.currentTarget.value == 1;
        };

        var label = document.createElement('label');
        label.innerText = 'Порядок задач';
        label.htmlFor = select.id;

        var div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(select);
        return div;
    }

    static TaskList(dataArr, theList, tName) {

        if (!dataArr) {
            var div = document.createElement('div');
            div.innerText = 'Ошибка данных'
            div.classList.add('red');
            return div;
        }
        var div = document.createElement('div');
        let dictSel = {};
        for (let i = 0, iMax = theList.length; i < iMax; i++) {
            dictSel[theList[i].name] = i + '. ' + theList[i].uName;
        }
        // автозаполнение элементов
        var task_arr = dataArr;
        for (let i = 0; i < task_arr.length; i++) {
            var taskElement = ElementFactory.createTask(i, dictSel, dataArr, theList, tName);
            div.appendChild(taskElement);
        }

        var addBtn = document.createElement('button');
        addBtn.innerText = 'Add';
        addBtn.onclick = function (event) {
            task_arr.push(theList[1].name);
            ws.Redraw();
        }
        div.appendChild(addBtn);
        return div;

        //==========================================
    }
    static createTask(index, dict, dataArr, theList, tName) {

        var div = document.createElement('div');
        div.id = index;

        var ul = document.createElement('ul');
        div.appendChild(ul);

        //кнопка удаления 
        var li = document.createElement('li');
        ul.appendChild(li);

        var btn = document.createElement('button');
        li.appendChild(btn);
        btn.innerText = 'X';
        btn.onclick = function () {
            dataArr.splice(index, 1);
            ws.Redraw();
        }

        //кнопка вниз
        var btn = document.createElement('button');
        li.appendChild(btn);
        if (index == dataArr.length - 1) {
            btn.innerText = '  ';
            btn.disabled = true;
        }
        else {
            btn.innerText = '\\/';
            btn.onclick = function () {
                var a = dataArr[index];
                dataArr[index] = dataArr[index + 1];
                dataArr[index + 1] = a;
                ws.Redraw();
            }
        }

        //кнопка вверх 
        var btn = document.createElement('button');
        li.appendChild(btn);
        if (index == 0) {
            btn.innerText = '  ';
            btn.disabled = true;
        }
        else {
            btn.innerText = '/\\';
            btn.onclick = function () {
                var a = dataArr[index];
                dataArr[index] = dataArr[index - 1];
                dataArr[index - 1] = a;
                ws.Redraw();
            }
        }


        //Название задачи
        var DatalistValues = [];
        theList.forEach(task => { DatalistValues.push(dict[task.name]); });

        var input = InputFactory.Datalist1(DatalistValues, tName);
        li.appendChild(input);
        input.onchange = function (event) {
            var taskID = parseInt(input.value);
            var task = theList[taskID];

            if (taskID == 0 || task === undefined) input.classList.add('red');
            else if (taskID != 0 && input.classList.contains('red')) {
                input.classList.remove('red');
            }

            //clear
            while (ul.children.length > 1) {
                ul.children[ul.children.length - 1].remove();
            }
            //fill
            task.params.forEach(getTd => {
                ul.appendChild(getTd(onChange));
            });

            onChange(null);
        }

        //кнопка Очистки 
        var clnBtn = document.createElement('button');
        li.appendChild(clnBtn);
        clnBtn.innerText = '🧽';
        clnBtn.classList.add('clnBtn');
        clnBtn.onclick = function () {
            input.value = '';
            input.classList.add('red');
        }

        // автозаполнение элементов
        var taskMem = dataArr[index].split(' ');
        if (!selectContain(theList, 'name', taskMem[0])) {
            dataArr[index] = theList[0].name;
            taskMem = dataArr[index].split(' ');
        }
        input.value = dict[taskMem[0]];
        var taskID = parseInt(input.value);
        var task = theList[parseInt(input.value)];

        for (let i = 0, iMax = task.params.length; i < iMax; i++) {
            var paramert = task.params[i](onChange);
            if (taskMem[i + 1] !== 'none') {
                var el = paramert.children[0];
                el.value = taskMem[i + 1];
                if (el.UPD) el.UPD();
                if (el.value == '') el.classList.add('red');
            }
            ul.appendChild(paramert);
        }
        if (taskID == 0) input.classList.add('red');

        return div;

        function onChange(event) {
            var taskName = theList[parseInt(input.value)].name;
            var taskResult = [taskName];

            for (let i = 1, iMax = ul.children.length; i < iMax; i++) {
                var element = ul.children[i].children[0];
                if (element.value) {
                    taskResult.push(element.value);
                }
                else {
                    taskResult.push('none');
                }
            }

            dataArr[index] = taskResult.join(' ');

            if (event != null && event.target.classList.contains('red')) {
                event.target.classList.remove('red');
            }
        }
    }

    static HeaderLabel(text) {
        var div = document.createElement('h3');
        div.innerText = text;
        return div;
    }
    static TextLabel(text) {
        var div = document.createElement('div');
        div.innerText = text;
        return div;
    }
    static SmallLabel(text) {
        var div = document.createElement('h5');
        div.innerText = text;
        return div;
    }

    static StartTime() {
        var dateEl = InputFactory.Date(OnChange);
        dateEl.value = ws.data.StartValues.Date; //менять тут
        dateEl.UPD();

        var a = document.createElement('a');
        a.innerText = 'Начало задания:'; //менять тут

        var table = document.createElement('table');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        table.appendChild(tr);
        tr.appendChild(td);

        td.appendChild(a);

        td = document.createElement('td');
        tr.appendChild(td);
        td.appendChild(dateEl);
        return table;

        function OnChange(event) {
            ws.data.StartValues.Date = dateEl.value; //менять тут
        }
    }

    static EndTimer() {
        var dateEl = InputFactory.Date(OnChange);
        dateEl.value = ws.data.FailValues.Date; //менять тут
        dateEl.UPD();

        var a = document.createElement('a');
        a.innerText = 'Продолжительность:'; //менять тут

        var a2 = document.createElement('a');
        a2.innerText = 'Если 0/0/0/0, то таймер отключен';

        var table = document.createElement('table');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        table.appendChild(tr);
        tr.appendChild(td);

        td.appendChild(a);

        td = document.createElement('td');
        tr.appendChild(td);
        td.appendChild(dateEl);

        td = document.createElement('td');
        tr.appendChild(td);
        td.appendChild(a2);
        return table;

        function OnChange(event) {
            ws.data.FailValues.Date = dateEl.value; //менять тут
        }
    }

    static FlagList(flagArr) {
        var div = document.createElement('div');

        for (let i = 0; i < flagArr.length; i++) {
            var taskElement = ElementFactory.Flag(i, flagArr);
            div.appendChild(taskElement);
        }

        var addBtn = document.createElement('button');
        addBtn.innerText = 'Add';
        addBtn.onclick = function (event) {
            flagArr.push('');
            ws.Redraw();
        }
        div.appendChild(addBtn);
        return div;
    }
    static Flag(index, flagArr) {
        var div = document.createElement('div');
        div.id = index;

        var btns = [
            {   //кнопка удаления 
                text: 'X',
                func: function () {
                    flagArr.splice(index, 1);
                    ws.Redraw();
                }
            },
            {   //кнопка вниз
                text: '\\/',
                func: function () {
                    var a = flagArr[index];
                    flagArr[index] = flagArr[index + 1];
                    flagArr[index + 1] = a;
                    ws.Redraw();
                }
            },
            {   //кнопка вверх 
                text: '/\\',
                func: function () {
                    var a = flagArr[index];
                    flagArr[index] = flagArr[index - 1];
                    flagArr[index - 1] = a;
                    ws.Redraw();
                }
            },
            {   //кнопка вверх 
                text: '🧽',
                func: function () {
                    input.value = '';
                }
            }
        ];

        var btn = InputFactory.ListBtn(btns[0]);
        div.appendChild(btn);

        var btn = InputFactory.ListBtn(btns[1]);
        if (index == flagArr.length - 1) {
            btn.innerText = '  ';
            btn.disabled = true;
        }
        div.appendChild(btn);

        var btn = InputFactory.ListBtn(btns[2]);
        if (index == 0) {
            btn.innerText = '  ';
            btn.disabled = true;
        }
        div.appendChild(btn);

        var input = document.createElement('input');
        input.type = 'text';
        input.value = flagArr[index];
        input.onchange = function () {
            input.value = input.value.trim()
            if (input.value[0] != '!') {
                input.value = input.value.replace(/!/gm, '')
            }
            input.value = input.value
                .replace(/\s/gm, '_')
                .replace(/_{2,}/gm, '_')
                .replace(/[^!\w]/gm, '')
                .toLowerCase();
            flagArr[index] = input.value;
        }
        div.appendChild(input);

        var btn = InputFactory.ListBtn(btns[3]);
        div.appendChild(btn);
        return div;
    }

    static TextField(langData, label, defValues = undefined) {

        var table = document.createElement('table');
        var tr = document.createElement('tr');
        table.appendChild(tr);

        var td = document.createElement('td');
        td.innerText = label;
        tr.appendChild(td);

        var td = document.createElement('td');
        tr.appendChild(td);
        var ru = InputFactory.createTextarea(langData, 'ru', defValues ? defValues[0] : undefined);
        td.appendChild(ru);

        td = document.createElement('td');
        tr.appendChild(td);
        var en = InputFactory.createTextarea(langData, 'en', defValues ? defValues[1] : undefined);
        td.appendChild(en);
        return table;
    }

    static CompleteFields() {
        var div = document.createElement('div');
        var textCompl = ws.textCompl;

        for (let i = 0; i < textCompl.length; i++) {
            var taskElement = ElementFactory.Compl(i, textCompl);
            div.appendChild(taskElement);
        }

        var addBtn = document.createElement('button');
        addBtn.innerText = 'Add';
        addBtn.onclick = function (event) {
            textCompl.push(new TextCompl());
            ws.data.OnComplete_arr.push(new CompleteUnit());
            ws.Redraw();
        }
        div.appendChild(addBtn);
        return div;
    }
    static Compl(index, textCompl) {

        var div = document.createElement('div');
        div.id = index;
        div.classList.add(index % 2 ? 'list2' : 'list1');

        var btns = [
            {   //кнопка удаления 
                text: 'X',
                func: function () {
                    textCompl.splice(index, 1);
                    ws.Redraw();
                }
            },
            {   //кнопка вниз
                text: '\\/',
                func: function () {
                    var a = textCompl[index];
                    textCompl[index] = textCompl[index + 1];
                    textCompl[index + 1] = a;
                    ws.Redraw();
                }
            },
            {   //кнопка вверх 
                text: '/\\',
                func: function () {
                    var a = textCompl[index];
                    textCompl[index] = textCompl[index - 1];
                    textCompl[index - 1] = a;
                    ws.Redraw();
                }
            }
        ];

        var btn = InputFactory.ListBtn(btns[0]);
        div.appendChild(btn);

        var btn = InputFactory.ListBtn(btns[1]);
        if (index == textCompl.length - 1) {
            btn.innerText = '  ';
            btn.disabled = true;
        }
        div.appendChild(btn);

        var btn = InputFactory.ListBtn(btns[2]);
        if (index == 0) {
            btn.innerText = '  ';
            btn.disabled = true;
        }
        div.appendChild(btn);

        var taskElement = ElementFactory.TextField(textCompl[index].complBtn, 'Текст кнопки:', ['Завершить', 'Complete']);
        div.appendChild(taskElement);
        taskElement = ElementFactory.TextField(textCompl[index].compl, 'Диалог:');
        div.appendChild(taskElement);
        taskElement = ElementFactory.TextLabel('Награда:');
        div.appendChild(taskElement);
        taskElement = ElementFactory.TaskList(ws.data.OnComplete_arr[index].Reward, reward_list, 'tasks2');
        div.appendChild(taskElement);
        return div;
    }

    /*
    WorkmanID(?)

    (?)
    автопоиск флагов
    недельный органайзер
    */
}

class InputFactory {

    static ParamDatalist(values, onChengeFunc) {
        var input = InputFactory.Datalist0(values, 'FishID');
        input.onchange = function (e) {
            if (input.classList.contains('red')) {
                input.classList.remove('red');
            }
            onChengeFunc(e)
        };
        input.UPD = function (e) {
            if (input.classList.contains('red')) {
                input.classList.remove('red');
            }
        }

        var clnBtn = document.createElement('button');
        clnBtn.innerText = '🧽';
        clnBtn.classList.add('clnBtn');
        clnBtn.onclick = function () {
            input.value = '';
            input.classList.add('red');
        }

        var td = document.createElement('td');
        td.appendChild(input);
        td.appendChild(clnBtn);
        if (!input.value | input.value == '') input.classList.add('red');
        return td;
    }


    static createTextarea(langData, name, defValues = undefined) {
        let element = document.createElement('div');
        element.innerText = name;
        let br = document.createElement('br');

        let input = document.createElement('textarea');
        input.style.height = '20px';
        input.style.width = '200px';
        input.style.maxlength = 200;

        if (defValues && langData[name] == 'none') {
            langData[name] = input.value = defValues;
        }
        input.value = langData[name];
        input.onclick = function () {
            if (input.value == 'none') input.value = '';
        }
        input.oninput = function () {
            input.value = input.value.replace(/"/gm, '')
            langData[name] = input.value;
        }
        input.onchange = function () {
            if (input.value.length < 1)
                langData[name] = input.value = 'none';
        }

        let reset = document.createElement('button');
        reset.innerText = "resetSize";
        reset.setAttribute("onclick", "ws.Redraw()");

        element.appendChild(reset);
        element.appendChild(br);
        element.appendChild(input);

        return element;
    }

    static ListBtn(param) {
        var btn = document.createElement('button');
        btn.innerText = param.text;
        btn.onclick = param.func;
        return btn;
    }

    static Datalist1(values, id) {
        var datalist = document.createElement('datalist');
        datalist.id = id;
        for (let i = 1, iMax = values.length; i < iMax; i++) {
            var option = document.createElement('option');
            option.value = values[i];
            datalist.appendChild(option);
        }

        var input = document.createElement('input');
        input.appendChild(datalist);
        input.setAttribute('list', datalist.id);
        return input;
    }
    static Datalist0(values, id) {
        var datalist = document.createElement('datalist');
        datalist.id = id;
        for (let i = 0, iMax = values.length; i < iMax; i++) {
            var option = document.createElement('option');
            option.value = values[i];
            datalist.appendChild(option);
        }

        var input = document.createElement('input');
        input.appendChild(datalist);
        input.setAttribute('list', datalist.id);
        return input;
    }

    static SelectWT(list) {
        var select = document.createElement('select');
        list.forEach(item => {
            let option = document.createElement('option');
            option.value = item;
            option.innerText = item.replace(/.*,/, '');
            select.appendChild(option);
        });
        return select;
    }

    static Number(def, min = undefined, max = undefined) {
        var input = document.createElement('input');
        input.type = 'number';
        input.value = def;
        if (min !== undefined) { input.min = min; }
        if (max !== undefined) { input.max = max; }
        input.classList.add('number');

        return input;
    }


    static Date(onChangeFunc) {
        var div = document.createElement('div');

        var a = document.createElement('a');
        a.innerText = ' W/D/H/m';
        div.appendChild(a);

        var W = InputFactory.Number(0, 0);
        W.onchange = function (event) {
            if (W.value < 0) W.value = 0;
            SetValue();
            onChangeFunc(event);
        };
        W.classList.add('number_time');
        div.appendChild(W);

        var D = InputFactory.Number(0, 0, 7);
        D.onchange = function (event) {
            if (D.value < 0) D.value = 0;
            if (D.value > 7) D.value = 7;
            SetValue();
            onChangeFunc(event);
        };
        D.classList.add('number_time');
        div.appendChild(D);

        var H = InputFactory.Number(0, 0, 23);
        H.onchange = function (event) {
            if (H.value < 0) H.value = 0;
            if (H.value > 23) H.value = 23;
            SetValue();
            onChangeFunc(event);
        };
        H.classList.add('number_time');
        div.appendChild(H);

        var M = InputFactory.Number(0, 0, 59);
        M.onchange = function (event) {
            if (M.value < 0) M.value = 0;
            if (M.value > 59) M.value = 59;
            SetValue();
            onChangeFunc(event);
        };
        M.classList.add('number_time');
        div.appendChild(M);

        var clnBtn = document.createElement('button');
        div.appendChild(clnBtn);
        clnBtn.innerText = '🧽';
        clnBtn.classList.add('clnBtn');
        clnBtn.onclick = function () {
            div.value = '0/0/0/0';
            Update();
            SetValue();
            onChangeFunc(null);
        }

        div.value = '0/0/1/0';
        div.UPD = Update;
        Update();

        return div;

        function SetValue() {
            var arr = [W.value, D.value, H.value, M.value];
            div.value = arr.join('/');
        }
        function Update() {
            var date = div.value.split('/');
            W.value = date[0];
            D.value = date[1];
            H.value = date[2];
            M.value = date[3];
        }
    }
}