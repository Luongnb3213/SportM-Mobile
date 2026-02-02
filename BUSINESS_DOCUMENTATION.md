# Tài liệu Nghiệp vụ Dự án Sport Platform

## 1. Tổng quan Dự án
Dự án **Sport Platform** là một nền tảng kết nối toàn diện dành cho cộng đồng thể thao, bao gồm người chơi và các chủ sân bãi. Hệ thống cung cấp giải pháp tìm kiếm sân tập, đặt lịch, quản lý trận đấu, và kết nối cộng đồng người chơi thể thao.

Hệ thống bao gồm các thành phần chính:
- **Mobile App (React Native)**: Dành cho người dùng cuối (người chơi và chủ sân).
- **Backend (NestJS)**: Xử lý logic nghiệp vụ, quản lý dữ liệu và API.
- **Frontend (Web)**: Trang quản trị (Admin/Owner) và thông tin landing page.

---

## 2. Đối tượng Người dùng (User Roles)

Hệ thống phân quyền dựa trên 3 vai trò chính (được định nghĩa trong hệ thống):

### 2.1. CLIENT (Người chơi)
- **Mô tả**: Người dùng cuối sử dụng dịch vụ.
- **Quyền hạn**:
    - Đăng ký tài khoản (Mặc định là role `CLIENT`).
    - Tìm kiếm và xem chi tiết sân bãi.
    - Thực hiện đặt sân (Booking) và thanh toán.
    - Gửi yêu cầu kết bạn và tham gia cộng đồng.
    - Quản lý thông tin cá nhân và lịch sử đặt sân.

### 2.2. OWNER (Chủ sân)
- **Mô tả**: Đối tác cung cấp sân bãi.
- **Quyền hạn**:
    - Có toàn bộ quyền của CLIENT.
    - **Quản lý danh sách sân**: Thêm, sửa, xóa thông tin sân của mình.
    - **Quản lý Slot & Lịch**: Xem và quản lý lịch đặt của người chơi.
    - **Dashboard Phân tích**: Xem doanh thu và số lượng booking theo thời gian, thống kê tổng quan.
    - **Quảng cáo**: Tạo chiến dịch quảng cáo cho sân.

### 2.3. ADMIN (Quản trị viên)
- **Mô tả**: Người quản lý vận hành hệ thống.
- **Quyền hạn**:
    - Quản lý người dùng (Client, Owner).
    - Duyệt sân bãi và nội dung quảng cáo.
    - Quản lý cấu hình hệ thống và các gói Subscription.

---

## 3. Các Phân hệ Nghiệp vụ Chính (Business Modules)

### 3.1. Quản lý Tài khoản & Xác thực (Authentication & User)
- **Đăng ký/Đăng nhập**:
    - **Email/Password**: Đăng ký và đăng nhập truyền thống.
    - **Đăng nhập liên kết (Social Login)**: Hỗ trợ 3 phương thức để tránh user phải nhập thủ công:
        - **Google**: Đăng nhập qua tài khoản Gmail
        - **Facebook**: Đăng nhập qua tài khoản Facebook
        - **Apple iCloud**: Đăng nhập qua Apple ID (iOS)
    - **JWT**: Bảo mật phiên làm việc với JSON Web Token.
- **Xác thực OTP (One-Time Password)**:
    - Gửi mã OTP qua email để xác minh tài khoản.
    - Thời gian hết hạn: 15 phút.
    - Sử dụng Redis để lưu trữ OTP tạm thời.
- **Hồ sơ người dùng**:
    - Thông tin cơ bản: Tên, Email, SĐT.
    - Thông tin bổ sung: Bio, Ảnh đại diện (`avatarUrl`), Ngày sinh, Giới tính.
    - **Số điện thoại**: Validation 9-11 số (cho Việt Nam).
    - Trạng thái người dùng (`status`): Kích hoạt hoặc khóa.
- **Remember Me (Ghi nhớ đăng nhập)**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - User có thể chọn "Remember me" khi đăng nhập.
        - Hệ thống lưu credentials được mã hóa.
        - Tự động điền email/password khi mở app lại.
    - **Mục đích**: Tiện lợi cho user, không cần nhập lại mỗi lần.
