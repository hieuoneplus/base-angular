export interface ITransferChannelConfigsContent {
    stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
    id: number;
    transferChannel: string;
    priority: number;
    transferType: string;
    active: boolean;
    reason: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
  }
  
  export interface IGetTransferChannelConfigParams {
    transferType?: string;
    type?: string
  }

  
  export interface IDetailModel {
    label?: string;
    title?: string;
    message?: string;
    innerHTML?: any;
    acceptBtn?: string;
    closeBtn?: string;
    panelClass?: string; /* for custom style */
    description?: string;
    confirm?: string;
    position?: any;
    data?: any;
    note?: string;
    isShowCheckBox?: boolean;
  }
  
  export interface IPutListPriorities {
    priorities: IListPriorities[]
    reason?: string;
  }

  export interface IListPriorities {
    id?: number;
    priority?: number;
  }
  export interface IPutActive {
    id?: number;
    active?: boolean;
    reason?: string;
  }
  