// Advanced Object Manipulation and Prototypes
const baseObject = {
  baseProp: "Base",
  baseMethod() {
    console.log("Base method called.");
  },
};

const derivedObject = Object.create(baseObject);
derivedObject.derivedProp = "Derived";
derivedObject.derivedMethod = function() {
  console.log("Derived method called.");
  this.baseMethod();
};

derivedObject.derivedMethod();
console.log(derivedObject.baseProp);

// Metaprogramming with Reflect API
const obj = { x: 1, y: 2 };
console.log(Reflect.has(obj, "x"));
console.log(Reflect.get(obj, "y"));
Reflect.set(obj, "z", 3);
console.log(obj.z);

// WeakMaps and WeakSets
let weakMapKey = { id: 1 };
let weakSetKey = { id: 2 };

const wm = new WeakMap();
const ws = new WeakSet();

wm.set(weakMapKey, "data");
ws.add(weakSetKey);

console.log(wm.has(weakMapKey));
console.log(ws.has(weakSetKey));

weakMapKey = null;
weakSetKey = null;

// (After garbage collection, wm and ws will no longer have those keys)
// console.log(wm.has(weakMapKey)); // false
// console.log(ws.has(weakSetKey)); // false

// Dynamic Imports (requires a module environment)
async function loadModule() {
  try {
    const module = await import("./dynamicModule.js"); // Assuming dynamicModule.js exists
    module.dynamicFunction();
  } catch (error) {
    console.error("Dynamic import error:", error);
  }
}

// loadModule();

// Typed Arrays and ArrayBuffers
const buffer = new ArrayBuffer(16);
const view = new Uint32Array(buffer);

view[0] = 10;
view[1] = 20;
console.log(view[0], view[1]);

// Web APIs (if in a browser environment)
// Example: Fetch API with complex request
async function fetchComplexData() {
  try {
    const response = await fetch("https://api.example.com/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer token",
      },
      body: JSON.stringify({ key: "value" }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// fetchComplexData();

// Symbol.iterator and Custom Iterators
const customIterable = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        } else {
          return { done: true };
        }
      },
    };
  },
};

for (const item of customIterable) {
  console.log("Custom iterable item:", item);
}

// Tail Call Optimization (not guaranteed in all JS engines)
function factorial(n, acc = 1) {
    if (n <= 1) {
        return acc;
    }
    return factorial(n - 1, n * acc);
}

console.log(factorial(10));

// BigInts
const bigNumber = 9007199254740991n + 1n;
console.log("BigInt:", bigNumber);

// Regular Expressions with Named Capture Groups
const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const dateString = "2023-10-27";
const match = regex.exec(dateString);
console.log("Named capture groups:", match.groups.year, match.groups.month, match.groups.day);

// SharedArrayBuffer and Atomics (requires a shared memory environment)
// const sharedBuffer = new SharedArrayBuffer(16);
// const sharedArray = new Int32Array(sharedBuffer);
// Atomics.add(sharedArray, 0, 5);
// console.log("SharedArrayBuffer:", sharedArray[0]);

// Internationalization API
const date = new Date();
const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date);
console.log(formattedDate);