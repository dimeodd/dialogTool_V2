var ws = new Workspace();
var mq = new multiQuests();

window.onload = function () {
    ws.Init(document.getElementById("workspace"));
    mq.Init(document.getElementById("questList"));
    DropdownExt.Init();
}
window.onbeforeunload = function () {

}
window.onclick = function (event) {
    DropdownExt.OnClick(event);
}

function download(name, text, type) {
    var file = new Blob([text], { type: type });

    var a = window.document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
    a.remove();
}

function selectWhere(data, propertyName, value) {
    for (var i = 0; i < data.length; i++) {
        if (data[i][propertyName] == value) return data[i];
    }
    return null;
}
function selectContain(data, propertyName, value) {
    return selectWhere(data, propertyName, value) !== null;
}

function inclideInRange(range, value) {
    return range.min <= value & value <= range.max;
}


/*
function Save() {
    var data = JSON.stringify(ws.GetData());
    download('Test data.json', data, 'text/json');
}

function Load() {
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = func;
    fileInput.accept = '.json';

    fileInput.click();
    fileInput.remove();

    async function func(event) {
        const file = event.target.files.item(0);
        const text = await file.text();
        var load = JSON.parse(text);

        ws.SetData(load);
        ws.Redraw();
    }
}
*/


function SaveAll() {
    var data = JSON.stringify(mq.GetData());
    download('Test data.json', data, 'text/json');
}

function LoadAll() {
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = func;
    fileInput.accept = '.json';

    fileInput.click();
    fileInput.remove();

    async function func(event) {
        const file = event.target.files.item(0);
        const text = await file.text();
        var load = JSON.parse(text);

        mq.SetData(load);
    }
}
function ExpotrToUE4() {
    mq.UpdateTextKeys();
    var work_data = mq.GetData().arr;
    var questsUE4 = [];
    var txt_arr = [
        { a: '', LANG: 'ru' },
        { a: '', LANG: 'en' }
    ]

    work_data.forEach(item => {
        questsUE4.push(item.data);

        txt_arr.forEach(txt => {
            txt.a = txt.a.concat('\n', item.data.Title_TextKey.concat(',', item.text.title[txt.LANG]));
            txt.a = txt.a.concat('\n', item.data.OnTake.TextKey.concat(',', item.text.description[txt.LANG]));
            txt.a = txt.a.concat('\n', item.data.OnSkip.TextKey.concat(',', item.text.skip[txt.LANG]));
            txt.a = txt.a.concat('\n', item.data.OnFail.TextKey.concat(',', item.text.fail[txt.LANG]));

            for (let j = 0, jMax = item.data.OnComplete_arr.length; j < jMax; j++) {
                txt.a = txt.a.concat('\n',
                    item.data.OnComplete_arr[j].TextKey.concat(',', item.textCompl[j].compl[txt.LANG])
                );
                txt.a = txt.a.concat('\n',
                    item.data.OnComplete_arr[j].TextKey_Button.concat(',', item.textCompl[j].complBtn[txt.LANG])
                );
            }
        });
    });

    download('quests.json', JSON.stringify(questsUE4), 'text/json');
    download('ru.txt', txt_arr[0].a, 'text/txt');
    download('en.txt', txt_arr[1].a, 'text/txt');
}