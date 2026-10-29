package fu.se.a2vuongvt_ce191082.repository;

import fu.se.a2vuongvt_ce191082.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {
    List<Tag> findByTagNameContainingIgnoreCase(String tagName);
}
