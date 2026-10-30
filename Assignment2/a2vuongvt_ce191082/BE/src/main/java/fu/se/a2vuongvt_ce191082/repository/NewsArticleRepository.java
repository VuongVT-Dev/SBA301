// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a2vuongvt_ce191082.repository;

import fu.se.a2vuongvt_ce191082.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {
    List<NewsArticle> findByNewsStatusOrderByCreatedDateDesc(Boolean newsStatus);
    List<NewsArticle> findByCreatedBy_AccountIdOrderByCreatedDateDesc(Short accountId);
    boolean existsByCreatedBy_AccountId(Short accountId);
    boolean existsByCategory_CategoryId(Short categoryId);
    List<NewsArticle> findByNewsTitleContainingIgnoreCaseOrHeadlineContainingIgnoreCase(String title, String headline);
}
