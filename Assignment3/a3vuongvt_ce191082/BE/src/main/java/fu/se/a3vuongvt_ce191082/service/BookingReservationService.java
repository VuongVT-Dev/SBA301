// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.service;

import fu.se.a3vuongvt_ce191082.entity.BookingDetail;
import fu.se.a3vuongvt_ce191082.entity.BookingReservation;
import fu.se.a3vuongvt_ce191082.entity.Customer;
import fu.se.a3vuongvt_ce191082.entity.RoomInformation;
import fu.se.a3vuongvt_ce191082.repository.BookingDetailRepository;
import fu.se.a3vuongvt_ce191082.repository.BookingReservationRepository;
import fu.se.a3vuongvt_ce191082.repository.CustomerRepository;
import fu.se.a3vuongvt_ce191082.repository.RoomInformationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingReservationService {

    private final BookingReservationRepository bookingReservationRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final CustomerRepository customerRepository;
    private final RoomInformationRepository roomRepository;

    public BookingReservationService(
            BookingReservationRepository bookingReservationRepository,
            BookingDetailRepository bookingDetailRepository,
            CustomerRepository customerRepository,
            RoomInformationRepository roomRepository
    ) {
        this.bookingReservationRepository = bookingReservationRepository;
        this.bookingDetailRepository = bookingDetailRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    public List<BookingReservation> getAllBookings(String keyword) {
        List<BookingReservation> all = bookingReservationRepository.findAll();
        all.sort((a, b) -> Integer.compare(
                b.getBookingReservationId() != null ? b.getBookingReservationId() : 0,
                a.getBookingReservationId() != null ? a.getBookingReservationId() : 0
        ));
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim().toLowerCase();
            return all.stream()
                    .filter(b -> {
                        boolean matchId = String.valueOf(b.getBookingReservationId()).contains(kw);
                        boolean matchCustomer = b.getCustomer() != null && (
                                (b.getCustomer().getCustomerFullName() != null && b.getCustomer().getCustomerFullName().toLowerCase().contains(kw))
                                        || (b.getCustomer().getEmailAddress() != null && b.getCustomer().getEmailAddress().toLowerCase().contains(kw))
                        );
                        boolean matchRoom = b.getBookingDetails() != null && b.getBookingDetails().stream()
                                .anyMatch(d -> d.getRoom() != null && d.getRoom().getRoomNumber() != null
                                        && d.getRoom().getRoomNumber().toLowerCase().contains(kw));
                        return matchId || matchCustomer || matchRoom;
                    })
                    .collect(Collectors.toList());
        }
        return all;
    }

    public List<BookingReservation> getBookingsByCustomerId(Integer customerId) {
        List<BookingReservation> list = bookingReservationRepository.findByCustomer_CustomerIdOrderByBookingDateDesc(customerId);
        list.sort((a, b) -> Integer.compare(
                b.getBookingReservationId() != null ? b.getBookingReservationId() : 0,
                a.getBookingReservationId() != null ? a.getBookingReservationId() : 0
        ));
        return list;
    }

    public BookingReservation getBookingById(Integer id) {
        return bookingReservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đặt phòng với ID: " + id));
    }

    @Transactional
    public BookingReservation createBooking(
            Integer customerId,
            LocalDate bookingDate,
            Integer bookingStatus,
            List<BookingDetailInput> detailInputs
    ) {
        if (customerId == null) {
            throw new IllegalArgumentException("Vui lòng chọn khách hàng (Customer)!");
        }
        if (detailInputs == null || detailInputs.isEmpty()) {
            throw new IllegalArgumentException("Đơn đặt phòng phải có ít nhất 1 phòng (BookingDetail)!");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Khách hàng không tồn tại!"));

        int nextReservationId = bookingReservationRepository.findAll().stream()
                .mapToInt(b -> b.getBookingReservationId() != null ? b.getBookingReservationId() : 0)
                .max()
                .orElse(0) + 1;

        BookingReservation reservation = new BookingReservation();
        reservation.setBookingReservationId(nextReservationId);
        reservation.setCustomer(customer);
        reservation.setBookingDate(bookingDate != null ? bookingDate : LocalDate.now());
        reservation.setBookingStatus(bookingStatus != null ? bookingStatus : 1);
        reservation.setTotalPrice(BigDecimal.ZERO);

        BookingReservation savedReservation = bookingReservationRepository.save(reservation);

        List<BookingDetail> savedDetails = saveDetailsAndComputeTotal(savedReservation, detailInputs);
        savedReservation.setBookingDetails(savedDetails);
        return bookingReservationRepository.save(savedReservation);
    }

    @Transactional
    public BookingReservation updateBooking(
            Integer reservationId,
            Integer customerId,
            LocalDate bookingDate,
            Integer bookingStatus,
            List<BookingDetailInput> detailInputs
    ) {
        BookingReservation existing = getBookingById(reservationId);
        if (customerId != null) {
            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("Khách hàng không tồn tại!"));
            existing.setCustomer(customer);
        }
        if (bookingDate != null) {
            existing.setBookingDate(bookingDate);
        }
        if (bookingStatus != null) {
            existing.setBookingStatus(bookingStatus);
        }

        if (detailInputs != null && !detailInputs.isEmpty()) {
            bookingDetailRepository.deleteByBookingReservationId(reservationId);
            bookingDetailRepository.flush();
            List<BookingDetail> savedDetails = saveDetailsAndComputeTotal(existing, detailInputs);
            existing.setBookingDetails(savedDetails);
        }

        return bookingReservationRepository.save(existing);
    }

    @Transactional
    public void deleteBooking(Integer reservationId) {
        BookingReservation existing = getBookingById(reservationId);
        bookingDetailRepository.deleteByBookingReservationId(reservationId);
        bookingReservationRepository.delete(existing);
    }

    private List<BookingDetail> saveDetailsAndComputeTotal(
            BookingReservation reservation,
            List<BookingDetailInput> detailInputs
    ) {
        Set<Integer> usedRoomIds = new HashSet<>();
        BigDecimal totalPrice = BigDecimal.ZERO;
        List<BookingDetail> details = new ArrayList<>();

        for (BookingDetailInput item : detailInputs) {
            if (item.getRoomId() == null) {
                throw new IllegalArgumentException("Vui lòng chọn phòng cho từng dòng chi tiết (BookingDetail)!");
            }
            if (!usedRoomIds.add(item.getRoomId())) {
                throw new IllegalArgumentException("Không được chọn trùng cùng 1 phòng nhiều lần trong cùng một đơn đặt phòng!");
            }
            if (item.getStartDate() == null || item.getEndDate() == null) {
                throw new IllegalArgumentException("Vui lòng nhập đầy đủ Ngày nhận phòng (StartDate) và Ngày trả phòng (EndDate)!");
            }
            if (item.getEndDate().isBefore(item.getStartDate())) {
                throw new IllegalArgumentException("Ngày trả phòng (EndDate) phải lớn hơn hoặc bằng Ngày nhận phòng (StartDate)!");
            }

            RoomInformation room = roomRepository.findById(item.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng với ID: " + item.getRoomId()));

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
            if (days <= 0) {
                days = 1;
            }

            BigDecimal actualPrice = item.getActualPrice();
            if (actualPrice == null || actualPrice.compareTo(BigDecimal.ZERO) <= 0) {
                BigDecimal unitPrice = room.getRoomPricePerDay() != null ? room.getRoomPricePerDay() : BigDecimal.ZERO;
                actualPrice = unitPrice.multiply(BigDecimal.valueOf(days));
            }

            BookingDetail detail = new BookingDetail();
            detail.setBookingReservationId(reservation.getBookingReservationId());
            detail.setRoomId(room.getRoomId());
            detail.setRoom(room);
            detail.setStartDate(item.getStartDate());
            detail.setEndDate(item.getEndDate());
            detail.setActualPrice(actualPrice);

            BookingDetail savedDetail = bookingDetailRepository.save(detail);
            savedDetail.setRoom(room);
            details.add(savedDetail);

            totalPrice = totalPrice.add(actualPrice);
        }

        reservation.setTotalPrice(totalPrice);
        return details;
    }

    public static class BookingDetailInput {
        private Integer roomId;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal actualPrice;

        public Integer getRoomId() {
            return roomId;
        }

        public void setRoomId(Integer roomId) {
            this.roomId = roomId;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }

        public BigDecimal getActualPrice() {
            return actualPrice;
        }

        public void setActualPrice(BigDecimal actualPrice) {
            this.actualPrice = actualPrice;
        }
    }
}
