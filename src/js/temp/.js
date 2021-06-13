// function handleMessageResponse(response) {
//     if (response.action === 'update_check') {
//         const { update, message } = response
//         document.getElementById('update-btn').textContent = message

//         if (update) {
//             document.getElementById(
//                 'update-default-icon'
//             ).style.display = 'none'
//             document.getElementById(
//                 'update-found-icon'
//             ).style.display = 'block'
//             document.getElementById('update-btn').disabled = true

//             const whatsNew = document.createElement('p')
//             whatsNew.id = 'update_checked'
//             whatsNew.className = 'panel-card-label'
//             whatsNew.innerText = update.release_notes['en-US']

//             document
//                 .getElementById('panel-update')
//                 .appendChild(whatsNew)
//         } else {
//             document.getElementById(
//                 'update-default-icon'
//             ).style.display = 'none'
//             document.getElementById(
//                 'no-update-found-icon'
//             ).style.display = 'block'
//         }
//     }
// }

// function messageTab(action, msg = '') {
//     const sending = browser.runtime.sendMessage({
//         action,
//         query: msg
//     })
//     sending.then(handleMessageResponse, (err) =>
//         console.log(`Error: ${err}`)
//     )
// }

// updateBtn.onclick = () => {
//     if (document.getElementById('update_checked')) {
//         document.getElementById('update_checked').remove()
//         document.getElementById('update-btn').textContent =
//             'Checking for updates...'
//         document.getElementById(
//             'update-default-icon'
//         ).style.animation = 'rotate-svg-icon infinite 1s linear'
//         document.getElementById('update-default-icon').style.fill =
//             'crimson'
//         messageTab('update_check')
//     } else {
//         document.getElementById('update-btn').textContent =
//             'Checking for updates...'
//         document.getElementById(
//             'update-default-icon'
//         ).style.animation = 'rotate-svg-icon infinite 1s linear'
//         document.getElementById('update-default-icon').style.fill =
//             'crimson'
//         messageTab('update_check')
//     }
// }
