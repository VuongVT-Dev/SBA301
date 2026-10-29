package fu.se.a2vuongvt_ce191082.repository;

import fu.se.a2vuongvt_ce191082.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Short> {
    List<Category> findByCategoryNameContainingIgnoreCaseOrCategoryDescriptionContainingIgnoreCase(String name, String description);
}
