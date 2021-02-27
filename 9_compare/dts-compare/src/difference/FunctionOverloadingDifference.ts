import Difference from './Difference';

export default class FunctionOverloadingDifference implements Difference {
  private functionIdentifier: string;
  private expectedNumberOfOverloadings: number;
  private actualNumberOfOverloadings: number;

  static CODE = 'function-overloading-difference';

  code = FunctionOverloadingDifference.CODE;

  constructor(
    functionIdentifier: string,
    expectedNumberOfOverloadings: number,
    actualNumberOfOverloadings: number,
  ) {
    this.functionIdentifier = functionIdentifier;
    this.expectedNumberOfOverloadings = expectedNumberOfOverloadings;
    this.actualNumberOfOverloadings = actualNumberOfOverloadings;
  }
}
