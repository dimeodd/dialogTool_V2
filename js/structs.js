class QuestStruct {
    QuestID = '0';
    QuestGiver_UE4 = 'none';
    Title_TextKey = 'Text key';

    IsAutoTake_bool = false;
    IsParallel_bool = true;
    StartValues = new Values();
    FailValues = new Values();

    Tasks_arr = ['empty'];

    OnTake = new DialogUnit(); // - описание квеста и предоплата при взятии
    OnFail = new DialogUnit(); // - Провал квеста  ,и штраф за провал
    OnSkip = new DialogUnit(); // - Отказ от квеста, штраф за отказ
    OnComplete_arr = [             // - Список наград на выбор
        new CompleteUnit()
    ];

    constructor() {
        this.QuestGiver_UE4 = char_list[0];
    }
}

class DialogUnit {
    TextKey = 'key';
    Reward = [];
}
class CompleteUnit extends DialogUnit {
    TextKey_Button = 'key';
}

class Values {
    Date = '0/0/0/0'; // Week/Day/Hour/Munite
    Flags_arr = [];
    // 'flag'  - требуется flag
    // '!flag' - не должно быть такого флага
}