const INVALID_PARAMETERS_CODE = '-4000'

export default class ErrorUtils {

    public static getErrorMessage(errorResponse) {
        try {
            const obj = errorResponse?.error;
            
            // Handle case where error is already an object
            if (obj && typeof obj === 'object') {
                if (obj.status === 403) return ['Người dùng không có quyền truy cập'];
                
                // Check if it's already parsed or needs parsing
                let error = obj;
                if (typeof obj === 'string') {
                    try {
                        error = JSON.parse(obj);
                    } catch (parseError) {
                        console.warn('Failed to parse error response:', parseError);
                        return [obj || 'Lỗi hệ thống'];
                    }
                }
                
                if (error?.soaErrorCode) {
                    const message = errorMessages[error.soaErrorCode];
                    if (message) {
                        return [message];
                    } else {
                        return error.soaErrorDesc ? [error.soaErrorDesc] : ['Lỗi hệ thống'];
                    }
                } else if (error?.message) {
                    return [error.message];
                } else if (error?.error) {
                    return [error.error];
                } else {
                    return error.soaErrorDesc ? [error.soaErrorDesc] : ['Lỗi hệ thống'];
                }
            } 
            // Handle case where error is a string
            else if (typeof obj === 'string') {
                try {
                    const parsedError = JSON.parse(obj);
                    return this.getErrorMessage({ error: parsedError });
                } catch {
                    return [obj];
                }
            }
            // Handle case where error is null/undefined but we have status
            else if (errorResponse?.status) {
                if (errorResponse.status === 401) {
                    return ['Tên đăng nhập hoặc mật khẩu không đúng'];
                } else if (errorResponse.status === 403) {
                    return ['Người dùng không có quyền truy cập'];
                } else if (errorResponse.status === 500) {
                    return ['Lỗi máy chủ. Vui lòng thử lại sau'];
                } else if (errorResponse.status === 0) {
                    return ['Không thể kết nối đến máy chủ'];
                }
            }
            
            return ['Lỗi hệ thống'];
        } catch (error) {
            console.error('Error in getErrorMessage:', error);
            return ['Lỗi hệ thống'];
        }
    }
}

