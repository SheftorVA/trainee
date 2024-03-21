function stringify(value) {
  if (typeof value === 'string') {
    const result = value.replace(/["\n\t\r\f\b\\]/g, (match) => {
      if (match === '\n') return '\\n';
      if (match === '\t') return '\\t';
      if (match === '\r') return '\\r';
      if (match === '\b') return '\\b';
      if (match === '\\') return '\\\\';
      return '\\' + match;
    });

    return `"${result}"`;
  }

  if (
    (typeof value === 'number' && !isNaN(value) && isFinite(value)) ||
    typeof value === 'boolean'
  ) {
    return `${value}`;
  }

  if (typeof value === 'bigint') {
    throw new TypeError('Do not know how to serialize a BigInt');
  }

  if (value?.toJSON) {
    return `"${value.toJSON()}"`;
  }

  if (value === null || (typeof value === 'number' && !isFinite(value))) {
    return 'null';
  }

  if (
    value === undefined ||
    typeof value === 'symbol' ||
    typeof value === 'function'
  ) {
    return undefined;
  }

  if (Array.isArray(value)) {
    let result = [];

    result = value.map((item) => {
      if (
        typeof item === 'function' ||
        typeof item === 'symbol' ||
        item == undefined
      ) {
        return 'null';
      } else {
        return stringify(item);
      }
    });
    return `[${result.join(',')}]`;
  }

  if (typeof value === 'object') {
    let result = [];

    for (const [key, element] of Object.entries(value)) {
      if (value[key] === value) {
        throw new TypeError('Converting circular structure to JSON');
      }

      if (
        typeof element === 'function' ||
        typeof element === 'symbol' ||
        element === undefined
      ) {
        continue;
      }

      result.push(`${stringify(key)}:${stringify(element)}`);
    }

    return `{${result.join(',')}}`;
  }
}

const obj = {
  key1: 'val1',
  key2: 2,
  key3: { name: 'Valdos', age: 23 },
  fn() {},
  key4: Symbol('id'),
  key5: NaN,
  Key6: null,
  Key7: undefined,
  Key8: +Infinity,
  Key9: -Infinity,
  Key10: 'Строка "строка внутри двойных кавычек"',
  Key11: 'key',
  Key12: '\n',
  Key13: '\t',
  Key14: '\r',
  Key15: '\b',
  Key16: '\\',
  // Key17: this,
  // Key18: 10n,
  Key19: new Date(),
};
