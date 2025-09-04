import {IConfig} from "../../../../model/citad";

export interface IAccountParameter extends IConfig {
  value: {
    $type: "account.parameter";
    accountParameters: IAccountParameterDetail[]
  };
}

export interface IAccountParameterDetail {
  auto: boolean,
  creditAccountNo: string,
  parameter: string,
  priority: number,
  processingUnit?: string,
  type: string
}

export interface IRequestUpdateAccountParameter{
  key: string;
  value: {
    $type: string,
    accountParameters: any[],
  };
  reason: string
}
