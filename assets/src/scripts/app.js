import Utils from "./classes/class.utils.js";

(()=> {

  const serialized = Utils.serialize({
    foo: 'bar'
  });

  console.log(serialized);

})();
