function Shape(Input, Factor = 0) {
  var Sign = el.div(Input, el.abs(Input));
  var Positive = el.mul(
    el.pow(el.abs(Input), el.div(1, el.sub(1, Factor))),
    Sign,
    el.div(el.add(el.div(Factor, el.abs(Factor)), 1), 2)
  );
  var Negative = el.mul(
    el.pow(el.abs(Input), el.add(Factor, 1)),
    Sign,
    el.div(el.add(el.mul(el.div(Factor, el.abs(Factor)), -1), 1), 2)
  );
  return el.add(Positive, Negative);
}
