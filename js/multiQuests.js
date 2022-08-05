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
            this.Element(quest, i);
            i++;
        });
    }
    Element(quest, index) {
        if (mq.charFilter !== 'none') {
            if (quest.data.QuestGiver_UE4 != mq.charFilter) return;
        }

        var div = document.createElement('div');
        div.innerText = quest.data.QuestID;
        div.onclick = function (e) {
            mq.index = index;
            ws.SetData(quest);
            ws.Redraw();
            mq.Redraw();
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
        this.arr.sort(compare);
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


    SetData(data) {
        this.arr = data.arr;
        this.index = data.index;

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
}