// DOM controls support independent fingers and share the existing keyboard physics.
export const touchInput = { left: false, right: false, jump: false };
const controlPointers = new Map();
export function clearControls() {
    controlPointers.clear();
    touchInput.left = touchInput.right = touchInput.jump = false;
    document.querySelectorAll('[data-control]').forEach(button => button.classList.remove('pressed'));
}
export function showControls(show) {
    clearControls();
    document.getElementById('touch-controls').hidden = !show;
}
document.querySelectorAll('[data-control]').forEach(button => {
    button.addEventListener('pointerdown', event => {
        event.preventDefault();
        controlPointers.set(event.pointerId, button.dataset.control);
        touchInput[button.dataset.control] = true;
        button.classList.add('pressed');
        button.setPointerCapture(event.pointerId);
    });
    function release(event) {
        const action = controlPointers.get(event.pointerId);
        controlPointers.delete(event.pointerId);
        if (action && !Array.from(controlPointers.values()).includes(action)) touchInput[action] = false;
        button.classList.remove('pressed');
    }
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
});
window.addEventListener('blur', clearControls);
document.addEventListener('visibilitychange', clearControls);
