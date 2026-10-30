// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a2vuongvt_ce191082.repository;

import fu.se.a2vuongvt_ce191082.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Short> {
    Optional<SystemAccount> findByAccountEmailIgnoreCase(String accountEmail);
    List<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(String name, String email);
}
