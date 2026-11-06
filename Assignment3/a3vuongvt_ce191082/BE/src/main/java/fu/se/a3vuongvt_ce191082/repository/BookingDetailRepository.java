// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.repository;

import fu.se.a3vuongvt_ce191082.entity.BookingDetail;
import fu.se.a3vuongvt_ce191082.entity.BookingDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {
    boolean existsByRoomId(Integer roomId);
    List<BookingDetail> findByBookingReservationId(Integer bookingReservationId);
    void deleteByBookingReservationId(Integer bookingReservationId);
}
