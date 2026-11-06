// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.controller;

import fu.se.a3vuongvt_ce191082.entity.BookingReservation;
import fu.se.a3vuongvt_ce191082.service.BookingReservationService;
import fu.se.a3vuongvt_ce191082.service.BookingReservationService.BookingDetailInput;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingReservationController {

    private final BookingReservationService bookingService;

    public BookingReservationController(BookingReservationService bookingService) {
        this.bookingService = bookingService;
    }

    // Staff: Xem và tìm kiếm toàn bộ đơn đặt phòng
    @GetMapping
    public ResponseEntity<List<BookingReservation>> getAllBookings(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(bookingService.getAllBookings(search));
    }

    // Customer: Xem lịch sử đặt phòng của chính mình
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingReservation>> getBookingsByCustomer(@PathVariable Integer customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomerId(customerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingReservation> getBookingById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // Staff hoặc Customer: Tạo đơn đặt phòng (có 1 hoặc nhiều phòng trong BookingDetail)
    @PostMapping
    public ResponseEntity<BookingReservation> createBooking(@RequestBody BookingRequest request) {
        BookingReservation saved = bookingService.createBooking(
                request.getCustomerId(),
                request.getBookingDate(),
                request.getBookingStatus(),
                request.getBookingDetails()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Staff: Cập nhật đơn đặt phòng và chi tiết phòng
    @PutMapping("/{id}")
    public ResponseEntity<BookingReservation> updateBooking(
            @PathVariable Integer id,
            @RequestBody BookingRequest request
    ) {
        BookingReservation updated = bookingService.updateBooking(
                id,
                request.getCustomerId(),
                request.getBookingDate(),
                request.getBookingStatus(),
                request.getBookingDetails()
        );
        return ResponseEntity.ok(updated);
    }

    // Staff: Xóa đơn đặt phòng
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable Integer id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa đơn đặt phòng thành công!"));
    }

    public static class BookingRequest {
        private Integer customerId;
        private LocalDate bookingDate;
        private Integer bookingStatus;
        private List<BookingDetailInput> bookingDetails;

        public Integer getCustomerId() {
            return customerId;
        }

        public void setCustomerId(Integer customerId) {
            this.customerId = customerId;
        }

        public LocalDate getBookingDate() {
            return bookingDate;
        }

        public void setBookingDate(LocalDate bookingDate) {
            this.bookingDate = bookingDate;
        }

        public Integer getBookingStatus() {
            return bookingStatus;
        }

        public void setBookingStatus(Integer bookingStatus) {
            this.bookingStatus = bookingStatus;
        }

        public List<BookingDetailInput> getBookingDetails() {
            return bookingDetails;
        }

        public void setBookingDetails(List<BookingDetailInput> bookingDetails) {
            this.bookingDetails = bookingDetails;
        }
    }
}
