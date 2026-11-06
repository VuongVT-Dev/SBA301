// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.repository;

import fu.se.a3vuongvt_ce191082.entity.BookingReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {
    List<BookingReservation> findByCustomer_CustomerIdOrderByBookingDateDesc(Integer customerId);
    boolean existsByCustomer_CustomerId(Integer customerId);
}
