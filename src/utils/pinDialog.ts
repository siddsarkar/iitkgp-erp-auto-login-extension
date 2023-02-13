// create a pin dialog using html
const pinDialog = document.createElement('dialog')
pinDialog.id = 'pinDialog'
pinDialog.open = false
pinDialog.innerHTML = `
  <div class="prompt">
    Enter your 4 digit PIN
  </div>
  <form class="digit-group" data-group-name="digits" data-autosubmit="false" autocomplete="off">
	<input type="password" id="digit-1" name="digit-1" data-next="digit-2" />
    <input type="password" id="digit-2" name="digit-2" data-next="digit-3" data-previous="digit-1" />
    <input type="password" id="digit-3" name="digit-3" data-next="digit-4" data-previous="digit-2" />
    <input type="password" id="digit-4" name="digit-4"  data-previous="digit-3" />
  </form>
	<button id="pinDialogCloseBtn">Close</button>
`

const style = document.createElement('style')
style.innerHTML = `
body {
  overflow: hidden;
}
dialog {
    z-index: 2147483646 !important;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 200px;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    padding: 0;
    margin: 0;
    
    background-color: #fff;
    // background-color: #0f0f1a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    background-image: url("${chrome.runtime.getURL('assets/images/ext_icon.png')}");
    background-repeat: no-repeat;
    background-position: left 10px bottom 10px;
    background-size: 50px;
    background-opacity: 0.5;
  }
  
  dialog::backdrop {
    background-color: rgba(0 0 0 / 0.5);
    backdrop-filter: blur(1px);
  }

  
.digit-group input {
  width: 30px;
  height: 50px;
  // background-color: #18182a;
  background-color: #fff;
  border: 2px solid gray;
  border-radius: 5px;
  border-opacity: 0.5;
  line-height: 50px;
  text-align: center;
  font-size: 24px;
  font-family: "Raleway", sans-serif;
  font-weight: 200;
  // color: white;
  color: black;
  margin: 0 2px;
}

.prompt {
  margin-bottom: 20px;
  font-size: 16px;
  // color: white;
  color: black;
}
#pinDialogCloseBtn {
  margin-top: 20px;
  border-radius: 5px;
  border: none;
  // color: white;
  color: black;
}
`

async function getPinFromDialog(): Promise<string> {
  let pin = ''
  // add the elements to the DOM
  document.head.appendChild(style)
  document.body.appendChild(pinDialog)

  // show the pin dialog
  pinDialog.showModal()

  // get the pin from the dialog
  // convert above jQuery code to javascript
  const pinDialogCloseBtn = document.getElementById('pinDialogCloseBtn') as HTMLButtonElement
  pinDialogCloseBtn.addEventListener('click', () => {
    pinDialog.close()
  })
  const digitGroups = document.querySelectorAll('.digit-group')
  digitGroups.forEach((digitGroup) => {
    const inputs = digitGroup.querySelectorAll('input')
    inputs.forEach((input) => {
      input.setAttribute('maxlength', '1')
      input.addEventListener('keyup', (e) => {
        const parent = input.parentElement as any
        if (e.keyCode === 8 || e.keyCode === 37) {
          const prev = parent.querySelector(`input#${input.dataset.previous}`)
          if (prev) prev.select()
        } else if (
          (e.keyCode >= 48 && e.keyCode <= 57) ||
          (e.keyCode >= 65 && e.keyCode <= 90) ||
          (e.keyCode >= 96 && e.keyCode <= 105) ||
          e.keyCode === 39
        ) {
          const next = parent.querySelector(`input#${input.dataset.next}`)
          if (next) next.select()
          else if (parent.dataset.autosubmit) {
            // print the pin
            console.log(inputs[0].value + inputs[1].value + inputs[2].value + inputs[3].value)
            pin = inputs[0].value + inputs[1].value + inputs[2].value + inputs[3].value
            pinDialog.close()
          }
        }
      })
    })
  })

  // wait for the pin to be entered
  await new Promise((resolve) => {
    pinDialog.addEventListener('close', resolve)
  })

  // remove the pin dialog
  pinDialog.remove()
  style.remove()

  return new Promise((resolve, reject) => {
    resolve(pin)
  })
}

export default getPinFromDialog
