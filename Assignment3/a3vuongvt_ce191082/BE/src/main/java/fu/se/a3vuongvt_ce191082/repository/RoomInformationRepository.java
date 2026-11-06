// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.repository;

import fu.se.a3vuongvt_ce191082.entity.RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomInformationRepository extends JpaRepository<RoomInformation, Integer> {
    Optional<RoomInformation> findByRoomNumberIgnoreCase(String roomNumber);
    List<RoomInformation> findByRoomNumberContainingIgnoreCaseOrRoomDetailDescriptionContainingIgnoreCase(String roomNumber, String desc);
    List<RoomInformation> findByRoomStatus(Short roomStatus);
}