- **Xóa Tài khoản (Account Deletion)**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - User có thể xóa tài khoản với các lý do:
            - Tài khoản bị trùng
            - Không cần nữa
            - Lỗi/bugs trong app
            - Vấn đề riêng tư
            - Lý do khác (với ghi chú tùy chọn)
        - Hiển thị dialog xác nhận trước khi xóa.
        - Thông báo sau khi xóa thành công.
    - **Mục đích**: Tuân thủ quyền riêng tư, cho phép user quản lý dữ liệu cá nhân.
- **Điều khoản & Chính sách**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - Hiển thị Terms and Conditions modal.
        - Link đến trang Policy (web view).
    - **Mục đích**: Tuân thủ pháp luật, minh bạch về điều khoản sử dụng.
- **Liên hệ & Báo cáo vấn đề**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - User có thể báo cáo vấn đề hoặc liên hệ admin qua modal.
        - Quick action button trong settings.
    - **Mục đích**: Hỗ trợ user, thu thập feedback.
- **Thông tin Thanh toán - Chủ sân (OWNER)**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - Chủ sân phải cung cấp thông tin thanh toán:
            - **Tên chủ tài khoản**: 2-50 ký tự (hỗ trợ Unicode, chữ, space, hyphen, apostrophe).
            - **Số tài khoản**: 8-19 chữ số.
            - **Tên ngân hàng**: Tối thiểu 2 ký tự.
            - **QR code thanh toán**: Upload ảnh QR code để user có thể chuyển khoản dễ dàng.
        - Thông tin này hiển thị cho user khi đặt sân.
    - **Mục đích**: Tạo điều kiện thanh toán giữa user và chủ sân.

### 3.2. Quản lý Sân bãi (Court Management)
- **Thông tin sân**:
    - Tên sân, mô tả, địa chỉ.
    - Loại thể thao (`SportType`).
    - Hình ảnh sân (`CourtImage`) - tối đa 4 ảnh.
    - Giá theo giờ.
    - Tọa độ địa lý (latitude, longitude).
- **Chủ sở hữu**: Mỗi sân được liên kết với một User đóng vai trò là chủ sân.
- **Browse/Search Sân (Dành cho User)**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - **Search**: Tìm kiếm sân với debounced 500ms.
        - **Filter**: Lọc theo loại thể thao với pill-based UI (chọn được highlight).
        - **Pagination**: 5 sân/trang với load more.
        - **Court card**: Hiển thị tên, giá/giờ, rating, ảnh.
        - **Empty state**: Khi không có sân match tiêu chí.
    - **Mục đích**: User dễ dàng tìm và lọc sân phù hợp.
- **Add Court (Thêm sân - Dành cho Owner)**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - **Upload ảnh**: Tối đa 4 ảnh cho sân, upload qua Cloudinary.
        - **Mapbox**: Chọn vị trí sân trên bản đồ với reverse geocoding (tự động lấy địa chỉ từ tọa độ).
        - **Sport type**: Chọn 1 loại thể thao qua pill selector.
        - **Validation**: Tên, địa chỉ, ảnh bắt buộc phải nhập.
        - Loading state khi submit.
    - **Mục đích**: Chủ sân dễ dàng đăng ký sân mới lên hệ thống.
- **Update Court (Cập nhật sân - Dành cho Owner)**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - **Pre-fill data**: Fetch và populate form với dữ liệu hiện tại.
        - **Image management**: Add, remove, reorder ảnh. Upload ảnh mới qua Cloudinary, giữ ảnh cũ.
        - Loading skeleton trong khi fetch dữ liệu.
    - **Mục đích**: Chủ sân cập nhật thông tin sân dễ dàng.
- **Owner Court List (Danh sách sân của Owner)**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - **Search**: Tìm theo tên/địa chỉ với debounced 500ms.
        - **Filter**: Lọc theo sport type với pills.
        - **Pagination**: 5 sân/trang.
        - **Quick actions** trên mỗi sân:
            - View details (Xem chi tiết)
            - Edit (Sửa - navigate to updateCourt)
            - Manage bookings (Quản lý đặt sân - navigate to bookingOwner)
            - Delete (Xóa)
    - **Mục đích**: Chủ sân quản lý tập trung tất cả sân của mình.

