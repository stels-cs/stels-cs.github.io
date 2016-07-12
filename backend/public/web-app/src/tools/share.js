export function share() {
    let url = 'https://vk.com/share.php?';
    url += 'url=https://vk.com/app5533090';
    url += '&title=Pinder';
    url += '&description=Новый способ знакомства в сообществах ВКонтакте';
    let win = window.open(url, '_blank');
    win.focus();
}