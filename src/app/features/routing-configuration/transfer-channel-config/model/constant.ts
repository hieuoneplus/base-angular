import {NgSelectItem, TextboxItem} from "@shared-sm";

export const TRANSFER_CHANNEL = () => new NgSelectItem({
    key: 'transferChannel',
    label: 'Kênh chuyển tiền',
    placeholder: 'Chọn kênh chuyển tiền',
    value: null,
    options: SELECT_CHANNEL,
    layout: '50',
  });

export const TRANSFER_TYPE = () => new NgSelectItem({
  key: 'transferType',
  label: 'Phân loại',
  placeholder: 'Chọn phân loại',
  value: null,
  options: [
    {
      value: 'FAST - Kênh chuyển tiền nhanh',
      key: 'FAST',
    },
    {
      value: 'IBPS - Kênh chuyển tiền thường',
      key: 'IBPS',
    },
  ],
  layout: '50',
});


export const SELECT_CHANNEL = [
    {
      value: 'INHOUSE',
      key: 'INHOUSE',
    },
    {
      value: 'NAPAS2',
      key: 'NAPAS2',
    },
    {
      value: 'BILATERAL',
      key: 'BILATERAL',
    },
    {
      value: 'IBFT',
      key: 'IBFT',
    },
    {
      value: 'ACH',
      key: 'ACH',
    },
    {
      value: 'BIDV',
      key: 'BIDV',
    },
    {
      value: 'CITAD',
      key: 'CITAD',
    },
    {
      value: 'VCB',
      key: 'VCB',
    },
    // {
    //   value: 'SML',
    //   key: 'SML',
    // },
  ]