### 3.3. Đặt Sân (Booking System)
Quy trình đặt sân là tính năng cốt lõi:
1. **Tìm kiếm**: Người dùng tìm sân trống theo thời gian và loại hình.
2. **Tạo Booking - Lịch và Slot**:
    - **Lịch 31 ngày**: User chọn ngày trong 31 ngày tới với format Việt (CN, T2-T7).
    - **10 khung giờ/ngày**: Từ 1:00-2:00 đến 11:00-12:00, chia thành 2 cột AM và PM.
    - **Chọn nhiều slot**: User có thể chọn nhiều giờ cùng lúc trong cùng một lần đặt.
    - **Phát hiện slot đã khóa**: Hệ thống kiểm tra real-time các slot đã bị lock, ngăn user chọn slot không khả dụng.
    - Chọn thời gian bắt đầu (`startTime`) và kết thúc (`endTime`).
    - Hệ thống tính toán tổng tiền (`totalPrice`) và tiền cọc (`deposit`).
    - Trạng thái đặt sân (`status`).
3. **Khóa Slot sau khi Đặt sân**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - Sau khi user đặt sân thành công, slot đó sẽ tự động bị **khóa**.
        - Slot bị khóa sẽ không cho phép user khác đặt vào cùng thời gian đó.
        - Chỉ khi booking bị hủy hoặc hoàn thành thì slot mới được mở lại.
    - **Mục đích**: Tránh conflict khi nhiều user đặt cùng 1 slot.
4. **Trung bày Shop cho Chủ sân**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - Chủ sân có thể tạo **shop** để trung bày các sản phẩm của mình (đồ thể thao, nước uống, dụng cụ, v.v.).
        - Sau khi user đặt sân, chủ sân sẽ **đẩy các sản phẩm** của shop lên để user có thể mua thêm.
        - Tích hợp với hệ thống thanh toán để user có thể đặt sân + mua sản phẩm cùng lúc.
    - **Mục đích**: Tăng doanh thu cho chủ sân, tiện lợi cho user.
5. **Thanh toán**:
    - Liên kết 1-1 với giao dịch thanh toán (`Payment`).
    - Người dùng có thể cần đặt cọc hoặc thanh toán toàn bộ.
6. **Mời người chơi**: Hệ thống hỗ trợ tạo `inviteId` để mời người khác tham gia vào Booking này.
7. **My Bookings - Quản lý Đặt sân của User**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - **Search**: Tìm kiếm theo địa điểm, tên sân, hoặc Booking ID.
        - **Filter trạng thái**: Lọc booking theo 4 trạng thái với icon màu riêng:
            - **PENDING_DEPOSIT** (Chờ thanh toán) - màu vàng, icon timer
            - **CONFIRMED** (Đã xác nhận) - màu xanh, icon checkmark
            - **COMPLETED** (Đã hoàn thành) - màu xanh dương, icon trophy
            - **CANCELLED** (Đã hủy) - màu đỏ, icon close
        - **Pagination**: Hiển thị 8 bookings/trang với nút "Xem thêm".
        - **Actions**:
            - **Thanh toán**: Click vào booking PENDING_DEPOSIT để mở modal QR code thanh toán.
            - **Hủy đặt sân**: Hủy booking (chỉ khi PENDING_DEPOSIT).
    - **Mục đích**: User dễ dàng theo dõi và quản lý các lần đặt sân của mình.
8. **Owner Booking Management - Quản lý Đặt sân của Chủ sân**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - **Quản lý theo sân**: Chủ sân xem booking của từng sân riêng biệt.
        - **Search**: Tìm theo tên khách hoặc chi tiết booking.
        - **Filter trạng thái**: Tương tự như user (PENDING_DEPOSIT, CONFIRMED, COMPLETED, CANCELLED).
        - **Actions theo trạng thái**:
            - **PENDING_DEPOSIT**: Confirm deposit (xác nhận đã nhận cọc) hoặc Complete (hoàn thành luôn).
            - **CONFIRMED**: Mark as completed hoặc Cancel.
            - **Other statuses**: View details only.
        - **Loading states**: Hiển thị loading khi thực hiện confirm/complete.
    - **Mục đích**: Chủ sân quản lý hiệu quả các booking, xác nhận thanh toán kịp thời.
