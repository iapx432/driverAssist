// window-layout.js

// splitter
    // add log pane splitter drag functionality
    const splitter =
        document.getElementById(
            'splitter'
        );

// dragging

// localStorage

    const bottomPane =
        document.getElementById(
            'bottomPane'
        );

    // set initial height of bottom pane from local storage or default to 150px
    bottomPane.style.height =
        localStorage.getItem(
            'bottomPaneHeight'
        ) ?? '150px';

// pane resizing