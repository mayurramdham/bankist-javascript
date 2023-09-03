'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          
          <div class="movements__value">${mov}EUR</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);

const calBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};
// calBalance(accounts);
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const updateUI = function (acc) {
  // displayMovements
  displayMovements(acc.movements);
  // calDisplaySummary
  calDisplaySummary(acc);
  // calBalance
  calBalance(acc);
};
console.log(createUserName(accounts));
console.log(accounts);

const calDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}EUR`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}EUR`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}EUR`;
};

// calDisplaySummary(account1.movements);
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
  // ChangingUI
  updateUI(currentAccount);
});

// Money Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // transfering money
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Displaying UI
    updateUI(currentAccount);
  }
  inputTransferAmount.value = '';
});

// Getting Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    // updateUI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
// Delete the Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  );
  {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);
    // Delteing the userAccount
    accounts.splice(index, 1);
    // Loging out the account
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const balance = movements.reduce((acc, curr) => curr + acc, 0);

console.log(balance);
let balance2 = 0;

for (const mov of movements) balance2 += mov;
console.log(balance2);

const max = movements.reduce(function (acc, cur) {
  if (acc > cur) {
    return acc;
  } else {
    return cur;
  }
}, movements[0]);
console.log(max);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(1));
// console.log(arr.slice(2));
// console.log(arr.slice(-4));
// console.log(arr.slice());
// console.log([...arr]);

// console.log(arr.splice(2));
// console.log(arr);
// console.log(arr.length);

// const arr2 = ['m', 'a', 'y', 'u', 'r'];
// console.log(arr2);
// // console.log(arr2.reverse());
// console.log(arr2);

// const letters = arr.join(arr2);
// console.log(letters);
// console.log(...arr, ...arr2);

// const movements = [200, 450, -820, 853, -960, -632, 250, -785, 965, -253];
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} You withdrwal ${Math.abs(movement)}`);
//   }
// }

// console.log('----For Each-----');
// movements.forEach(function (movement, i) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} You withdrwal ${Math.abs(movement)}`);
//   }
// });

// const dogOwner1 = {
//   name: 'dog1',
//   age: '5',
// };
// const dogOwner2 = {
//   name: 'dog2',
//   age: '2',
// };
// const dogOwner3 = {
//   name: 'dog3',
//   age: '1',
// };
// const dogOwner4 = {
//   name: 'dog4',
//   age: '6',
// };
// const dogOwner5 = {
//   name: 'dog5',
//   age: '3',
// };

// const dogOwner = [dogOwner1, dogOwner2, dogOwner3, dogOwner4, dogOwner5];

// dogOwner.forEach(function () {
//   if (age > 3) {
//     console.log('Its puppuy');
//   }
// });

// const checkDogs = function (dogsjulia, dogkats) {
//   const dogsjuliaCorrected = dogsjulia.slice();

//   dogsjuliaCorrected.splice(0, 1);
//   dogsjuliaCorrected.splice(-2);
//   const corretDogs = dogsjuliaCorrected.concat(dogkats);
//   console.log(corretDogs);
//   corretDogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log('dogs');
//     } else {
//       console.log('puppy');
//     }
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// const rupeesTuUSD = 80.0;
// const newUSD = movements.map(function (mov) {
//   return mov * rupeesTuUSD;
// });

// console.log(newUSD);

// const movementUSDfor = [];
// for (const mov of movements) movementUSDfor.push(mov * rupeesTuUSD);
// console.log(movementUSDfor);

// console.log(movements);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits);
// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdraw = [];
// const withdrwal = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(withdrwal);

// for (const mov of movements) if (mov < 0) withdraw.push(mov);
// console.log(withdraw);

// Coding challenge 2
// let humanAge = 0;
// const calcAverageHumanAge = function (ages) {
//   const dogAge = ages.map(function (dogages) {
//     if (dogages <= 2) {
//       return (humanAge = 2 * dogages);
//     } else if (dogages > 2) {
//       return (humanAge = 16 + dogages * 4);
//     }
//   });
//   console.log(dogAge);
// };

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);
//   const adults = humanAges.filter(function (age) {
//     return age >= 18;
//   });
//   console.log(adults);
//   // const avg = adults.reduce((acc, ages) => acc + ages, 0) / adults.length;
//   // return avg;
//   const avg1 = adults.reduce(function (acc, ages) {
//     return acc + ages / adults.length;
//   }, 0);
//   console.log(avg1);
// };

// checkDogs(, [4, 1, 15, 8, 3]);
// console.log(average);

// coding challenge 3
// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// const average = calcAverageHumanAge([3, 5, 2, 12, 7]);

// console.log(average);
// const eurToUSd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUSd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     console.log(acc);
//   }
// }

//
// const anyDeposits = movements.filter(mov => mov > 0);
// console.log(anyDeposits);

// some function
// console.log(movements.includes(-130));
// const anyDeposit = movements.some(mov => mov > 0);
// console.log(anyDeposit);

// Flat and FaltMap

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);

// const overAllBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, curr) => acc + curr, 0);

// console.log(overAllBalance);

// const overAllBalance2 = accounts
//   .flatMap(acc => acc.movements)

//   .reduce((acc, curr) => acc + curr, 0);

// console.log(overAllBalance2);

// Array practise
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// console.log(movements);

// const future = new Date(2037, 11, 19, 15, 23);
// console.log(future.getFullYear());
// future.setFullYear(2040);
// console.log(future);

currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

function getCurrentIndianDateTime() {
  // Create a new Date object
  const date = new Date();

  // Set the options for formatting the date and time
  const options = {
    timeZone: 'Asia/Kolkata', // Set the time zone to Indian Standard Time (IST)
    weekday: 'long', // Get the full name of the day of the week
    year: 'numeric', // Get the full year (e.g., 2023)
    month: 'long', // Get the full name of the month
    day: 'numeric', // Get the day of the month (e.g., 16)
    hour: 'numeric', // Get the hour (e.g., 10 for 10:00 AM/PM)
    minute: 'numeric', // Get the minute (e.g., 30)
    second: 'numeric', // Get the second (e.g., 45)
    hour12: true, // Use 12-hour time format (AM/PM)
  };

  // Format the date and time according to the options
  const formattedDate = date.toLocaleString('en-IN', options);

  return formattedDate;
}

// Function to update the displayed date and time
function updateDateTime() {
  const currentDateTime = getCurrentIndianDateTime();
}

// Call the updateDateTime function immediately to display the current date and time
// updateDateTime();

// Call the updateDateTime function every second (1000 milliseconds) to update the date and time
const newdate = document.querySelector('.date');

const setI = setInterval(updateDateTime, 1000);
newdate.textContent = getCurrentIndianDateTime();
