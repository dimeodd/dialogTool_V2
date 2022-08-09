class Workspace {
    owner;
    data = new QuestStruct();
    text = {
        title: new LangData(),
        description: new LangData(),
        skip: new LangData(),
        fail: new LangData()
    };
    textCompl = [
        new TextCompl()
    ];
    /*
        'title'
        'description'
        'skip'
        'fail'
        'compl'     //compl1 ... compl9
        'complBtn'  //complBtn1 ... complBtn9
     */

    SetData(loadData) {
        this.data = loadData.data;
        this.text = loadData.text;
        this.textCompl = loadData.textCompl;
    }
    GetData() {
        var qd = new QuestData();
        qd.data = this.data;
        qd.text = this.text;
        qd.textCompl = this.textCompl;
        return qd;
    }

    Init(owner) {
        this.owner = owner;
        this.data = new QuestStruct();
        this.Redraw();
    }

    Redraw() {
        this.owner.innerHTML = '';
        this.owner.appendChild(ElementFactory.QidChanger());
        this.owner.appendChild(ElementFactory.CharSelector());
        this.owner.appendChild(ElementFactory.AutoTaker());
        this.owner.appendChild(ElementFactory.TextField(ws.text.title, 'Название квеста:'));
        this.owner.appendChild(ElementFactory.TextField(ws.text.description, 'Описание:'));
        this.owner.appendChild(ElementFactory.TextLabel('Предоплата:'));
        this.owner.appendChild(ElementFactory.TaskList(ws.data.OnTake.Reward, reward_list, 'tasks2'));

        this.owner.appendChild(ElementFactory.HeaderLabel('Условия старта квеста'));
        this.owner.appendChild(ElementFactory.StartTime());
        this.owner.appendChild(ElementFactory.TextLabel('Флаги условий:'));
        this.owner.appendChild(ElementFactory.FlagList(ws.data.StartValues.Flags_arr));
        this.owner.appendChild(ElementFactory.SmallLabel('flag - если флаг есть'));
        this.owner.appendChild(ElementFactory.SmallLabel('!flag - если флага нет'));
        
        this.owner.appendChild(ElementFactory.HeaderLabel('Задания'));
        this.owner.appendChild(ElementFactory.TasksOrder());
        this.owner.appendChild(ElementFactory.TaskList(ws.data.Tasks_arr, task_list, 'tasks1'));

        this.owner.appendChild(ElementFactory.HeaderLabel('Условия провала'));
        this.owner.appendChild(ElementFactory.EndTimer());
        this.owner.appendChild(ElementFactory.TextLabel('Флаги провала:'));
        this.owner.appendChild(ElementFactory.FlagList(ws.data.FailValues.Flags_arr));
        this.owner.appendChild(ElementFactory.SmallLabel('flag - если флаг есть, то провал'));
        this.owner.appendChild(ElementFactory.SmallLabel('!flag - если флага нет, то провал'));


        this.owner.appendChild(ElementFactory.HeaderLabel('On Skip'));
        this.owner.appendChild(ElementFactory.TextField(ws.text.skip, 'Диалог пропуска:'));
        this.owner.appendChild(ElementFactory.TextLabel('Штрафы:'));
        this.owner.appendChild(ElementFactory.TaskList(ws.data.OnSkip.Reward, reward_list, 'tasks2'));

        this.owner.appendChild(ElementFactory.HeaderLabel('On Fail'));
        this.owner.appendChild(ElementFactory.TextField(ws.text.fail, 'Диалог провала:'));
        this.owner.appendChild(ElementFactory.TextLabel('Штрафы:'));
        this.owner.appendChild(ElementFactory.TaskList(ws.data.OnFail.Reward, reward_list, 'tasks2'));

        this.owner.appendChild(ElementFactory.HeaderLabel('Кнопка завершения квеста'));
        this.owner.appendChild(ElementFactory.CompleteFields());
    }
}

class TextCompl {
    compl = new LangData();
    complBtn = new LangData();
}

class LangData {
    ru = 'none';
    en = 'none';
}

class QuestData {
    data = new QuestStruct();
    text = {
        title: new LangData(),
        description: new LangData(),
        skip: new LangData(),
        fail: new LangData()
    };
    textCompl = [
        new TextCompl()
    ];
}