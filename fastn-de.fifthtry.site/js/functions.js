(function () {
    function getWindowPosition() {
        window.document.querySelectorAll(".top-bar").forEach(topBar => {
            console.log(topBar.getBoundingClientRect())
        })
    }
    window.getWindowPosition = getWindowPosition;
}())