9. **Payment Modal - Thanh toán trong Booking**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - **Hiển thị**: Modal xuất hiện khi user click "Thanh toán" trong My Bookings.
        - **Thông tin hiển thị**:
            - Tên chủ tài khoản (từ Owner)
            - Số tài khoản (từ Owner)
            - Tên ngân hàng (từ Owner)
            - **QR code thanh toán** (ảnh QR từ Owner)
        - **Hướng dẫn**: "Vui lòng chuyển khoản theo thông tin bên dưới và ghi kèm mã Booking để được xác nhận nhanh hơn."
        - **Close button**: Đóng modal.
    - **Mục đích**: Tạo điều kiện dễ dàng cho user thanh toán qua chuyển khoản ngân hàng.

### 3.4. Kết nối Cộng đồng (Social)
- **Tìm bạn (Friend Discovery)**:
    - **Loại**: Core
    - **Giao diện**: Carousel swipe cards giống Tinder/TikTok (lướt ngang)
    - **Nghiệp vụ**:
        - User có thể scroll giống TikTok để xem profile của người khác.
        - **Hiển thị**: Tên, bio, avatar (nếu không có ảnh thì hiển thị initials).
        - **Actions**:
            - **Skip**: Bỏ qua user này, tự động load user tiếp theo.
            - **Add friend**: Gửi lời mời kết bạn.
        - Infinite scrolling với pagination.
    - **Mục đích**: Dễ dàng kết nối với người chơi khác trong cộng đồng.
- **Kết bạn (Friend Requests)**:
    - **Loại**: Core
    - **Giao diện**: Two-tab interface (2 tabs)
    - **Nghiệp vụ**:
        - **Tab 1 - Lời mời đến (Pending Requests)**:
            - Hiển thị friend requests nhận được.
            - User có thể Accept (chấp nhận) hoặc Reject (từ chối).
            - Avatar + name.
            - Pagination: 5/trang.
        - **Tab 2 - Lời mời đã gửi (Sent Requests)**:
            - Hiển thị friend requests đã gửi đi.
            - User có thể Cancel (hủy lời mời).
            - Pagination: 5/trang.
        - Toast notifications cho success/failure.
    - **Mục đích**: Quản lý lời mời kết bạn rõ ràng, dễ theo dõi.
- **Mời bạn vào Booking (Invite Friends to Booking)**:
    - **Loại**: Core
    - **Giao diện**: Bottom sheet modal
    - **Nghiệp vụ**:
        - **Search friends**: Tìm kiếm bạn bè để mời (debounced).
        - **Pagination**: 10 friends/trang với load more.
        - **Friend cards**:
            - Avatar (fallback initials nếu không có ảnh - 2 ký tự đầu của tên).
            - Full name.
            - Already-invited status (đã mời).
        - **Actions**:
            - Invite friend button.
            - Remove invited friend (nút X trên avatar).
        - **Invited friends display**: Avatar grid dưới "Mời bạn bè" section.
        - **Empty state**: "Chưa có ai được mời" khi chưa chọn ai.
    - **Mục đích**: Dễ dàng mời bạn bè tham gia đặt sân chung.
- **Thông báo Thời gian thực (Real-time Notification)**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - Hệ thống gửi thông báo real-time qua Socket.IO với 6 loại thông báo, **mỗi loại có icon và màu riêng**:
            1. **BOOKING_SUCCESS** (Đặt sân thành công) - Green checkmark
            2. **INVITED_TO_BOOKING** (Được mời tham gia booking) - Blue calendar
            3. **NEW_BOOKING_FOR_OWNER** (Booking mới cho chủ sân) - Gold bell
            4. **FRIEND_REQUEST** (Lời mời kết bạn) - Purple user icon
            5. **FRIEND_ACCEPTED** (Chấp nhận kết bạn) - Green handshake
            6. **BOOKING_REMINDER** (Nhắc nhở booking) - Orange clock
        - **Pull-to-refresh**: User kéo xuống để refresh danh sách notification.
        - **Load more**: Scroll để load thêm notifications (pagination).
        - **Relative time**: Hiển thị thời gian tương đối ("2 giờ trước", "5 phút trước").
        - **Badge**: Hiển thị số notification chưa đọc trên tab icon.
        - Hỗ trợ đánh dấu đã đọc và quản lý trạng thái thông báo.
    - **Mục đích**: User dễ phân biệt các loại thông báo qua icon/màu sắc, không bỏ lỡ thông tin quan trọng.
