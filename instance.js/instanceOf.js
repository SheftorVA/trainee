function instanceOf(x, y) {
  if (x == null) return false;

  if (typeof x !== 'object' && typeof x !== 'function') return false;

  if (!y.prototype) {
    throw new TypeError(`Right-hand side of 'instanceof' is not an object`);
  }

  if (Object.getPrototypeOf(x) === y.prototype) {
    return true;
  } else {
    let pr = Object.getPrototypeOf(x);
    return instanceOf(pr, y);
  }
}

class User {
  constructor(names, ages) {
    this.names = names;
    this.ages = ages;
  }
}

class Man extends User {
  constructor(surname) {
    super();
    this.personName = super.names;
    this.personAge = super.ages;
    this.personSurname = surname;
  }
}

function f() {}
const user = new User('Vlados', 23);
const man = new Man('Surname', 'Name', 22);
