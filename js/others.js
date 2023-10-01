const ic = document.querySelector('#ic')
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
let p1 = 'img/logo_light.png', p2 = 'img/logo_dark.png'


if(location.href.includes('vsP.html')) {
    p1 = '../' + p1
    p2 = '../' + p2
}

if(darkModeMediaQuery.matches) ic.href = p1
else ic.href = p2


darkModeMediaQuery.addEventListener('change', (e) => {
    if(e.matches) ic.href = p1
    else ic.href = p2
})