- **Push Notification (Thông báo đẩy ra điện thoại)**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - Đẩy thông báo ra điện thoại user ngay cả khi app đang đóng hoặc chạy nền.
        - Sử dụng Firebase Cloud Messaging (FCM) hoặc Expo Push Notification.
        - Tích hợp với các loại thông báo real-time ở trên.
        - User có thể nhận thông báo về booking, lời mời kết bạn, khuyến mãi ngay trên màn hình khóa.
    - **Mục đích**: Tăng engagement, đảm bảo user không bỏ lỡ thông tin quan trọng.
- **Đánh giá & Bình luận (Rating & Comments)**:
    - **Loại**: Core
    - **Rating System**:
        - **5 sao + Comment**: User đánh giá sân với hệ thống 5 sao và comment tùy chọn.
        - **Edit/Delete**: User có thể sửa hoặc xóa rating của mình.
        - **Pagination**: 10 ratings/trang với load more.
        - **Average rating**: Hệ thống tính và hiển thị rating trung bình trên court card.
    - **Comments Display**:
        - **Hiển thị**: Số sao, tên user, nội dung, thời gian relative ("Vừa xong", "5 phút", "2 giờ"), avatar.
        - **Edit modal**: Cho comment owner để sửa nội dung.
        - **Delete capability**: Cho comment owner để xóa comment.
    - **Mục đích**: Minh bạch chất lượng sân, giúp user đưa ra quyết định tốt hơn khi đặt sân.

### 3.5. Quảng cáo (Advertisement)
- **Loại**: Core
- **Nghiệp vụ**:
    - Người dùng (thường là Chủ sân) có thể mua dịch vụ quảng cáo để hiển thị sân của mình ở vị trí nổi bật.
    - Hệ thống quản lý các chiến dịch quảng cáo và liên kết với Chủ sân.
- **Ads Detail Page (Trang chi tiết quảng cáo)**:
    - **Hiển thị**: Title, content, image, date range (ngày bắt đầu/kết thúc).
    - **Status check**: ĐANG DIỄN RA hoặc HẾT HẠN / ẨN.
    - **Link extraction**: Extract và mở link từ nội dung quảng cáo.
- **Ads Page (Danh sách quảng cáo)**:
    - **Pagination**: 4 ads/trang với load more.
    - **Date filtering**: Lọc quảng cáo theo ngày.
    - **Display order**: Quản lý thứ tự hiển thị.
- **Mục đích**: Tăng visibility cho sân của chủ sân, tạo doanh thu từ quảng cáo.

### 3.6. Bản đồ & Định vị Địa lý (Maps & Location)
- **Tích hợp Mapbox**:
    - Hiển thị vị trí sân trên bản đồ tương tác.
    - Chọn vị trí khi tạo/cập nhật sân mới.
- **Tìm sân gần đây (Nearby Search)**:
    - Tìm kiếm các sân bãi gần vị trí người dùng.
    - Sử dụng tọa độ địa lý (latitude, longitude) để tính khoảng cách.
    - Hiển thị kết quả theo độ gần.
- **Thông tin định vị**:
    - Mỗi sân lưu trữ tọa độ `lat` (latitude) và `lng` (longitude).
    - Hỗ trợ lấy vị trí hiện tại của user qua GPS.

### 3.7. Dashboard Phân tích cho Owner (Owner Analytics)
- **Loại**: Core
- **Báo cáo, thống kê sân**:
    - Dashboard cho chủ sân tổng quan.
    - **Thống kê doanh thu của sân theo ngày/tháng/năm** (trong nền tảng app).
    - Hiển thị biểu đồ doanh thu theo thời gian.
- **Thống kê theo thời gian**:
    - Xem doanh thu theo khoảng ngày (startDate - endDate).
    - Số lượng booking theo ngày/tuần/tháng.
- **Báo cáo tổng quan**:
    - Tổng doanh thu từ các booking.
    - Số lượng booking thành công, đã hủy.
    - Tỷ lệ sử dụng sân theo thời gian.
- **Endpoint API**: `/owner/dashboard` với tham số lọc theo ngày.

