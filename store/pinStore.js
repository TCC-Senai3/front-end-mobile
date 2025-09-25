// Funções para manipulação de PIN
let pin = '';

export function setPin(newPin) {
  pin = newPin;
}

export function getPin() {
  return pin;
}

export function clearPin() {
  pin = '';
}
