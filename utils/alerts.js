export function showInfo(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}
export function showToastCloseSuccess(message) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showConfirmButton: false,
        color: '#f4f0f0ff',
        showCloseButton: true,
        timer: 3000,
        background: '#09873cff',
        timerProgressBar: true,
        icon: 'success',
        title: message,
    });
}
export function showToastCloseError(message) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showConfirmButton: false,
        color: '#f4f0f0ff',
        showCloseButton: true,
        background: '#b60f0cff',
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: message,
    });
}
export function showToast(message, icon) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
        icon: icon,
        title: message,
    });
}