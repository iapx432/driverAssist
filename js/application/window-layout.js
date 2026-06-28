// window-layout.js

import { 
    getSettingValue,
    setSettingValue
} 
from "../settings/settings.js";

let dragging = false;    

export function initialiseWindowLayout() {

    // set initial height of bottom pane from local storage or default to 150px
    const bottomPane =
        document.getElementById(
            'bottomPane'
        );

    bottomPane.style.height = getSettingValue('bottomPaneHeight') ?? '150px';

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

            // save new height to settings
            const newHeightHtml = setSettingValue ('bottomPaneHeight', `${newHeight}px`);

            // update the bottom pane height
            bottomPane.style.height = newHeightHtml;
        }
    );

}

