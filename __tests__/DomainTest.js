const MissionUtils = require('@woowacourse/mission-utils');
const User = require('../src/User');
const Lotto = require('../src/Lotto');

const mockQuestions = (answers) => {
  MissionUtils.Console.readLine = jest.fn();
  answers.reduce((acc, input) => {
    return acc.mockImplementationOnce((question, callback) => {
      callback(input);
    });
  }, MissionUtils.Console.readLine);
};

const mockRandoms = (numbers) => {
  MissionUtils.Random.pickUniqueNumbersInRange = jest.fn();
  numbers.reduce((acc, number) => {
    return acc.mockReturnValueOnce(number);
  }, MissionUtils.Random.pickUniqueNumbersInRange);
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, 'print');
  logSpy.mockClear();
  return logSpy;
};

describe('기능 1번. 로또 구입 금액 입력 받기', () => {
  test('숫자 이외의 타입을 입력한 경우', () => {
    const user = new User();
    mockQuestions(['1000d ']);
    expect(() => user.getUserMoney()).toThrow('[ERROR]');
  });
  test('1000원 미만의 값을 입력한 경우', () => {
    const user = new User();
    mockQuestions(['900']);
    expect(() => user.getUserMoney()).toThrow('[ERROR]');
  });
  test('NUMBER.MAX_SAFE_INTEGER 이상 값을 입력한 경우', () => {
    const user = new User();
    mockQuestions([`${Number.MAX_SAFE_INTEGER}`]);
    expect(() => user.getUserMoney()).toThrow('[ERROR]');
  });
  test('1000원으로 나누어 떨어지지 않는 경우', () => {
    const user = new User();
    mockQuestions(['1350']);
    expect(() => user.getUserMoney()).toThrow('[ERROR]');
  });
  test('값을 제대로 입력한 경우', () => {
    const logSpy = getLogSpy();
    const user = new User();
    mockQuestions(['8 00 0']);
    user.getUserMoney();
    expect(logSpy).toHaveBeenCalledWith('유효한 입력입니다.');
  });
});

describe('기능 2번. 로또 구입 금액 만큼의 로또 번호 생성', () => {
  test('입력받은 금액 만큼의 로또 발행', () => {
    const user = new User();
    mockQuestions(['8000']);
    user.getUserMoney();
    expect(user.lottoList.length).toEqual(8);
  });
});
