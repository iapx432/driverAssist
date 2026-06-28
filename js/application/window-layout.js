// window-layout.js

let dragging = false;    

export function initialiseWindowLayout() {

    // set initial height of bottom pane from local storage or default to 150px
    const bottomPane =
        document.getElementById(
            'bottomPane'
        );

    const lsBottomPanelHeight = localStorage.getItem('bottomPaneHeight');

    bottomPane.style.height = lsBottomPanelHeight ?? '150px';

    // add log pane splitter drag functionality
    const splitter =
        document.getElementById(
            'splitter'
        );

    splitter.addEventListener(
        'mousedown',
        () => {
            dragging = true;
        }    
    );    

    document.addEventListener(
        'mouseup',
        () => {
            dragging = false;
        }    
    );    

    document.addEventListener(
        'mousemove',
        event => {

            if (!dragging) {
                return;
            }

            const newHeight =
                Math.max(
                    50,
                    Math.min(
                        800,
                        window.innerHeight -
                        event.clientY
                    )
                );

            // save new height to local storage
            localStorage.setItem(
                'bottomPaneHeight',
                `${newHeight}px`
            );

            bottomPane.style.height =
                `${newHeight}px`;
        }
    );

}

