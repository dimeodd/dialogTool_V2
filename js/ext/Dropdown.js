
class DropdownExt {
    static ShowDropDown(event) {
        var el = event.target.parentElement;
        el.querySelector("#myDropdown").classList.toggle("show");
    }

    static Init() {
        var list = document.getElementsByClassName('dropbtn');
        for (const element of list) {
            element.onclick = DropdownExt.ShowDropDown;
        };

        var list = document.getElementsByClassName('dropdown-content');
        for (const element of list) {
            element.childNodes.forEach(node => {
                if (node.onclick) {
                    var a = node.onclick;
                    node.onclick = function (event) {
                        a(event);
                        DropdownExt.onChange(event);
                    }
                } else {
                    node.onclick != DropdownExt.onChange;
                }
            });
        };
    }

    // Close the dropdown if the user clicks outside of it
    static onChange(event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    static OnClick(event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
}