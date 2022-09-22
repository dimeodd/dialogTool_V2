class multiQuests {
    owner;
    arr = [new QuestData()];
    index;
    charFilter;

    Init(owner) {
        this.owner = owner;
        this.SetData(new MqData());

        //фильтр
        var div = document.createElement('a');

        var myClist = ['none'];

        char_list.forEach(charName => {
            myClist.push(charName);
        });

        var input = InputFactory.SelectWT(myClist);
        mq.charFilter = input.value = myClist[0];
        input.onchange = function () {
            mq.charFilter = input.value;
            mq.Redraw();
        }
        div.innerText = 'Фильтр квестгиверов:';
        div.appendChild(input);
        document.getElementById('header').appendChild(div);


        this.Redraw();

        /*
        //TODO внедрить сохранение в localstorage, чтобы предотвратить перезагрузки
        кнопка удаления текущего квеста
        кнопка нового файла
        */
    }

    UpdateTextKeys() {
        var arr = this.arr;

        for (let i = 0, iMax = arr.length; i < iMax; i++) {
            var qid = arr[i].data.QuestID + '_';
            var data = arr[i].data;

            data.Title_TextKey = qid + 'title';
            data.OnTake.TextKey = qid + 'description';
            data.OnSkip.TextKey = qid + 'skip';
            data.OnFail.TextKey = qid + 'fail';

            data.OnComplete_arr
            for (let j = 0, jMax = data.OnComplete_arr.length; j < jMax; j++) {
                data.OnComplete_arr[j].TextKey = qid + 'compl_' + j;
                data.OnComplete_arr[j].TextKey_Button = qid + 'complBtn_' + j
            }
        }
    }

    Redraw() {
        this.owner.innerHTML = '';
        var i = 0;
        this.arr.forEach(quest => {
            this.CreateElement(quest, i);
            i++;
        });
    }
    CreateElement(quest, index) {
        if (mq.charFilter !== 'none' &&
            mq.charFilter !== quest.data.QuestGiver_UE4) return;

        var delBtn = document.createElement('button');
        delBtn.innerText = 'X';
        delBtn.style.width = '15px';
        delBtn.style.padding = '0px';
        delBtn.addEventListener(
            'click',
            function () {
                if (!confirm("Хотите удалить?")) return;
                if (mq.arr.length < 2) {
                    mq.arr[index] = new QuestData();
                }
                else
                    mq.arr.splice(index, 1);

                if (mq.index >= mq.arr.length) mq.index = mq.arr.length - 1;
                ws.SetData(mq.arr[mq.index]);
                ws.Redraw();
                mq.Redraw();
            },
            { once: true, capture: true });

        var div = document.createElement('div');
        div.innerText = quest.data.QuestID;
        div.addEventListener(
            'click',
            function () {
                mq.index = index;
                ws.SetData(quest);
                ws.Redraw();
                mq.Redraw();
            },
            true);

        div.onpointerenter = function () {
            div.insertBefore(delBtn, div.firstChild);
            div.style.paddingLeft = 0;
            div.style.width = '100%';
        }
        div.onpointerleave = function () {
            delBtn.remove();
            div.removeAttribute('style');
        }
        if (index == this.index) div.classList.add('selected');
        else if (index % 2) div.classList.add('questListElement2');
        else div.classList.add('questListElement1');

        this.owner.appendChild(div);
    }

    NewQuest() {
        this.arr.push(new QuestData());
        ws.SetData(this.arr[this.arr.length - 1]);

        if (this.charFilter !== 'none') {
            ws.data.QuestGiver_UE4 = this.charFilter;
        }
        ws.Redraw();
        this.index = this.arr.length - 1;
        this.Redraw();
    }


    SortByID() {
        var select = this.arr[this.index];
        this.arr.sort(compare);
        this.index = this.arr.indexOf(select);
        this.Redraw();

        function compare(a, b) {
            if (a.data.QuestID[0] >= 'A' && a.data.QuestID[0] <= 'Я' ||
                b.data.QuestID[0] >= 'A' && b.data.QuestID[0] <= 'Я'
            ) {
                if (a.data.QuestID[0] < b.data.QuestID[0]) {
                    return -1;
                }
                if (a.data.QuestID[0] > b.data.QuestID[0]) {
                    return 1;
                }
            }
            var a_i = parseInt(a.data.QuestID.match(/\d{1,}/)[0]);
            var b_i = parseInt(b.data.QuestID.match(/\d{1,}/)[0]);
            if (a_i < b_i) {
                return -1;
            }
            if (a_i > b_i) {
                return 1;
            }
            return 0;
        }
    }

    SetData(mqData) {
        FileVersionController.CheckFile(mqData);
        this.arr = mqData.arr;
        this.index = mqData.index;
        this.fileVersion = mqData.fileVersion;

        this.Redraw();
        ws.SetData(this.arr[this.index]);
        ws.Redraw();
    }

    GetData() {
        var save = new MqData();
        save.arr = this.arr;
        save.index = this.index;
        return save;
    }
}

class MqData {
    arr = [new QuestData()];
    index = 0;
    fileVersion = 2;
}

class FileVersionController {

    //проверяет актуальность версии файла
    static CheckFile(mqData) {
        var currVersion = new MqData().fileVersion;
        var fixArr = FileVersionController.fixArr;

        //zero fix
        if (!mqData.hasOwnProperty('fileVersion')) {
            alert("Версия файла не обнаружена. Файл будет обновлён до версии 1");
            fixArr[0](mqData);
        }

        if (mqData.fileVersion < currVersion) {
            for (let i = mqData.fileVersion, iMax = Math.max(currVersion, fixArr.length); i < iMax; i++) {
                fixArr[i](mqData);
            }
            alert("Файл обновлён до версии " + currVersion);
        }
    }

    static fixArr = [
        FileVersionController.Fix0,
        FileVersionController.Fix1
    ]

    static Fix0(mqData) {
        mqData.fileVersion = 1;
    }
    static Fix1(mqData) {
        mqData.arr.forEach(quest => {
            var arr = quest.data.Tasks_arr;
            for (let i = 0, iMax = arr.length; i < iMax; i++) {
                arr[i] = arr[i].replace('64,fish32', items_list[63]);
            }
        });
        //TODO как нибуль автоматизировать это, чтобы название не тут менять, а только в списке
    }
}