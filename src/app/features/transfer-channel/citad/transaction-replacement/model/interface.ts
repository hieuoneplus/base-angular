import {IConfig} from "../../../../model/citad";

export interface ITransactionReplacement extends IConfig {
  value: {
    $type: "replacement";
    replacements: object
  };
}

export interface IReplaceSpecialCharDetail {
  field: string,
  target: string,
  replacement: string,
}

export interface IRequestUpdateReplaceSpecialChar {
  key: string;
  value: {
    $type: string,
    replacements: object,
  };
  reason: string
}
