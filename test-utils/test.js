import nodeAssert from 'assert';

const state = {
  total: 0,
  failed: 0,
  passed: 0,
};

const RESET = "\x1b[0m";
const FG_RED = "\x1b[31m";
const FG_GREEN = "\x1b[32m";
const FG_YELLOW = "\x1b[33m";
const FG_BLUE = "\x1b[34m";
const FG_MAGENTA = "\x1b[35m";
const FG_CYAN = "\x1b[36m";
const FG_WHITE = "\x1b[37m";
const BG_RED = "\x1b[41m";
const BG_GREEN = "\x1b[42m";
const BG_YELLOW = "\x1b[43m";
const BG_WHITE = "\x1b[47m";

const colored = (color, message) => (color + message + RESET);

export const log = {
  run: console.log,
  pass: console.log,
  fail: console.log,
  info: console.log,
  default: console.log,
};

export const test = (message, fn) => {
  try {
    fn();
    state.total += 1;
    state.passed += 1;
    log.pass(colored(BG_GREEN, 'PASSED'), message);
  } catch(e) {
    state.total += 1;
    state.failed += 1;
    log.fail(colored(BG_RED, 'FAILED '), message);
    log.info(colored(FG_RED, 'expected '), e.expected);
    log.info(colored(RESET, 'to '), e.operator);
    log.info(colored(FG_GREEN, 'actual '), e.actual);

    return e;
  }
};

export const assert = nodeAssert;

// END TESTS
export const endTests = () => {
  log.info(
    "\n",
    colored(FG_YELLOW, 'total: '), colored(RESET, state.total),
    colored(FG_GREEN, 'passed: '), colored(RESET, state.passed),
    colored(FG_RED, 'failed: '), colored(RESET, state.failed)
  );

  if (state.failed) {
    process.exit(1);
  }

  process.exit(0);
}

export default {
  test,
  log,
  assert: nodeAssert,
  endTests,
};