### 3.8. Quản lý Sự kiện - Chủ sân (Owner Events Management)
- **Loại**: Core
- **Tạo sự kiện, đăng bài**:
    - **Nghiệp vụ**:
        - Chủ sân có thể tạo sự kiện (giải đấu, khuyến mãi, hoạt động đặc biệt).
        - **Upload ảnh**: Gần upload được ảnh, hỗ trợ **cắt, thu phóng** (crop/zoom) ảnh trực tiếp từ điện thoại.
        - Đăng bài chi tiết về sự kiện với tiêu đề, mô tả, thời gian, địa điểm.
    - **Mục đích**: Quảng bá sự kiện, thu hút người chơi tham gia.
- **Vị trí**: Trang chủ hiển thị sự kiện nổi bật (carousel).

### 3.9. Profile Chủ sân & Chuyển đổi Chế độ (Owner Profile & Mode Switching)
- **Loại**: Nền có (Enhancement)
- **Chủ sân xem đăng bài**:
    - Chủ sân có thể xem lại các bài đăng, sự kiện của mình.
- **Thêm nút đổi chế độ sang người dùng (User)**:
    - **Nghiệp vụ**:
        - Chủ sân có thể **chuyển sang chế độ CLIENT** để trải nghiệm app như một người dùng bình thường.
        - Khi ở chế độ CLIENT, chủ sân có thể đặt sân tại các sân khác, tìm bạn, v.v.
        - Có nút toggle để **chuyển đổi qua lại** giữa chế độ OWNER và CLIENT.
    - **Mục đích**: Linh hoạt, chủ sân cũng có thể là người chơi.

### 3.10. Quản lý Lịch & Quyền hạn - Chủ sân (Owner Schedule & Permissions)
#### 3.10.1. Taskbar - Thay đổi thông tin & Cập quyền
- **Loại**: Nền có (Enhancement)
- **Nghiệp vụ**:
    - **Thay đổi thông tin sân**: Chủ sân có thể cập nhật thông tin sân (giá, mô tả, ảnh) bất cứ lúc nào.
    - **Cập quyền sử dụng**:
        - Chủ sân có thể **cấp quyền ưu tiên** cho các user đặt sân định lâu dài (VIP, member).
        - Ví dụ: User đặt sân thường xuyên sẽ được ưu tiên chọn slot trước, hoặc giảm giá.
    - **Khóa sân**:
        - Chủ sân có thể **tạm khóa sân** (không cho đặt) khi bảo trì, sửa chữa, hoặc có sự kiện riêng.
        - Khi khóa, tất cả slot của sân sẽ không hiển thị cho user.
- **Mục đích**: Quản lý linh hoạt, tăng trải nghiệm cho khách hàng VIP.

#### 3.10.2. Quản lý Lịch đặt sân
- **Loại**: Core
- **Nghiệp vụ**:
    - Chủ sân xem lịch đặt sân theo ngày/tuần/tháng (calendar view).
    - **Dùng, khóa sân**:
        - Chủ sân có thể đánh dấu slot đang "đang sử dụng" hoặc "khóa" để không cho đặt.
    - Xem chi tiết từng booking: user nào đặt, thời gian, trạng thái thanh toán.
- **Thông báo quản lý lịch sân đẩy ra điện thoại**:
    - **Loại**: Core
    - **Nghiệp vụ**:
        - Các tác vụ quản lý lịch sân (booking mới, hủy booking, thay đổi slot) phải **đẩy được thông báo ra điện thoại** cho chủ sân.
        - Sử dụng Push Notification (FCM/Expo Push).
        - Chủ sân nhận thông báo ngay lập tức kể cả khi app đang đóng.
    - **Mục đích**: Chủ sân luôn cập nhật kịp thời, không bỏ lỡ booking quan trọng.

### 3.11. Trang chủ - Giao diện Người dùng (Home Screen UI)

#### 3.11.1. Sự kiện nổi bật (Featured Events)
- **Loại**: Core
- **Giao diện**: Carousel lướt ngang (Horizontal Scroll)
- **Nghiệp vụ**:
    - Hiển thị các sự kiện, khuyến mãi, hoặc quảng cáo nổi bật.
    - Sử dụng carousel ngang thay vì xổ dọc để tiết kiệm không gian màn hình.
    - **Lý do**: Tránh để xem thêm xổ dọc sẽ bị mất không gian của app, che đi phần các sân đã đặt.
- **Vị trí**: Đầu trang chủ (sau gợi ý cho bạn).

