// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.repository;

import fu.se.a3vuongvt_ce191082.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {
    List<RoomType> findByRoomTypeNameContainingIgnoreCase(String keyword);
}