const errorMessages = {
    // "008006-4000": "Giá trị đầu vào không hợp lệ. Vui lòng kiểm tra lại",
    "008006-4002": "Người dùng không có quyền thao tác. Vui lòng kiểm tra lại ",
    "008006-4806": "Người dùng đã được thêm. Vui lòng không thêm mới",
    "008006-4808": "Vai trò không tồn tại. Vui lòng kiểm tra lại",
    "008006-5000": "Hệ thống tạm thời gián đoạn. Vui lòng thực hiện lại sau",
    "008006-5807": "Có lỗi xảy ra trong quá trình truy vấn thông tin người dùng. Vui lòng thử lại sau",
    "008006-5808": "Có lỗi xảy ra trong quá trình truy vấn thông tin người dùng. Vui lòng thử lại sau",
    "008006-5809": "Không tìm thấy tài khoản. Vui lòng kiểm tra lại",
    "008006-5801": "Hệ thống tạm thời gián đoạn. Vui lòng thực hiện lại sau",
    "008006-5800": "Có lỗi xảy ra trong quá trình gán vai trò cho người dùng. Vui lòng thử lại sau",
    "008006-5804": "Có lỗi xảy ra trong quá trình thêm người dùng. Vui lòng thử lại sau",
    "008006-5805": "Có lỗi xảy ra trong quá trình thêm người dùng. Vui lòng thử lại sau",
    "008006-5806": "Có lỗi xảy ra trong quá trình thêm người dùng. Vui lòng thử lại sau",
    "008006-4807": "Không tìm thấy tài khoản. Vui lòng kiểm tra lại",
    "008006-5812": "Chỉ thêm người dùng có số điện thoại hợp lệ",
    "008006-4800": "Người dùng không tồn tại. Vui lòng kiểm tra lại",
    "008006-4001": "Hết phiên bản đăng nhập. Vui lòng đăng nhập lại",
    "008006-5802": "Hệ thống tạm thời gián đoạn. Vui lòng thực hiện lại sau",
    "008006-5803": "Hệ thống tạm thời gián đoạn. Vui lòng thực hiện lại sau",
    "008006-4805": "Người dùng không có quyền thao tác. Vui lòng kiểm tra lại",
    "008006-4801": "Vai trò đã tồn tại. Vui lòng không thêm mới",
    "008006-4803": "Quyền gán cho vai trò không tồn tại. Vui lòng kiểm tra lại",
    "008006-4804": "Vai trò không tồn tại. Vui lòng kiểm tra lại",
    // "008006-4802": "",
    "008006-5821": "Trùng tên loại tài khoản",
    "008006-5819": "Tạo thất bại",
    "008006-4812": "Không tìm thấy account",
    "008006-5820": "Update thất bại",
    "008006-5813": "Có lỗi xảy ra trong quá trình lấy mã OTP. Vui lòng thử lại sau",
    "008006-5814": "Có lỗi xảy ra trong quá trình lấy mã OTP. Vui lòng thử lại sau",
    "008006-5815": "Có lỗi xảy ra trong quá trình lấy mã OTP. Vui lòng thử lại sau",
    "008006-5816": "Hết phiên xác thực OTP. Vui lòng thực hiện lại sau",
    "008006-5817": "Xác thực OTP thất bại",
    "008006-5822": "Trùng tên chanel + bank code",
    "008006-5823": "Tạo thất bại",
    "008006-4818": "Vượt quá giới hạn, vui lòng thử lại sau",
    "008006-5824": "Tạo thất bại",
    "008006-5830": "Lỗi xác thực token, vui lòng thử lại sau",
    "005001-4110": "Cấu hình không tồn tại. Vui lòng kiểm tra lại",
    "005001-4000": "Giá trị đầu vào không hợp lệ. Vui lòng kiểm tra lại",
    "005001-5000": "Hệ thống tạm thời gián đoạn. Vui lòng thực hiện lại sau",
    "005001-4001": "Hết phiên bản đăng nhập. Vui lòng đăng nhập lại",
    '008006-4144': 'Cấu hình đã tồn tại. Vui lòng không thêm mới',
    '008006-4138':
      'Có lỗi xảy ra trong quá trình chỉnh sửa cấu hình. Vui lòng thử lại sau',
    '008006-4143': 'Cấu hình không tồn tại. Vui lòng kiểm tra lại',
    'PAP-4144': 'Cấu hình đã tồn tại. Vui lòng không thêm mới',
    'PAP-4143':
      'Có lỗi xảy ra trong quá trình chỉnh sửa cấu hình. Vui lòng thử lại sau',
    'PAP-4138': 'Cấu hình không tồn tại. Vui lòng kiểm tra lại',
    'PAP-4820': 'File quá dung lượng. Vui lòng kiểm tra lại!',
    'PAP-4821': 'Có lỗi trong quá trình xử lý dữ liệu: File này chứa MsgID trùng nhau ở các bản ghi. Vui lòng kiểm tra lại!',
    'PAP-4822': 'File không đúng định dạng. Chỉ chấp nhận file Excel(*.xls, *.xlsx). Vui lòng kiểm tra lại!',
    'PAP-4823': 'Có lỗi trong quá trình xử lý dữ liệu: File không chứa MsgID nào. Vui lòng kiểm tra lại!',
    'PAP-4824': 'Có lỗi trong quá trình xử lý dữ liệu: Vượt quá giới hạn SL giao dịch tối đa cho phép (tối đa 1000 GD/1 lần upload). Vui lòng kiểm tra lại!',
    'PAP-4825': 'Có lỗi trong quá trình xử lý dữ liệu: Thiếu thông tin định nghĩa trường dữ liệu MsgId. Vui lòng kiểm tra lại!',
    'PAP-4826': 'Có lỗi trong quá trình xử lý dữ liệu: MsgID không hợp lệ. Vui lòng kiểm tra lại!',
    'PAP-4827': 'Có lỗi trong quá trình xử lý dữ liệu: Không tồn tại MsgID . Vui lòng kiểm tra lại!',
    'PAP-4831': 'Có lỗi xảy ra trong quá trình phê duyệt cấu hình. Vui lòng thử lại sau!',
    'PAP-4832': 'Có lỗi xảy ra trong quá trình phê duyệt cấu hình. Vui lòng thử lại sau!',
    'PAP-4828': 'Bản ghi đã tồn tại',
    'PAP-4829': 'Bản ghi đã tồn tại',
    'PAP-4840': 'Lịch sử cấu hình không tồn tại',
    'PAP-4839': 'Cấu hình không tồn tại',
    'PAP-5849': 'Cấu hình đã tồn tại',
    'PAP-5845': 'Cấu hình đã tồn tại',
    'PAP-4837': 'Cấu hình không tồn tại',
    'PAP-4838': 'Lịch sử cấu hình không tồn tại',
    'PAP-4843': 'Cấu hình không tồn tại',
    'PAP-4842': 'Cấu hình đã tồn tại',
    'PAP-4844': 'Lịch sử cấu hình không tồn tại',
    'PAP-5832': 'Cấu hình đã tồn tại. Vui lòng kiểm tra lại',
    'PAP-4852': 'Mã tỉnh thành/Tên tỉnh thành đã tồn tại. Vui lòng kiểm tra lại',
    'PAP-5855': 'Có lỗi xảy ra trong quá trình thêm tỉnh thành. Vui lòng thử lại sau',
    'PAP-5856': 'Có lỗi xảy ra trong quá trình cập nhật tỉnh thành. Vui lòng thử lại sau',

    'PAP-5807': 'Có lỗi xảy ra trong quá trình truy vấn thông tin người dùng. Vui lòng thử lại sau',
    'PAP-5808': 'Có lỗi xảy ra trong quá trình truy vấn thông tin người dùng. Vui lòng thử lại sau',
    'PAP-5809': 'Không tìm thấy tài khoản. Vui lòng kiểm tra lại',
    'PAP-5812': 'Tài khoản không có số điện thoại hợp lệ. Vui lòng kiểm tra lại',
    'PAP-5813': 'Có lỗi xảy ra trong quá trình lấy mã OTP. Vui lòng thử lại sau',
    'PAP-5814': 'Có lỗi xảy ra trong quá trình lấy mã OTP. Vui lòng thử lại sau',
    'PAP-5815': 'Có lỗi xảy ra trong quá trình lấy mã OTP. Vui lòng thử lại sau',
    'PAP-4000': 'Giá trị đầu vào không hợp lệ. Vui lòng kiểm tra lại',
    'PAP-5816': 'Hết phiên xác thực OTP. Vui lòng thực hiện lại sau',
    'PAP-5817': 'Xác thực OTP thất bại',
    'PAP-4001': 'Hết phiên bản đăng nhập. Vui lòng đăng nhập lại',
    'PAP-4002': 'Người dùng không có quyền thao tác. Vui lòng kiểm tra lại',
    'PAP-4806': 'Người dùng đã được thêm. Vui lòng không thêm mới',
    'PAP-4808': 'Vai trò không tồn tại. Vui lòng kiểm tra lại',
    'PAP-5000': 'Hệ thống tạm thời gián đoạn. Vui lòng thực hiện lại sau',
    'PAP-5804': 'Có lỗi xảy ra trong quá trình thêm người dùng. Vui lòng thử lại sau',
    'PAP-5805': 'Có lỗi xảy ra trong quá trình thêm người dùng. Vui lòng thử lại sau',
    'PAP-5806': 'Có lỗi xảy ra trong quá trình thêm người dùng. Vui lòng thử lại sau',
    'PAP-4807': 'Không tìm thấy tài khoản. Vui lòng kiểm tra lại',
    'PAP-4800': 'Người dùng không tồn tại. Vui lòng kiểm tra lại',
    'PAP-5802': 'Hệ thống tạm thời gián đoạn. Vui lòng thực hiện lại sau',
    'PAP-5803': 'Hệ thống tạm thời gián đoạn. Vui lòng thực hiện lại sau',
    'PAP-5801': 'Có lỗi xảy ra trong quá trình gán vai trò cho người dùng. Vui lòng thử lại sau',
    'PAP-5800': 'Có lỗi xảy ra trong quá trình gán vai trò cho người dùng. Vui lòng thử lại sau',
    'PAP-4805': 'Người dùng không có quyền thao tác. Vui lòng kiểm tra lại',
    'PAP-4801': 'Vai trò đã tồn tại. Vui lòng không thêm mới',
    'PAP-4803': 'Quyền gán cho vai trò không tồn tại. Vui lòng kiểm tra lại',
    'PAP-4804': 'Vai trò không tồn tại. Vui lòng kiểm tra lại',
    'PAP-5821': 'Cấu hình đã tồn tại. Vui lòng không thêm mới',
    'PAP-5819': 'Hệ thống tạm thời gián đoạn. Vui lòng thực hiện lại sau',
    'PAP-4812': 'Cấu hình không tồn tại. Vui lòng kiểm tra lại',
    'PAP-5820': 'Hệ thống tạm thời gián đoạn. Vui lòng thực hiện lại sau',
    '008006-4000': 'Giá trị đầu vào không hợp lệ. Vui lòng kiểm tra lại',
    '008006-4130': 'Cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '008006-4129': 'Cấu hình đã tồn tại. Vui lòng không thêm mới',
    '008006-4128': 'Cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '008006-4127': 'Cấu hình đã tồn tại. Vui lòng không thêm mới',
    '005005-4000': 'Giá trị đầu vào không hợp lệ. Vui lòng kiểm tra lại',
    '005005-4001': 'Hết phiên bản đăng nhập. Vui lòng đăng nhập lại',
    '005005-4002': 'Người dùng không có quyền thao tác. Vui lòng kiểm tra lại',
    '005005-4003': 'Dữ liệu không tồn tại. Vui lòng kiểm tra lại',
    '005005-4135': 'Cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '005005-4121': 'Cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '005005-4120': 'Cấu hình đã tồn tại. Vui lòng không thêm mới',
    '005005-4146': 'Cấu hình đã tồn tại. Vui lòng không thêm mới',
    '005005-4147': 'Cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '005005-4173': 'Lịch sử cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '005005-4172': 'Lịch sử cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '005005-4149': 'Lịch sử cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '005005-4153': 'Lịch sử cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '005005-4174': 'Lịch sử cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '005005-5158': 'Giao dịch không tồn tại. Vui lòng kiểm tra lại',
    '005001-4130': 'Không tìm thấy giao dịch gốc. Vui lòng kiểm tra lại',
    '005005-4142': 'Cấu hình đã tồn tại. Vui lòng không thêm mới',
    '005005-4143': 'Cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '005005-4139': 'Cấu hình đã tồn tại. Vui lòng không thêm mới',
    '005001-4140': 'Cấu hình không tồn tại. Vui lòng kiểm tra lại',
    '08006-4144': 'Cấu hình đã tồn tại. Vui lòng không thêm mới'
};
