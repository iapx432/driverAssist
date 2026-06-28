export function setSettingValue(id, value) {
    localStorage.setItem(
        id,
        value
    );

    return value;
}

export function getSettingValue(id) {
    return localStorage.getItem(
        id
    );
}
