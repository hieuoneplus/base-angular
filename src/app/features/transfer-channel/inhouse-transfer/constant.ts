import { ModuleKeys } from "src/app/public/module-permission.utils"

export const availableConfigs = [
  {
    moduleName: ModuleKeys.inhouse_transfer_channel_state,
    configName: "Cấu hình bật/tắt luồng hạch toán GD BĐB vào T24",
    pageUrl: "/pmp_admin/transfer-channel/inhouse-transfer/configs",
    icon: 'ic-settings',
    permission_module: "inhouse-transfer-channel-state",
  },
  {
    moduleName: ModuleKeys.inhouse_config,
    configName: "Cấu hình tham số bảo vệ T24",
    pageUrl: "/pmp_admin/transfer-channel/inhouse-transfer/t24-protection",
    icon: 'ic-settings',
    permission_module: "inhouse-config",
  },
]
