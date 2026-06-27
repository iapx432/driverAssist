// window-layout.js

export function initialiseWindowLayout() {

    // set initial height of bottom pane from local storage or default to 150px
    const bottomPane =
        document.getElementById(
            'bottomPane'
        );

    bottomPane.style.height =
        localStorage.getItem(
            'bottomPaneHeight'
        ) ?? '150px';

}