#### 3.11.2. Các sân đã đặt (Booked Courts)
- **Loại**: Core
- **Giao diện**: Carousel lướt ngang (Horizontal Scroll)
- **Nghiệp vụ**:
    - Hiển thị danh sách các sân mà user đã đặt.
    - **Hiển thị số slot trống** ngay trên trang chủ:
        - Mỗi sân hiển thị số lượng slot còn trống hôm nay.
        - Giúp user dễ dàng nhận biết sân nào còn chỗ mà không cần vào chi tiết.
    - Sử dụng carousel ngang để dễ xem thêm, thay vì xổ dọc xuống.
    - **Lý do**: Dễ xem thêm, xổ dọc xuống thay bằng lướt ngang giúp tiết kiệm không gian và trải nghiệm tốt hơn.
- **Vị trí**: Giữa trang chủ (sau sự kiện nổi bật).
- **Thông tin hiển thị**:
    - Tên sân
    - Số slot trống (ví dụ: "5 slots trống")
    - Hình ảnh sân
    - Giá
    - Trạng thái booking gần nhất

#### 3.11.3. Gợi ý cho bạn (Suggestions / Recommendations)
- **Loại**: Core
- **Giao diện**: Thu nhỏ, đặt ở đầu trang chủ
- **Nghiệp vụ**:
    - Gợi ý các sân phù hợp dựa trên:
        - Vị trí hiện tại của user (nếu đã bật GPS).
        - Lịch sử đặt sân trước đó.
        - Sở thích thể thao.
    - **Yêu cầu bật vị trí**:
        - Hiển thị dòng chữ yêu cầu user bật vị trí để có gợi ý tốt hơn.
        - Ví dụ: "Bật vị trí để xem sân gần bạn".
    - **Lý do**: Kèm theo dòng chữ yêu cầu bật vị trí để tăng độ chính xác của gợi ý.
- **Vị trí**: Đầu trang chủ (top).
- **Kích thước**: Thu nhỏ, không chiếm quá nhiều không gian.

#### 3.11.4. Search Bar (Thanh tìm kiếm)
- **Loại**: Core
- **Nghiệp vụ**:
    - Search bar trên trang chủ link đến trang search đầy đủ.
    - User click vào search bar → navigate to `/home/search`.
- **Mục đích**: Truy cập nhanh chức năng tìm kiếm từ trang chủ.

#### 3.11.5. Email Subscription (Đăng ký Email)
- **Loại**: Enhancement
- **Nghiệp vụ**:
    - Section cho user đăng ký nhận email notifications.
    - User nhập email và subscribe.
- **Mục đích**: Marketing, gửi tin tức và khuyến mãi qua email.

#### 3.11.6. Trust Stats (Thống kê tin cậy)
- **Loại**: Enhancement
- **Nghiệp vụ**:
    - Hiển thị thống kê tin cậy của platform:
        - Số lượng user đã đăng ký.
        - Số lượng sân trên hệ thống.
        - Số lượng bookings đã hoàn thành.
    - Tăng độ tin cậy cho user mới.
- **Mục đích**: Social proof, tăng conversion rate.

---

### 3.12. Thanh toán (Payment System)

#### 3.12.1. Payment History (Lịch sử thanh toán)
- **Loại**: Core
- **Nghiệp vụ**:
    - **View all transactions**: User xem tất cả giao dịch thanh toán của mình.
    - **Search**: Tìm theo mã giao dịch hoặc số tiền.
    - **Filter status**: Lọc theo 3 trạng thái với icon màu riêng:
        - **PENDING** (Đang xử lý) - màu vàng, icon clock
        - **SUCCESS** (Hoàn tất) - màu xanh, icon checkmark
        - **FAILED** (Thất bại) - màu đỏ, icon close
    - **Pagination**: 12 transactions/trang với load more.
    - **Transaction card displays**:
        - Mã giao dịch (bold, large font).
        - Payment status (colored).
        - Phương thức thanh toán.
        - Số tiền VND (formatted currency).
        - Thông tin booking liên quan (Order ID, total price, deposit, notes).
    - **Empty state**: Khi không có transactions.
- **Mục đích**: User theo dõi lịch sử thanh toán, kiểm tra trạng thái giao dịch.

#### 3.12.2. Payment Modal trong Booking (đã mô tả ở Section 3.3.9)
- **Loại**: Core
- **Nghiệp vụ**: Xem Section 3.3.9 - Payment Modal.


