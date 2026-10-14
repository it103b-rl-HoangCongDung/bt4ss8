/**
 * Môn học: [RL-IT103B-K25] - Xây dựng ứng dụng web với Javascript
 * Bài tập: Bài 4 - Session 8
 * Tiêu đề: 4. Phân tích Trade-off: Biến đổi Mảng Trực tiếp (Mutating) vs Bản sao Bất biến
 * GitHub Organization: it103b-rl-HoangCongDung
 * 
 * BÁO CÁO PHÂN TÍCH KỸ THUẬT VÀ TRADE-OFF:
 * 1. Đánh giá độ phức tạp thời gian (Time Complexity):
 *    - push() / pop(): Thêm/xóa ở cuối mảng có độ phức tạp O(1) do JavaScript không cần di chuyển
 *      bất kỳ phần tử nào khác trong bộ nhớ, chỉ cần cập nhật con trỏ độ dài mảng.
 *    - unshift() / shift(): Thêm/xóa ở đầu mảng có độ phức tạp O(N) vì khi xóa phần tử ở chỉ số 0
 *      hoặc thêm vào đầu, toàn bộ N-1 phần tử phía sau buộc phải dịch chuyển lại vị trí trong bộ nhớ
 *      và hệ thống V8 Engine phải tiến hành tái đánh chỉ số (Re-indexing) cho toàn bộ mảng.
 * 
 * 2. Ngữ cảnh & Vấn đề thực tế tại Trạm sạc:
 *    - Khi hệ thống điều phối xe điện sử dụng queue.shift() để lấy xe đầu hàng, với số lượng xe
 *      lên tới hàng chục nghìn ('N' rất lớn) trong các dịp lễ tết, thao tác O(N) gây nghẽn luồng xử lý,
 *      làm giảm hiệu năng nghiêm trọng, gây giật lag hệ thống.
 * 
 * 3. Giải pháp tối ưu kỹ thuật:
 *    - Thay vì sử dụng phương thức shift() gây tốn kém tài nguyên cho việc dịch chuyển mảng,
 *      chúng ta dùng biến con trỏ chỉ số đầu mảng ('headIndex') để đánh dấu vị trí hiện tại.
 *    - Khi lấy xe ra khỏi hàng đợi, chỉ cần tăng 'headIndex++' (độ phức tạp O(1)) mà không cần thay đổi cấu trúc mảng.
 */

// Mô phỏng giải pháp tối ưu dùng con trỏ headIndex cho hàng đợi trạm sạc
class ChargingQueue {
  constructor() {
    this.items = {};
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  // Thêm xe vào cuối hàng đợi (O(1))
  enqueue(vehicleId) {
    this.items[this.tailIndex] = vehicleId;
    this.tailIndex++;
  }

  // Lấy xe ra khỏi đầu hàng đợi bằng con trỏ headIndex (O(1))
  dequeue() {
    if (this.headIndex === this.tailIndex) {
      return null; // Hàng đợi trống
    }
    const item = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;
    return item;
  }

  // Kiểm tra kích thước hiện tại
  size() {
    return this.tailIndex - this.headIndex;
  }
}

// Đoạn code kiểm thử minh họa
const queue = new ChargingQueue();
queue.enqueue('XE-DIEN-001');
queue.enqueue('XE-DIEN-002');
console.log('Xe rời trạm:', queue.dequeue()); // 'XE-DIEN-001'
console.log('Số lượng xe còn lại trong hàng đợi:', queue.size());
