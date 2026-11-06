// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.repository;

import fu.se.a3vuongvt_ce191082.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByEmailAddressIgnoreCase(String emailAddress);
    List<Customer> findByCustomerFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCaseOrTelephoneContainingIgnoreCase(
            String fullName, String email, String telephone);
}
